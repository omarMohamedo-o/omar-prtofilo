/**
 * ML & NLP Engineer Portfolio Data
 * ==================================
 * Data specific to ML & NLP Engineer mode
 */

export const mlnlpPersonalInfo = {
    heroLogo: "/images/me/OmarsLogo-ml.svg",
    title: "ML & NLP Engineer",
    tagline: "Machine Learning and NLP Engineer specialized in building intelligent AI solutions, conversational agents, and production ML systems.",
    description: "Passionate about developing cutting-edge AI applications using deep learning, NLP, and LLM technologies.",
    themeColor: "purple", // Theme color for ML/NLP mode
    resume: "/resumes/Omar Mohamed Abdelsalam-AI-Resume.pdf"
};

export const mlnlpSkills = {
    "Machine Learning": ["TensorFlow", "PyTorch", "Scikit-learn", "Keras", "XGBoost", "LightGBM"],
    "NLP & LLMs": ["Transformers", "LangChain", "Hugging Face", "spaCy", "NLTK", "RAG", "OpenAI API", "Gemini API"],
    "Data Science": ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Jupyter", "Feature Engineering"],
    "Computer Vision": ["OpenCV", "YOLO", "Image Classification", "Object Detection"],
    "MLOps & Deployment": ["Docker", "Kubernetes", "FastAPI", "Flask", "Streamlit", "MLflow"],
    "Vector Databases": ["ChromaDB", "Pinecone", "FAISS", "Weaviate"],
    "Programming": ["Python", "C++", "SQL", "Bash"],
    "Cloud Platforms": ["AWS SageMaker", "Google Vertex AI", "Azure ML", "Hugging Face Spaces"],
    "Databases": ["PostgreSQL", "MongoDB", "Redis", "SQLite"]
};

export const mlnlpProjects = [
    {
        title: "MORA - Portfolio AI Chatbot",
        description: "RAG-based conversational AI assistant using LangChain, ChromaDB, and Google Gemini. Features text chat, image analysis, PDF Q&A, and voice interaction with custom knowledge base.",
        tech: ["LangChain", "ChromaDB", "Gemini API", "FastAPI", "RAG", "Python"],
        link: "#"
    },
    {
        title: "HistoryVerse - AI/AR Historical Platform",
        description: "Graduation project (Grade: A+) - Interactive AI and Augmented Reality platform for historical exploration. Features NLP-powered historical Q&A, AR visualizations, and engaging educational content.",
        tech: ["NLP", "Transformers", "AR", "Python", "TensorFlow", "Unity"],
        link: "#"
    },
    {
        title: "Telecom Customer Churn Prediction",
        description: "End-to-end ML pipeline for predicting customer churn using ensemble methods. Achieved 92% accuracy with feature engineering, hyperparameter tuning, and model interpretability.",
        tech: ["Scikit-learn", "XGBoost", "Pandas", "SHAP", "Matplotlib"],
        link: "#"
    },
    {
        title: "Document Intelligence System",
        description: "NLP system for automatic document classification, entity extraction, and summarization using transformer models and custom fine-tuning.",
        tech: ["Transformers", "Hugging Face", "spaCy", "FastAPI", "Docker"],
        link: "#"
    }
];

export const mlnlpCertifications = [
    // Remaining certifications ordered by date (newest → oldest)
    {
        name: "HCCDA-Tech Essentials Huawei Cloud Developer",
        issuer: "Huawei",
        date: "Jul 2025",
        verified: true,
        link: "https://drive.google.com/file/d/1PF71T7ycbmXjV-CchoOzmJCtfF_gBsLL/view",
        issuerLink: "https://www.huaweicloud.com/intl/en-us/",
        image: "HCCDA-Tech Essentials Huawei Cloud Developer.png"
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
    // (Moved GitHub Foundition into courses per request)
];

export const mlnlpCourses = [
    // Ordered newest → oldest
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
        name: "Docker Essentials: A Developer Introduction",
        provider: "IBM",
        date: "May 2025",
        verified: true,
        platform: "Credly",
        link: "https://www.credly.com/badges/517d3f92-9950-4b0c-b637-cc22f5206447/linked_in_profile",
        providerLink: "https://www.ibm.com/us-en",
        image: "IBM_Docker_Essentials _A_Developer_Introduction.png"
    },
    {
        name: "AWS Academy Cloud Foundations",
        provider: "Amazon Web Services (AWS)",
        date: "Apr 2025",
        verified: true,
        platform: "Credly",
        link: "https://www.credly.com/badges/795c58fb-53f7-4859-b894-51660e879def/print",
        providerLink: "https://pages.awscloud.com/AWS-Academy.html",
        image: "AWS_Academy_Graduate___Cloud_Foundations__Training_Badge_Badge.png"
    },
    {
        name: "Data Analyst Full Career Track (9 Courses)",
        provider: "365 Data Science",
        date: "Jul 2024",
        verified: true,
        link: "https://learn.365datascience.com/c/348bab1efa/",
        providerLink: "https://365datascience.com/",
        image: "Data-Analyst-Career-Track.jpg"
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
    "Leadership & Mentoring": ["Team Leadership", "Technical Mentoring", "Knowledge Sharing", "Project Coordination"],
    "Communication": ["Technical Documentation", "Cross-team Collaboration", "Stakeholder Communication", "Presentation Skills"],
    "Problem Solving": ["Analytical Thinking", "Research Skills", "Critical Thinking", "Creative Solutions"],
    "Adaptability": ["Fast Learner", "Flexible Mindset", "Innovation", "Continuous Learning"],
    "Time Management": ["Task Prioritization", "Meeting Deadlines", "Multi-tasking", "Efficient Planning"],
    "Collaboration": ["Team Player", "Agile Methodologies", "Remote Work", "Cross-functional Teams"]
};

export const mlnlpAboutMe = [
    "ML & NLP Engineer with hands-on experience building intelligent AI systems, conversational agents, and production-ready machine learning pipelines. Skilled in deep learning frameworks (TensorFlow, PyTorch), NLP libraries (Transformers, LangChain, spaCy), and LLM integration (OpenAI, Gemini).",
    "I've developed RAG-based chatbots, trained custom NLP models, and built end-to-end ML pipelines for real-world applications. I combine strong data science foundations with modern AI practices to deliver impactful solutions that solve real business problems.",
    "I'm passionate about pushing the boundaries of AI, building conversational AI systems, and making machine learning accessible. Currently seeking opportunities to develop innovative ML/NLP solutions, build AI-powered products, and contribute to cutting-edge research in enterprise environments."
];
