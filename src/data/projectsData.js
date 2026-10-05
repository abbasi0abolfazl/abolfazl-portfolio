export const techFilters = ["Python", "NLP", "Computer Vision", "Trading", "RAG", "LLM", "Speech & Audio"];
export const yearFilters = ["2023", "2024", "2025", "2026"];

export const projects = [
  {
    id: 'ai-dubbing-studio',
    title: 'AI Dubbing Studio (Autonomous Localization)',
    description: 'An enterprise-grade, on-premise AI video dubbing suite that converts foreign speech to synchronized Persian audio in under 3 minutes. Features Faster-Whisper VAD segmentation, neural voice synthesis, dynamic Rubberband acoustic time-stretching, background music ducking, and subpath reverse proxy deployment.',
    tags: ['Python', 'Faster-Whisper', 'Neural TTS', 'FFmpeg', 'React 18', 'Docker', 'Waitress', 'Nginx/Apache'],
    tech: ['Python', 'NLP', 'LLM', 'Speech & Audio'],
    year: '2026',
    github: 'https://github.com/abbasi0abolfazl/ai-dubbing-studio',
    demo: 'https://demo.arnikaware.com/studio',
    featured: true,
    color: 'from-indigo-500/10 to-violet-500/10',
    overview: 'A complete on-premise AI localization suite that eliminates external API dependencies and costly per-minute cloud bills. The system performs automated millisecond-accurate speech extraction, chunked translation, character-based neural TTS synthesis, acoustic time-stretching (Rubberband), and audio ducking, delivered through an interactive browser-based NLE waveform editor with live SSE progress tracking.',
    role: 'Sole Architect & Lead Engineer. Designed the distributed async processing pipeline, integrated Faster-Whisper with CUDA/fp16 and CTranslate2, engineered the FFmpeg multi-filter audio ducking engine, created the React waveform timeline editor, and implemented enterprise reverse proxy subpath routing with automated zero-downtime Docker CI/CD deployment.',
    challenge: 'Three major engineering bottlenecks: 1) Synchronization drift between translated Persian speech and original English pacing, 2) Maintaining real-time feedback and video previews without GPU locking, and 3) Seamless enterprise reverse proxy deployment under a unified subpath (/studio) behind Nginx/Apache without breaking SPA routing, assets, or SSE streams.',
    solution: 'Implemented acoustic speech rate matching with FFmpeg rubberband time-stretching and dynamic music ducking. Engineered background threading with atomic project storage and Server-Sent Events (SSE) for zero-latency progress streaming. Wrapped the WSGI layer with DispatcherMiddleware and ProxyFix, paired with dynamic Vite base routing to ensure zero-configuration subpath operation.',
    results: [
      'Reduced end-to-end video dubbing turnaround from 2 weeks to under 3 minutes',
      '100% on-premise execution with zero external API fees or data leakage risk',
      'Sub-second real-time progress streaming over Server-Sent Events',
      'Seamless subpath routing and automated zero-downtime Docker CI/CD deployment',
    ],
    codeSnippet: `# WSGI Subpath Dispatcher & ProxyFix Integration:
# Seamlessly serves root and /studio requests under enterprise reverse proxy
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.middleware.proxy_fix import ProxyFix

app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    "/studio": app.wsgi_app
})
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)`,
    lessons: 'In speech-to-speech pipelines, natural rhythm matters more than raw word-for-word accuracy — dynamic acoustic time-stretching combined with background audio ducking transforms synthetic dubbing into professional broadcast quality. Furthermore, architecting web applications with dynamic subpath routing from day one eliminates massive proxy integration friction.',
  },
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
    github: 'https://github.com/abbasi0abolfazl/CommentAnalyzer',
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
    id: 'chart-pattern-detector',
    title: 'Chart Pattern Detection Experiment',
    description: 'A reproducible proof of concept that generates candlestick images from OHLC data and applies a public pretrained YOLOv8 model to identify chart patterns.',
    tags: ['YOLOv8', 'Computer Vision', 'Trading', 'Python'],
    tech: ['Python', 'Computer Vision', 'Trading'],
    year: '2024',
    github: 'https://github.com/abbasi0abolfazl/stock-market-pattern-detection',
    demo: null,
    featured: false,
    color: 'from-amber-500/10 to-orange-500/10',
    overview: 'An experimental computer-vision pipeline that converts historical OHLC data into candlestick images, filters discontinuous time windows, and runs inference with the public foduucom/stockmarket-pattern-detection-yolov8 model.',
    role: 'I built the data preprocessing, multi-window chart generation, inference orchestration, and annotated-output workflow around the pretrained model.',
    challenge: 'Financial time series must be converted into consistent visual windows without introducing misleading gaps or incomplete chart segments.',
    solution: 'Generated charts at multiple window sizes, skipped windows with time gaps greater than ten minutes, and saved only images where the upstream model returned detections.',
    results: [
      'Reproducible local pipeline from OHLC CSV input to annotated detections',
      'Multiple chart-window sizes with explicit time-gap filtering',
      'Open implementation linked to the public pretrained model it uses',
    ],
    codeSnippet: `from ultralyticsplus import YOLO

model = YOLO("foduucom/stockmarket-pattern-detection-yolov8")
model.overrides["conf"] = 0.25
model.overrides["iou"] = 0.45
detections = model(chart_image)`,
    lessons: 'A pretrained detector can validate the end-to-end pipeline, but model-quality claims require a versioned dataset, a documented evaluation protocol, and reproducible metrics.',
  },
  {
    id: 'forex-trading-bot',
    title: 'Automated Forex Trading Bot',
    description: 'Real-time Forex trading system with RSI divergence strategies, adaptive lot sizing, trailing stops, and Redis-cached news-based trading suspension.',
    tags: ['MetaTrader', 'Redis', 'PostgreSQL', 'Python'],
    tech: ['Python', 'Trading'],
    year: '2024',
    github: null,
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
    title: 'FXBrain — Financial AI MVP',
    description: 'An early-stage MVP for an AI-assisted Forex analysis platform, exploring product workflows for market analysis, trading signals, alerts, and decision-support tools.',
    tags: ['Financial AI', 'Forex', 'Product MVP'],
    tech: ['Trading', 'LLM'],
    year: '2025',
    github: 'https://github.com/abbasi0abolfazl/FXBrain',
    demo: null,
    featured: true,
    color: 'from-yellow-500/10 to-amber-500/10',
    overview: 'FXBrain is currently an MVP focused on product design, user workflows, and validating the concept of an AI-assisted Forex analysis platform. The production data, trading, and AI backend are not implemented yet.',
    role: 'Designed the initial product concept, interface, and workflow for combining market data, analysis, and AI-assisted decision support.',
    challenge: 'The current challenge is validating which market-analysis and decision-support workflows are useful before investing in a production backend and AI pipeline.',
    solution: 'Built the MVP around the product experience first, using it to define core use cases, user flows, and the boundaries of future data, trading, and AI components.',
    results: [
      'Initial MVP and product workflow designed',
      'Core use cases for market analysis and trading support defined',
      'Backend and AI architecture remain future work',
    ],
    codeSnippet: `// Current status: product MVP
// Production trading, data, and AI backend are not implemented yet.`,
    lessons: 'Validating product workflows before building a complex backend reduces the risk of engineering features that do not solve the right problem.',
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
    id: 'cafebot',
    title: 'Cafebot',
    description: 'Conversational ordering chatbot for coffeeshops.',
    tags: ['Python', 'LLMs', 'Streamlit'],
    tech: ['Python', 'LLM'],
    year: '2025',
    github: 'https://github.com/abbasi0abolfazl/cafebot',
    demo: null,
    featured: false,
    color: 'from-amber-500/10 to-yellow-500/10',
    overview: 'A conversational AI chatbot for coffeeshops that lets customers place orders through natural language interaction, built with LLMs and Streamlit.',
    role: 'Designed and built the conversational ordering system, integrated LLM for natural language understanding of coffee orders, and deployed the Streamlit interface.',
    challenge: 'Coffee orders can be complex (customizations, sizes, add-ons) and require the chatbot to understand nuanced natural language while maintaining a clear order state.',
    solution: 'Used LLM-powered intent parsing to extract order details from free-form text, with a structured state machine to track order progress and confirm items before finalizing.',
    results: [
      'Natural language ordering with support for customizations',
      'Streamlit-based interface for easy deployment',
      'Modular design adaptable to other food/beverage domains',
    ],
    codeSnippet: `# Order intent extraction with LLM
def parse_order(user_input: str) -> Order:
    prompt = f"""Extract coffee order from: {user_input}
    Return: {{drink, size, add_ons, quantity}}"""
    response = llm.invoke(prompt)
    return Order.parse(response)

# State machine for order flow
class OrderState:
    LISTENING = "listening"
    CONFIRMING = "confirming"
    COMPLETED = "completed"`,
    lessons: 'Conversational ordering works best when the LLM handles the flexible input but a deterministic state machine manages the transaction flow.',
  },
];

// Default export for convenience
export default projects;
