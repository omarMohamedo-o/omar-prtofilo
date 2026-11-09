/**
 * Shared Portfolio Data - Omar Gad (Omar Mohamed Abdelsalam)
 * ==========================================================
 * Common data shared across all portfolio modes
 */

export const personalInfo = {
    name: "Omar Gad",
    fullName: "Omar Mohamed Abdelsalam",
    title: "Computer Engineer | AI & Machine Learning | LLMs & RAG | MLOps & Cloud",
    tagline: "Computer Engineering graduate and M.Sc. candidate (CGPA 4.0 / 4.0) with experience building LLM, RAG, NLP, and speech systems and running them in production.",
    summary: "Computer Engineering graduate and M.Sc. candidate (CGPA 4.0 / 4.0) with experience building LLM, RAG, NLP, and speech systems and running them in production. Completed AI and DevOps internships, taught Python and ML to 50+ students, and earned RHCSA. Research interests: applied ML, generative AI, and multilingual conversational systems.",
    location: "Alexandria, Egypt",
    phone: "+20 101 1297 869",
    email: "omarmo.abdelsalam@gmail.com",
    github: "https://github.com/omarMohamedo-o",
    linkedin: "https://linkedin.com/in/omar-mohamedo-o",
    credly: "https://www.credly.com/users/omar-mohamedo-o/badges#credly",
    whatsapp: "https://wa.me/201011297869",
    image: "/images/me/Personal_Photo.svg",
    researchInterests: ["Applied ML", "Generative AI", "Multilingual Conversational Systems", "LLMs & RAG", "MLOps"]
};

export const Intern = [
    {
        title: "DevOps Engineer Intern",
        company: "Digital Egypt Pioneers Initiative (DEPI)",
        link: "https://depi.gov.eg/",
        location: "Alexandria, Egypt",
        period: "Apr 2024 – Oct 2024",
        type: "Part-time, Hybrid",
        achievements: [
            "Delivered 5 DevOps projects with Terraform, Ansible, and CI/CD pipelines, improving deployment speed by 40%.",
            "Deployed cloud infrastructure and Kubernetes clusters with 99.5% uptime on AWS (EC2, S3, VPC).",
            "Strengthened infrastructure security and container scanning using HashiCorp Vault and Trivy."
        ]
    },
    {
        title: "Artificial Intelligence Engineer Intern",
        company: "Telecom Egypt",
        link: "https://www.te.eg/",
        location: "Alexandria, Egypt",
        period: "Sep 2023 – Dec 2023",
        type: "Full-time, Onsite",
        achievements: [
            "Built NLP pipelines for enterprise chatbots using Hugging Face transformers and spaCy.",
            "Developed image-classification models using TensorFlow and PyTorch for internal automation.",
            "Integrated machine learning models into high-performance backend REST APIs."
        ]
    },
    {
        title: "System Administration Intern",
        company: "Information Technology Institute (ITI)",
        link: "https://iti.gov.eg/",
        location: "Alexandria, Egypt",
        period: "Apr 2025 – Aug 2025",
        type: "Full-time, Onsite",
        achievements: [
            "Administered Linux & Windows servers, enhancing system stability and security.",
            "Automated routine tasks with Bash, Python, and Ansible, reducing manual intervention by 60%.",
            "Configured and secured web servers (Apache, Nginx, IIS) and enforced firewall policies.",
            "Deployed virtual environments on AWS, Azure, and VMware with automated monitoring."
        ]
    }
];

export const Experiences = [
    {
        title: "MLOps & AI Infrastructure Engineer",
        company: "PlayerHub.GG",
        link: "https://www.playerhub.gg/en",
        location: "Dubai, UAE",
        period: "Sep 2026 – Present",
        type: "Full-time, Remote",
        achievements: [
            "Own deployment and operations for AI agent systems, scraping pipelines, and production and dev/test environments across Docker, Kubernetes, hybrid and multi-cloud.",
            "Built GitHub Actions CI/CD pipelines, centralized logging and monitoring (Prometheus, Grafana, Loki/Promtail), and automated deployment workflows.",
            "Engineered a highly available setup with HAProxy read routing, DB replication (MariaDB primary + replica), self-healing workloads (autoheal, smartheal), and automated backups."
        ]
    },
    {
        title: "AI & ML Engineer",
        company: "CliniSoft",
        link: "https://clinisoft.org/",
        location: "Alexandria, Egypt",
        period: "Apr 2026 – Aug 2026",
        type: "Full-time, Onsite",
        achievements: [
            "Developed production healthcare AI using LLMs, NLP, and speech AI to automate clinical documentation and medical transcriptions.",
            "Built and served robust microservices through FastAPI with strict Pydantic schemas and high throughput.",
            "Deployed AI models following MLOps, containerization, and cloud infrastructure best practices."
        ]
    },
    {
        title: "Programming Instructor",
        company: "EYouth",
        link: "https://eyouthlearning.com/en",
        location: "Cairo, Egypt",
        period: "Apr 2026 – Sep 2026",
        type: "Part-time, Remote",
        achievements: [
            "Designed and delivered project-based Python, AI, and robotics courses for ambitious learners.",
            "Mentored students through real-world software and machine learning projects from concept to deployment."
        ]
    },
    {
        title: "Software & DevOps Engineer",
        company: "ChloroMaster",
        link: "https://chloromaster.com/",
        location: "Egypt",
        period: "Jun 2025 – Apr 2026",
        type: "Full-time, Remote",
        achievements: [
            "Designed and built the enterprise company platform end-to-end: backend microservices, relational databases, REST APIs, and AWS infrastructure with Kubernetes and Terraform.",
            "Integrated production AI features and shipped continuous deployments via Docker, GitHub Actions CI/CD with Vault and Trivy security scanning.",
            "Implemented 24/7 observability and alerting with Prometheus, Grafana, and structured logging."
        ]
    },
    {
        title: "Python & AI Instructor",
        company: "Black Horse Courses",
        link: "https://black-horse-courses.com/",
        location: "Alexandria, Egypt",
        period: "Jan 2025 – Dec 2025",
        type: "Part-time, Onsite",
        achievements: [
            "Trained 50+ students in Python programming, machine learning algorithms, and cloud model deployment.",
            "Achieved a 95% student satisfaction rating through hands-on labs, OOP principles, and real-world projects."
        ]
    }
];

export const Volunteering = [
    {
        title: "Remote Technical Mentor (Volunteer)",
        company: "Palestine Polytechnic University",
        link: "https://www.ppu.edu/",
        location: "Palestine",
        period: "2025 – 2026",
        type: "Volunteer, Remote",
        badge: "Official Thesis Acknowledgement",
        achievements: [
            "Advised a university research team building an AI-powered retinal OCT disease diagnosis deep learning system.",
            "Officially acknowledged in the published academic graduation thesis for remote guidance, model evaluation, and technical expertise."
        ]
    }
];

export const education = [
    {
        degree: "Master of Science in Computer Engineering",
        institution: "Arab Academy for Science, Technology and Maritime Transport (AASTMT)",
        link: "https://aast.edu/en/",
        location: "Alexandria, Egypt",
        period: "Feb 2026 – Present",
        cgpa: "4.0 / 4.0",
        highlights: "Focus on Applied ML, Generative AI, Multilingual Conversational Systems, and LLMs/RAG."
    },
    {
        degree: "Diploma in Software Engineering – Intensive Code Camp",
        institution: "Information Technology Institute (ITI)",
        link: "https://iti.gov.eg/",
        program: "Intensive Code Camp (ICC)",
        location: "Alexandria, Egypt",
        period: "Mar 2025 – Aug 2025",
        highlights: "Intensive immersion in Software Architecture, DevOps, Linux Systems Administration, and Cloud Engineering."
    },
    {
        degree: "Bachelor of Engineering in Computer Engineering",
        institution: "Higher Institute of Engineering & Technology (BHI)",
        link: "https://bhi47.com/",
        location: "Alexandria, Egypt",
        period: "Sep 2019 – Jul 2024",
        cgpa: "3.2 / 4.0 (Very Good – B+)",
        project: "HistoryVerse – Multilingual AI/AR Museum Guide (Grade: A+)",
        coursework: ["Neural Networks", "Pattern Recognition", "Algorithms", "Numerical Analysis", "Digital Systems Design"]
    }
];

export const languages = [
    { name: "Arabic", level: "Native" },
    { name: "English", level: "Fluent" }
];

// Portfolio modes
export const MODES = {
    DEVOPS: 'devops',
    MLNLP: 'mlnlp'
};
