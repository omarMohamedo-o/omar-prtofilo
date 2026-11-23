/**
 * Advanced Portfolio Knowledge Base & RAG Engine for MORA AI
 * Inspired by HistoryVerse-Chatbot Multi-Agent Architecture:
 * - Arabic text normalization & Egyptian colloquial expansion
 * - Domain scope guardrails & refusal handling
 * - Multi-turn conversational memory & entity resolution
 * - Grounded verified citations & performance metrics
 * - Persona: MORA (Omar Mohamed's Autonomous Technical Representative)
 */

// ARABIC NLP & COLLOQUIAL NORMALIZATION UTILITIES
// (Adapted from HistoryVerse-Chatbot utils/arabic.py & colloquial.py)

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

// DOMAIN SCOPE GUARDRAILS (From HistoryVerse-Chatbot refusal.py)

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
                return "يبدو موضوعاً شيقاً، لكن تخصصي الأساسي هو مساعدة زوار موقع المهندس عمر محمد والإجابة عن مشاريعه في الذكاء الاصطناعي وهندسة MLOps والبنية السحابية. هل تود استكشاف أي من هذه المجالات؟";
            }
            return "That sounds interesting, but my focus is helping you learn about Omar Mohamed's engineering work, AI projects, and cloud/MLOps systems. Is there a specific project or skill of his you'd like to check out?";
        }
    }
    return null;
}

// COMPREHENSIVE PORTFOLIO KNOWLEDGE BASE

export const PORTFOLIO_KNOWLEDGE = {
    profile: {
        name: "Omar Mohamed",
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

// INTELLIGENT MULTI-TURN RAG MATCHER

export function queryLocalKnowledge(userQuery = '', conversationHistory = []) {
    if (!userQuery) return null;

    // Check domain boundary guardrail first
    const refusal = checkOutOfDomain(userQuery);
    if (refusal) return refusal;

    const rawLower = userQuery.toLowerCase().trim();
    const isArabic = /[\u0600-\u06FF]/.test(userQuery);

    // 1. Natural Conversational Greetings
    if (/^(hi|hello|hey|yo|howdy|sup|good\s*morning|good\s*evening|greetings|ازيك|مرحبا|سلام|اهلا|صباح الخير|مساء الخير|هاي|هلو)[\s!.]*$/i.test(rawLower)) {
        return isArabic
            ? "أهلاً بك! أنا **مورا (MORA)**، المساعد الذكي للمهندس عمر محمد. يسعدني جداً التحدث معك، كيف يمكنني مساعدتك اليوم؟"
            : "Hey there! I'm **MORA**, Omar Mohamed's AI assistant. Great to chat with you! How can I help you today?";
    }

    // 2. Real-Time Clock & Date
    if (/(time|date|clock|current\s*time|what\s*time|ساع[ةه]|الوقت|تاريخ|نهار[ده])/i.test(rawLower)) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Cairo' });
        const dateStr = now.toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Africa/Cairo' });
        return isArabic
            ? `الساعة الآن **${timeStr}** بتوقيت مصر (${dateStr}). هل هناك أي شيء تحب أن تسأل عنه؟`
            : `Right now it's **${timeStr}** (Egypt Time / UTC+2) on **${dateStr}**. How can I help you today?`;
    }

    // 3. Friendly Check-ins / "How are you"
    if (/(how\s*are\s*you|how\s*is\s*it\s*going|how\s*do\s*you\s*do|whats\s*up|عامل ايه|اخبارك|ازيك ايه الاخبار|كيف حالك)/i.test(rawLower)) {
        return isArabic
            ? "أنا ممتاز وبأفضل حال، شكراً لسؤالك! جاهز لمساعدتك في أي استفسار يخص عمل ومشاريع المهندس عمر. حابب تسأل عن إيه؟"
            : "I'm doing great, thank you for asking! Ready to help you with anything regarding Omar's engineering work, projects, or background. What would you like to explore?";
    }

    // 4. Who are you / Identity
    if (/(who\s*are\s*you|what\s*is\s*your\s*name|tell\s*me\s*about\s*yourself|انت مين|اسمك ايه|عرف نفسك|مين انت)/i.test(rawLower)) {
        return isArabic
            ? "أنا **مورا (MORA)**، المساعد التقني الذكي للمهندس **عمر محمد** (Omar Mohamed). أنا هنا للإجابة عن أسئلتك حول مشاريعه، تقنياته، وخبراته في الذكاء الاصطناعي وهندسة البنية التحتية، أو لمساعدتك في التواصل معه مباشرة!"
            : "I'm **MORA**, the AI representative and technical assistant for **Omar Mohamed**. Think of me as his digital co-pilot here to answer questions about his AI & MLOps engineering work, past projects, or help you connect with him directly!";
    }

    // 5. What can you do
    if (/(what\s*can\s*you\s*do|help\s*me|capabilities|تقدر تعمل ايه|بتعمل ايه|مساعده)/i.test(rawLower)) {
        return isArabic
            ? "أستطيع مساعدتك في:\n• الإجابة عن مشاريع عمر وخبراته العملية في **PlayerHub.GG** و **CliniSoft**.\n• شرح تفاصيل مشروع تخرجه **HistoryVerse (+A)** وتدريب **SDXL LoRA**.\n• استعراض مهاراته في MLOps، Docker، Kubernetes، و LLMs.\n• تزويدك ببيانات التواصل المباشر أو التوظيف."
            : "Here is what I can help you with:\n• Discuss Omar's production engineering work at **PlayerHub.GG** and **CliniSoft**.\n• Deep dive into flagship projects like **HistoryVerse (A+)** and **SDXL LoRA fine-tuning**.\n• Share details on his tech stack: Docker, Kubernetes, Terraform, PyTorch, and LLMs/RAG.\n• Provide direct contact and hiring details.";
    }

    // 6. Thanks
    if (/(thank\s*you|thanks|thx|شكرا|تسلم|جزاك الله خيرا|الف شكر)/i.test(rawLower)) {
        return isArabic
            ? "العفو، على الرحب والسعة دائماً! لو عندك أي سؤال تاني أنا في الخدمة 🚀"
            : "You're very welcome! Feel free to ask if there is anything else you'd like to know 🚀";
    }

    // 7. Goodbyes
    if (/(bye|goodbye|see\s*you|مع السلامة|باي|اشوفك بعدين)/i.test(rawLower)) {
        return isArabic
            ? "مع السلامة! سعدت بالحديث معك، وأتمنى لك يوماً رائعاً. يمكنك دائماً العودة أو مراسلة عمر مباشرة!"
            : "Goodbye! It was a pleasure chatting. Feel free to come back anytime or reach out to Omar directly!";
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

    // Follow-up pronoun questions (e.g. "where is that?", "what tech did he use there?")
    const isFollowUp = (q.includes('there') || q.includes('he do there') || q.includes('used there') || q.includes('هناك') || q.includes('فيها') || q.includes('تكنولوجي ايه'));
    if (isFollowUp && contextTopic) {
        if (contextTopic === 'playerhub') {
            return isArabic
                ? "في **PlayerHub.GG**، استخدم عمر التقنيات التالية: Docker و Kubernetes، و Nginx Edge و HAProxy للقراءة الذكية، و MariaDB replication و Redis، والمراقبة بـ Prometheus و Grafana و Loki، وآليات التعافي الذاتي (autoheal/smartheal)."
                : "At **PlayerHub.GG**, Omar engineered the stack using Docker Compose & Kubernetes, Nginx Edge & HAProxy read routing, MariaDB primary-replica replication, Redis caching, Prometheus/Grafana observability, and self-healing autoheal/smartheal daemons.";
        }
        if (contextTopic === 'clinisoft') {
            return isArabic
                ? "في **CliniSoft**، استخدم عمر نماذج اللغة الكبيرة (LLMs) و NLP لأتمتة التوثيق الطبي، وتقنيات Faster-Whisper للتفريغ الصوتي السريري، وخدمات مصغرة بـ FastAPI وممارسات MLOps."
                : "At **CliniSoft**, Omar built clinical documentation AI using production LLMs & NLP, Faster-Whisper speech models for clinical transcription, and FastAPI microservices with strict Pydantic validation.";
        }
    }

    // Specific entity questions - Answer ONLY what was asked:

    // Who is Omar / General Overview
    if (/who\s*is\s*omar|tell\s*me\s*about\s*omar|مين\s+(هو\s+)?عمر|من\s+(هو\s+)?عمر|نبذة\s*عن\s*عمر/i.test(rawLower)) {
        return isArabic
            ? "عمر محمد هو مهندس حاسب وباحث ماجستير (معدل 4.0) متخصص في **الذكاء الاصطناعي (LLMs & RAG)** وهندسة **MLOps والبنية السحابية**. يعمل حالياً كمهندس MLOps في شركة **PlayerHub.GG** (دبي، عن بُعد)، ولديه مشروعات متميزة مثل **HistoryVerse** (+A) و **SDXL LoRA**."
            : "Omar Mohamed is a Computer Engineer and M.Sc. candidate (CGPA 4.0) specializing in **AI/LLMs, RAG, and MLOps/Cloud Infrastructure**. He currently works as an MLOps & AI Infrastructure Engineer at **PlayerHub.GG** (Dubai, Remote) and has built production systems across healthcare, gaming, and cloud automation.";
    }

    // PlayerHub.GG / Current Role
    if (q.includes('playerhub') || q.includes('player hub') || q.includes('بلايرهب') || /شغال\s*فين|بيشتغل\s*فين|وظيفته|where\s*does\s*he\s*work|current\s*role/i.test(rawLower)) {
        return isArabic
            ? "في **PlayerHub.GG** (دبي، عن بُعد · سبتمبر 2026 – الآن)، يعمل عمر كـ **MLOps & AI Infrastructure Engineer**، حيث يتولى تشغيل أنظمة وكلاء الذكاء الاصطناعي (AI agents) وخطوط سحب البيانات، وتصميم بنية تحتية عالية التوافر بـ HAProxy و MariaDB replication و Docker/K8s، مع المراقبة المتكاملة بـ Prometheus و Grafana."
            : "At **PlayerHub.GG** (Dubai, Remote · Sep 2026 – Present), Omar works as an **MLOps & AI Infrastructure Engineer**. He owns production deployments for autonomous AI agent systems, scraping pipelines, HAProxy routing, MariaDB replication, self-healing daemons, and Prometheus/Grafana observability.";
    }

    // CliniSoft
    if (q.includes('clinisoft') || q.includes('clini soft') || q.includes('كلينيسوفت') || q.includes('طبيه') || q.includes('طبية') || q.includes('رعايه صحيه')) {
        return isArabic
            ? "في **CliniSoft** (أبريل 2026 – أغسطس 2026)، عمل عمر كـ **AI & ML Engineer** في مجال الرعاية الصحية، حيث بنى حلول ذكاء اصطناعي إنتاجية باستخدام LLMs و NLP و Faster-Whisper لأتمتة التوثيق والملاحظات السريرية عبر واجهات برمجة سريعة بـ FastAPI."
            : "At **CliniSoft** (Alexandria · Apr 2026 – Aug 2026), Omar served as an **AI & ML Engineer**, building production healthcare AI with LLMs, NLP, and Faster-Whisper speech models to automate clinical documentation via high-throughput FastAPI microservices.";
    }

    // HistoryVerse / Graduation Project
    if (q.includes('historyverse') || q.includes('history verse') || q.includes('graduation') || q.includes('تخرج') || q.includes('متحف') || q.includes('هيستوري')) {
        return isArabic
            ? "مشروع تخرج عمر هو **HistoryVerse** (بتقدير امتياز مرتفع **+A**): وهو مرشد متاحف تفاعلي بالذكاء الاصطناعي والواقع المعزز (AI/AR). يتميز بدقة 90–96% في التعرف على الآثار بـ YOLOv5 و Vision Transformers، وأكثر من 25 نقطة نهاية REST مع ChromaDB RAG، ونشر كامل على AWS Fargate مع 204 اختبارات مؤتمتة ناجحة."
            : "Omar's graduation project is **HistoryVerse** (graded **A+**): a multilingual AI/AR museum guide platform featuring 90–96% artifact recognition accuracy with YOLOv5 & Vision Transformers, 25+ REST endpoints with ChromaDB RAG, and automated deployment on AWS Fargate with 204 passing automated tests.";
    }

    // SDXL LoRA Fine-Tuning
    if (q.includes('sdxl') || q.includes('lora') || q.includes('diffusers') || q.includes('sultan hassan') || q.includes('مسجد') || q.includes('سلطان حسن')) {
        return isArabic
            ? "قام عمر بتنفيذ خط تدريب وتخصيص نموذج **Stable Diffusion XL (SDXL) LoRA** على العمارة التاريخية لمسجد السلطان حسن بالقاهرة، باستخدام Hugging Face Diffusers (rank 32, fp16)، وتتبع التجارب بالكامل بـ **MLflow** داخل بيئة Docker قابلة للتكرار."
            : "Omar built an **SDXL LoRA fine-tuning pipeline** for Sultan Hassan Mosque's architectural heritage in Cairo, fine-tuning Stable Diffusion XL using Hugging Face Diffusers (rank 32, fp16 precision) and tracking experiments with **MLflow** in Docker.";
    }

    // ChloroMaster
    if (q.includes('chloromaster') || q.includes('كلورو')) {
        return isArabic
            ? "في **ChloroMaster** (يونيو 2025 – أبريل 2026)، عمل عمر كـ **Software & DevOps Engineer**، حيث صمم وبنى المنصة السحابية للشركة على AWS باستخدام Kubernetes و Terraform و GitHub Actions CI/CD وإدارة الأسرار بـ HashiCorp Vault."
            : "At **ChloroMaster** (Jun 2025 – Apr 2026), Omar served as a **Software & DevOps Engineer**, architecting the enterprise cloud platform on AWS with Kubernetes, Terraform, HashiCorp Vault secrets, and GitHub Actions CI/CD.";
    }

    // Docker & Kubernetes
    if (q.includes('docker') || q.includes('kubernetes') || q.includes('k8s') || q.includes('دوكر') || q.includes('كوبيرنيتيس')) {
        return isArabic
            ? "يمتلك عمر خبرة عميقة في **Docker و Kubernetes**: يدير حاويات وكلاء AI وأنابيب السحب بـ K8s في PlayerHub.GG، وبنى بنية AWS السحابية بـ K8s في ChloroMaster، وهو حاصل على شهادة **IBM Docker Essentials** وشهادة **RHCSA** في إدارة نظم لينكس."
            : "Omar has hands-on production expertise in **Docker & Kubernetes**: managing containerized AI agents and scraping pipelines at PlayerHub.GG, architecting AWS Kubernetes infrastructure at ChloroMaster, and holds the **IBM Docker Essentials** and **RHCSA** credentials.";
    }

    // Academic Education & GPA
    if (q.includes('education') || q.includes('degree') || q.includes('master') || q.includes('gpa') || q.includes('university') || q.includes('academic') || q.includes('تعليم') || q.includes('ماجستير') || q.includes('جامعه') || q.includes('كليه') || q.includes('معدل')) {
        return isArabic
            ? "المؤهلات الأكاديمية لعمر:\n• **ماجستير هندسة الحاسب:** الأكاديمية العربية (AASTMT) بمعدل ممتاز **4.0 / 4.0** (فبراير 2026 – الآن).\n• **دبلومة هندسة البرمجيات:** معهد تكنولوجيا المعلومات (ITI).\n• **بكالوريوس هندسة الحاسب:** المعهد العالي للهندسة (BHI) بتقدير جيد جداً مرتفع ومشروع التخرج امتياز +A."
            : "Omar's academic qualifications:\n• **M.Sc. in Computer Engineering:** Arab Academy (AASTMT) with a perfect **4.0 / 4.0 CGPA** (Feb 2026 – Present).\n• **Software Engineering Diploma:** Information Technology Institute (ITI).\n• **B.Eng. in Computer Engineering:** BHI (CGPA: 3.2 / 4.0, Very Good B+) with an A+ Graduation Project.";
    }

    // Certifications
    if (q.includes('certif') || q.includes('rhcsa') || q.includes('aspire') || q.includes('huawei') || q.includes('شهادات') || q.includes('شهاده')) {
        return isArabic
            ? "أبرز شهادات عمر المعتمدة:\n• **برنامج قادة أسباير:** معهد أسباير (تأسس في جامعة هارفارد، سبتمبر 2026).\n• **RHCSA:** مهندس نظم معتمد من ريد هات (#250-068-707).\n• **Huawei Cloud Developer (HCCDA):** مطور سحابي معتمد من هواوي.\n• **IBM Docker Essentials** و **AWS Academy Cloud Foundations**."
            : "Omar's verified certifications:\n• **Aspire Leaders Program:** Aspire Institute (Founded at Harvard University, Sep 2026).\n• **Red Hat Certified System Administrator (RHCSA #250-068-707)**.\n• **Huawei Cloud Developer (HCCDA)**.\n• **IBM Docker Essentials** and **AWS Academy Cloud Foundations**.";
    }

    // Contact & Hiring
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('whatsapp') || q.includes('hire') || q.includes('reach') || q.includes('تواصل') || q.includes('ايميل') || q.includes('واتساب') || q.includes('رقم') || q.includes('تليفون') || q.includes('توظيف') || q.includes('شغل')) {
        return isArabic
            ? "معلومات التواصل المباشر مع المهندس عمر:\n• **البريد الإلكتروني:** omarmo.abdelsalam@gmail.com\n• **الهاتف وواتساب:** +20 101 1297 869\n• **لينكد إن:** linkedin.com/in/omar-mohamedo-o\n• **جيت هاب:** github.com/omarMohamedo-o\nوهو متاح لفرص العمل بدوام كامل، التعاقدات الاستشارية، ومشاريع MLOps والذكاء الاصطناعي."
            : "You can reach Omar directly at:\n• **Email:** omarmo.abdelsalam@gmail.com\n• **Phone / WhatsApp:** +20 101 1297 869\n• **LinkedIn:** linkedin.com/in/omar-mohamedo-o\n• **GitHub:** github.com/omarMohamedo-o\nHe is open to full-time engineering roles, contract MLOps architecture, and AI consulting worldwide.";
    }

    // Location
    if (q.includes('where') || q.includes('location') || q.includes('based') || q.includes('alexandria') || q.includes('فين') || q.includes('مكان') || q.includes('عايش') || q.includes('مقيم')) {
        return isArabic
            ? "عمر مقيم في **الإسكندرية، مصر**، ويعمل عن بُعد مع فرق عمل عالمية (حالياً مع PlayerHub.GG في دبي)، وهو متاح للعمل عن بُعد ولفرص الانتقال الدولية."
            : "Omar is based in **Alexandria, Egypt**, working remotely with international teams (currently with PlayerHub.GG in Dubai), and is open to remote roles as well as global relocation.";
    }

    // Skills overview
    if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('tools') || q.includes('مهارات') || q.includes('تقنيات') || q.includes('ادوات')) {
        return isArabic
            ? "المهارات الأساسية لعمر:\n• **الذكاء الاصطناعي و LLMs:** أنظمة RAG، الوكلاء متعددو المهام، ChromaDB، LangChain، PyTorch، Faster-Whisper، وتخصيص LoRA.\n• **MLOps والسحابة:** Docker، Kubernetes، GitHub Actions، Terraform، AWS، Prometheus، و Grafana.\n• **البرمجة:** Python، C++، Java، Bash، وقواعد بيانات PostgreSQL و MariaDB و Redis."
            : "Omar's core technical stack:\n• **AI & LLMs:** RAG architectures, Multi-Agent systems, ChromaDB, LangChain, PyTorch, Faster-Whisper, and SDXL LoRA fine-tuning.\n• **MLOps & Cloud:** Docker, Kubernetes, GitHub Actions CI/CD, Terraform, AWS, Prometheus, and Grafana.\n• **Programming:** Python, C++, Java, Bash · PostgreSQL, MariaDB, and Redis.";
    }

    // Pricing, Rates & ROI
    if (q.includes('rate') || q.includes('price') || q.includes('cost') || q.includes('fee') || q.includes('roi') || q.includes('سعر') || q.includes('اسعار') || q.includes('تكلفه') || q.includes('تكلفة') || q.includes('عائد')) {
        return isArabic
            ? "أسعار الاستشارات الهندسية والعائد المالي (ROI):\n• **الاستشارات التقنية:** 85 إلى 150 دولاراً أمريكياً في الساعة.\n• **مشاريع MLOps/DevOps محددة النطاق:** من 5,000 إلى 25,000 دولار أمريكي.\n• **جلسة استكشافية:** مجانية لمدة 30 دقيقة (بقيمة 150 دولاراً).\n• **العائد المحقق:** توفير 65% إلى 93% من تكاليف واجهات الـ AI التوليدي (أكثر من 15,000 دولار سنوياً)، وتوفير 45,000+ دولار سنوياً للمراكز الطبية بأتمتة التوثيق السريري."
            : "Omar's consulting rates & verified ROI:\n• **Technical Consulting:** $85 to $150 USD per hour.\n• **Fixed-Scope MLOps/Cloud Deployments:** $5,000 to $25,000 USD per project.\n• **Discovery Consultation:** Complimentary 30-minute session (valued at $150 USD).\n• **Demonstrated ROI:** 65% to 93% reduction in recurring LLM API inference costs (saving $15,000+ USD/yr) and over $45,000 USD annual savings per clinical practice via documentation automation.";
    }

    // Why Hire & Value Proposition
    if (q.includes('why hire') || q.includes('why omar') || q.includes('value') || q.includes('ليه اوظف') || q.includes('ليه اختار')) {
        return isArabic
            ? "لماذا تختار توظيف عمر محمد؟\n• **جاهزية إنتاجية 99.9%:** خبرة حية في إدارة عناقيد Kubernetes و HAProxy ومزامنة MariaDB تحت أكثر من 10,000 مستخدم نشط.\n• **كفاءة وتوفير مالي:** خفض تكاليف الذكاء الاصطناعي بنسبة تصل إلى 93% بنماذج LoRA وتفريغ الصوت Faster-Whisper المكممة.\n• **اعتمادات دولية موثقة:** شهادة RHCSA من Red Hat (#250-068-707)، وباحث ماجستير بمعدل كامل 4.0 / 4.0 في AASTMT."
            : "Why hire Omar Mohamed?\n• **99.9% Production Reliability:** Proven experience engineering HAProxy read routing and MariaDB replication under 10,000+ DAU at PlayerHub.GG.\n• **Dramatic Cost Reduction:** Slashed AI inference costs by up to 93% using local quantized Faster-Whisper and LoRA fine-tuning.\n• **Verified Elite Credentials:** RHCSA Certified (#250-068-707) and M.Sc. in Computer Engineering with a perfect 4.0 / 4.0 CGPA.";
    }

    // RAG Architecture & Hallucination Mitigation
    if (q.includes('rag') || q.includes('hallucinat') || q.includes('vector') || q.includes('chroma') || q.includes('هلوسه') || q.includes('هلوسة') || q.includes('استرجاع')) {
        return isArabic
            ? "كيف يمنع عمر هلوسة نماذج اللغة في أنظمة RAG؟\n• **فهرسة واسترجاع هجين:** في ChromaDB و FAISS مع إعادة الترتيب بـ Cross-Encoder.\n• **توجيه بالوكلاء (Multi-Agent):** تقسيم المهام بين وكلاء مستقلين للمعلومات والترجمة.\n• **تدقيق صارم:** التحقق من المخرجات عبر هياكل Pydantic وقياس الدقة بإطار عمل Ragas وتتبع الأداء بـ Langfuse."
            : "How Omar prevents LLM hallucinations in production RAG:\n• **Hybrid Indexing & Retrieval:** ChromaDB and FAISS with Cross-Encoder re-ranking.\n• **Multi-Agent Orchestration:** Specialized domain agents for retrieval, translation, and verification.\n• **Strict Validation & Evals:** Pydantic schema validation, Ragas framework scoring, and distributed OpenTelemetry tracing with Langfuse.";
    }

    // Conversational Fallback - Friendly, human, answers naturally without dumping static bio!
    return isArabic
        ? "يسعدني مساعدتك! بصفتي المساعد الذكي لعمر، أستطيع الإجابة عن أي شيء يخص مشاريعه الهندسية (مثل HistoryVerse و SDXL LoRA)، خبراته في PlayerHub.GG و CliniSoft، مهاراته في MLOps و Docker و LLMs، أو كيفية التواصل معه وتوظيفه. تحب تسأل عن إيه بالتحديد؟"
        : "I'd be happy to help with that! As Omar's AI assistant, I can answer anything specific about his engineering work—such as his systems at PlayerHub.GG, his healthcare AI at CliniSoft, projects like HistoryVerse (A+), his MLOps/LLM stack, or how to get in touch. What specific area would you like to explore?";
}
