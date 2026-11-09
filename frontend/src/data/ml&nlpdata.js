/**
 * ML & NLP Engineer Portfolio Data
 * ==================================
 * Data specific to ML & NLP Engineer mode - Omar Mohamed
 */

export const mlnlpPersonalInfo = {
    heroLogo: "/images/me/OmarsLogo-ml.svg",
    title: "AI & Machine Learning Engineer",
    tagline: "Computer Engineering M.Sc. candidate (CGPA 4.0) building LLM, RAG, NLP, and speech AI systems running reliably in production.",
    description: "Specialized in LLMs & Generative AI, RAG architectures, multi-agent systems, fine-tuning, and scalable production AI pipelines.",
    themeColor: "purple",
    resume: "/resumes/Omar Mohamed Abdelsalam-AI-Resume.pdf"
};

export const mlnlpSkills = {
    "LLMs & Generative AI": [
        "RAG (Retrieval Augmented Generation)",
        "Multi-agent Systems",
        "MCP (Model Context Protocol)",
        "LangChain",
        "LlamaIndex",
        "ChromaDB",
        "FAISS",
        "LoRA Fine-tuning",
        "GPTQ Quantization",
        "Gemini API",
        "OpenAI API",
        "Llama 3 / Ollama"
    ],
    "ML & NLP": [
        "PyTorch",
        "TensorFlow",
        "Scikit-learn",
        "Hugging Face Transformers",
        "Diffusers",
        "spaCy",
        "NLTK",
        "YOLOv5",
        "Faster-Whisper",
        "Google TTS"
    ],
    "LLMOps & Evaluation": [
        "MLflow",
        "Langfuse Tracing",
        "Ragas Evaluation",
        "Pydantic Validation",
        "pytest",
        "CI/CD for ML"
    ],
    "MLOps & Cloud Deployment": [
        "FastAPI",
        "Docker",
        "Kubernetes",
        "GitHub Actions CI/CD",
        "Terraform",
        "AWS (Fargate, S3, EC2)",
        "Prometheus",
        "Grafana"
    ],
    "Programming & Databases": [
        "Python",
        "C++",
        "Java",
        "Bash",
        "PostgreSQL",
        "MySQL",
        "Redis",
        "MongoDB"
    ],
    "Soft Skills": [
        "Technical Leadership",
        "Mentoring & Teaching",
        "Teamwork & Collaboration",
        "Analytical Problem Solving",
        "Clear Technical Communication"
    ]
};

export const mlnlpProjects = [
    {
        title: "HistoryVerse – Multilingual AI/AR Museum Guide",
        description: "Graduation Project (Grade: A+) — An end-to-end multi-agent AI and Augmented Reality museum exploration platform. Features 90–96% artifact recognition accuracy with YOLOv5 and Vision Transformers, 25+ REST endpoints with model-agnostic routing (Gemini, OpenAI, Llama, Ollama), RAG over ChromaDB, real-time multilingual voice (Whisper, Google TTS), and ARCore 3D reconstructions. Enforces Pydantic-validated outputs, Langfuse tracing, Ragas evaluation, 204 passing automated tests, and AWS Fargate deployment with modular Terraform.",
        tech: ["YOLOv5", "Transformers", "RAG", "ChromaDB", "LangChain", "Whisper", "ARCore", "FastAPI", "AWS Fargate", "Terraform", "Langfuse", "Ragas"],
        github: "https://github.com/omarMohamedo-o/HistoryVerse",
        link: "#"
    },
    {
        title: "SDXL LoRA Fine-tuning Pipeline – Sultan Hassan Mosque",
        description: "Curated domain-specific dataset with precision captioning and trained Stable Diffusion XL LoRA fine-tuning models using Hugging Face diffusers (rank 32, fp16). Tracked hyperparameter optimization and loss convergence with MLflow in a fully reproducible Docker Compose pipeline.",
        tech: ["SDXL", "LoRA", "Hugging Face Diffusers", "PyTorch", "MLflow", "Docker Compose", "Computer Vision"],
        github: "https://github.com/omarMohamedo-o/sdxl-lora-finetuning",
        link: "#"
    },
    {
        title: "CliniSoft — Clinical Healthcare AI & Speech Documentation",
        description: "Production healthcare AI solution utilizing LLMs, NLP, and speech AI to automate clinical documentation and transcriptions for medical professionals. Deployed via FastAPI microservices with strict Pydantic validation, containerized with Docker, and monitored in production.",
        tech: ["FastAPI", "LLMs", "NLP", "Faster-Whisper", "Docker", "MLOps", "Pydantic"],
        github: "",
        link: "https://clinisoft.org/"
    },
    {
        title: "PlayerHub.GG — AI Agents & Infrastructure Ops",
        description: "Production operations and deployment for autonomous AI agents, web scraping pipelines, and high-availability infrastructure supporting PlayerHub.GG. Implemented automated CI/CD, centralized logging (Loki, Grafana), and self-healing workloads.",
        tech: ["Docker", "Kubernetes", "AI Agents", "Python", "CI/CD", "Prometheus", "Grafana"],
        github: "https://github.com/omarMohamedo-o/playerhub-infrastructure.git",
        link: "https://www.playerhub.gg/en"
    },
    {
        title: "MORA — Multimodal Portfolio AI Assistant & RAG",
        description: "Interactive RAG-based conversational AI agent for this portfolio. Features deep context retrieval over Omar's projects, experience, skills, and resume, with voice synthesis, image analysis, and conversational intelligence powered by Gemini and custom local RAG fallback.",
        tech: ["RAG", "LangChain", "Gemini API", "ChromaDB", "FastAPI", "React", "Web Speech"],
        github: "https://github.com/omarMohamedo-o/omar-prtofilo",
        link: "#"
    },
    {
        title: "Telecom Customer Churn Prediction & Analytics",
        description: "End-to-end ML pipeline for telecom customer churn prediction using ensemble classifiers. Achieved 92% accuracy with rigorous feature engineering, hyperparameter tuning, and SHAP explainability analysis.",
        tech: ["Scikit-learn", "XGBoost", "Pandas", "SHAP", "Matplotlib", "Python"],
        github: "",
        link: "#"
    }
];

export const mlnlpCertifications = [
    {
        name: "Aspire Leaders Program",
        issuer: "Aspire Institute (Founded at Harvard)",
        date: "Sep 2026",
        verified: true,
        link: "https://www.aspireleaders.org/",
        issuerLink: "https://www.aspireleaders.org/",
        image: "Aspire-Leaders-Program.png"
    },
    {
        name: "Red Hat Certified System Administrator (RHCSA)",
        issuer: "Red Hat",
        date: "May 2025",
        verified: true,
        link: "https://rhtapps.redhat.com/verify?certId=250-068-707",
        issuerLink: "https://www.redhat.com/en",
        image: "red-hat-certified-system-administrator-rhcsa.jpg"
    },
    {
        name: "HCCDA-Tech Essentials Huawei Cloud Developer",
        issuer: "Huawei",
        date: "Jul 2025",
        verified: true,
        link: "https://drive.google.com/file/d/1PF71T7ycbmXjV-CchoOzmJCtfF_gBsLL/view",
        issuerLink: "https://www.huaweicloud.com/intl/en-us/",
        image: "HCCDA-Tech Essentials Huawei Cloud Developer.png"
    }
];

export const mlnlpCourses = [
    {
        name: "Docker Essentials: A Developer Introduction",
        provider: "IBM",
        date: "May 2025",
        verified: true,
        link: "https://www.credly.com/badges/517d3f92-9950-4b0c-b637-cc22f5206447/linked_in_profile",
        providerLink: "https://www.ibm.com/us-en",
        image: "IBM_Docker_Essentials _A_Developer_Introduction.png"
    },
    {
        name: "AWS Academy Cloud Foundations",
        provider: "Amazon Web Services (AWS)",
        date: "Apr 2025",
        verified: true,
        link: "https://www.credly.com/badges/795c58fb-53f7-4859-b894-51660e879def/print",
        providerLink: "https://pages.awscloud.com/AWS-Academy.html",
        image: "AWS_Academy_Graduate___Cloud_Foundations__Training_Badge_Badge.png"
    },
    {
        name: "Jenkins Course Completion",
        provider: "KodeKloud",
        date: "Sep 2024",
        verified: true,
        link: "https://learn.kodekloud.com/certificate/a061b87c-80c0-4470-a120-b0fa1ec77e5d",
        providerLink: "https://kodekloud.com/",
        image: "KodeKloud Jenkins Certificate.jpg"
    },
    {
        name: "GitHub Foundation",
        provider: "DataCamp",
        date: "Oct 2025",
        verified: true,
        link: "https://www.datacamp.com/completed/statement-of-accomplishment/track/bc61190444fa6e4ae3acbde64d805a1e05b43833",
        providerLink: "https://www.datacamp.com/",
        image: "GItHub-Foundition.jpg"
    },
    {
        name: "Data Scientist Full Career Track (9 Courses)",
        provider: "365 Data Science",
        date: "Mar 2024",
        verified: true,
        link: "https://learn.365datascience.com/c/177c03e65b/",
        providerLink: "https://365datascience.com/",
        image: "Data-Scientist-Career-Track.jpg"
    }
];

export const mlnlpSoftSkills = {
    "Leadership & Mentoring": ["Team Leadership", "Technical Mentoring", "Knowledge Sharing", "Project Coordination", "Instructor Experience (50+ students)"],
    "Communication": ["Technical Documentation", "Cross-team Collaboration", "Stakeholder Communication", "Research Presentation"],
    "Problem Solving": ["Analytical Thinking", "Applied ML Research", "Critical Evaluation", "Performance Optimization"],
    "Adaptability": ["Fast Learner", "Continuous Learning", "Multi-cloud Agnostic", "Production Pragmatism"]
};

export const mlnlpAboutMe = [
    "Computer Engineering graduate and M.Sc. candidate (CGPA 4.0 / 4.0 at Arab Academy for Science, Technology and Maritime Transport) with hands-on experience building LLM, RAG, NLP, and speech systems and running them reliably in production.",
    "Currently serving as MLOps & AI Infrastructure Engineer at PlayerHub.GG (Dubai, UAE - Remote), and previously AI & ML Engineer at CliniSoft, where I developed production healthcare AI automating clinical documentation. I combine rigorous machine learning foundations with deep DevOps/MLOps engineering.",
    "Creator of HistoryVerse (Graduation Project, Grade: A+), an AWS Fargate-deployed multilingual AI/AR museum platform with 90-96% artifact recognition accuracy, ChromaDB RAG, and 204 passing automated tests. Research interests include applied ML, generative AI, multi-agent systems, and multilingual conversational systems."
];
