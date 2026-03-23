/**
 * Shared Portfolio Data - Omar Mohamed Abdelsalam
 * ================================================
 * Common data shared across all portfolio modes
 */

export const personalInfo = {
    name: "Omar Mohamed Abdelsalam",
    location: "Alexandria, Egypt",
    phone: "+20 101 1297 869",
    email: "omarmo.abdelsalam@gmail.com",
    github: "https://github.com/omarMohamedo-o",
    linkedin: "https://linkedin.com/in/omar-mohamedo-o",
    credly: "https://www.credly.com/users/omar-mohamedo-o/badges#credly",
    whatsapp: "https://wa.me/201011297869",
    image: "/images/me/Personal_Photo.svg"
};

export const Intern = [
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
            "Deployed and managed virtual environments on AWS, Azure, and VMware.",
            "Built CI/CD pipelines using Jenkins and GitHub Actions to accelerate deployment."
        ]
    },
    {
        title: "DevOps Engineer Intern",
        company: "Digital Egypt Pioneers Initiative (DEPI)",
        link: "https://depi.gov.eg/",
        location: "Alexandria, Egypt",
        period: "Apr 2024 – Oct 2024",
        type: "Part-time, Hybrid",
        achievements: [
            "Delivered 5 end-to-end DevOps projects with Terraform, Ansible, and CI/CD pipelines",
            "Deployed AWS infrastructure (EC2, S3, VPC) and Kubernetes clusters with 99.5% uptime",
            "Strengthened infrastructure security using Vault and Trivy"
        ]
    },
    {
        title: "Artificial Intelligence Engineer Intern",
        company: "Telecom Egypt",
        link: "https://www.te.eg/",
        location: "Alexandria, Egypt",
        period: "Sep 2023",
        type: "Full-Time, Onsite",
        achievements: [
            "Developed and pre-processed ML models on real-world telecom datasets",
            "Performed feature engineering, evaluation, and EDA to improve model performance",
            "Built predictive models for customer behavior analysis",
            "Implemented data pipelines for model training and evaluation"
        ]
    }
];

export const Experiences = [
    {
        title: "Python & AI Instructor",
        company: "Black Horse Courses",
        link: "https://black-horse-courses.com/",
        location: "Alexandria, Egypt",
        period: "Jan 2025 – Present",
        type: "Part-time, Onsite",
        achievements: [
            "Delivered Python and machine learning training to 50+ students",
            "Focused on OOP, data structures, and real-world model deployment",
            "Achieved 95% satisfaction rate"
        ]
    }
];

export const education = [
    {
        degree: "Master of Science in Computer Engineering",
        institution: "Arab Academy for Science, Technology and Maritime Transport (AASTMT)",
        link: "https://aast.edu/en/",
        location: "Alexandria, Egypt",
        period: "Feb 2026 – present",
        // cgpa: "4.0 / 4.0 (Excellent)",
    },
    {
        degree: "Diploma in Computer Software Engineering",
        institution: "Information Technology Institute (ITI)",
        link: "https://iti.gov.eg/",
        program: "Intensive Code Camp (ICC)",
        location: "Alexandria, Egypt",
        period: "Mar 2025 – Aug 2025"
    },
    {
        degree: "Bachelor of Engineering in Computer Engineering",
        institution: "Higher Institute of Engineering & Technology (BHI)",
        link: "https://bhi47.com/",
        location: "Alexandria, Egypt",
        period: "Sep 2019 – Jul 2024",
        project: "HistoryVerse – AI/AR platform for interactive historical exploration (Grade: A+)"
    }
];

export const languages = [
    { name: "Arabic", level: "Native" },
    { name: "English", level: "Professional" },
    { name: "German", level: "Beginner" }
];

// Portfolio modes
export const MODES = {
    DEVOPS: 'devops',
    MLNLP: 'mlnlp'
};
