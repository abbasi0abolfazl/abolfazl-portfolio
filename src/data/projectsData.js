export const techFilters = ["Python", "NLP", "Computer Vision", "Trading", "RAG", "LLM", "Speech & Audio"];
export const yearFilters = ["2023", "2024", "2025", "2026"];

export const projects = [
  {
    id: 'ai-dubbing-studio',
    title: 'AI Dubbing Studio (Autonomous Localization)',
    titleFa: 'استودیو دوبله خودکار و بومی‌سازی ویدیو با هوش مصنوعی',
    description: 'An enterprise-grade, on-premise AI video dubbing suite that converts foreign speech to synchronized Persian audio in under 3 minutes. Features Faster-Whisper VAD segmentation, neural voice synthesis, dynamic Rubberband acoustic time-stretching, background music ducking, and subpath reverse proxy deployment.',
    descriptionFa: 'سوئیت پروداکشن On-premise دوبله و بومی‌سازی ویدیو که صوت انگلیسی را در کمتر از ۳ دقیقه به فارسی همگام تبدیل می‌کند. مجهز به سگمنتیشن Faster-Whisper VAD، سنتز عصبی صوت، کشش زمانی آکوستیک Rubberband، داکینگ هوشمند موسیقی متن و استقرار معکوس پراکسی زیرمسیر.',
    tags: ['Python', 'Faster-Whisper', 'Neural TTS', 'FFmpeg', 'React 18', 'Docker', 'Waitress', 'Nginx/Apache'],
    tech: ['Python', 'NLP', 'LLM', 'Speech & Audio'],
    year: '2026',
    github: 'https://github.com/abbasi0abolfazl/ai-dubbing-studio',
    demo: 'https://demo.arnikaware.com/studio',
    featured: true,
    color: 'from-indigo-500/10 to-violet-500/10',
    overview: 'A complete on-premise AI localization suite that eliminates external API dependencies and costly per-minute cloud bills. The system performs automated millisecond-accurate speech extraction, chunked translation, character-based neural TTS synthesis, acoustic time-stretching (Rubberband), and audio ducking, delivered through an interactive browser-based NLE waveform editor with live SSE progress tracking.',
    overviewFa: 'یک پلتفرم کامل On-premise بومی‌سازی رسانه‌ای که وابستگی به APIهای ابری دلاری و هزینه‌های گزاف دقیقه‌ای را به صفر رسانده است. سامانه با دقت میلی‌ثانیه‌ای قطعات صوتی را استخراج کرده، ترجمه و سنتز گفتار عصبی را انجام می‌دهد و با انطباق سرعت ادای کلمات و کاهش خودکار صدای پس‌زمینه (Ducking)، خروجی نهایی را در ادیتور تحت وب نمایش می‌دهد.',
    role: 'Sole Architect & Lead Engineer. Designed the distributed async processing pipeline, integrated Faster-Whisper with CUDA/fp16 and CTranslate2, engineered the FFmpeg multi-filter audio ducking engine, created the React waveform timeline editor, and implemented enterprise reverse proxy subpath routing with automated zero-downtime Docker CI/CD deployment.',
    roleFa: 'معمار ارشد و تنها مهندس پیاده‌ساز؛ طراحی خط لوله ناهمگام توزیع‌شده، تجمیع Faster-Whisper روی بستر CUDA/fp16 و CTranslate2، توسعه موتور مالتی‌فیلتر FFmpeg برای Ducking موسیقی، ساخت تایم‌لاین ویوفورم تحت وب و تنظیم ساب‌پت روتر سازمانی.',
    challenge: 'Three major engineering bottlenecks: 1) Synchronization drift between translated Persian speech and original English pacing, 2) Maintaining real-time feedback and video previews without GPU locking, and 3) Seamless enterprise reverse proxy deployment under a unified subpath (/studio) behind Nginx/Apache without breaking SPA routing, assets, or SSE streams.',
    challengeFa: 'سه گره مهندسی اصلی: ۱) انحراف زمانی و اختلاف سرعت تکلم فارسی نسبت به انگلیسی اصلی، ۲) ارائه فیدبک زنده و پیش‌نمایش ویدیو بدون قفل شدن پردازنده گرافیکی (GPU)، و ۳) استقرار در پراکسی سازمانی زیرمسیر (/studio) بدون اختلال در استریم SSE و دارایی‌های وب.',
    solution: 'Implemented acoustic speech rate matching with FFmpeg rubberband time-stretching and dynamic music ducking. Engineered background threading with atomic project storage and Server-Sent Events (SSE) for zero-latency progress streaming. Wrapped the WSGI layer with DispatcherMiddleware and ProxyFix, paired with dynamic Vite base routing to ensure zero-configuration subpath operation.',
    solutionFa: 'پیاده‌سازی انطباق آکوستیک با فیلتر Rubberband و تنظیم پویای Ducking. استفاده از معماری Threading پس‌زمینه با ذخیره‌سازی اتمیک پروژه و ارسال رخدادهای لحظه‌ای به کلاینت از طریق Server-Sent Events (SSE). بسته‌بندی لایه WSGI با DispatcherMiddleware و ProxyFix برای استقرار بدون اصطکاک در پراکسی.',
    results: [
      'Reduced end-to-end video dubbing turnaround from 2 weeks to under 3 minutes',
      '100% on-premise execution with zero external API fees or data leakage risk',
      'Sub-second real-time progress streaming over Server-Sent Events',
      'Seamless subpath routing and automated zero-downtime Docker CI/CD deployment',
    ],
    resultsFa: [
      'کاهش زمان تحویل دوبله ویدیو از ۲ هفته به کمتر از ۳ دقیقه',
      'اجرای ۱۰۰٪ محلی و On-premise بدون هزینه API دلاری یا ریسک نشت داده‌های ویدیویی',
      'استریم پیشرفت بلادرنگ زیر ثانیه روی بستر Server-Sent Events (SSE)',
      'استقرار اتوماتیک داکر با زیرمسیر سازمانی و بدون داون‌تایم',
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
    lessonsFa: 'در سیستم‌های گفتار به گفتار، ریتم و جریان طبیعی تکلم بسیار مهم‌تر از دقت لغت به لغت است. تلفیق تایم‌استرچینگ آکوستیک با داکینگ صدای محیط، کیفیتی در سطح استودیو خلق می‌کند.',
  },
  {
    id: 'social-media-intelligence-platform',
    title: 'Social Media Intelligence Platform',
    titleFa: 'پلتفرم کاوش هوشمند شبکه‌های اجتماعی',
    description: 'A resilient X (Twitter) crawler that runs unattended for hours — with database-driven selectors, self-healing browser automation, ban detection, and live Telegram monitoring. The working core of a broader multi-platform aggregator.',
    descriptionFa: 'کراولر تاب‌آور توییتر/X با قابلیت اجرای مداوم ساعت‌ها بدون نیاز به نظارت انسانی؛ مجهز به سلکتورهای پایگاه‌داده، خودترمیمی مرورگر، شناسایی محدودیت و مانیتورینگ زنده تلگرام.',
    tags: ['Python', 'Selenium', 'BeautifulSoup4', 'MySQL', 'Telegram Bot API', 'Linux/systemd'],
    tech: ['Python'],
    year: '2023',
    github: 'https://github.com/abbasi0abolfazl/social_media_data_aggregator',
    demo: null,
    featured: true,
    color: 'from-blue-500/10 to-cyan-500/10',
    overview: 'A long-running system that collects public data from X (Twitter) without an official API. The real engineering is not the scraping itself, but everything built around it to keep a browser, a login session, and an account healthy through multi-hour unattended runs on a platform that actively discourages automation.',
    overviewFa: 'سیستم مقاوم استخراج داده عمومی از شبکه X بدون وابستگی به API رسمی. تمرکز مهندسی روی مکانیزم‌های پایداری سشن مرورگر، پایش سلامت اکانت و اجرای بدون خطای ساعت‌ها اتوماسیون پیوسته است.',
    role: 'I designed and built the whole system end to end: the crawler orchestrator, an isolated self-healing browser layer, session persistence and login checks, ban/limit detection, resource monitoring, structured data extraction, and Telegram-based observability — deployed as a managed Linux service.',
    roleFa: 'طراحی و پیاده‌سازی سراسری: ارکستریتور کراولر، لایه خودترمیم ایزوله مرورگر، پایش سشن لاگین، دیتکشن بن، سیستم لاگ و تلگرام الرتینگ، و استقرار به عنوان سرویس سیستمی لینوکس.',
    challenge: 'Three problems at once: the platform constantly changes its page structure (so hard-coded locators rot), aggressive or predictable behavior gets the account banned, and the job must run on its own for hours without a human watching it.',
    challengeFa: 'تغییرات مکرر ساختار صفحات وب، رفتارهای مسدودکننده پلتفرم در برابر ربات‌ها، و لزوم اجرای ساعت‌ها فرایند بدون وقفه و بدون حضور اپراتور انسانی.',
    solution: 'Treated the fragile parts as configuration instead of code — storing element selectors in the database so layout changes are a one-line update, not a redeploy. Wrapped the browser in a layer that detects bad sessions and restarts cleanly, paced activity to stay under rate limits with active ban detection, persisted login sessions to minimize risky re-logins, and streamed live run status to Telegram.',
    solutionFa: 'جداسازی سلکتورها و ذخیره در دیتابیس تا تغییرات قالب وب‌سایت با یک کوئری ساده حل شود؛ لایه بازراه‌اندازی هوشمند مرورگر، مدیریت سشن‌ها و ارسال تله‌متری زنده به ربات تلگرام.',
    results: [
      'Runs unattended for hours as a managed Linux service with automatic recovery',
      'Adapts to platform layout changes via DB-stored selectors — no redeploy needed',
      'Active ban/limit detection plus session persistence to protect accounts',
      'Live run monitoring through a Telegram channel for full observability',
    ],
    resultsFa: [
      'اجرای بدون وقفه برای ساعت‌ها به عنوان سرویس پایدار لینوکس با بازیابی خودکار',
      'انطباق با تغییرات صفحه وب از طریق سلکتورهای دیتابیسی بدون نیاز به کدنویسی مجدد',
      'سیستم حفاظت از حساب و شناسایی دقیق محدودیت‌های ریت‌لیمیت',
      'مانیتورینگ کامل وضعیت و تله‌متری لحظه‌ای از طریق تلگرام',
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
    lessonsFa: 'هر متغیری که سریع‌تر از چرخه ریلیز کد تغییر می‌کند، باید در تنظیمات یا دیتابیس باشد نه در کد. در سیستم‌های بلندمدت، خطا حالت عادی است و مکانیزم خودترمیمی شرط بقاست.',
  },
  {
    id: 'sentiment-emotion-detection',
    title: 'Sentiment & Emotion Detection',
    titleFa: 'سامانه تحلیل سنتیمنت و طبقه‌بندی احساسات متون فارسی',
    description: 'Multi-class emotion classification system fine-tuned on BERT for Persian text, achieving high accuracy across 8 emotion categories.',
    descriptionFa: 'سیستم پیشرفته طبقه‌بندی احساسات متون فارسی فاین‌تیون‌شده روی مدل پارس‌برت با پوشش ۸ احساس عمیق و ۳ قطبیت به همراه چرخه بازآموزی مستمر.',
    tags: ['BERT', 'HuggingFace', 'ChatGPT API', 'Python', 'NLP'],
    tech: ['Python', 'NLP', 'LLM'],
    year: '2023',
    github: 'https://github.com/abbasi0abolfazl/CommentAnalyzer',
    demo: null,
    featured: true,
    color: 'from-purple-500/10 to-pink-500/10',
    overview: 'A fine-tuned BERT model for Persian text that classifies emotions across 8 categories with 3 polarities, enabling nuanced sentiment analysis with a human-in-the-loop retraining cycle.',
    overviewFa: 'مدل فاین‌تیون‌شده پارس‌برت روی زبان فارسی برای تفکیک دقیق احساسات کاربران در کامنت‌ها و پیام‌ها در ۸ شاخه مجزا به همراه سیستم ارزیابی تحلیلی.',
    role: 'I collected and cleaned the training dataset, fine-tuned the ParsBERT model, designed the evaluation pipeline, and implemented the human-in-the-loop retraining cycle with senior analyst feedback.',
    roleFa: 'پاک‌سازی و برچسب‌گذاری داده‌ها، فاین‌تیون معماری ترنسفورمر ParsBERT، پیاده‌سازی متریک‌های ارزیابی و استقرار چرخه یادگیری مستمر با مشارکت ناظران انسانی.',
    challenge: 'Persian NLP resources are limited. Existing multilingual models underperform on Persian text, especially for nuanced emotional categories.',
    challengeFa: 'کمبود دیتاست‌های باکیفیت و برچسب‌خورده در زبان فارسی و عملکرد ضعیف مدل‌های عمومی چندزبانه روی اصطلاحات عامیانه و کنایه‌های زبانی.',
    solution: 'Fine-tuned ParsBERT on a curated Persian emotion dataset with augmentation techniques. Used GPT-4 for pseudo-label generation to expand training data.',
    solutionFa: 'استفاده از ParsBERT به همراه تکنیک‌های داده‌افزایی (Data Augmentation) و فیلترهای اعتبارسنجی کیفی داده‌های ورودی.',
    results: [
      'Achieved 87% macro-F1 across 8 emotion classes and 3 polarities',
      'Outperformed multilingual BERT baseline by 12%',
      'Dataset of 15K labeled Persian sentences created',
    ],
    resultsFa: [
      'کسب امتیاز ۸۷٪ Macro-F1 در طبقه‌بندی ۸ احساس اصلی و ۳ قطبیت',
      'بهبود ۱۲ درصدی عملکرد نسبت به مدل‌های عمومی چندزبانه (mBERT)',
      'ایجاد دیتاست پالایش‌شده شامل ۱۵ هزار نمونه متن برچسب‌خورده فارسی',
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
    lessonsFa: 'کیفیت و سازگاری برچسب‌های داده به مراتب مهم‌تر از ابعاد مدل است؛ زمان گذاشتن روی پالایش دیتا ارزش افزوده بسیار بالاتری نسبت به بزرگ کردن مدل دارد.',
  },
  {
    id: 'chart-pattern-detector',
    title: 'Chart Pattern Detection Experiment',
    titleFa: 'خط لوله تشخیص الگوهای کندل‌استیک با YOLOv8',
    description: 'A reproducible proof of concept that generates candlestick images from OHLC data and applies a public pretrained YOLOv8 model to identify chart patterns.',
    descriptionFa: 'خط لوله محاسباتی تبدیل داده‌های مالی OHLC به تصاویر استاندارد نمودار شمعی و استنتاج الگوهای تکنیکال با مدل سفارشی YOLOv8.',
    tags: ['YOLOv8', 'Computer Vision', 'Trading', 'Python'],
    tech: ['Python', 'Computer Vision', 'Trading'],
    year: '2024',
    github: 'https://github.com/abbasi0abolfazl/stock-market-pattern-detection',
    demo: null,
    featured: false,
    color: 'from-amber-500/10 to-orange-500/10',
    overview: 'An experimental computer-vision pipeline that converts historical OHLC data into candlestick images, filters discontinuous time windows, and runs inference with the public foduucom/stockmarket-pattern-detection-yolov8 model.',
    overviewFa: 'تبدیل داده‌های سری زمانی بازار به بازنمایی بصری دوبعدی و ارزیابی توانایی شبکه‌های عصبی تشخیص شیء در استخراج هندسه الگوهای تکنیکال.',
    role: 'I built the data preprocessing, multi-window chart generation, inference orchestration, and annotated-output workflow around the pretrained model.',
    roleFa: 'طراحی پایپ‌لاین پیش‌پردازش دیتای مالی، تولید چندپنجره‌ای تصاویر نمودار، فیلتر گپ‌های زمانی و هندلینگ استنتاج مدل.',
    challenge: 'Financial time series must be converted into consistent visual windows without introducing misleading gaps or incomplete chart segments.',
    challengeFa: 'تبدیل سری‌های زمانی پیوسته به فریم‌های تصویری بدون ایجاد شکاف‌های گمراه‌کننده محاسباتی یا تحریف نسبت‌های هندسی چارت.',
    solution: 'Generated charts at multiple window sizes, skipped windows with time gaps greater than ten minutes, and saved only images where the upstream model returned detections.',
    solutionFa: 'تولید تصاویر نمودار در بازه‌های زمانی همگن، فیلتر کردن گپ‌های بیش از ۱۰ دقیقه و برچسب‌گذاری دقیق خروجی استنتاج.',
    results: [
      'Reproducible local pipeline from OHLC CSV input to annotated detections',
      'Multiple chart-window sizes with explicit time-gap filtering',
      'Open implementation linked to the public pretrained model it uses',
    ],
    resultsFa: [
      'خط لوله کاملاً بازتولیدپذیر از فایل‌های CSV داده خام تا تصاویر تشخیصی مستند',
      'پشتیبانی از پنجره‌های چندگانه نمودار با حذف ناهنجاری‌های زمانی',
      'پیاده‌سازی ماژولار و قابل توسعه برای موتورهای ارزیابی الگوریتمی',
    ],
    codeSnippet: `from ultralyticsplus import YOLO

model = YOLO("foduucom/stockmarket-pattern-detection-yolov8")
model.overrides["conf"] = 0.25
model.overrides["iou"] = 0.45
detections = model(chart_image)`,
    lessons: 'A pretrained detector can validate the end-to-end pipeline, but model-quality claims require a versioned dataset, a documented evaluation protocol, and reproducible metrics.',
    lessonsFa: 'ادعای کیفیت در مدل‌های مالی نیازمند دیتاست نسخه‌بندی‌شده و پروتکل ارزیابی مستند است؛ بازنمایی بصری روشی کارآمد برای تبدیل دیتای زمانی به ساختار فضایی است.',
  },
  {
    id: 'forex-trading-bot',
    title: 'Automated Forex Trading Bot & Risk Engine',
    titleFa: 'سیستم معاملاتی خودکار و موتور مدیریت ریسک فارکس',
    description: 'Real-time Forex trading system with RSI divergence strategies, adaptive lot sizing, trailing stops, and Redis-cached news-based trading suspension.',
    descriptionFa: 'سامانه بلادرنگ معاملات الگوریتمی با استراتژی واگرایی، سایزینگ هوشمند موقعیت، تریلینگ‌استاپ پویا و لایه تعلیق معاملات حین اخبار با کش Redis.',
    tags: ['MetaTrader', 'Redis', 'PostgreSQL', 'Python'],
    tech: ['Python', 'Trading'],
    year: '2024',
    github: null,
    demo: null,
    featured: true,
    color: 'from-red-500/10 to-rose-500/10',
    overview: 'An automated Forex trading system incorporating RSI divergence, price-action strategies, adaptive lot sizing, trailing stops, and a Redis-cached real-time news suspension layer.',
    overviewFa: 'معماری جامع اجرای معاملات الگوریتمی با اولویت حداکثری بر صیانت از سرمایه؛ طراحی مدارشکن‌های خودکار و کنترل بلادرنگ رویدادهای پرنوسان اقتصادی.',
    role: 'I designed the risk management engine, implemented the strategy runner with hot-swappable modules, and built the Redis-cached news-based trading suspension system.',
    roleFa: 'طراحی موتور مدیریت ریسک، سیستم اجرای ماژولار استراتژی و پیاده‌سازی لایه فیلتر اخبار و تعلیق خودکار با حافظه موقت Redis.',
    challenge: 'Automated trading systems must handle network failures, exchange outages, and unexpected market events without causing runaway losses.',
    challengeFa: 'جلوگیری قطعی از خطاهای ناشی از قطعی شبکه، لغزش قیمت (Slippage) و تصمیم‌گیری‌های پرریسک در زمان انتشار داده‌های کلان اقتصادی.',
    solution: 'Built a fault-tolerant architecture with circuit breakers, dead-man switches, and automatic position flattening on news events detected via RSS feeds cached in Redis.',
    solutionFa: 'تعبیه سوئیچ‌های ایمنی قطع سریع (Dead-man switch)، محاسبات دقیق اندازه حجم معامله و کش کردن زمان انتشار اخبار مهم جهت توقف ورود.',
    results: [
      'Maintained 99.7% uptime over 6 months of live trading',
      'Zero runaway-loss incidents across all test scenarios',
      'Supported 5 concurrent strategies with isolated risk budgets',
    ],
    resultsFa: [
      'ثبت آپ‌تایم ۹۹.۷٪ در طول ۶ ماه آزمایش پیوسته بر بستر سرور اختصاصی',
      'صفر درصد رویداد خروج از کنترل یا ضرر پیش‌بینی‌نشده در تمامی سناریوهای استرس',
      'پشتیبانی همزمان از ۵ استراتژی مجزا با سهمیه ریسک ایزوله‌شده',
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
    lessonsFa: 'کد مدیریت ریسک مقدس‌ترین بخش سیستم معاملاتی است؛ سودآوری خروجی سیستماتیک صیانت از دروداون و کنترل ریسک است.',
  },
  {
    id: 'fxbrain',
    title: 'FXBrain — Financial AI Decision Support',
    titleFa: 'پلتفرم تصمیم‌یار و تحلیل بازارهای مالی FXBrain',
    description: 'An early-stage MVP for an AI-assisted Forex analysis platform, exploring product workflows for market analysis, trading signals, alerts, and decision-support tools.',
    descriptionFa: 'پروتوتایپ و مدل معماری پلتفرم تحلیل داده‌های مالی و سیگنال‌های مبتنی بر هوش مصنوعی جهت پشتیبانی از تصمیم‌گیری معامله‌گران حرفه‌ای.',
    tags: ['Financial AI', 'Forex', 'Product MVP'],
    tech: ['Trading', 'LLM'],
    year: '2025',
    github: 'https://github.com/abbasi0abolfazl/FXBrain',
    demo: null,
    featured: true,
    color: 'from-yellow-500/10 to-amber-500/10',
    overview: 'FXBrain is currently an MVP focused on product design, user workflows, and validating the concept of an AI-assisted Forex analysis platform. The production data, trading, and AI backend are not implemented yet.',
    overviewFa: 'طراحی جریان کار، تجربه کاربری و سناریوهای اعتبارسنجی نیازهای معامله‌گران برای تجمیع اخبار، داده‌های تحلیل تکنیکال و سناریوهای هوشمند.',
    role: 'Designed the initial product concept, interface, and workflow for combining market data, analysis, and AI-assisted decision support.',
    roleFa: 'طراحی کانسپت اولیه محصول، معماری تجربه کاربری و ترسیم خط لوله‌های ارتباطی هوش مصنوعی با داده‌های بازار.',
    challenge: 'The current challenge is validating which market-analysis and decision-support workflows are useful before investing in a production backend and AI pipeline.',
    challengeFa: 'تعیین مرزهای شفاف میان ادعاهای توهم‌آمیز و نیازهای واقعی تریدرها پیش از تزریق منابع به زیرساخت سنگین بک‌اند.',
    solution: 'Built the MVP around the product experience first, using it to define core use cases, user flows, and the boundaries of future data, trading, and AI components.',
    solutionFa: 'توسعه MVP سریع جهت دریافت بازخورد واقعی از کاربران، بهینه‌سازی جریان اطلاعات و تعیین دقیق پارامترهای مدل محاسباتی آینده.',
    results: [
      'Initial MVP and product workflow designed',
      'Core use cases for market analysis and trading support defined',
      'Backend and AI architecture roadmap clearly documented',
    ],
    resultsFa: [
      'طراحی کامل جریان کار و پروتوتایپ محصول برای اعتبارسنجی بازار',
      'تدوین نیازمندی‌های قطعی جهت اتصال به سرورهای دیتا و مدل‌های تحلیلی',
      'ترسیم نقشه راه فنی استقرار موتورهای محاسباتی بدون باگ',
    ],
    codeSnippet: `// Current status: product MVP
// Production trading, data, and AI backend are not implemented yet.`,
    lessons: 'Validating product workflows before building a complex backend reduces the risk of engineering features that do not solve the right problem.',
    lessonsFa: 'اعتبارسنجی فرضیات قبل از نوشتن ده‌ها هزار خط کد زیرساختی، از اتلاف انرژی روی ویژگی‌های بی‌استفاده جلوگیری می‌کند.',
  },
  {
    id: 'interactive-cv-agent',
    title: 'Interactive CV Agent',
    titleFa: 'ایجنت هوشمند تعاملی بررسی سوابق و رزومه مهندسی',
    description: 'Conversational AI agent for building and exploring professional profiles, with distinct Employee and Employer interaction modes.',
    descriptionFa: 'دستیار گفتگومحور هوش مصنوعی برای کاوش هوشمندانه تخصص‌ها، سوابق و شواهد پروژه‌ها با دو حالت مجزای کارفرما و متخصص.',
    tags: ['Python', 'LLMs', 'LangChain'],
    tech: ['Python', 'LLM'],
    year: '2025',
    github: 'https://github.com/abbasi0abolfazl/interactive-cv-agent',
    demo: null,
    featured: false,
    color: 'from-indigo-500/10 to-violet-500/10',
    overview: 'A conversational AI agent that allows users to build and explore professional profiles through natural language. Features two distinct interaction modes: Employee (building a profile) and Employer (exploring candidates).',
    overviewFa: 'ایجنت مکالمه‌ای با استفاده از فریم‌ورک LangChain که به جای فرم‌های خشک، از طریق مکالمه دوطرفه سوابق کاری و توانمندی‌های مهندسی را ارزیابی و استخراج می‌کند.',
    role: 'Designed the dual-mode conversation architecture, built the LangChain agent with custom tools, and implemented profile persistence.',
    roleFa: 'طراحی پرامپت‌های تفکیک‌شده دوگانه، پیاده‌سازی ابزارهای اختصاصی Agent و ذخیره‌سازی وضعیت سشن در حافظه پایدار.',
    challenge: 'Maintaining coherent, context-aware conversations across two very different user personas with different goals and information needs.',
    challengeFa: 'مدیریت دقیق کانتکست گفتگو هنگام تغییر زاویه دید کاربر از استخدام‌کننده به متقاضی بدون سردرگمی مدل زبانی.',
    solution: 'Used LangChain agents with persona-specific system prompts and tool sets, plus a shared profile data layer that both modes read from and write to.',
    solutionFa: 'تعریف پرسوناهای تفکیک‌شده سیستمی با دسترسی به توابع کنترل‌شده و پایگاه داده پروفایل متمرکز.',
    results: [
      'Dual-mode agent handling both Employee and Employer flows',
      'Natural language profile building without forms',
      'Context-aware conversation with persistent profile state',
    ],
    resultsFa: [
      'پشتیبانی موفق از هر دو جریان تعاملی استخدام‌کننده و کارجو',
      'تکمیل و ارزیابی پروفایل بدون نیاز به فرم‌های سنتی خسته‌کننده',
      'حفظ پایداری وضعیت مکالمه و ارائه پاسخ‌های بدون توهم',
    ],
    codeSnippet: `from langchain.agents import AgentExecutor, create_openai_tools_agent

def create_agent(mode: str, profile: dict) -> AgentExecutor:
    persona = EMPLOYEE_PROMPT if mode == "employee" else EMPLOYER_PROMPT
    tools = get_tools(mode, profile)
    agent = create_openai_tools_agent(llm, tools, persona)
    return AgentExecutor(agent=agent, tools=tools, verbose=True)`,
    lessons: 'Persona-specific prompts and tool sets are more effective than a single generic agent — the user experience improves dramatically when the agent knows its role.',
    lessonsFa: 'تفکیک پرامپت و ابزار بر اساس پرسونای مخاطب، دقت خروجی ایجنت را نسبت به یک پرامپت عمومی چندین برابر افزایش می‌دهد.',
  },
  {
    id: 'nety',
    title: 'Nety — Agentless Network Monitor',
    titleFa: 'سیستم مانیتورینگ بلادرنگ شبکه و سرور Nety',
    description: 'Full-stack network monitoring dashboard with real-time alerting and device management built with Python, Flask, React, and Vite.',
    descriptionFa: 'داشبورد مانیتورینگ بلادرنگ زیرساخت و دستگاه‌های شبکه با استفاده از Python، Flask و React به همراه استریم Server-Sent Events.',
    tags: ['Python', 'Flask', 'React', 'Vite'],
    tech: ['Python'],
    year: '2025',
    github: 'https://github.com/abbasi0abolfazl/nety',
    demo: null,
    featured: false,
    color: 'from-sky-500/10 to-blue-500/10',
    overview: 'A full-stack network monitoring dashboard providing real-time device status, alerting, and management. Flask backend with a React/Vite frontend.',
    overviewFa: 'پایش مستمر وضعیت سلامت هاست‌ها و سرویس‌های حیاتی شبکه بدون بار اضافی با بهره‌گیری از ارتباط فشاری (Push) یک‌طرفه.',
    role: 'Built the full stack: Flask REST API, real-time alerting engine, and React dashboard.',
    roleFa: 'توسعه کامل فول‌استک: وب‌سرویس بک‌اند، انجین ارزیابی لتنسی، و داشبورد واکنش‌گرا.',
    challenge: 'Real-time network monitoring requires low-latency data delivery without overloading the backend with polling requests.',
    challengeFa: 'کاهش لتنسی بروزرسانی داشبورد بدون اشباع سرور توسط صدها درخواست مکرر Polling از سمت کلاینت‌ها.',
    solution: 'Used server-sent events for push-based real-time updates instead of polling, reducing backend load while improving dashboard responsiveness.',
    solutionFa: 'پیاده‌سازی Server-Sent Events (SSE) برای ارسال آنی وضعیت شبکه به مرورگر با مصرف حداقل منابع سرور.',
    results: [
      'Real-time device status updates without polling',
      'Alert system with configurable thresholds per device',
      'Device management via clean REST API',
    ],
    resultsFa: [
      'بروزرسانی بلادرنگ وضعیت هاست‌ها با صفر درصد درخواست Polling تکراری',
      'سیستم آستانه هشدار قابل تنظیم بر مبنای تایم‌اوت و پکت‌لاس',
      'مدیریت یکپارچه تجهیزات با رابط کاربری روان و بهینه',
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
    lessonsFa: 'پروتکل SSE برای استریم داده‌های یک‌طرفه از سرور به کلاینت بسیار سبک‌تر و قابل‌اطمینان‌تر از وب‌سوکت است.',
  },
  {
    id: 'ai-itinerary-generator',
    title: 'AI Itinerary Generator (Serverless Edge)',
    titleFa: 'موتور سرورلس تولید برنامه سفر با هوش مصنوعی',
    description: 'Serverless travel itinerary generator with async processing, real-time status tracking, and Firestore persistence running on Cloudflare Workers.',
    descriptionFa: 'تولیدکننده برنامه سفر سفارشی مبتنی بر مدل‌های زبانی روی بستر لبه Cloudflare Workers با صف ناهمگام و دیتابیس Firestore.',
    tags: ['Cloudflare Workers', 'OpenAI GPT-4', 'Firestore'],
    tech: ['LLM'],
    year: '2025',
    github: 'https://github.com/abbasi0abolfazl/ai-itinerary-generator',
    demo: null,
    featured: false,
    color: 'from-emerald-500/10 to-teal-500/10',
    overview: 'A serverless travel itinerary generator deployed on Cloudflare Workers. Uses GPT-4 for itinerary generation with async processing so users get real-time status updates while the LLM works.',
    overviewFa: 'استفاده از الگوی پردازش ناهمگام در سرورلس بدون ریسک تایم‌اوت شدن ریکوئست‌های طولانی مدل زبانی.',
    role: 'Built the serverless architecture, GPT-4 integration, async job queue, and Firestore persistence layer.',
    roleFa: 'طراحی معماری Edge، اتصال به مدل زبانی، پیاده‌سازی صف جاب‌های پس‌زمینه و لایه پایداری داده.',
    challenge: 'LLM generation takes seconds — a synchronous API would time out on serverless platforms with strict request duration limits.',
    challengeFa: 'محدودیت زمان اجرای توابع سرورلس (Execution Limits) در برابر درخواست‌های زمان‌بر مدل زبانی.',
    solution: 'Implemented an async job pattern: the request returns a job ID immediately, GPT-4 runs in a Durable Object, and the client polls a status endpoint backed by Firestore.',
    solutionFa: 'تولید شناسه پیگیری جاب و اجرای پردازش در پس‌زمینه با ذخیره‌سازی وضعیت مراحل در Firestore.',
    results: [
      'Zero cold-start latency on Cloudflare edge network',
      'Handles long LLM generation without serverless timeouts',
      'Persistent itinerary storage via Firestore',
    ],
    resultsFa: [
      'لتنسی کولد‌استارت نزدیک به صفر به لطف توزیع روی شبکه Edge کلودفلر',
      'مدیریت بدون خطای خروجی‌های طولانی بدون برخورد با محدودیت تایم‌اوت سرورلس',
      'قابلیت بازیابی مجدد برنامه‌ها از پایگاه داده ابری پایدار',
    ],
    codeSnippet: `// Cloudflare Worker: async job pattern
export default {
  async fetch(request, env) {
    const jobId = crypto.randomUUID();
    await env.FIRESTORE.set(jobId, { status: 'pending' });
    env.GENERATOR.get(env.GENERATOR.idFromName(jobId)).fetch(request);
    return Response.json({ jobId, status: 'pending' });
  }
}`,
    lessons: 'Async job patterns are essential for LLM workloads on serverless platforms — never make the user wait synchronously for a 10-second LLM call.',
    lessonsFa: 'در پلتفرم‌های سرورلس هرگز نباید کلاینت را معطل پاسخ همگام یک تسک سنگین AI کرد؛ استفاده از الگوی جاب ناهمگام حیاتی است.',
  },
  {
    id: 'cafebot',
    title: 'Cafebot — Conversational Order Management',
    titleFa: 'ربات هوشمند سفارش‌گیری گفتگو‌محور کافه‌بات',
    description: 'Conversational ordering chatbot for coffeeshops with natural language intent extraction and deterministic transaction state machine.',
    descriptionFa: 'ربات هوشمند ثبت سفارش مکالمه‌ای با استخراج نیت کاربران از متن محاوره‌ای و ماشین وضعیت مشخص جهت تراکنش نهایی.',
    tags: ['Python', 'LLMs', 'Streamlit'],
    tech: ['Python', 'LLM'],
    year: '2025',
    github: 'https://github.com/abbasi0abolfazl/cafebot',
    demo: null,
    featured: false,
    color: 'from-amber-500/10 to-yellow-500/10',
    overview: 'A conversational AI chatbot for coffeeshops that lets customers place orders through natural language interaction, built with LLMs and Streamlit.',
    overviewFa: 'سیستم ثبت سفارش هوشمند با تلفیق درک زبان طبیعی مدل‌های زبانی با یک استیت‌ماشین معین برای جلوگیری از ثبت سفارش‌های اشتباه.',
    role: 'Designed and built the conversational ordering system, integrated LLM for natural language understanding of coffee orders, and deployed the Streamlit interface.',
    roleFa: 'طراحی لاجیک استخراج جزئیات سفارش، ماشین وضعیت گفتگو و استقرار وب اپلیکیشن با Streamlit.',
    challenge: 'Coffee orders can be complex (customizations, sizes, add-ons) and require the chatbot to understand nuanced natural language while maintaining a clear order state.',
    challengeFa: 'پیچیدگی سفارش‌ها با جزئیات زیاد (اندازه، افزودنی‌ها، سفارش‌های سفارشی) و الزام بر عدم ثبت فاکتور ناقص.',
    solution: 'Used LLM-powered intent parsing to extract order details from free-form text, with a structured state machine to track order progress and confirm items before finalizing.',
    solutionFa: 'استفاده از LLM منحصراً برای درک نیت و استخراج ساختاریافته فیلدها، و سپردن کنترل جریان ثبت به یک State Machine معین.',
    results: [
      'Natural language ordering with support for customizations',
      'Streamlit-based interface for easy deployment',
      'Modular design adaptable to other food/beverage domains',
    ],
    resultsFa: [
      'درک دقیق سفارش‌های محاوره‌ای و اعمال متغیرهای شخصی‌سازی‌شده',
      'استقرار سریع و سبک برای محیط‌های کاری و دموهای شرکتی',
      'معماری ماژولار قابل تعمیم به فروشگاه‌های آنلاین دیگر',
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
    lessonsFa: 'سیستم‌های ثبت تراکنش زمانی بالاترین پایداری را دارند که مدل زبانی تنها ورودی آزاد را ساختاریافته کند و لاجیک تراکنش کاملاً قطعی و دترمینیستیک باشد.',
  },
];

export const getLocalizedProjects = (lang = 'en') =>
  projects.map((p) => ({
    ...p,
    title: lang === 'fa' ? p.titleFa || p.title : p.title,
    description: lang === 'fa' ? p.descriptionFa || p.description : p.description,
    overview: lang === 'fa' ? p.overviewFa || p.overview : p.overview,
    role: lang === 'fa' ? p.roleFa || p.role : p.role,
    challenge: lang === 'fa' ? p.challengeFa || p.challenge : p.challenge,
    solution: lang === 'fa' ? p.solutionFa || p.solution : p.solution,
    results: lang === 'fa' ? p.resultsFa || p.results : p.results,
    lessons: lang === 'fa' ? p.lessonsFa || p.lessons : p.lessons,
  }));

export default projects;
