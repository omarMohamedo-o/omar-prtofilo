/**
 * Advanced Portfolio Knowledge Base & RAG Engine for MORA AI
 * ==========================================================
 * Inspired by HistoryVerse-Chatbot Multi-Agent Architecture:
 * - Arabic text normalization & Egyptian colloquial expansion
 * - Domain scope guardrails & refusal handling
 * - Multi-turn conversational memory & entity resolution
 * - Grounded verified citations & performance metrics
 * - Persona: MORA (Omar Gad's Autonomous Technical Representative)
 */

// =============================================================================
// ARABIC NLP & COLLOQUIAL NORMALIZATION UTILITIES
// (Adapted from HistoryVerse-Chatbot utils/arabic.py & colloquial.py)
// =============================================================================

const TASHKEEL_REGEX = /[\u0617-\u061A\u064B-\u0652\u0670]/g;
const TATWEEL_REGEX = /\u0640/g;
const ALEF_REGEX = /[إأآا]/g;
const TEH_MARBUTA_REGEX = /ة/g;
const ALEF_MAQSURA_REGEX = /ى/g;

/**
 * Normalizes Arabic text for high-recall semantic search
 */
export function normalizeArabicText(text = '') {
    if (!text) return '';
    return text
        .replace(TASHKEEL_REGEX, '')
        .replace(TATWEEL_REGEX, '')
        .replace(ALEF_REGEX, 'ا')
        .replace(TEH_MARBUTA_REGEX, 'ه')
        .replace(ALEF_MAQSURA_REGEX, 'ي')
        .toLowerCase()
        .trim();
}

/**
 * Egyptian Colloquial expansion rules mapping everyday spoken phrases
 * to structured portfolio inquiry concepts.
 */
const EGYPTIAN_COLLOQUIAL_MAPPINGS = [
    { pattern: /(?:^|\s)(شغال فين|بيشتغل فين|شغله فين|وظيفته|وظيفه عمر)(?:\s|$)/i, concepts: 'playerhub clinisoft وظائف خبرة' },
    { pattern: /(?:^|\s)(عمل ايه|مشاريعه|ايه مشاريعه|المشاريع|بروجكتات)(?:\s|$)/i, concepts: 'historyverse sdxl lora مشاريع' },
    { pattern: /(?:^|\s)(مشروع تخرجه|تخرج|تقديره|مجموعه|درجاته)(?:\s|$)/i, concepts: 'historyverse امتياز cgpa تعليم' },
    { pattern: /(?:^|\s)(رقم تليفونه|تليفون|واتساب|واتس|نمره|نمرته)(?:\s|$)/i, concepts: 'تواصل هاتف whatsapp contact' },
    { pattern: /(?:^|\s)(ايميل|بريد|ايميله|اكلمه ازاي|اتواصل معاه)(?:\s|$)/i, concepts: 'contact email تواصل' },
    { pattern: /(?:^|\s)(ديف اوبس|كوبيرنيتيس|تيرافورم|دوكر|سحابه)(?:\s|$)/i, concepts: 'devops kubernetes terraform docker' },
    { pattern: /(?:^|\s)(ذكاء اصطناعي|ماشين ليرنينج|لارج لانجوتش|راج)(?:\s|$)/i, concepts: 'ai ml llm rag' },
    { pattern: /(?:^|\s)(شهاداته|معاه شهادات ايه|امتحانات|شهاده)(?:\s|$)/i, concepts: 'rhcsa huawei aspire certifications شهادات' }
];

export function expandColloquialQuery(query = '') {
    if (!query) return '';
    let enriched = query;
    for (const mapping of EGYPTIAN_COLLOQUIAL_MAPPINGS) {
        if (mapping.pattern.test(query)) {
            enriched += ` ${mapping.concepts}`;
        }
    }
    return enriched;
}

// =============================================================================
// DOMAIN SCOPE GUARDRAILS (From HistoryVerse-Chatbot refusal.py)
// =============================================================================

const OUT_OF_DOMAIN_PATTERNS = [
    /(?:^|\s)(football|soccer|champions league|كورة|ماتش|اهداف|دوري|كرة قدم)(?:\s|$)/i,
    /(?:^|\s)(recipe|cooking|طبخة|وصفة طعام|شوربة|بيتزا|اكل)(?:\s|$)/i,
    /(?:^|\s)(weather|forecast|طقس|درجات الحرارة|مطر)(?:\s|$)/i,
    /(?:^|\s)(crypto|bitcoin|trading|سعر الدولار|اسعار الذهب|بورصة)(?:\s|$)/i,
    /(?:^|\s)(diagnosis|prescription|علاج الصداع|دواء|مرض)(?:\s|$)/i,
];

export function checkOutOfDomain(query = '') {
    const isArabic = /[\u0600-\u06FF]/.test(query);
    for (const pattern of OUT_OF_DOMAIN_PATTERNS) {
        if (pattern.test(query)) {
            if (isArabic) {
                return `أنا **MORA**، المساعد التقني الخاص بالمهندس **عمر جاد**.
أنا متخصص فقط في كل ما يتعلق بمسيرة عمر الهندسية، مشاريعه المتقدمة في الذكاء الاصطناعي (مثل **HistoryVerse** و**SDXL LoRA**)، خبراته في **PlayerHub.GG** و**CliniSoft**، مهاراته في السحابة وMLOps، وطرق التواصل والتوظيف.
يسعدني جداً أن تسألني عن أي من هذه المجالات! 🚀`;
            }
            return `I'm **MORA**, the technical assistant dedicated to **Omar Gad**'s engineering portfolio.
My focus is strictly on Omar's professional work, including his live systems at **PlayerHub.GG** and **CliniSoft**, his **HistoryVerse** (A+) AI/AR platform, his MLOps/LLM stack, and collaboration inquiries.
Feel free to ask me anything about his projects, skills, or experience! 🚀`;
        }
    }
    return null;
}

// =============================================================================
// COMPREHENSIVE PORTFOLIO KNOWLEDGE BASE
// =============================================================================

export const PORTFOLIO_KNOWLEDGE = {
    profile: {
        name: "Omar Gad",
        fullName: "Omar Mohamed Abdelsalam",
        title: "Computer Engineer | AI & Machine Learning | LLMs & RAG | MLOps & Cloud",
        location: "Alexandria, Egypt",
        email: "omarmo.abdelsalam@gmail.com",
        phone: "+20 101 1297 869",
        whatsapp: "https://wa.me/201011297869",
        linkedin: "https://linkedin.com/in/omar-mohamedo-o",
        github: "https://github.com/omarMohamedo-o",
        summary: "Computer Engineering graduate and M.Sc. candidate (CGPA 4.0 / 4.0 at Arab Academy for Science, Technology and Maritime Transport) with experience building LLM, RAG, NLP, and speech systems and running them in production. Completed AI and DevOps internships, taught Python and ML to 50+ students, and earned RHCSA. Research interests: applied ML, generative AI, and multilingual conversational systems."
    },

    education: [
        {
            institution: "Arab Academy for Science, Technology and Maritime Transport (AASTMT)",
            degree: "Master of Science in Computer Engineering",
            location: "Alexandria, Egypt",
            period: "Feb 2026 – Present",
            cgpa: "4.0 / 4.0",
            citations: ["[Degree: M.Sc.]", "[CGPA: 4.0/4.0]", "[Status: Active Research]"],
            details: "Research focus on applied machine learning, generative AI, multilingual conversational agents, and LLMs/RAG."
        },
        {
            institution: "Information Technology Institute (ITI)",
            degree: "Diploma in Software Engineering – Intensive Code Camp (ICC)",
            location: "Alexandria, Egypt",
            period: "Mar 2025 – Aug 2025",
            citations: ["[Institute: ITI]", "[Program: ICC Software Engineering]"],
            details: "Intensive 9-month program focused on Linux system administration, DevOps pipelines, container orchestration, and cloud architecture."
        },
        {
            institution: "Higher Institute of Engineering & Technology (BHI)",
            degree: "Bachelor of Engineering in Computer Engineering",
            location: "Alexandria, Egypt",
            period: "Sep 2019 – Jul 2024",
            cgpa: "3.2 / 4.0 (Very Good – B+)",
            citations: ["[Degree: B.Sc.]", "[Grade: Very Good – B+]", "[Graduation Project: HistoryVerse Grade A+]"],
            coursework: ["Neural Networks", "Pattern Recognition", "Algorithms", "Numerical Analysis", "Digital Systems Design"],
            graduationProject: "HistoryVerse – Multilingual AI/AR Museum Guide (Graduation Project, Grade: A+)"
        }
    ],

    experiences: [
        {
            company: "PlayerHub.GG",
            title: "MLOps & AI Infrastructure Engineer",
            location: "Dubai, UAE",
            type: "Full-time, Remote",
            period: "Sep 2026 – Present",
            citations: ["[Company: PlayerHub.GG]", "[Role: MLOps & AI Infrastructure]", "[Location: Dubai, Remote]"],
            highlights: [
                "Own deployment and operations for AI agent systems, scraping pipelines, and production and dev/test environments (Docker, Kubernetes, hybrid and multi-cloud).",
                "Built GitHub Actions CI/CD, centralized logging and monitoring (Prometheus, Grafana, Loki/Promtail), and automated release pipelines.",
                "Engineered a highly available setup with HAProxy read routing, DB replication (MariaDB primary + replica), self-healing workloads (autoheal, smartheal), and automated backups."
            ]
        },
        {
            company: "CliniSoft",
            title: "AI & ML Engineer",
            location: "Alexandria, Egypt",
            type: "Full-time, Onsite",
            period: "Apr 2026 – Aug 2026",
            citations: ["[Company: CliniSoft]", "[Domain: Healthcare AI & LLMs]"],
            highlights: [
                "Developed production healthcare AI using LLMs, NLP, and speech AI to automate clinical documentation and medical transcriptions.",
                "Served high-throughput microservices through FastAPI with Pydantic schemas and input sanitization.",
                "Deployed and maintained AI services following MLOps, containerization (Docker), and cloud infrastructure practices."
            ]
        },
        {
            company: "EYouth",
            title: "Programming Instructor",
            location: "Cairo, Egypt",
            type: "Part-time, Remote",
            period: "Apr 2026 – Sep 2026",
            citations: ["[Company: EYouth]", "[Teaching: Python & AI]"],
            highlights: [
                "Designed and delivered project-based Python, AI, and robotics courses.",
                "Mentored students through real-world software and machine learning projects."
            ]
        },
        {
            company: "Palestine Polytechnic University",
            title: "Remote Technical Mentor (Volunteer)",
            location: "Palestine",
            type: "Volunteer, Remote",
            period: "2025 – 2026",
            citations: ["[Honor: Acknowledged in Academic Thesis]", "[Domain: AI Retinal OCT Diagnosis]"],
            highlights: [
                "Advised a student team building an AI-powered retinal OCT disease diagnosis deep learning system.",
                "Acknowledged in the graduation thesis for remote guidance, model evaluation, and technical expertise."
            ]
        },
        {
            company: "ChloroMaster",
            title: "Software & DevOps Engineer",
            location: "Egypt",
            type: "Full-time, Remote",
            period: "Jun 2025 – Apr 2026",
            citations: ["[Company: ChloroMaster]", "[Stack: AWS, K8s, Terraform, Vault]"],
            highlights: [
                "Designed and built the enterprise company platform end-to-end: backend microservices, databases, REST APIs, and AWS infrastructure with Kubernetes and Terraform.",
                "Integrated AI features and shipped continuous deployments via Docker, GitHub Actions CI/CD with Vault and Trivy security scanning.",
                "Implemented 24/7 monitoring and alerting with Prometheus and Grafana."
            ]
        },
        {
            company: "Black Horse Courses",
            title: "Python & AI Instructor",
            location: "Alexandria, Egypt",
            type: "Part-time, Onsite",
            period: "Jan 2025 – Dec 2025",
            citations: ["[Students: 50+]", "[Satisfaction: 95%]"],
            highlights: [
                "Trained 50+ students in Python, machine learning algorithms, and cloud model deployment.",
                "Achieved a 95% satisfaction rating through hands-on labs, OOP principles, and real-world projects."
            ]
        }
    ],

    internships: [
        {
            company: "Digital Egypt Pioneers Initiative (DEPI)",
            title: "DevOps Engineer Intern",
            location: "Alexandria, Egypt",
            period: "Apr 2024 – Oct 2024",
            citations: ["[Projects: 5 Delivered]", "[Speed: +40%]", "[Uptime: 99.5%]"],
            highlights: [
                "Delivered 5 DevOps projects with Terraform, Ansible, and CI/CD pipelines, improving deployment speed by 40%.",
                "Deployed cloud infrastructure and Kubernetes clusters with 99.5% uptime on AWS (EC2, S3, VPC).",
                "Strengthened infrastructure security and container scanning using Vault and Trivy."
            ]
        },
        {
            company: "Telecom Egypt",
            title: "Artificial Intelligence Engineer Intern",
            location: "Alexandria, Egypt",
            period: "Sep 2023 – Dec 2023",
            citations: ["[Company: Telecom Egypt]", "[Stack: Hugging Face, PyTorch]"],
            highlights: [
                "Built NLP pipelines for enterprise chatbots using Hugging Face and spaCy.",
                "Developed image-classification models using TensorFlow and PyTorch.",
                "Integrated ML models into high-performance backend REST APIs."
            ]
        },
        {
            company: "Information Technology Institute (ITI)",
            title: "System Administration Intern",
            location: "Alexandria, Egypt",
            period: "Apr 2025 – Aug 2025",
            citations: ["[Automation: -60% Manual Effort]"],
            highlights: [
                "Administered Linux & Windows servers, enhancing system stability and security.",
                "Automated routine tasks with Bash, Python, and Ansible, reducing manual intervention by 60%."
            ]
        }
    ],

    projects: [
        {
            name: "HistoryVerse – Multilingual AI/AR Museum Guide",
            grade: "Graduation Project, Grade: A+",
            citations: ["[Grade: A+]", "[Accuracy: 90–96%]", "[Tests: 204 Passing]", "[Deploy: AWS Fargate & Terraform]"],
            description: "Multilingual AI & AR platform for interactive historical artifact exploration.",
            metrics: [
                "AI Recognition: 90–96% artifact recognition accuracy using YOLOv5 and Vision Transformer models.",
                "Multi-agent LLM Platform: 25+ REST endpoints, RAG over ChromaDB, and model-agnostic LLM routing (Gemini, OpenAI, Llama, Ollama).",
                "Voice & AR: real-time multilingual voice (Whisper, Google TTS) and 3D reconstructions with ARCore and Jetpack Compose.",
                "Reliability & Cloud: Pydantic-validated outputs, Langfuse tracing, Ragas evaluation, 204 passing tests; deployed on AWS Fargate with modular Terraform."
            ],
            tech: ["YOLOv5", "Transformers", "RAG", "ChromaDB", "LangChain", "Whisper", "ARCore", "AWS Fargate", "Terraform", "Langfuse", "Ragas"]
        },
        {
            name: "SDXL LoRA Fine-tuning Pipeline – Sultan Hassan Mosque, Cairo",
            citations: ["[Model: SDXL 1.0]", "[Method: LoRA rank 32 fp16]", "[Tracking: MLflow]"],
            description: "Fine-tuning Stable Diffusion XL using Low-Rank Adaptation (LoRA) for historical architectural imagery.",
            metrics: [
                "Curated domain-specific dataset with precision captioning.",
                "Trained Stable Diffusion XL LoRA using Hugging Face diffusers (rank 32, fp16).",
                "Tracked hyperparameter experiments and loss with MLflow inside reproducible Docker Compose."
            ],
            tech: ["SDXL", "LoRA", "Hugging Face Diffusers", "PyTorch", "MLflow", "Docker Compose"]
        },
        {
            name: "PlayerHub.GG Infrastructure Stack",
            citations: ["[Live: playerhub.gg]", "[Stack: Docker, K8s, HAProxy, MariaDB, Redis, Loki]"],
            description: "Live production gaming platform and AI infrastructure repository.",
            metrics: [
                "Containerized stack with Docker Compose and Kubernetes.",
                "Nginx edge, PHP-FPM, HAProxy read routing, MariaDB replication, separated Redis caching.",
                "Prometheus, Grafana, Loki/Promtail observability and self-healing workloads (autoheal, smartheal)."
            ],
            tech: ["Docker", "Kubernetes", "HAProxy", "MariaDB", "Redis", "Prometheus", "Grafana", "Loki"]
        },
        {
            name: "ChloroMaster Cloud Platform",
            citations: ["[Stack: AWS, K8s, Terraform, Vault, Trivy, Prometheus]"],
            description: "Full-scale enterprise agricultural and chemical management platform.",
            metrics: [
                "Containerized microservices orchestrated on AWS Kubernetes.",
                "Modular Terraform Infrastructure-as-Code.",
                "Automated GitHub Actions CI/CD with HashiCorp Vault secrets and Trivy vulnerability scanning."
            ],
            tech: ["AWS", "Kubernetes", "Terraform", "Docker", "Vault", "Trivy", "Prometheus", "Grafana"]
        },
        {
            name: "MORA – Portfolio AI Assistant with RAG",
            citations: ["[Architecture: RAG + Multimodal]", "[Providers: Gemini + Local RAG Fallback]"],
            description: "Intelligent conversational assistant embedded directly into Omar's portfolio.",
            metrics: [
                "RAG over Omar's entire portfolio, resume, publications, and projects.",
                "Text chat, voice recording transcription, speech synthesis, and multimodal image analysis.",
                "Zero-downtime multi-layer fallback architecture."
            ],
            tech: ["LangChain", "ChromaDB", "Gemini API", "FastAPI", "React", "Speech API"]
        }
    ],

    skills: {
        "LLMs & Generative AI": ["RAG", "Multi-agent systems", "MCP (Model Context Protocol)", "LangChain", "ChromaDB", "FAISS", "LoRA fine-tuning", "GPTQ quantization", "Gemini API", "Llama 3 / Ollama"],
        "ML & NLP": ["PyTorch", "TensorFlow", "scikit-learn", "Hugging Face Transformers", "Diffusers", "spaCy", "YOLOv5", "Faster-Whisper", "Google TTS"],
        "LLMOps & Testing": ["MLflow", "Langfuse tracing", "Ragas evaluation", "Pydantic validation", "pytest", "CI/CD for ML"],
        "MLOps & Cloud": ["FastAPI", "Docker", "Kubernetes", "GitHub Actions CI/CD", "Terraform", "Ansible", "Helm", "AWS (Fargate, S3, EC2)", "Azure", "GCP", "Prometheus", "Grafana", "HashiCorp Vault", "Trivy"],
        "Programming & Databases": ["Python", "C++", "Java", "Bash", "PostgreSQL", "MySQL", "Redis", "MongoDB", "Linux (RHEL, Ubuntu)", "Git"],
        "Soft Skills": ["Leadership", "Mentoring", "Teamwork", "Problem Solving", "Technical Communication"]
    },

    certifications: [
        {
            name: "Aspire Leaders Program",
            issuer: "Aspire Institute (Founded at Harvard University)",
            date: "Sep 2026",
            verified: true,
            citations: ["[Issuer: Harvard-founded Aspire Institute]", "[Date: Sep 2026]"]
        },
        {
            name: "Red Hat Certified System Administrator (RHCSA)",
            issuer: "Red Hat",
            date: "May 2025",
            verified: true,
            citations: ["[Cert ID: 250-068-707]", "[Date: May 2025]"]
        },
        {
            name: "HCCDA-Tech Essentials Huawei Cloud Developer",
            issuer: "Huawei",
            date: "Jul 2025",
            verified: true,
            citations: ["[Issuer: Huawei Cloud]", "[Date: Jul 2025]"]
        },
        {
            name: "Docker Essentials: A Developer Introduction",
            issuer: "IBM",
            date: "May 2025",
            verified: true,
            citations: ["[Issuer: IBM]", "[Date: May 2025]"]
        },
        {
            name: "AWS Academy Cloud Foundations",
            issuer: "Amazon Web Services (AWS)",
            date: "Apr 2025",
            verified: true,
            citations: ["[Issuer: AWS Academy]", "[Date: Apr 2025]"]
        },
        {
            name: "Jenkins Course Completion",
            issuer: "KodeKloud",
            date: "Sep 2024",
            verified: true,
            citations: ["[Issuer: KodeKloud]", "[Date: Sep 2024]"]
        }
    ]
};

// =============================================================================
// INTELLIGENT MULTI-TURN RAG MATCHER
// =============================================================================

export function queryLocalKnowledge(userQuery = '', conversationHistory = []) {
    if (!userQuery) return null;

    // Check domain boundary guardrail first
    const refusal = checkOutOfDomain(userQuery);
    if (refusal) return refusal;

    const rawLower = userQuery.toLowerCase().trim();
    const isArabic = /[\u0600-\u06FF]/.test(userQuery);

    // Natural Conversational Greetings (like ChatGPT)
    if (/^(hi|hello|hey|yo|howdy|sup|good\s*morning|good\s*evening|greetings|ازيك|مرحبا|سلام|اهلا|صباح الخير|مساء الخير|هاي|هلو)[\s!.]*$/i.test(rawLower)) {
        return isArabic
            ? "👋 أهلاً بك! أنا **MORA**، المساعد الذكي الخاص بالمهندس **عمر جاد**.\n\nكيف يمكنني مساعدتك اليوم؟ يسعدني أن تسألني عن خبرات عمر في **PlayerHub.GG** و**CliniSoft**، أو مشروعه المميز **HistoryVerse (+A)**، مهاراته في MLOps و Cloud، أو كيفية التواصل معه وتوظيفه! 🚀"
            : "👋 Hey there! I'm **MORA**, Omar Gad's personal AI Assistant.\n\nHow can I help you today? Ask me anything about Omar's work at **PlayerHub.GG** & **CliniSoft**, his **HistoryVerse (A+)** AI/AR platform, his **MLOps & LLM skills**, or how to get in touch!";
    }

    // Friendly Check-ins
    if (/(how\s*are\s*you|how\s*is\s*it\s*going|how\s*do\s*you\s*do|عامل ايه|اخبارك|ازيك ايه الاخبار|كيف حالك)/i.test(rawLower)) {
        return isArabic
            ? "أنا ممتاز وبأفضل حال، شكراً لسؤالك! جاهز لمساعدتك بكامل طاقتي 🚀 حابب تعرف إيه عن مسيرة عمر الهندسية أو مشاريعه في الذكاء الاصطناعي؟"
            : "I'm doing great and running at full speed! 🚀 Ready to answer any questions about Omar's engineering projects, production architecture, or background. What would you like to explore?";
    }

    // Who are you / Identity
    if (/(who\s*are\s*you|what\s*is\s*your\s*name|tell\s*me\s*about\s*yourself|انت مين|اسمك ايه|عرف نفسك|مين انت)/i.test(rawLower)) {
        return isArabic
            ? "أنا **MORA**، الممثل التقني الذكي والمساعد الرسمي للمهندس **عمر جاد**.\nأنا مصمم للإجابة عن كل ما يتعلق بخبرات عمر، مشاريعه (مثل **HistoryVerse** و**SDXL LoRA**)، وبنيته التحتية في **PlayerHub.GG**. يمكنك سؤالي عن أي مهارة أو أداة!"
            : "I'm **MORA**, the official autonomous AI representative and technical assistant for **Omar Gad** (Omar Mohamed Abdelsalam).\nI'm grounded in his verified portfolio, production systems, and resume. Feel free to quiz me on his skills, past companies, or graduation project!";
    }

    // What can you do
    if (/(what\s*can\s*you\s*do|help\s*me|capabilities|تقدر تعمل ايه|بتعمل ايه|مساعده)/i.test(rawLower)) {
        return isArabic
            ? "أستطيع مساعدتك في عدة أمور:\n• الإجابة عن مشاريع عمر وخبراته في **PlayerHub.GG** و**CliniSoft**.\n• شرح تفاصيل مشروع تخرجه **HistoryVerse (+A)** وتدريب **SDXL LoRA**.\n• استعراض مهاراته في **MLOps** و **Docker** و **Kubernetes** و **LLMs**.\n• إرشادك في جولة داخل البورتفوليو أو تزويدك ببيانات التواصل والتوظيف!"
            : "Here's what I can do for you:\n• Answer detailed technical questions about Omar's work at **PlayerHub.GG** and **CliniSoft**.\n• Explain his flagship projects like **HistoryVerse (A+)** and **SDXL LoRA fine-tuning**.\n• Break down his **MLOps, Cloud, and LLM stack** (Docker, Kubernetes, Terraform, Vault).\n• Provide direct contact info, resume downloads, or guide you through the portfolio!";
    }

    // Expand colloquial phrases & normalize Arabic
    const expandedQuery = isArabic ? expandColloquialQuery(userQuery) : userQuery;
    const norm = normalizeArabicText(expandedQuery);
    const q = `${rawLower} ${norm}`;

    // Contextual pronoun resolution from conversation history
    let contextTopic = '';
    if (conversationHistory && conversationHistory.length > 0) {
        const lastExchanges = conversationHistory.slice(-4).map(m => m.text || m.content || '').join(' ').toLowerCase();
        if (lastExchanges.includes('playerhub') || lastExchanges.includes('بلايرهب')) contextTopic = 'playerhub';
        else if (lastExchanges.includes('clinisoft') || lastExchanges.includes('كلينيسوفت')) contextTopic = 'clinisoft';
        else if (lastExchanges.includes('historyverse') || lastExchanges.includes('تخرج')) contextTopic = 'historyverse';
        else if (lastExchanges.includes('chloromaster') || lastExchanges.includes('كلورو')) contextTopic = 'chloromaster';
    }

    // Follow-up pronoun questions (e.g. "where is that?", "what tech did he use there?", "what was his grade?")
    const isFollowUp = (q.includes('there') || q.includes('he do there') || q.includes('used there') || q.includes('هناك') || q.includes('فيها') || q.includes('تكنولوجي ايه'));
    if (isFollowUp && contextTopic) {
        if (contextTopic === 'playerhub') {
            return isArabic
                ? `في **PlayerHub.GG**، استخدم عمر التقنيات التالية:\n• **الحاويات والأوركسترا:** Docker Compose و Kubernetes.\n• **الشبكات والتوجيه:** Nginx Edge و HAProxy للقراءة الذكية.\n• **قواعد البيانات:** MariaDB بتكرار Primary + Replica و Redis منفصل.\n• **المراقبة والملاحظة:** Prometheus و Grafana و Loki/Promtail.\n• **التعافي الذاتي:** daemons مثل autoheal و smartheal، وهندسة الفوضى بـ toxiproxy.`
                : `At **PlayerHub.GG**, Omar engineered the stack using:\n• **Orchestration:** Docker Compose & Kubernetes.\n• **Routing:** Nginx Edge & HAProxy read routing.\n• **Databases:** MariaDB primary-replica replication & separate Redis caching clusters.\n• **Observability:** Prometheus, Grafana, Loki/Promtail.\n• **Self-healing:** Autoheal, smartheal daemons, and toxiproxy chaos testing.`;
        }
        if (contextTopic === 'clinisoft') {
            return isArabic
                ? `في **CliniSoft**، استخدم عمر:\n• نماذج اللغة الكبيرة (LLMs) و NLP لأتمتة التوثيق الطبي.\n• تقنيات Speech AI و Faster-Whisper للتفريغ الصوتي السريري.\n• إطار العمل **FastAPI** ومكتبة Pydantic مع ممارسات MLOps و Docker.`
                : `At **CliniSoft**, Omar built clinical documentation AI using:\n• Production LLMs & NLP for automated medical records.\n• Speech AI and Faster-Whisper for clinical transcription.\n• **FastAPI** microservices with strict Pydantic validation and Docker MLOps pipelines.`;
        }
    }

    // 1. PlayerHub.GG
    if (q.includes('playerhub') || q.includes('player hub') || q.includes('بلايرهب')) {
        if (isArabic) {
            return `**PlayerHub.GG [دبي، الإمارات · عن بُعد · سبتمبر 2026 – الآن]:**
يعمل عمر كـ **MLOps & AI Infrastructure Engineer**:
• **أنظمة الذكاء الاصطناعي:** يملك إدارة ونشر أنظمة وكلاء الذكاء الاصطناعي المستقلين (AI Agent Systems) وأنابيب السحب الآلي في بيئات الإنتاج والتطوير.
• **CI/CD والمراقبة:** بنى خطوط GitHub Actions CI/CD والمراقبة المركزية باستخدام **Prometheus**, **Grafana**, و **Loki/Promtail**.
• **التوافر العالي والتعافي الذاتي:** صمم بيئة عالية التوافر تشمل HAProxy للتوجيه الذكي، وتكرار MariaDB (Primary + Replica)، والتعافي الذاتي (autoheal/smartheal)، والنسخ الاحتياطي المؤتمت.`;
        }
        return `**PlayerHub.GG [Dubai, UAE · Full-time, Remote · Sep 2026 – Present]:**
Omar serves as **MLOps & AI Infrastructure Engineer**:
• **AI Agent Operations:** Owns deployment and production operations for autonomous AI agent systems and high-throughput scraping pipelines across Docker, Kubernetes, and hybrid clouds.
• **CI/CD & Observability:** Engineered centralized logging and metrics using Prometheus, Grafana, and Loki/Promtail alongside automated GitHub Actions CI/CD workflows.
• **High Availability:** Architected HAProxy read routing, MariaDB primary-replica replication, Redis clusters, and self-healing autoheal/smartheal daemons.`;
    }

    // 2. CliniSoft
    if (q.includes('clinisoft') || q.includes('clini soft') || q.includes('كلينيسوفت') || q.includes('طبيه') || q.includes('طبية') || q.includes('رعايه صحيه')) {
        if (isArabic) {
            return `**CliniSoft [الإسكندرية، مصر · دوام كامل · أبريل 2026 – أغسطس 2026]:**
عمل عمر كـ **AI & ML Engineer** في مجال الرعاية الصحية والذكاء الاصطناعي الطبي:
• طوّر حلول ذكاء اصطناعي إنتاجية باستخدام **LLMs**, **NLP**, و **Speech AI** لأتمتة التوثيق السريري والملاحظات الطبية.
• قام ببرمجة ونشر خدمات مصغرة عالية الإنتاجية عبر **FastAPI** مع مخططات Pydantic الصارمة.
• اعتمد أفضل ممارسات الحاويات (Docker) والسحابة وعمليات MLOps.`;
        }
        return `**CliniSoft [Alexandria, Egypt · Full-time, Onsite · Apr 2026 – Aug 2026]:**
Omar worked as an **AI & ML Engineer**:
• **Clinical Documentation AI:** Developed production healthcare AI utilizing LLMs, NLP, and speech AI to automate clinical documentation and medical transcriptions.
• **FastAPI Microservices:** Built high-throughput backend microservices with strict Pydantic validation schemas.
• **MLOps Deployment:** Shipped containerized models following MLOps, Docker, and cloud engineering standards.`;
    }

    // 3. HistoryVerse
    if (q.includes('historyverse') || q.includes('history verse') || q.includes('graduation') || q.includes('تخرج') || q.includes('متحف') || q.includes('هيستوري')) {
        if (isArabic) {
            return `**مشروع التخرج: HistoryVerse [الدرجة: +A · موثق]:**
منصة مرشد متاحف تفاعلية متعددة اللغات مدعومة بالذكاء الاصطناعي والواقع المعزز (AI/AR):
• **التعرف البصري على الآثار:** دقة 90–96% في التعرف على الآثار باستخدام YOLOv5 ونماذج Vision Transformers.
• **منصة وكلاء متعددين و RAG:** أكثر من 25 نقطة نهاية REST، ونظام RAG عبر ChromaDB، وتوجيه ذكي مستقل للنماذج (Gemini, OpenAI, Llama, Ollama).
• **الصوت والواقع المعزز:** معالجة صوت فورية متعددة اللغات (Faster-Whisper, Google TTS) ونماذج ثلاثية الأبعاد بـ ARCore وJetpack Compose.
• **الموثوقية والسحابة:** مخرجات محققة بـ Pydantic، وتتبع Langfuse، وتقييم Ragas، مع 204 اختبار مؤتمت ناجح، ونشر على **AWS Fargate** عبر Terraform نمطي.`;
        }
        return `**HistoryVerse — Multilingual AI/AR Museum Guide [Graduation Project, Grade: A+]:**
• **Computer Vision:** 90–96% artifact recognition accuracy using YOLOv5 and Vision Transformer models.
• **Multi-Agent RAG Platform:** 25+ REST endpoints, RAG over ChromaDB, and model-agnostic LLM routing (Gemini, OpenAI, Llama, Ollama).
• **Real-Time Voice & AR:** Multilingual voice conversation (Faster-Whisper, Google TTS) and interactive 3D reconstructions with ARCore and Jetpack Compose.
• **Enterprise Reliability:** Pydantic validation, Langfuse distributed tracing, Ragas evaluation, 204 passing automated tests, deployed to **AWS Fargate** with modular Terraform.`;
    }

    // 4. SDXL LoRA Fine-Tuning
    if (q.includes('sdxl') || q.includes('lora') || q.includes('diffusers') || q.includes('sultan hassan') || q.includes('مسجد') || q.includes('سلطان حسن')) {
        if (isArabic) {
            return `**مشروع تدريب وتخصيص SDXL LoRA – مسجد السلطان حسن بالقاهرة:**
• تنظيم وتنسيق مجموعة بيانات صور معمارية عالية الدقة مع تسميات توضيحية دقيقة.
• تدريب نموذج Stable Diffusion XL LoRA باستخدام مكتبة Hugging Face Diffusers (rank 32, fp16).
• تتبع دقيق لمنحنيات الخسارة وتجارب التعلم باستخدام **MLflow** داخل بيئة Docker Compose قابلة للتكرار بالكامل.`;
        }
        return `**SDXL LoRA Fine-Tuning Pipeline – Sultan Hassan Mosque, Cairo:**
• **Dataset Curation:** Curated high-resolution architectural dataset with precision captioning.
• **LoRA Training:** Fine-tuned Stable Diffusion XL using Hugging Face Diffusers (rank 32, fp16 precision).
• **MLflow Tracking:** Tracked hyperparameter optimization and loss convergence with MLflow in a fully reproducible Docker Compose pipeline.`;
    }

    // 5. ChloroMaster
    if (q.includes('chloromaster') || q.includes('كلورو')) {
        if (isArabic) {
            return `**ChloroMaster [مصر · عن بُعد · يونيو 2025 – أبريل 2026]:**
عمل عمر كـ **Software & DevOps Engineer**:
• صمم وبنى المنصة السحابية للشركة بالكامل: خدمات مصغرة، وقواعد بيانات، وواجهات APIs، وبنية AWS سحابية مع Kubernetes و Terraform.
• أدار عمليات الأمان والأسرار عبر HashiCorp Vault وفحص الحاويات بـ Trivy.
• بنى خطوط GitHub Actions CI/CD والمراقبة والتنبيه على مدار الساعة بـ Prometheus و Grafana.`;
        }
        return `**ChloroMaster [Software & DevOps Engineer · Jun 2025 – Apr 2026]:**
• Engineered the enterprise platform end-to-end: microservices, relational databases, REST APIs, and AWS infrastructure with Kubernetes and Terraform.
• Integrated production AI features and implemented automated GitHub Actions CI/CD with HashiCorp Vault secrets and Trivy security scanning.
• Configured 24/7 production observability and alerting via Prometheus and Grafana.`;
    }

    // 6. Experience overview / Career
    if (q.includes('experience') || q.includes('work') || q.includes('job') || q.includes('career') || q.includes('خبره') || q.includes('خبرات') || q.includes('وظائف') || q.includes('شغل')) {
        if (isArabic) {
            return `**المسيرة المهنية لعمر جاد:**
1. **PlayerHub.GG** (سبتمبر 2026 – الآن): MLOps & AI Infrastructure Engineer (دبي، الإمارات · عن بُعد).
2. **CliniSoft** (أبريل 2026 – أغسطس 2026): AI & ML Engineer للأنظمة الطبية والتوثيق السريري.
3. **EYouth** (أبريل 2026 – سبتمبر 2026): مدرب برمجة وذكاء اصطناعي وروبوتات.
4. **جامعة بوليتكنك فلسطين** (2025 – 2026): مرشد تقني متطوع لمشروع تشخيص أمراض العيون بالذكاء الاصطناعي (أُشيد به في رسالة التخرج).
5. **ChloroMaster** (يونيو 2025 – أبريل 2026): Software & DevOps Engineer (بنية AWS، Kubernetes، Terraform).
6. **Black Horse Courses** (يناير 2025 – ديسمبر 2025): مدرب بايثون وذكاء اصطناعي (درب 50+ طالباً بمعدل رضا 95%).`;
        }
        return `**Omar Gad's Professional Experience:**
1. **PlayerHub.GG** (Sep 2026 – Present) · *MLOps & AI Infrastructure Engineer* (Dubai, UAE · Remote)
2. **CliniSoft** (Apr 2026 – Aug 2026) · *AI & ML Engineer* (Alexandria · Healthcare AI, LLMs & Speech)
3. **EYouth** (Apr 2026 – Sep 2026) · *Programming Instructor* (Python, AI & Robotics)
4. **Palestine Polytechnic University** (2025 – 2026) · *Remote Technical Mentor (Volunteer)* (Retinal OCT AI diagnosis)
5. **ChloroMaster** (Jun 2025 – Apr 2026) · *Software & DevOps Engineer* (Full platform, AWS, Kubernetes, Terraform)
6. **Black Horse Courses** (Jan 2025 – Dec 2025) · *Python & AI Instructor* (Trained 50+ students, 95% satisfaction)`;
    }

    // 7. Education & Academic Honors
    if (q.includes('education') || q.includes('degree') || q.includes('master') || q.includes('gpa') || q.includes('university') || q.includes('academic') || q.includes('تعليم') || q.includes('ماجستير') || q.includes('جامعه') || q.includes('كليه') || q.includes('معدل')) {
        if (isArabic) {
            return `**المؤهلات الأكاديمية والدرجات:**
• **ماجستير هندسة الحاسب (M.Sc.):** الأكاديمية العربية للعلوم والتكنولوجيا والنقل البحري (AASTMT) – فبراير 2026 حتى الآن، بمعدل ممتاز **CGPA: 4.0 / 4.0**.
• **دبلومة هندسة البرمجيات (ICC):** معهد تكنولوجيا المعلومات (ITI) – مارس 2025 حتى أغسطس 2025.
• **بكالوريوس هندسة الحاسب:** المعهد العالي للهندسة والتكنولوجيا (BHI) – سبتمبر 2019 حتى يوليو 2024 (تقدير جيد جداً B+ بمعدل 3.2 / 4.0، ومشروع التخرج امتياز مرتفع +A).`;
        }
        return `**Omar Gad's Academic Credentials:**
• **Master of Science in Computer Engineering:** Arab Academy for Science, Technology and Maritime Transport (AASTMT) · Feb 2026 – Present · **CGPA: 4.0 / 4.0**
• **Diploma in Software Engineering (Intensive Code Camp):** Information Technology Institute (ITI) · Mar 2025 – Aug 2025
• **Bachelor of Engineering in Computer Engineering:** Higher Institute of Engineering & Technology (BHI) · Sep 2019 – Jul 2024 · **CGPA: 3.2 / 4.0 (Very Good – B+)** · Graduation Project Grade: **A+**`;
    }

    // 8. Technical Skills & Tools
    if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('tools') || q.includes('مهارات') || q.includes('تقنيات') || q.includes('ادوات')) {
        if (isArabic) {
            return `**الترسانة التقنية للمهندس عمر جاد:**
• **LLMs & Generative AI:** أنظمة RAG، الوكلاء متعددو المهام (Multi-Agent Systems)، بروتوكول MCP، LangChain، ChromaDB، FAISS، تخصيص LoRA، وتكميم GPTQ.
• **تعلم الآلة ومعالجة اللغات (ML & NLP):** PyTorch، TensorFlow، Scikit-learn، Hugging Face Transformers، spaCy، YOLOv5، Faster-Whisper.
• **عمليات النماذج والاختبار (LLMOps):** MLflow، Langfuse tracing، تقييم Ragas، تحققات Pydantic، واختبارات pytest.
• **MLOps & السحابة:** FastAPI، Docker، Kubernetes، GitHub Actions CI/CD، Terraform، Ansible، Helm، AWS (Fargate، S3، EC2)، Prometheus، Grafana، Vault، Trivy.
• **لغات البرمجة:** Python، C++، Java، Bash · قواعد البيانات: PostgreSQL، MySQL، Redis، MongoDB.`;
        }
        return `**Omar Gad's Core Technical Skills:**
• **LLMs & Generative AI:** RAG architectures, Multi-Agent Systems, MCP (Model Context Protocol), LangChain, ChromaDB, FAISS, LoRA Fine-Tuning, GPTQ Quantization, Gemini API, Llama 3 / Ollama.
• **ML & NLP:** PyTorch, TensorFlow, scikit-learn, Hugging Face Transformers, Diffusers, spaCy, YOLOv5, Faster-Whisper, Google TTS.
• **LLMOps & Evaluation:** MLflow, Langfuse tracing, Ragas evaluation, Pydantic validation, pytest.
• **MLOps & Cloud:** FastAPI, Docker, Kubernetes, GitHub Actions CI/CD, Terraform, Ansible, Helm, AWS (Fargate, S3, EC2), Azure, GCP, Prometheus, Grafana, HashiCorp Vault, Trivy.
• **Languages & Databases:** Python, C++, Java, Bash · PostgreSQL, MySQL, Redis, MongoDB · Linux (RHEL, Ubuntu), Git.`;
    }

    // 9. Certifications
    if (q.includes('certif') || q.includes('rhcsa') || q.includes('aspire') || q.includes('huawei') || q.includes('docker') || q.includes('شهادات') || q.includes('شهاده')) {
        if (isArabic) {
            return `**الشهادات والاعتمادات الموثقة:**
1. **برنامج قادة أسباير (Aspire Leaders Program):** معهد أسباير (تأسس في جامعة هارفارد) – سبتمبر 2026 [موثق].
2. **Red Hat Certified System Administrator (RHCSA):** شركة Red Hat العالمية – مايو 2025 [رقم التحقق: 250-068-707].
3. **HCCDA-Tech Essentials Huawei Cloud Developer:** شركة هواوي – يوليو 2025 [موثق].
4. **IBM Docker Essentials: A Developer Introduction:** شركة IBM – مايو 2025 [موثق].
5. **AWS Academy Cloud Foundations:** شركة Amazon Web Services – أبريل 2025 [موثق].
6. **Jenkins Course Completion:** منصة KodeKloud – سبتمبر 2024 [موثق].`;
        }
        return `**Omar Gad's Verified Certifications & Honors:**
1. **Aspire Leaders Program:** Aspire Institute (Founded at Harvard University) · Sep 2026 [Verified]
2. **Red Hat Certified System Administrator (RHCSA):** Red Hat · May 2025 [Verified - Cert ID: 250-068-707]
3. **HCCDA-Tech Essentials Huawei Cloud Developer:** Huawei · Jul 2025 [Verified]
4. **Docker Essentials: A Developer Introduction:** IBM · May 2025 [Verified]
5. **AWS Academy Cloud Foundations:** Amazon Web Services · Apr 2025 [Verified]
6. **Jenkins Course Completion:** KodeKloud · Sep 2024 [Verified]`;
    }

    // 10. Contact / Collaboration
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('whatsapp') || q.includes('hire') || q.includes('reach') || q.includes('تواصل') || q.includes('ايميل') || q.includes('واتساب') || q.includes('رقم') || q.includes('تليفون')) {
        if (isArabic) {
            return `**قنوات التواصل المباشر مع المهندس عمر جاد:**
• **البريد الإلكتروني:** [omarmo.abdelsalam@gmail.com](mailto:omarmo.abdelsalam@gmail.com)
• **الهاتف وواتساب:** [+20 101 1297 869](https://wa.me/201011297869)
• **لينكد إن:** [linkedin.com/in/omar-mohamedo-o](https://linkedin.com/in/omar-mohamedo-o)
• **جيت هاب:** [github.com/omarMohamedo-o](https://github.com/omarMohamedo-o)
• **الموقع:** الإسكندرية، مصر (متاح للعمل عن بُعد ولعقود التوظيف والمشاريع الاستشارية).`;
        }
        return `**Get in Touch with Omar Gad:**
• **Email:** [omarmo.abdelsalam@gmail.com](mailto:omarmo.abdelsalam@gmail.com)
• **Phone & WhatsApp:** [+20 101 1297 869](https://wa.me/201011297869)
• **LinkedIn:** [linkedin.com/in/omar-mohamedo-o](https://linkedin.com/in/omar-mohamedo-o)
• **GitHub:** [github.com/omarMohamedo-o](https://github.com/omarMohamedo-o)
• **Location:** Alexandria, Egypt (Open for full-time, remote, hybrid, and consultancy roles worldwide).`;
    }

    // 11. Greetings & Introduction
    if (q.includes('who') || q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('مين') || q.includes('من انت') || q.includes('اهلا') || q.includes('مرحبا') || q.includes('سلام')) {
        if (isArabic) {
            return `أهلاً بك! أنا **MORA**، المساعد الذكي المعتمد للمهندس **عمر جاد** (Omar Gad).
عمر مهندس حاسب آلي وباحث ماجستير (بمعدل 4.0 / 4.0 في الأكاديمية العربية) متخصص في:
• **الذكاء الاصطناعي التوليدي ونماذج اللغة (Generative AI & LLMs/RAG)**
• **هندسة البنية التحتية والعمليات (MLOps & Cloud DevOps)**

يعمل حالياً كـ **MLOps & AI Infrastructure Engineer** في شركة **PlayerHub.GG** بدبي، وعمل سابقاً في **CliniSoft** و**ChloroMaster**.
يمكنك سؤالي عن مشاريعه (مثل HistoryVerse وSDXL LoRA)، خبراته، شهاداته، أو كيفية التواصل معه!`;
        }
        return `Hello! I'm **MORA**, the personal AI assistant for **Omar Gad** (Omar Mohamed Abdelsalam).
Omar is a Computer Engineer and M.Sc. candidate (CGPA 4.0 / 4.0 at Arab Academy) specialized in:
• **Artificial Intelligence & Machine Learning**
• **LLMs, RAG, & Multi-Agent Systems**
• **MLOps & Cloud Infrastructure (Kubernetes, Terraform, AWS)**

He currently serves as **MLOps & AI Infrastructure Engineer at PlayerHub.GG** (Dubai, UAE), with past experience at **CliniSoft** and **ChloroMaster**.
Feel free to ask me anything about his projects, tech stack, production experience, or how to collaborate!`;
    }

    // Fallback general guidance
    if (isArabic) {
        return `أنا هنا لمساعدتك في كل ما يخص المهندس عمر جاد!
يمكنك سؤالي عن:
• **الخبرة المهنية:** عمله في PlayerHub.GG، CliniSoft، أو ChloroMaster.
• **المشاريع الهندسية:** مشروع التخرج HistoryVerse (امتياز +A على AWS Fargate) أو تدريب SDXL LoRA.
• **الترسانة التقنية:** في LLMs، RAG، Multi-Agent، Kubernetes، Terraform، أو PyTorch.
• **التعليم والشهادات:** ماجستير هندسة الحاسب بمعدل 4.0، وشهادة RHCSA، وبرنامج هارفارد أسباير.
• **التواصل:** عبر البريد أو واتساب مباشرة.`;
    }

    return `I can answer any question about Omar Gad's background, production projects, and engineering experience!
Here are some great topics to ask:
• **Professional Experience:** His MLOps work at PlayerHub.GG, healthcare AI at CliniSoft, or cloud engineering at ChloroMaster.
• **Featured Projects:** HistoryVerse (A+ Multilingual Museum AI/AR Guide with YOLOv5 & AWS Fargate) or SDXL LoRA Fine-Tuning.
• **Tech Stack:** LLMs, RAG, Multi-Agent systems, Kubernetes, Terraform, Docker, and PyTorch.
• **Academics & Certifications:** M.Sc. with 4.0 CGPA, Red Hat RHCSA, and Harvard-founded Aspire Leaders Program.
• **Collaboration:** How to contact Omar via email or WhatsApp.`;
}
