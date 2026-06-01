// Filter options
export const techFilters = ["Python", "NLP", "Computer Vision", "Trading", "RAG", "LLM"];
export const typeFilters = ["Web App", "API", "Desktop App", "Research"];
export const yearFilters = ["2023", "2024", "2025"];

// Projects data
export const projects = [
  {
    id: 'social-botnet-intelligence',
    title: 'Social Botnet Intelligence System',
    description: 'Modular social media scraping system for data collection from X, Facebook, and Instagram with intelligent scheduling.',
    tags: ['Python', 'Selenium', 'Asyncio', 'Flask'],
    tech: ['Python'],
    type: 'API',
    year: '2023',
    github: 'https://github.com/abbasi0abolfazl',
    demo: null,
    color: 'from-blue-500/10 to-cyan-500/10',
    overview: 'A modular, scalable system for collecting and analyzing social media data across multiple platforms simultaneously using intelligent scheduling and async processing.',
    role: 'I designed the overall architecture, implemented the async scraping engine, and built the scheduling system that handles rate limiting and anti-ban strategies.',
    challenge: 'Collecting large volumes of social media data reliably while respecting rate limits, handling CAPTCHAs, and managing session state across multiple accounts and platforms.',
    solution: 'Built a modular pipeline with per-platform adapters, exponential backoff, proxy rotation, and a Redis-based job queue. Each scraper runs as an isolated async worker.',
    results: [
      'Processed 50K+ data points per day reliably',
      'Reduced ban rate by 90% with adaptive scheduling',
      'Supported 3 platforms with a single shared pipeline',
    ],
    codeSnippet: `async def scrape_with_retry(url, max_retries=3):
    for attempt in range(max_retries):
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=10) as resp:
                    return await resp.json()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            await asyncio.sleep(2 ** attempt)`,
    lessons: 'Designing for failure from day one is critical in scraping systems. Modular adapters saved significant time when adding new platforms.',
  },
  {
    id: 'sentiment-emotion-detection',
    title: 'Sentiment & Emotion Detection',
    description: 'Multi-class emotion classification system fine-tuned on BERT for Persian text, achieving high accuracy across 8 emotion categories.',
    tags: ['BERT', 'HuggingFace', 'ChatGPT API', 'Python'],
    tech: ['Python', 'NLP', 'LLM'],
    type: 'Research',
    year: '2023',
    github: 'https://github.com/abbasi0abolfazl',
    demo: null,
    color: 'from-purple-500/10 to-pink-500/10',
    overview: 'A fine-tuned BERT model for Persian text that classifies emotions across 8 categories, enabling nuanced sentiment analysis for downstream applications.',
    role: 'I collected and cleaned the training dataset, fine-tuned the ParsBERT model, and designed the evaluation pipeline comparing against GPT-4 baselines.',
    challenge: 'Persian NLP resources are limited. Existing multilingual models underperform on Persian text, especially for nuanced emotional categories.',
    solution: 'Fine-tuned ParsBERT on a curated Persian emotion dataset with augmentation techniques. Used GPT-4 for pseudo-label generation to expand training data.',
    results: [
      'Achieved 87% macro-F1 across 8 emotion classes',
      'Outperformed multilingual BERT baseline by 12%',
      'Dataset of 15K labeled Persian sentences created',
    ],
    codeSnippet: `from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_name = "HooshvareLab/bert-fa-base-uncased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(
    model_name, num_labels=8
)

def predict_emotion(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True)
    outputs = model(**inputs)
    return outputs.logits.argmax(dim=-1).item()`,
    lessons: 'Data quality matters more than model size. Spending time on label consistency improved results more than scaling up the model.',
  },
  {
    id: 'legal-reasoning-chatbot',
    title: 'Legal Reasoning Chatbot',
    description: 'Persian legal document assistant using RAG architecture with vector search for intelligent document retrieval and reasoning.',
    tags: ['RAG', 'ChromaDB', 'LangChain', 'Streamlit'],
    tech: ['Python', 'NLP', 'RAG', 'LLM'],
    type: 'Web App',
    year: '2024',
    github: 'https://github.com/abbasi0abolfazl',
    demo: null,
    color: 'from-green-500/10 to-emerald-500/10',
    overview: 'A Retrieval-Augmented Generation chatbot for Persian legal documents that answers user queries by retrieving and reasoning over relevant legal articles.',
    role: 'I built the document ingestion pipeline, designed the chunking strategy for legal texts, integrated ChromaDB for vector storage, and built the LangChain reasoning chain.',
    challenge: 'Legal documents have complex hierarchical structures and cross-references. Simple chunking strategies lose context critical for accurate legal reasoning.',
    solution: 'Implemented structure-aware chunking that preserves article hierarchy, with a hybrid retrieval approach combining dense and sparse search.',
    results: [
      'Retrieved relevant articles with 92% precision@5',
      'Reduced hallucination rate by 60% vs. vanilla LLM',
      'Processed a corpus of 10K+ legal articles',
    ],
    codeSnippet: `from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/paraphrase-multilingual-mpnet-base-v2"
)
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="./legal_db"
)

retriever = vectorstore.as_retriever(search_kwargs={"k": 5})`,
    lessons: 'Domain-specific chunking strategies are as important as model selection. Legal text requires understanding document structure before splitting.',
  },
  {
    id: 'chart-pattern-detector',
    title: 'Chart Pattern Detector (YOLOv8)',
    description: 'Computer vision model for detecting financial chart patterns with 97% accuracy using YOLOv8 architecture.',
    tags: ['YOLOv8', 'Computer Vision', 'Trading', 'Python'],
    tech: ['Python', 'Computer Vision', 'Trading'],
    type: 'Research',
    year: '2024',
    github: 'https://github.com/abbasi0abolfazl',
    demo: null,
    color: 'from-amber-500/10 to-orange-500/10',
    overview: 'A real-time computer vision system that detects classic technical analysis chart patterns (head & shoulders, triangles, flags) from live trading charts.',
    role: 'I created the training dataset by annotating 3K+ chart images, trained and validated the YOLOv8 model, and built the real-time inference pipeline.',
    challenge: 'Chart patterns are visually ambiguous and context-dependent. The same visual shape can represent different patterns depending on surrounding price action.',
    solution: 'Combined YOLOv8 for bounding-box detection with a secondary classifier that uses price-action context windows to disambiguate similar-looking patterns.',
    results: [
      '97% mAP@0.5 on the test set',
      'Real-time inference at 30 FPS on CPU',
      'Detected 12 distinct chart pattern types',
    ],
    codeSnippet: `from ultralytics import YOLO

model = YOLO("yolov8n.pt")
results = model.train(
    data="chart_patterns.yaml",
    epochs=100,
    imgsz=640,
    batch=16,
    patience=20,
    augment=True,
)

# Inference
detections = model.predict("chart.png", conf=0.5)`,
    lessons: 'Transfer learning from natural images works surprisingly well for financial charts. Starting from pretrained weights reduced training time by 70%.',
  },
  {
    id: 'forex-trading-bot',
    title: 'Automated Forex Trading Bot',
    description: 'Real-time trading system with comprehensive risk management, news-based suspension, and multi-strategy support.',
    tags: ['MetaTrader', 'Redis', 'PostgreSQL', 'Python'],
    tech: ['Python', 'Trading'],
    type: 'Desktop App',
    year: '2024',
    github: 'https://github.com/abbasi0abolfazl',
    demo: null,
    color: 'from-red-500/10 to-rose-500/10',
    overview: 'An automated Forex trading system that executes multiple strategies simultaneously with real-time risk management, news event detection, and position tracking.',
    role: 'I designed the risk management engine, implemented the strategy runner with hot-swappable modules, and built the news-based trading suspension system.',
    challenge: 'Automated trading systems must handle network failures, exchange outages, and unexpected market events without causing runaway losses.',
    solution: 'Built a fault-tolerant architecture with circuit breakers, dead-man switches, and automatic position flattening on news events detected via RSS feeds.',
    results: [
      'Maintained 99.7% uptime over 6 months of live trading',
      'Zero runaway-loss incidents across all test scenarios',
      'Supported 5 concurrent strategies with isolated risk budgets',
    ],
    codeSnippet: `class RiskManager:
    def __init__(self, max_drawdown=0.05, max_position_size=0.02):
        self.max_drawdown = max_drawdown
        self.max_position_size = max_position_size

    def approve_trade(self, account, trade):
        current_drawdown = self.get_drawdown(account)
        if current_drawdown > self.max_drawdown:
            return False, "Max drawdown exceeded"
        position_size = trade.lot_size / account.balance
        if position_size > self.max_position_size:
            return False, "Position size too large"
        return True, "Approved"`,
    lessons: 'Risk management code should be treated as the most critical part of the system — more important than the trading logic itself.',
  },
  {
    id: 'ecommerce-chatbot',
    title: 'E-Commerce Chatbot',
    description: 'Intelligent shopping assistant using RAG and semantic search for product recommendations and customer support.',
    tags: ['OpenAI API', 'RAG', 'Semantic Search', 'Python'],
    tech: ['Python', 'NLP', 'RAG', 'LLM'],
    type: 'Web App',
    year: '2025',
    github: 'https://github.com/abbasi0abolfazl',
    demo: null,
    color: 'from-teal-500/10 to-cyan-500/10',
    overview: 'An AI-powered shopping assistant that understands natural language queries, recommends products using semantic search, and handles customer support through RAG.',
    role: 'I built the semantic product search engine, designed the conversation flow, integrated the OpenAI API with a structured tool-calling system, and optimized retrieval latency.',
    challenge: 'Users describe products in natural language that doesn\'t match product catalog keywords. Traditional keyword search fails for intent-based queries.',
    solution: 'Encoded the entire product catalog with embeddings and used cosine similarity search combined with LLM reranking to surface the most relevant products for any query.',
    results: [
      'Reduced "no results" rate from 23% to 3%',
      'Improved add-to-cart rate by 18% in A/B test',
      'Average response latency under 800ms',
    ],
    codeSnippet: `import openai
import numpy as np

def semantic_search(query, product_embeddings, top_k=5):
    query_emb = openai.embeddings.create(
        input=query,
        model="text-embedding-3-small"
    ).data[0].embedding

    scores = np.dot(product_embeddings, query_emb)
    top_indices = np.argsort(scores)[-top_k:][::-1]
    return top_indices, scores[top_indices]`,
    lessons: 'Semantic search alone isn\'t enough — combining it with LLM reranking and business rules (stock, margin) dramatically improves real-world relevance.',
  },
];

// Default export for convenience
export default projects;