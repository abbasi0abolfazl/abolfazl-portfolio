export const techFilters = ["Python", "NLP", "Computer Vision", "Trading", "RAG", "LLM"];
export const yearFilters = ["2023", "2024", "2025"];

export const projects = [
  {
    id: 'social-media-intelligence-platform',
    title: 'Social Media Intelligence Platform',
    description: 'A resilient X (Twitter) crawler that runs unattended for hours — with database-driven selectors, self-healing browser automation, ban detection, and live Telegram monitoring. The working core of a broader multi-platform aggregator.',
    tags: ['Python', 'Selenium', 'BeautifulSoup4', 'MySQL', 'Telegram Bot API', 'Linux/systemd'],
    tech: ['Python'],
    year: '2023',
    github: 'https://github.com/abbasi0abolfazl/social_media_data_aggregator',
    demo: null,
    featured: true,
    color: 'from-blue-500/10 to-cyan-500/10',
    overview: 'A long-running system that collects public data from X (Twitter) without an official API. The real engineering is not the scraping itself, but everything built around it to keep a browser, a login session, and an account healthy through multi-hour unattended runs on a platform that actively discourages automation.',
    role: 'I designed and built the whole system end to end: the crawler orchestrator, an isolated self-healing browser layer, session persistence and login checks, ban/limit detection, resource monitoring, structured data extraction, and Telegram-based observability — deployed as a managed Linux service.',
    challenge: 'Three problems at once: the platform constantly changes its page structure (so hard-coded locators rot), aggressive or predictable behavior gets the account banned, and the job must run on its own for hours without a human watching it.',
    solution: 'Treated the fragile parts as configuration instead of code — storing element selectors in the database so layout changes are a one-line update, not a redeploy. Wrapped the browser in a layer that detects bad sessions and restarts cleanly, paced activity to stay under rate limits with active ban detection, persisted login sessions to minimize risky re-logins, and streamed live run status to Telegram.',
    results: [
      'Runs unattended for hours as a managed Linux service with automatic recovery',
      'Adapts to platform layout changes via DB-stored selectors — no redeploy needed',
      'Active ban/limit detection plus session persistence to protect accounts',
      'Live run monitoring through a Telegram channel for full observability',
    ],
    codeSnippet: `# Selectors live in the database, not the code —
# so a platform layout change is a one-line UPDATE, not a redeploy.
def select_selectors() -> dict:
    """Load Selenium selectors from the DB into a lookup dict."""
    query = "SELECT name, selector_type, selector_value FROM twitter_xpath;"
    rows = db_manager.select(query)
    return {
        name: (selector_type, selector_value)
        for name, selector_type, selector_value in rows
    }`,
    lessons: 'Anything that changes more often than your release cycle belongs in settings, not code — storing selectors in the database removed most of the maintenance pain. And in long-running automation, failure is the normal state, so self-recovery and observability have to be features from day one.',
  },
  {
    id: 'sentiment-emotion-detection',
    title: 'Sentiment & Emotion Detection',
    description: 'Multi-class emotion classification system fine-tuned on BERT for Persian text, achieving high accuracy across 8 emotion categories.',
    tags: ['BERT', 'HuggingFace', 'ChatGPT API', 'Python'],
    tech: ['Python', 'NLP', 'LLM'],
    year: '2023',
    github: 'https://github.com/abbasi0abolfazl',
    demo: null,
    featured: true,
    color: 'from-purple-500/10 to-pink-500/10',
    overview: 'A fine-tuned BERT model for Persian text that classifies emotions across 8 categories with 3 polarities, enabling nuanced sentiment analysis with a human-in-the-loop retraining cycle.',
    role: 'I collected and cleaned the training dataset, fine-tuned the ParsBERT model, designed the evaluation pipeline, and implemented the human-in-the-loop retraining cycle with senior analyst feedback.',
    challenge: 'Persian NLP resources are limited. Existing multilingual models underperform on Persian text, especially for nuanced emotional categories.',
    solution: 'Fine-tuned ParsBERT on a curated Persian emotion dataset with augmentation techniques. Used GPT-4 for pseudo-label generation to expand training data.',
    results: [
      'Achieved 87% macro-F1 across 8 emotion classes and 3 polarities',
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
    description: 'Persian legal document assistant using RAG architecture with ChromaDB vector search, few-/zero-shot prompting, and Streamlit/Gradio production interfaces.',
    tags: ['RAG', 'ChromaDB', 'LangChain', 'Streamlit', 'Docker'],
    tech: ['Python', 'NLP', 'RAG', 'LLM'],
    year: '2024',
    github: 'https://github.com/abbasi0abolfazl',
    demo: null,
    featured: true,
    color: 'from-green-500/10 to-emerald-500/10',
    overview: 'A Retrieval-Augmented Generation chatbot for Persian legal documents deployed in production via Streamlit and Gradio with Docker. Answers user queries by retrieving and reasoning over relevant legal articles.',
    role: 'I built the document ingestion pipeline, designed the chunking strategy for legal texts, integrated ChromaDB for vector storage, and built the LangChain reasoning chain with few-/zero-shot prompting.',
    challenge: 'Legal documents have complex hierarchical structures and cross-references. Simple chunking strategies lose context critical for accurate legal reasoning.',
    solution: 'Implemented structure-aware chunking that preserves article hierarchy, with a hybrid retrieval approach combining dense and sparse search, and few-/zero-shot prompting for improved reasoning.',
    results: [
      'Retrieved relevant articles with 92% precision@5',
      'Reduced hallucination rate by 60% vs. vanilla LLM',
      'Deployed via Streamlit and Gradio with Docker in production',
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
    description: 'Computer vision model for detecting financial chart patterns with 97% accuracy using YOLOv8, integrated into a live trading pipeline.',
    tags: ['YOLOv8', 'Computer Vision', 'Trading', 'Python'],
    tech: ['Python', 'Computer Vision', 'Trading'],
    year: '2024',
    github: 'https://github.com/abbasi0abolfazl',
    demo: null,
    featured: true,
    color: 'from-amber-500/10 to-orange-500/10',
    overview: 'A real-time computer vision system trained on a custom-labeled candlestick chart dataset that detects technical analysis patterns at 97% accuracy, with detections integrated into a live trading pipeline.',
    role: 'I created the custom-labeled candlestick dataset, trained and validated the YOLOv8 model, and built the real-time inference pipeline integrated with live trading.',
    challenge: 'Chart patterns are visually ambiguous and context-dependent. The same visual shape can represent different patterns depending on surrounding price action.',
    solution: 'Combined YOLOv8 for bounding-box detection with a secondary classifier that uses price-action context windows to disambiguate similar-looking patterns.',
    results: [
      '97% mAP@0.5 on the test set',
      'Real-time inference integrated into live trading pipeline',
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
    description: 'Real-time Forex trading system with RSI divergence strategies, adaptive lot sizing, trailing stops, and Redis-cached news-based trading suspension.',
    tags: ['MetaTrader', 'Redis', 'PostgreSQL', 'Python'],
    tech: ['Python', 'Trading'],
    year: '2024',
    github: 'https://github.com/abbasi0abolfazl',
    demo: null,
    featured: true,
    color: 'from-red-500/10 to-rose-500/10',
    overview: 'An automated Forex trading system incorporating RSI divergence, price-action strategies, adaptive lot sizing, trailing stops, and a Redis-cached real-time news suspension layer.',
    role: 'I designed the risk management engine, implemented the strategy runner with hot-swappable modules, and built the Redis-cached news-based trading suspension system.',
    challenge: 'Automated trading systems must handle network failures, exchange outages, and unexpected market events without causing runaway losses.',
    solution: 'Built a fault-tolerant architecture with circuit breakers, dead-man switches, and automatic position flattening on news events detected via RSS feeds cached in Redis.',
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
    id: 'fxbrain',
    title: 'FXBrain',
    description: 'AI-powered financial market platform with trading signals, technical/fundamental analysis, smart volatility alerts, backtesting engine, and personalized dashboards.',
    tags: ['Python', 'LLMs', 'REST API', 'PostgreSQL', 'Redis'],
    tech: ['Python', 'Trading', 'LLM'],
    year: '2025',
    github: 'https://github.com/abbasi0abolfazl',
    demo: null,
    featured: true,
    color: 'from-yellow-500/10 to-amber-500/10',
    overview: 'A comprehensive AI-powered financial market platform combining LLM-driven analysis with quantitative trading signals, real-time volatility alerts, a backtesting engine, and personalized dashboards.',
    role: 'Designed and built the full platform: LLM integration for market analysis, trading signal generation pipeline, backtesting engine, and the REST API backend.',
    challenge: 'Financial markets require low-latency signal delivery combined with high-quality LLM analysis — balancing speed with depth of reasoning.',
    solution: 'Separated signal generation (fast, rule-based) from LLM analysis (async, queued) and cached intermediate results in Redis to deliver both speed and quality.',
    results: [
      'Real-time trading signals with sub-second latency',
      'Backtesting engine covering multiple strategies and timeframes',
      'Personalized dashboards adapting to each user risk profile',
    ],
    codeSnippet: `# Signal pipeline: fast rule-based layer + async LLM analysis
async def generate_signal(symbol: str) -> Signal:
    technical = compute_technical_indicators(symbol)
    if technical.confidence > THRESHOLD:
        return Signal(source="technical", **technical)
    # Enqueue LLM analysis for deeper reasoning
    await llm_queue.put({"symbol": symbol, "context": technical})
    return Signal(source="pending", symbol=symbol)`,
    lessons: 'Separating fast rule-based signals from slow LLM analysis and combining them asynchronously gives the best of both worlds for financial applications.',
  },
  {
    id: 'interactive-cv-agent',
    title: 'Interactive CV Agent',
    description: 'Conversational AI agent for building and exploring professional profiles, with distinct Employee and Employer interaction modes.',
    tags: ['Python', 'LLMs', 'LangChain'],
    tech: ['Python', 'LLM'],
    year: '2025',
    github: 'https://github.com/abbasi0abolfazl/interactive-cv-agent',
    demo: null,
    featured: false,
    color: 'from-indigo-500/10 to-violet-500/10',
    overview: 'A conversational AI agent that allows users to build and explore professional profiles through natural language. Features two distinct interaction modes: Employee (building a profile) and Employer (exploring candidates).',
    role: 'Designed the dual-mode conversation architecture, built the LangChain agent with custom tools, and implemented profile persistence.',
    challenge: 'Maintaining coherent, context-aware conversations across two very different user personas with different goals and information needs.',
    solution: 'Used LangChain agents with persona-specific system prompts and tool sets, plus a shared profile data layer that both modes read from and write to.',
    results: [
      'Dual-mode agent handling both Employee and Employer flows',
      'Natural language profile building without forms',
      'Context-aware conversation with persistent profile state',
    ],
    codeSnippet: `from langchain.agents import AgentExecutor, create_openai_tools_agent

def create_agent(mode: str, profile: dict) -> AgentExecutor:
    persona = EMPLOYEE_PROMPT if mode == "employee" else EMPLOYER_PROMPT
    tools = get_tools(mode, profile)
    agent = create_openai_tools_agent(llm, tools, persona)
    return AgentExecutor(agent=agent, tools=tools, verbose=True)`,
    lessons: 'Persona-specific prompts and tool sets are more effective than a single generic agent — the user experience improves dramatically when the agent knows its role.',
  },
  {
    id: 'nety',
    title: 'Nety — Network Monitor',
    description: 'Full-stack network monitoring dashboard with real-time alerting and device management built with Python, Flask, React, and Vite.',
    tags: ['Python', 'Flask', 'React', 'Vite'],
    tech: ['Python'],
    year: '2025',
    github: 'https://github.com/abbasi0abolfazl/nety',
    demo: null,
    featured: false,
    color: 'from-sky-500/10 to-blue-500/10',
    overview: 'A full-stack network monitoring dashboard providing real-time device status, alerting, and management. Flask backend with a React/Vite frontend.',
    role: 'Built the full stack: Flask REST API, real-time alerting engine, and React dashboard.',
    challenge: 'Real-time network monitoring requires low-latency data delivery without overloading the backend with polling requests.',
    solution: 'Used server-sent events for push-based real-time updates instead of polling, reducing backend load while improving dashboard responsiveness.',
    results: [
      'Real-time device status updates without polling',
      'Alert system with configurable thresholds per device',
      'Device management via clean REST API',
    ],
    codeSnippet: `@app.route('/events')
def stream():
    def generate():
        while True:
            status = check_all_devices()
            yield f"data: {json.dumps(status)}\\n\\n"
            time.sleep(5)
    return Response(generate(), mimetype='text/event-stream')`,
    lessons: 'Server-sent events are a simpler and more efficient alternative to WebSockets for one-directional real-time data like monitoring dashboards.',
  },
  {
    id: 'ai-itinerary-generator',
    title: 'AI Itinerary Generator',
    description: 'Serverless travel itinerary generator with async processing, real-time status tracking, and Firestore persistence running on Cloudflare Workers.',
    tags: ['Cloudflare Workers', 'OpenAI GPT-4', 'Firestore'],
    tech: ['LLM'],
    year: '2025',
    github: 'https://github.com/abbasi0abolfazl/ai-itinerary-generator',
    demo: null,
    featured: false,
    color: 'from-emerald-500/10 to-teal-500/10',
    overview: 'A serverless travel itinerary generator deployed on Cloudflare Workers. Uses GPT-4 for itinerary generation with async processing so users get real-time status updates while the LLM works.',
    role: 'Built the serverless architecture, GPT-4 integration, async job queue, and Firestore persistence layer.',
    challenge: 'LLM generation takes seconds — a synchronous API would time out on serverless platforms with strict request duration limits.',
    solution: 'Implemented an async job pattern: the request returns a job ID immediately, GPT-4 runs in a Durable Object, and the client polls a status endpoint backed by Firestore.',
    results: [
      'Zero cold-start latency on Cloudflare edge network',
      'Handles long LLM generation without serverless timeouts',
      'Persistent itinerary storage via Firestore',
    ],
    codeSnippet: `// Cloudflare Worker: async job pattern
export default {
  async fetch(request, env) {
    const jobId = crypto.randomUUID();
    await env.FIRESTORE.set(jobId, { status: 'pending' });
    // Kick off generation without awaiting
    env.GENERATOR.get(env.GENERATOR.idFromName(jobId)).fetch(request);
    return Response.json({ jobId, status: 'pending' });
  }
}`,
    lessons: 'Async job patterns are essential for LLM workloads on serverless platforms — never make the user wait synchronously for a 10-second LLM call.',
  },
  {
    id: 'hiero-sdk-python',
    title: 'Hedera SDK Contribution',
    description: 'Open source contribution to the official Python SDK for Hedera Hashgraph: fungible & NFT token management, consensus transactions, and account/topic queries.',
    tags: ['Python', 'Hedera Hashgraph', 'Blockchain'],
    tech: ['Python'],
    year: '2025',
    github: 'https://github.com/abbasi0abolfazl',
    demo: null,
    featured: false,
    color: 'from-violet-500/10 to-purple-500/10',
    overview: 'Contributed to the official hiero-sdk-python (Python SDK for Hedera Hashgraph), adding support for fungible and NFT token management, consensus transactions, and account/topic queries.',
    role: 'Implemented token management APIs, consensus transaction handling, and account/topic query methods; wrote tests and documentation.',
    challenge: 'Blockchain SDKs require precise protocol implementation with no room for ambiguity — every transaction type has strict encoding and validation rules.',
    solution: 'Followed the Hedera protobuf spec closely, wrote comprehensive tests against testnet, and aligned with existing SDK patterns for consistency.',
    results: [
      'Added fungible & NFT token management to the Python SDK',
      'Implemented consensus transaction support',
      'Merged into the official hiero-sdk-python repository',
    ],
    codeSnippet: `from hiero_sdk_python import Client, TokenCreateTransaction

client = Client.for_testnet()
client.set_operator(account_id, private_key)

token_id = (
    TokenCreateTransaction()
    .set_token_name("MyToken")
    .set_token_symbol("MTK")
    .set_initial_supply(1000)
    .set_treasury_account_id(account_id)
    .execute(client)
    .get_receipt(client)
    .token_id
)`,
    lessons: 'Contributing to an SDK forces you to understand the underlying protocol at a deeper level than application-level usage — it is one of the best ways to build foundational knowledge.',
  },
];

// Default export for convenience
export default projects;
