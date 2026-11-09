/**
 * Comprehensive Portfolio Knowledge Base for MORA AI Chatbot & RAG Engine
 * =========================================================================
 * Contains structured facts, project details, experience metrics,
 * and semantic answering templates for Omar Gad (Omar Mohamed Abdelsalam).
 */

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
        summary: "Computer Engineering graduate and M.Sc. candidate (CGPA 4.0 / 4.0 at Arab Academy) with hands-on experience building LLM, RAG, NLP, and speech systems and running them in production. Completed AI and DevOps internships, taught Python and ML to 50+ students, and earned RHCSA certification. Research interests include applied ML, generative AI, and multilingual conversational systems.",
        researchInterests: [
            "Applied Machine Learning",
            "Generative AI & LLMs",
            "Retrieval Augmented Generation (RAG)",
            "Multilingual Conversational Systems",
            "MLOps & Cloud Infrastructure"
        ]
    },

    education: [
        {
            institution: "Arab Academy for Science, Technology and Maritime Transport (AASTMT)",
            degree: "Master of Science in Computer Engineering",
            location: "Alexandria, Egypt",
            period: "Feb 2026 – Present",
            gpa: "CGPA: 4.0 / 4.0",
            details: "Research focus on applied machine learning, generative AI, and multilingual conversational systems."
        },
        {
            institution: "Information Technology Institute (ITI)",
            degree: "Diploma in Software Engineering – Intensive Code Camp (ICC)",
            location: "Alexandria, Egypt",
            period: "Mar 2025 – Aug 2025",
            details: "Intensive 9-month code camp covering Linux system administration, DevOps pipelines, container orchestration, and cloud architecture."
        },
        {
            institution: "Higher Institute of Engineering & Technology (BHI)",
            degree: "Bachelor of Engineering in Computer Engineering",
            location: "Alexandria, Egypt",
            period: "Sep 2019 – Jul 2024",
            gpa: "CGPA: 3.2 / 4.0 (Very Good – B+)",
            coursework: "Neural Networks, Pattern Recognition, Algorithms, Numerical Analysis, Digital Systems Design",
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
            highlights: [
                "Own deployment and operations for AI agent systems, scraping pipelines, and production and dev/test environments across Docker, Kubernetes, hybrid and multi-cloud.",
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
            highlights: [
                "Developed production healthcare AI using LLMs, NLP, and speech AI to automate clinical documentation and medical transcriptions.",
                "Served high-throughput microservices through FastAPI with Pydantic schemas and input sanitization.",
                "Deployed and maintained AI services following MLOps, containerization, and cloud practices."
            ]
        },
        {
            company: "EYouth",
            title: "Programming Instructor",
            location: "Cairo, Egypt",
            type: "Part-time, Remote",
            period: "Apr 2026 – Sep 2026",
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
            highlights: [
                "Advised a student team building an AI-powered retinal OCT disease diagnosis system.",
                "Acknowledged in the academic thesis for remote guidance and technical machine learning expertise."
            ]
        },
        {
            company: "ChloroMaster",
            title: "Software & DevOps Engineer",
            location: "Egypt",
            type: "Full-time, Remote",
            period: "Jun 2025 – Apr 2026",
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
            highlights: [
                "Trained 50+ students in Python, machine learning, and cloud model deployment.",
                "Achieved a 95% satisfaction rating through hands-on labs and mentoring."
            ]
        }
    ],

    internships: [
        {
            company: "Digital Egypt Pioneers Initiative (DEPI)",
            title: "DevOps Engineer Intern",
            location: "Alexandria, Egypt",
            period: "Apr 2024 – Oct 2024",
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
            highlights: [
                "Built NLP pipelines for enterprise chatbots using Hugging Face and spaCy.",
                "Developed image-classification models using TensorFlow and PyTorch.",
                "Integrated ML models into backend APIs."
            ]
        },
        {
            company: "Information Technology Institute (ITI)",
            title: "System Administration Intern",
            location: "Alexandria, Egypt",
            period: "Apr 2025 – Aug 2025",
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
            description: "Multilingual AI & AR platform for interactive historical artifact exploration.",
            metrics: [
                "AI Recognition: 90–96% artifact recognition accuracy using YOLOv5 and Transformer-based models.",
                "Multi-agent LLM Platform: 25+ REST endpoints, RAG over ChromaDB, and model-agnostic LLM routing (Gemini, OpenAI, Llama, Ollama).",
                "Voice & AR: real-time multilingual voice (Whisper, Google TTS) and 3D reconstructions with ARCore and Jetpack Compose.",
                "Reliability & Cloud: Pydantic-validated outputs, Langfuse tracing, Ragas evaluation, 204 passing tests; deployed on AWS Fargate with modular Terraform."
            ],
            tech: ["YOLOv5", "Transformers", "RAG", "ChromaDB", "LangChain", "Whisper", "ARCore", "AWS Fargate", "Terraform", "Langfuse", "Ragas"]
        },
        {
            name: "SDXL LoRA Fine-tuning Pipeline – Sultan Hassan Mosque, Cairo",
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
            description: "Intelligent conversational assistant embedded directly into Omar's portfolio.",
            metrics: [
                "RAG over Omar's entire portfolio, resume, publications, and projects.",
                "Text chat, voice recording transcription, speech synthesis, and multimodal image analysis.",
                "Hybrid fallback architecture ensuring 100% uptime without failure."
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
            issuer: "Aspire Institute (Founded at Harvard)",
            date: "Sep 2026",
            verified: true,
            link: "https://www.aspireleaders.org/"
        },
        {
            name: "Red Hat Certified System Administrator (RHCSA)",
            issuer: "Red Hat",
            date: "May 2025",
            verified: true,
            link: "https://rhtapps.redhat.com/verify?certId=250-068-707"
        },
        {
            name: "HCCDA-Tech Essentials Huawei Cloud Developer",
            issuer: "Huawei",
            date: "Jul 2025",
            verified: true,
            link: "https://drive.google.com/file/d/1PF71T7ycbmXjV-CchoOzmJCtfF_gBsLL/view"
        },
        {
            name: "Docker Essentials: A Developer Introduction",
            issuer: "IBM",
            date: "May 2025",
            verified: true
        },
        {
            name: "AWS Academy Cloud Foundations",
            issuer: "Amazon Web Services (AWS)",
            date: "Apr 2025",
            verified: true
        },
        {
            name: "Jenkins Course Completion",
            issuer: "KodeKloud",
            date: "Sep 2024",
            verified: true
        }
    ],

    languages: [
        { language: "Arabic", level: "Native" },
        { language: "English", level: "Fluent" }
    ]
};

/**
 * Intelligent Local RAG Matcher for instant accurate answers
 */
export function queryLocalKnowledge(userQuery) {
    if (!userQuery) return null;
    const q = userQuery.toLowerCase().trim();

    // Language detection: Arabic vs English
    const isArabic = /[\u0600-\u06FF]/.test(userQuery);

    // 1. PlayerHub
    if (q.includes('playerhub') || q.includes('player hub') || (isArabic && q.includes('بلايرهب'))) {
        if (isArabic) {
            return `**PlayerHub.GG (دبي، الإمارات - عن بُعد):**
عمر يعمل كـ **MLOps & AI Infrastructure Engineer** في PlayerHub.GG منذ سبتمبر 2026 حتى الآن:
• يدير تشغيل ونشر أنظمة وكلاء الذكاء الاصطناعي (AI Agent Systems) وأنابيب السحب (Scraping Pipelines) في بيئات الإنتاج والتطوير.
• بنى خطوط GitHub Actions CI/CD والمراقبة المركزية (Prometheus, Grafana, Loki/Promtail).
• صمم بيئة عالية التوافر (High Availability) مع HAProxy للتوجيه الذكي، وتكرار قواعد البيانات MariaDB (Primary + Replica)، والتعافي الذاتي (autoheal/smartheal)، والنسخ الاحتياطي التلقائي.`;
        }
        return `**PlayerHub.GG (Dubai, UAE · Full-time, Remote · Sep 2026 – Present):**
Omar works as an **MLOps & AI Infrastructure Engineer** at PlayerHub.GG:
• **Core Ownership:** Owns deployment and operations for autonomous AI agent systems, scraping pipelines, and production/dev/test environments across Docker, Kubernetes, hybrid, and multi-cloud.
• **CI/CD & Observability:** Engineered automated GitHub Actions CI/CD pipelines and centralized logging and metrics with Prometheus, Grafana, and Loki/Promtail.
• **High Availability:** Built an HA architecture with HAProxy read routing, MariaDB primary-replica replication, Redis clusters, self-healing workloads (autoheal, smartheal), and automated backups.`;
    }

    // 2. CliniSoft
    if (q.includes('clinisoft') || q.includes('clini soft') || (isArabic && q.includes('كلينيسوفت'))) {
        if (isArabic) {
            return `**CliniSoft (الإسكندرية، مصر - دوام كامل):**
عمر عمل كـ **AI & ML Engineer** في CliniSoft من أبريل 2026 حتى أغسطس 2026:
• طوّر أنظمة ذكاء اصطناعي للرعاية الصحية في بيئة الإنتاج باستخدام نماذج LLMs وNLP وSpeech AI لأتمتة التوثيق السريري والملاحظات الطبية.
• قام بخدمتها عبر خدمات مصغرة عالية السرعة باستخدام **FastAPI** ومخططات Pydantic.
• طبق أفضل ممارسات MLOps والحاويات (Docker) والبنية السحابية.`;
        }
        return `**CliniSoft (Alexandria, Egypt · Full-time, Onsite · Apr 2026 – Aug 2026):**
Omar worked as an **AI & ML Engineer** at CliniSoft:
• **Clinical Healthcare AI:** Developed production healthcare AI utilizing LLMs, NLP, and speech AI to automate clinical documentation and medical transcriptions.
• **Microservices Architecture:** Built and served high-throughput backend services using FastAPI and strict Pydantic schemas.
• **Deployment:** Deployed containerized AI services adhering to MLOps, Docker, and cloud infrastructure best practices.`;
    }

    // 3. HistoryVerse
    if (q.includes('historyverse') || q.includes('history verse') || q.includes('graduation') || q.includes('مشروع التخرج') || (isArabic && q.includes('هيستوري'))) {
        if (isArabic) {
            return `**مشروع التخرج: HistoryVerse (الدرجة: +A):**
منصة مرشد متاحف تفاعلية متعددة اللغات مدعومة بالذكاء الاصطناعي والواقع المعزز (AI/AR):
• **دقة التعرف على الآثار:** حقق 90–96% دقة باستخدام YOLOv5 ونماذج Vision Transformers.
• **منصة وكلاء متعددين وRAG:** أكثر من 25 نقطة نهاية REST، وRAG عبر ChromaDB، وتوجيه مستقل للنماذج (Gemini, OpenAI, Llama, Ollama).
• **الصوت والواقع المعزز:** صوت فوري متعدد اللغات (Whisper, Google TTS) ونماذج ثلاثية الأبعاد بـ ARCore وJetpack Compose.
• **السحابة والاعتمادية:** مخرجات محققة بـ Pydantic، وتتبع Langfuse، وتقييم Ragas، مع 204 اختبار مؤتمت ناجح، ونشر على **AWS Fargate** عبر Terraform نمطي.`;
        }
        return `**HistoryVerse — Multilingual AI/AR Museum Guide (Graduation Project, Grade: A+):**
• **AI Artifact Recognition:** Achieved 90–96% recognition accuracy using YOLOv5 and Vision Transformer models.
• **Multi-Agent LLM Platform:** 25+ REST endpoints, RAG over ChromaDB, and model-agnostic LLM routing (Gemini, OpenAI, Llama, Ollama).
• **Voice & AR:** Real-time multilingual voice processing (Whisper, Google TTS) and interactive 3D reconstructions with ARCore and Jetpack Compose.
• **Reliability & Cloud:** Pydantic-validated schemas, Langfuse tracing, Ragas evaluation, 204 passing automated tests, deployed to **AWS Fargate** with modular Terraform.`;
    }

    // 4. SDXL LoRA
    if (q.includes('sdxl') || q.includes('lora') || q.includes('diffusers') || q.includes('sultan hassan') || (isArabic && q.includes('مسجد'))) {
        if (isArabic) {
            return `**مشروع تدريب وتخصيص SDXL LoRA – مسجد السلطان حسن:**
• تجميع وتنسيق مجموعة بيانات متخصصة مع نصوص وصفية دقيقة.
• تدريب نموذج Stable Diffusion XL LoRA باستخدام مكتبة Hugging Face Diffusers (rank 32, fp16).
• تتبع دقيق لمعاملات التدريب والمنحنيات باستخدام MLflow ضمن بيئة Docker Compose قابلة للتكرار بالكامل.`;
        }
        return `**SDXL LoRA Fine-tuning Pipeline – Sultan Hassan Mosque, Cairo:**
• **Dataset & Curation:** Curated high-resolution dataset with detailed architectural captioning.
• **LoRA Training:** Fine-tuned Stable Diffusion XL using Hugging Face Diffusers (rank 32, fp16 precision).
• **Tracking:** Monitored hyperparameter optimization and loss convergence with MLflow in a fully reproducible Docker Compose pipeline.`;
    }

    // 5. ChloroMaster
    if (q.includes('chloromaster') || (isArabic && q.includes('كلورو'))) {
        if (isArabic) {
            return `**ChloroMaster (مصر - دوام كامل عن بُعد · يونيو 2025 – أبريل 2026):**
عمر صمم وبنى منصة الشركة المتكاملة:
• خدمات مصغرة، وقواعد بيانات، وواجهات برمجة تطبيقات (APIs)، وبنية سحابية على AWS مع Kubernetes وTerraform.
• دمج ميزات الذكاء الاصطناعي مع خطوط GitHub Actions CI/CD وإدارة أسرار بـ HashiCorp Vault وفحص أمني بـ Trivy.
• مراقبة مستمرة 24/7 باستخدام Prometheus وGrafana.`;
        }
        return `**ChloroMaster (Software & DevOps Engineer · Jun 2025 – Apr 2026):**
• Designed and engineered the enterprise platform end-to-end: microservices, relational databases, REST APIs, and AWS infrastructure with Kubernetes and Terraform.
• Integrated AI capabilities and implemented automated GitHub Actions CI/CD with HashiCorp Vault secrets and Trivy security scanning.
• Configured 24/7 production observability and alerting via Prometheus and Grafana.`;
    }

    // 6. Experience in general
    if (q.includes('experience') || q.includes('work') || q.includes('job') || (isArabic && (q.includes('خبرة') || q.includes('شغل') || q.includes('وظائف')))) {
        if (isArabic) {
            return `**الخبرات المهنية لعمر جاد:**
1. **PlayerHub.GG** (سبتمبر 2026 – الآن): MLOps & AI Infrastructure Engineer (دبي - عن بُعد).
2. **CliniSoft** (أبريل 2026 – أغسطس 2026): AI & ML Engineer (الإسكندرية - حضوري) لأنظمة الذكاء الاصطناعي الطبية.
3. **EYouth** (أبريل 2026 – سبتمبر 2026): مدرب برمجة وذكاء اصطناعي وروبوتات.
4. **جامعة بوليتكنك فلسطين** (2025 – 2026): مرشد تقني متطوع لمشروع تشخيص أمراض الشبكية بالذكاء الاصطناعي (تمت الإشادة به في رسالة التخرج).
5. **ChloroMaster** (يونيو 2025 – أبريل 2026): Software & DevOps Engineer للبنية السحابية وتطبيقات الميكروسيرفس.
6. **Black Horse Courses** (يناير 2025 – ديسمبر 2025): مدرب بايثون وذكاء اصطناعي (درب أكثر من 50 طالباً بمعدل رضا 95%).`;
        }
        return `**Omar Gad's Professional Experience:**
1. **PlayerHub.GG** (Sep 2026 – Present) · *MLOps & AI Infrastructure Engineer* (Dubai, UAE · Remote)
2. **CliniSoft** (Apr 2026 – Aug 2026) · *AI & ML Engineer* (Alexandria · Healthcare AI & LLM documentation)
3. **EYouth** (Apr 2026 – Sep 2026) · *Programming Instructor* (Python, AI & Robotics)
4. **Palestine Polytechnic University** (2025 – 2026) · *Remote Technical Mentor (Volunteer)* (Retinal OCT AI diagnosis)
5. **ChloroMaster** (Jun 2025 – Apr 2026) · *Software & DevOps Engineer* (Full platform, AWS, Kubernetes, Terraform)
6. **Black Horse Courses** (Jan 2025 – Dec 2025) · *Python & AI Instructor* (Trained 50+ students, 95% satisfaction)`;
    }

    // 7. Education
    if (q.includes('education') || q.includes('degree') || q.includes('university') || q.includes('master') || q.includes('gpa') || (isArabic && (q.includes('تعليم') || q.includes('ماجستير') || q.includes('جامعة') || q.includes('معدل')))) {
        if (isArabic) {
            return `**المؤهلات الأكاديمية لعمر جاد:**
• **ماجستير هندسة الحاسب (M.Sc.):** الأكاديمية العربية للعلوم والتكنولوجيا والنقل البحري (AASTMT) – فبراير 2026 حتى الآن، بمعدل ممتاز **CGPA: 4.0 / 4.0**.
• **دبلومة هندسة البرمجيات (ICC):** معهد تكنولوجيا المعلومات (ITI) – مارس 2025 حتى أغسطس 2025.
• **بكالوريوس هندسة الحاسب:** المعهد العالي للهندسة والتكنولوجيا (BHI) – سبتمبر 2019 حتى يوليو 2024 (تقدير جيد جداً B+ بمعدل 3.2 / 4.0، ومشروع التخرج امتياز مرتفع +A).`;
        }
        return `**Omar Gad's Academic Background:**
• **Master of Science in Computer Engineering:** Arab Academy for Science, Technology and Maritime Transport (AASTMT) · Feb 2026 – Present · **CGPA: 4.0 / 4.0**
• **Diploma in Software Engineering (Intensive Code Camp):** Information Technology Institute (ITI) · Mar 2025 – Aug 2025
• **Bachelor of Engineering in Computer Engineering:** Higher Institute of Engineering & Technology (BHI) · Sep 2019 – Jul 2024 · **CGPA: 3.2 / 4.0 (Very Good – B+)** · Graduation Project Grade: **A+**`;
    }

    // 8. Skills & Technologies
    if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('tools') || (isArabic && (q.includes('مهارات') || q.includes('تقنيات') || q.includes('أدوات')))) {
        if (isArabic) {
            return `**المهارات التقنية الرئيسية لعمر جاد:**
• **نماذج اللغة الكبيرة والذكاء الاصطناعي التوليدي (LLMs & GenAI):** RAG, Multi-agent Systems, MCP, LangChain, ChromaDB, FAISS, LoRA fine-tuning, GPTQ quantization, Gemini API, Llama 3.
• **تعلم الآلة ومعالجة اللغات الطبيعية (ML & NLP):** PyTorch, TensorFlow, scikit-learn, Hugging Face Transformers, spaCy, YOLOv5, Faster-Whisper.
• **عمليات النماذج والاختبار (LLMOps):** MLflow, Langfuse, Ragas, Pydantic, pytest.
• **عمليات الذكاء الاصطناعي والسحابة (MLOps & Cloud):** FastAPI, Docker, Kubernetes, GitHub Actions CI/CD, Terraform, Ansible, Helm, AWS (Fargate, S3, EC2), Prometheus, Grafana, HashiCorp Vault, Trivy.
• **لغات البرمجة:** Python, C++, Java, Bash · قواعد البيانات: PostgreSQL, MySQL, Redis, MongoDB.`;
        }
        return `**Omar Gad's Core Technical Skills:**
• **LLMs & Generative AI:** RAG, Multi-Agent Systems, MCP (Model Context Protocol), LangChain, ChromaDB, FAISS, LoRA Fine-Tuning, GPTQ Quantization, Gemini API, Llama 3 / Ollama.
• **ML & NLP:** PyTorch, TensorFlow, scikit-learn, Hugging Face Transformers, Diffusers, spaCy, YOLOv5, Faster-Whisper.
• **LLMOps & Evaluation:** MLflow, Langfuse tracing, Ragas evaluation, Pydantic validation, pytest.
• **MLOps & Cloud:** FastAPI, Docker, Kubernetes, GitHub Actions CI/CD, Terraform, Ansible, Helm, AWS (Fargate, S3, EC2), Azure, GCP, Prometheus, Grafana, Vault, Trivy.
• **Languages & Databases:** Python, C++, Java, Bash · PostgreSQL, MySQL, Redis, MongoDB · Linux, Git.`;
    }

    // 9. Certifications
    if (q.includes('certif') || q.includes('rhcsa') || q.includes('aspire') || q.includes('huawei') || (isArabic && (q.includes('شهادات') || q.includes('شهادة')))) {
        if (isArabic) {
            return `**الشهادات والاعتمادات الموثقة:**
1. **برنامج قادة أسباير (Aspire Leaders Program)** من معهد أسباير (تأسس في جامعة هارفارد) – سبتمبر 2026 [موثق].
2. **Red Hat Certified System Administrator (RHCSA)** – مايو 2025 [موثق].
3. **HCCDA-Tech Essentials Huawei Cloud Developer** – يوليو 2025 [موثق].
4. **IBM Docker Essentials: A Developer Introduction** – مايو 2025 [موثق].
5. **AWS Academy Cloud Foundations** – أبريل 2025 [موثق].
6. **KodeKloud Jenkins Course Completion** – سبتمبر 2024 [موثق].`;
        }
        return `**Omar Gad's Verified Certifications & Honors:**
1. **Aspire Leaders Program:** Aspire Institute (Founded at Harvard University) · Sep 2026 [Verified]
2. **Red Hat Certified System Administrator (RHCSA):** Red Hat · May 2025 [Verified - Cert ID: 250-068-707]
3. **HCCDA-Tech Essentials Huawei Cloud Developer:** Huawei · Jul 2025 [Verified]
4. **Docker Essentials: A Developer Introduction:** IBM · May 2025 [Verified]
5. **AWS Academy Cloud Foundations:** Amazon Web Services · Apr 2025 [Verified]
6. **Jenkins Course Completion:** KodeKloud · Sep 2024 [Verified]`;
    }

    // 10. Contact / Reach out
    if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('whatsapp') || q.includes('hire') || q.includes('reach') || (isArabic && (q.includes('تواصل') || q.includes('ايميل') || q.includes('واتساب') || q.includes('رقم')))) {
        if (isArabic) {
            return `**معلومات التواصل مع عمر جاد:**
• **البريد الإلكتروني:** [omarmo.abdelsalam@gmail.com](mailto:omarmo.abdelsalam@gmail.com)
• **الهاتف / واتساب:** [+20 101 1297 869](https://wa.me/201011297869)
• **لينكد إن:** [linkedin.com/in/omar-mohamedo-o](https://linkedin.com/in/omar-mohamedo-o)
• **جيت هاب:** [github.com/omarMohamedo-o](https://github.com/omarMohamedo-o)
• **الموقع:** الإسكندرية، مصر (متاح للعمل عن بُعد ولعقود كاملة وجزئية).`;
        }
        return `**Get in Touch with Omar Gad:**
• **Email:** [omarmo.abdelsalam@gmail.com](mailto:omarmo.abdelsalam@gmail.com)
• **Phone & WhatsApp:** [+20 101 1297 869](https://wa.me/201011297869)
• **LinkedIn:** [linkedin.com/in/omar-mohamedo-o](https://linkedin.com/in/omar-mohamedo-o)
• **GitHub:** [github.com/omarMohamedo-o](https://github.com/omarMohamedo-o)
• **Location:** Alexandria, Egypt (Open for full-time, remote, hybrid, and consultancy roles worldwide).`;
    }

    // 11. Internships
    if (q.includes('intern') || (isArabic && (q.includes('تدريب') || q.includes('انترن')))) {
        if (isArabic) {
            return `**التدريبات العملية (Internships):**
• **DevOps Engineer Intern بـ DEPI (أبريل 2024 – أكتوبر 2024):** أنجز 5 مشاريع DevOps باستخدام Terraform وAnsible وCI/CD، وسرّع وتيرة النشر بنسبة 40%، ونشر مجموعات Kubernetes على AWS مع توفر 99.5%.
• **AI Engineer Intern بشركة المصرية للاتصالات Telecom Egypt (سبتمبر 2023 – ديسمبر 2023):** بنى أنابيب NLP لنظم الشات بوت المؤسسية (Hugging Face, spaCy)، ونماذج تصنيف صور (PyTorch, TensorFlow).
• **System Administration Intern بـ ITI (أبريل 2025 – أغسطس 2025):** إدارة سيرفرات Linux/Windows وأتمتة المهام بـ Bash وAnsible بنسبة توفير 60%.`;
        }
        return `**Omar Gad's Internships:**
• **DevOps Engineer Intern · DEPI (Apr 2024 – Oct 2024):** Delivered 5 end-to-end DevOps projects with Terraform, Ansible, and CI/CD pipelines, accelerating deployment speed by 40%. Deployed Kubernetes clusters on AWS with 99.5% uptime.
• **Artificial Intelligence Engineer Intern · Telecom Egypt (Sep 2023 – Dec 2023):** Built NLP pipelines for enterprise chatbots using Hugging Face and spaCy; trained image-classification models with TensorFlow & PyTorch.
• **System Administration Intern · ITI (Apr 2025 – Aug 2025):** Linux & Windows server administration, security policies, and Ansible/Bash automation.`;
    }

    // 12. Who is Omar / Summary / General greeting
    if (q.includes('who') || q.includes('about') || q.includes('hello') || q.includes('hi') || (isArabic && (q.includes('مين') || q.includes('من هو') || q.includes('مرحبا') || q.includes('اهلا')))) {
        if (isArabic) {
            return `أهلاً بك! أنا **MORA**، المساعد الذكي للمهندس **عمر جاد** (Omar Gad).
عمر مهندس حاسب آلي وباحث ماجستير (بمعدل 4.0 / 4.0) متخصص في:
• **الذكاء الاصطناعي وتعلم الآلة (AI & Machine Learning)**
• **نماذج اللغة الكبيرة وRAG (LLMs & RAG Architectures)**
• **البنية السحابية وعمليات التشغيل (MLOps & Cloud DevOps)**

يعمل حالياً كـ **MLOps & AI Infrastructure Engineer** في شركة **PlayerHub.GG** بدبي، وعمل سابقاً في **CliniSoft** و**ChloroMaster**.
يمكنك سؤالي عن مشاريعه (مثل HistoryVerse وSDXL LoRA)، خبراته، مهاراته، أو كيفية التعاون معه!`;
        }
        return `Hello! I'm **MORA**, the personal AI assistant for **Omar Gad** (Omar Mohamed Abdelsalam).
Omar is a Computer Engineer and M.Sc. candidate (CGPA 4.0 / 4.0 at Arab Academy) specialized in:
• **Artificial Intelligence & Machine Learning**
• **LLMs, RAG, & Multi-Agent Systems**
• **MLOps & Cloud Infrastructure (Kubernetes, Terraform, AWS)**

He currently serves as **MLOps & AI Infrastructure Engineer at PlayerHub.GG** (Dubai, UAE), with past experience at **CliniSoft** and **ChloroMaster**.
Feel free to ask me anything about his projects (like HistoryVerse or SDXL LoRA), tech stack, production experience, or how to collaborate!`;
    }

    // Fallback response with helpful prompt guide
    if (isArabic) {
        return `أنا هنا لمساعدتك في معرفة كل شيء عن عمر جاد!
يمكنك سؤالي عن:
• **الخبرة العملية:** مثل عمله في PlayerHub.GG أو CliniSoft أو ChloroMaster.
• **المشاريع:** مثل مشروع التخرج HistoryVerse (الحاصل على +A) أو تخصيص SDXL LoRA.
• **المهارات:** في نماذج اللغة (LLMs/RAG)، البنية السحابية (Kubernetes, Terraform)، أو بايثون.
• **التعليم والشهادات:** ماجستير هندسة الحاسب بمعدل 4.0، وشهادة RHCSA، وبرنامج قادة أسباير.
• **التواصل:** كيفية مراسلة عمر عبر البريد أو واتساب مباشرة.`;
    }

    return `I can answer any question about Omar Gad's background, production projects, and engineering experience!
Here are some great topics to ask:
• **Professional Experience:** His MLOps work at PlayerHub.GG, healthcare AI at CliniSoft, or cloud engineering at ChloroMaster.
• **Featured Projects:** HistoryVerse (A+ Multilingual Museum AI/AR Guide with YOLOv5 & AWS Fargate) or SDXL LoRA Fine-Tuning.
• **Tech Stack:** LLMs, RAG, Multi-Agent systems, Kubernetes, Terraform, Docker, and PyTorch.
• **Academics & Certifications:** M.Sc. with 4.0 CGPA, Red Hat RHCSA, and Harvard-founded Aspire Leaders Program.
• **Collaboration:** How to contact Omar via email or WhatsApp.`;
}
