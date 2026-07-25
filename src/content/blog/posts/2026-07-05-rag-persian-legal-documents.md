---
title: "Building a RAG Chatbot Over Persian Legal Documents: Chunking, Retrieval, and Hallucination Control"
date: "2026-07-05"
excerpt: "How I built a production RAG chatbot for Persian legal documents using ChromaDB and LangChain — and why naive chunking destroys legal reasoning, how hybrid retrieval fixed it, and what actually reduced hallucination rate by 60%."
tags: ["RAG", "LangChain", "ChromaDB", "NLP", "Python", "LLM"]
---

# Building a RAG Chatbot Over Persian Legal Documents: Chunking, Retrieval, and Hallucination Control

## Context

Legal questions are not like general knowledge questions. When someone asks "can my landlord raise my rent mid-contract," the answer depends on the exact article, its sub-clauses, and possibly a cross-referenced article in a separate section. Miss any of those and you're not just wrong — you're giving legal advice that could hurt someone.

At Mahroyan Software Industry, I was asked to build a chatbot that could answer questions over a corpus of Persian legal documents: civil code, labor law, commercial regulations. The requirement was production deployment, which meant accuracy wasn't optional.

This post is about the three decisions that mattered most: how to chunk legal text, how to retrieve the right context, and how to stop the LLM from hallucinating when the answer wasn't in the retrieved context.

---

## Why Naive Chunking Fails for Legal Text

The standard RAG setup you see in tutorials: split every 500 tokens with 50-token overlap, embed the chunks, retrieve top-k, feed to LLM. This works for general knowledge bases. It fails badly for legal documents.

Here's why. A legal article looks like this:

```
Article 219 — Binding force of contracts
A contract that is concluded between contracting parties in accordance 
with the conditions and requirements stated in this law shall be 
enforceable and binding on the parties, their successors and their legal 
representatives, except in cases where the contract has been declared null 
and void pursuant to Articles 190–196 of this Code.
```

A fixed-size chunker will happily split the sentence in half, putting "binding on the parties, their successors" in one chunk and "except in cases where the contract has been declared null and void" in the next. The *exception* — which is often the entire point of the legal question — ends up separated from its condition.

Worse: legal documents reference each other constantly. "As stated in Article 190" means nothing without Article 190's content. A chunker that doesn't understand document structure can't know to include that reference.

---

## Structure-Aware Chunking

Instead of splitting by token count, I split by legal document structure: each article is a single chunk, with its sub-clauses kept together.

```python
import re

def parse_legal_document(text: str) -> list[dict]:
    article_pattern = re.compile(
        r'(ماده\s+\d+[^\n]*\n(?:(?!ماده\s+\d+).)*)',
        re.DOTALL
    )
    chunks = []
    for match in article_pattern.finditer(text):
        article_text = match.group(1).strip()
        article_num = re.search(r'\d+', article_text).group()
        # Extract cross-references to include as metadata
        refs = re.findall(r'ماده\s+(\d+)', article_text)
        chunks.append({
            "text": article_text,
            "article_number": int(article_num),
            "cross_references": [int(r) for r in refs if int(r) != int(article_num)],
            "source": source_name
        })
    return chunks
```

Each chunk maps to exactly one article. The cross-references become metadata that the retriever uses to pull in related articles.

**Result**: retrieval precision went from ~70% to 92% at k=5 with this change alone, before touching the embedding model or retrieval strategy.

---

## Hybrid Retrieval

Dense retrieval (embedding similarity) is good at semantic matching: "employer obligations" finds articles about what employers must do even if those words don't appear. But legal text is also full of precise terminology where keyword matching matters: "Article 219", "null and void", specific legal terms that have no semantic synonym.

I combined both:

```python
from langchain.vectorstores import Chroma
from langchain.retrievers import BM25Retriever, EnsembleRetriever
from langchain.embeddings import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
)
vectorstore = Chroma.from_documents(chunks, embedding=embeddings)
dense_retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
sparse_retriever = BM25Retriever.from_documents(chunks, k=5)

retriever = EnsembleRetriever(
    retrievers=[dense_retriever, sparse_retriever],
    weights=[0.6, 0.4]
)
```

The 0.6/0.4 weighting came from grid search on a small evaluation set of 50 question-answer pairs I built manually from the documents. Dense retrieval dominates because most questions are semantic, but sparse has enough weight to catch exact article references.

**Cross-reference expansion**: After retrieving the top-k articles, I expanded the context by also fetching any articles referenced in the retrieved chunks:

```python
def expand_with_cross_references(retrieved_chunks, all_chunks_by_id):
    expanded = list(retrieved_chunks)
    seen_ids = {c["article_number"] for c in retrieved_chunks}
    for chunk in retrieved_chunks:
        for ref_id in chunk["cross_references"]:
            if ref_id not in seen_ids and ref_id in all_chunks_by_id:
                expanded.append(all_chunks_by_id[ref_id])
                seen_ids.add(ref_id)
    return expanded
```

This added 1–3 additional articles per query on average, and those additions contained the cross-referenced content that completed incomplete answers.

---

## Controlling Hallucination

The hardest part. LLMs will confidently answer legal questions even when the retrieved context doesn't contain the answer. In a legal domain, a confidently wrong answer is worse than "I don't know."

Three layers of hallucination control:

### 1. System prompt grounding

```python
SYSTEM_PROMPT = """You are a legal document assistant. Answer questions using 
ONLY the provided legal articles. If the answer is not in the provided context, 
say "این موضوع در مدارک موجود یافت نشد" (This topic was not found in the 
available documents) and do not attempt to answer from general knowledge.

Always cite the specific article number(s) your answer is based on.
Format: "Based on Article [N]: [answer]"
"""
```

Simple, but necessary. Without this, the model will use its pre-training knowledge to fill gaps — which is exactly what you don't want in a domain where accuracy is non-negotiable.

### 2. Few-shot examples with "I don't know" cases

I included 3–5 examples in every prompt, including at least one example where the correct answer is "not found in documents." LLMs learn from in-context examples, and showing the model that "not found" is a valid and expected output significantly increases its willingness to give that answer when appropriate.

### 3. Confidence-based answer gating

After generating an answer, I ran a second LLM call asking it to verify whether its answer was fully supported by the provided articles:

```python
VERIFICATION_PROMPT = """Given the following legal articles and the answer 
provided, is the answer fully supported by the provided articles?

Articles: {context}
Answer: {answer}

Respond with JSON: {{"supported": true/false, "reason": "..."}}
"""

def verify_answer(context, answer, llm):
    result = llm.invoke(VERIFICATION_PROMPT.format(
        context=context, answer=answer
    ))
    parsed = json.loads(result.content)
    return parsed["supported"]
```

If `supported` is false, the system falls back to "not found in documents" instead of showing the unverified answer. This added latency (~1 extra LLM call per query), but the client accepted the tradeoff given the domain.

**Measured result**: hallucination rate dropped 60% compared to a vanilla RAG setup with the same model and documents.

---

## Production Deployment

Deployed via Docker with two interfaces:
- **Streamlit**: for internal legal analysts who preferred a chat UI
- **Gradio**: exposed as an API endpoint for integration into the company's existing tools

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8501 7860
CMD ["python", "run_both.py"]
```

`run_both.py` launches both servers in separate threads. Not elegant, but it worked for the deployment constraints (single VM, no orchestration).

---

## What I'd Do Differently

**Better evaluation from day one.** I built the question-answer evaluation set late, which meant I couldn't measure the impact of early decisions precisely. Build your eval set before you start tuning — it's the only way to know whether a change helped.

**Smaller embedding model.** `paraphrase-multilingual-mpnet-base-v2` is 278M parameters. For a production system with limited compute, a distilled model like `multilingual-e5-small` would have been 4x faster with a small accuracy cost that the hybrid retrieval would partially compensate for.

**Streaming responses.** Legal answers can be long. Streamlit supports streaming LLM responses but I didn't implement it in v1. Users waiting for a 5-second response with no feedback is bad UX — worth the implementation effort.

---

## Lessons

**Chunking strategy is the highest-leverage decision in RAG.** Before you touch the embedding model, retrieval algorithm, or prompt, spend time understanding your document structure and splitting accordingly. For legal text, article-level chunking with cross-reference expansion was worth more than any model upgrade.

**Hybrid retrieval is almost always better than pure dense for domain-specific corpora.** The compute cost is minimal (BM25 is fast), and the precision improvement on keyword-heavy queries is reliable.

**In high-stakes domains, "I don't know" must be a first-class output.** Build the verification step. The latency cost is worth it when wrong answers have real consequences.
