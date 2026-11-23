/**
 * Shared Portfolio Data - Omar Mohamed (Omar Mohamed Abdelsalam)
 * Common data shared across all portfolio modes
 */

export const personalInfo = {
    name: "Omar Mohamed Abdelsalam",
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
        title: "AI & ML Engineer Intern",
        company: "CliniSoft",
        logo: "/images/companies/clinisoft.png",
        certificate: "/images/certifications/Clinisoft-certificate.webp",
        link: "https://clinisoft.org/",
        location: "Alexandria, Egypt",
        period: "Apr 2026 – Aug 2026",
        type: "Full-time, Onsite",
        achievements: [
            "Developed production healthcare AI using quantized Faster-Whisper (int8) and LLMs to automate clinical documentation, delivering 1.15s transcription latency with 68% GPU VRAM reduction (3.1 GB down to 980 MB).",
            "Constructed specialized clinical summarization pipelines with strict Pydantic schemas, reducing physician charting time by 70% (18.0 min to 5.4 min per consultation) and saving clinics over $45,000 USD per 10-physician practice annually with 100% HIPAA-compliant data confidentiality.",
            "Deployed high-throughput asynchronous FastAPI microservices and Redis caching handling concurrent consultation streams with zero data leakage."
        ]
    },
    {
        title: "DevOps Engineer Intern",
        company: "Digital Egypt Pioneers Initiative (DEPI)",
        logo: "/images/companies/depi.png",
        certificate: "/images/certifications/DEPI-R1-certified-devops-omar-mohamed-abdelsalam.webp",
        link: "https://depi.gov.eg/",
        location: "Alexandria, Egypt",
        period: "Apr 2024 – Oct 2024",
        type: "Part-time, Hybrid",
        achievements: [
            "Delivered 5 DevOps projects with Terraform, Ansible, and CI/CD pipelines, accelerating deployment speed by 40%.",
            "Deployed cloud infrastructure and Kubernetes clusters with 99.5% uptime on AWS (EC2, S3, VPC).",
            "Strengthened infrastructure security and container scanning using HashiCorp Vault and Trivy with 0 critical CVEs permitted."
        ]
    },
    {
        title: "Artificial Intelligence Engineer Intern",
        company: "Telecom Egypt",
        logo: "/images/companies/telecom-egypt.png",
        certificate: "/images/certifications/we-certified-artificial-intelligence.webp",
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
        logo: "/images/companies/iti.png",
        certificate: "/images/certifications/ITI-certified-system-administration.webp",
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
        logo: "/images/companies/playerhub.png",
        link: "https://www.playerhub.gg/en",
        location: "Dubai, UAE",
        period: "Sep 2026 – Present",
        type: "Full-time, Remote",
        achievements: [
            "Engineered HAProxy 2.8+ intelligent read/write splitting with MariaDB primary-replica replication and Redis caching, achieving 99.9% platform uptime under 10,000+ daily active users and absorbing 60% of query volume with sub-10ms p95 latency.",
            "Built automated GitHub Actions CI/CD and self-healing container supervisors (autoheal/smartheal), reducing cloud API and database scaling expenditures by 65% (saving over $15,000 USD annually).",
            "Deployed unified Prometheus, Grafana, and Loki/Promtail observability tracking sub-50ms query metrics, error budgets, and replication health across production, dev, and test environments."
        ]
    },
    {
        title: "Programming Instructor",
        company: "EYouth",
        logo: "/images/companies/eyouth.png",
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
        logo: "/images/companies/chloromaster.png",
        link: "https://chloromaster.com/",
        location: "Egypt",
        period: "Jun 2025 – Apr 2026",
        type: "Full-time, Remote",
        achievements: [
            "Engineered enterprise cloud platform from inception on AWS using Kubernetes, automated GitHub Actions CI/CD, and modular Terraform Infrastructure as Code (IaC), accelerating multi-environment cloud provisioning from 6.0 hours to 12 minutes (96.6% speedup).",
            "Enforced DevSecOps compliance via HashiCorp Vault dynamic secret leasing (3,600s TTL) and Trivy container vulnerability scanning, ensuring 0 HIGH or CRITICAL CVEs entered production and saving $8,400+ USD annually in infrastructure overhead.",
            "Implemented 24/7 observability and alerting with Prometheus, Grafana, and structured logging."
        ]
    },
    {
        title: "Python & AI Instructor",
        company: "Black Horse Courses",
        logo: "/images/companies/blackhorse.png",
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
        logo: "/images/companies/ppu.png",
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
        logo: "/images/companies/aastmt.png",
        link: "https://aast.edu/en/",
        location: "Alexandria, Egypt",
        period: "Feb 2026 – Present",
        cgpa: "4.0 / 4.0",
        highlights: "Focus on Applied ML, Generative AI, Multilingual Conversational Systems, and LLMs/RAG."
    },
    {
        degree: "Diploma in Software Engineering – Intensive Code Camp",
        institution: "Information Technology Institute (ITI)",
        logo: "/images/companies/iti.png",
        link: "https://iti.gov.eg/",
        program: "Intensive Code Camp (ICC)",
        location: "Alexandria, Egypt",
        period: "Mar 2025 – Aug 2025",
        highlights: "Intensive immersion in Software Architecture, DevOps, Linux Systems Administration, and Cloud Engineering."
    },
    {
        degree: "Bachelor of Engineering in Computer Engineering",
        institution: "Higher Institute of Engineering & Technology (BHI)",
        logo: "/images/companies/bhi.png",
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
    { name: "English", level: "Fluent" },
    { name: "German", level: "Beginner (A1)" }
];

// Portfolio modes
export const MODES = {
    DEVOPS: 'devops',
    MLNLP: 'mlnlp'
};
