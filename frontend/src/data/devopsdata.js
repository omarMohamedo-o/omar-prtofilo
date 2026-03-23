/**
 * DevOps Engineer Portfolio Data
 * ================================
 * Data specific to DevOps Engineer mode
 */

export const devopsPersonalInfo = {
    title: "DevOps Engineer",
    tagline: "RHCSA-certified DevOps Engineer specialized in building secure, scalable, and automated cloud environments.",
    link: "https://www.datacamp.com/completed/statement-of-accomplishment/track/bc61190444fa6e4ae3acbde64d805a1e05b43833",
    resume: "/resumes/Omar Mohamed Abdelsalam-DevOps-Resume.pdf",
    themeColor: "cyan"
};
/**
 * DevOps Engineer Portfolio Data
 * ================================
 * Data specific to DevOps Engineer mode
 */

export const devopsSkills = {
    "Cloud & Virtualization": ["AWS", "Azure", "GCP", "Huawei Cloud", "VMware"],
    "Infrastructure as Code": ["Terraform", "Ansible"],
    "CI/CD & Automation": ["Jenkins", "GitHub Actions"],
    "Containers & Orchestration": ["Docker", "Kubernetes", "Helm"],
    "Security & Monitoring": ["HashiCorp Vault", "Trivy", "Prometheus", "Grafana", "New Relic", "Snyk"],
    "Programming & Scripting": ["Python", "Bash", "C++", "PowerShell"],
    "Databases": ["MySQL", "PostgreSQL", "SQL Server", "Redis", "MongoDB"],
    "Operating Systems": ["Linux (RHEL, Ubuntu)", "Windows Server"],
    "Version Control": ["Git", "GitHub", "GitLab"]
};

export const devopsProjects = [
    {
        title: "Cloud-Native Microservices Voting App",
        description: "Production-grade microservices voting application deployed on Kubernetes with automated CI/CD and infrastructure provisioning. Features include containerized microservices, Terraform infrastructure, GitHub Actions pipelines, Helm chart deployments, Prometheus/Grafana observability, and Snyk security scanning.",
        tech: ["Kubernetes", "Docker", "Terraform", "GitHub Actions", "Helm", "PostgreSQL", "Redis"],
        link: "https://github.com/omarMohamedo-o/Cloud-Native-Microservices-Voting-App.git"
    },
    {
        title: "GitOps-Driven Multi-Node Todo Application",
        description: "Full-stack Todo application deployed on a 3-node K3s Kubernetes cluster using GitOps continuous delivery. Features include Ansible configuration automation, ArgoCD declarative deployments, Docker Compose service formulation, and MongoDB Atlas integration with secure secret management.",
        tech: ["K3s", "ArgoCD", "Ansible", "Docker Compose", "MongoDB", "GitHub Actions"],
        link: "https://github.com/omarMohamedo-o/GitOps-Driven-Multi-Node-Todo-Application.git"
    },
    {
        title: "Cloud-Native DevOps CI/CD Pipeline",
        description: "End-to-end DevOps pipeline for building, containerizing, and deploying cloud-ready applications via automated workflows. Features include optimized Docker image builds, automated CI/CD lifecycle pipelines, container networking management, and adherence to zero-touch delivery pipeline best practices.",
        tech: ["Docker", "CI/CD", "GitHub Actions", "Containers", "DevOps"],
        link: "https://github.com/omarMohamedo-o/cloud-native-devops-pipeline.git"
    },
    {
        title: "Cloud-Ready Containerized Application Stack with Docker Compose",
        description: "Containerized multi-service application orchestrated using Docker Compose to enable reproducible deployments. Features include custom Docker images, multi-container architectural definitions, robust service networking & volume mappings, and portable configuration environments for guaranteed isolation.",
        tech: ["Docker", "Docker Compose", "Containers"],
        link: "https://github.com/omarMohamedo-o/docker-multi-service-app.git"
    }
];

export const devopsCertifications = [
    // Remaining certificates ordered by date (newest → oldest)
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

    // (Moved KodeKloud and GitHub entries into courses per request)
];

export const devopsCourses = [
    // Ordered newest → oldest
    {
        name: "Sprints x Microsoft Summer Camp - DevOps Foundations Certificate",
        provider: "Sprints / Microsoft",
        date: "Oct 2025",
        verified: true,
        link: "https://sprints.ai/en-eg/journeys/learning/ID%20-%20SPR%20-%202ES2O9/view-certificate-serial",
        providerLink: "https://learn.microsoft.com/en-us/training/",
        providerLinks: ["https://sprints.ai/en-eg", "https://learn.microsoft.com/en-us/training/"],
        image: "Sprints x Microsoft Summer Camp - DevOps Foundations Certificate.jpg"
    },
    {
        name: "GitHub Actions / Foundation",
        provider: "DataCamp",
        date: "Oct 2025",
        verified: true,
        link: "https://www.datacamp.com/completed/statement-of-accomplishment/track/bc61190444fa6e4ae3acbde64d805a1e05b43833",
        providerLink: "https://www.datacamp.com/",
        image: "GItHub-Foundition.jpg"
    },
    {
        name: "Ansible Course Completion",
        provider: "KodeKloud",
        date: "Aug 2025",
        verified: true,
        link: "https://learn.kodekloud.com/certificate/2ccb19f5-74a5-4e56-9232-91bd1ce4674c",
        providerLink: "https://kodekloud.com/",
        image: "KodeKloud Ansible Basics Certificate.jpg"
    },
    {
        name: "Terraform Basics Training Course",
        provider: "KodeKloud",
        date: "Aug 2025",
        verified: true,
        link: "https://learn.kodekloud.com/certificate/e2cbdf47-bc11-4166-9f6f-550db8fa6343",
        providerLink: "https://kodekloud.com/",
        image: "KodeKloud Terraform Basics Certificate.jpg"
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
        name: "SkillsDynamix Professional DevOps Course",
        provider: "SkillsDynamix",
        date: "Oct 2024",
        verified: true,
        link: "https://drive.google.com/file/d/1aYEBhzn98oNRqZF9geyoGHnZ9RUcPlig/view?pli=1",
        providerLink: "https://www.skillsdynamix.com/",
        image: "SkillsDynamix-certified-devops-omar-mohamed-abdelsalam.jpg"
    },
    {
        name: "Jenkins Course Completion",
        provider: "KodeKloud",
        date: "Sep 2024",
        verified: true,
        link: "https://learn.kodekloud.com/certificate/a061b87c-80c0-4470-a120-b0fa1ec77e5d",
        providerLink: "https://kodekloud.com/",
        image: "KodeKloud Jenkins Certificate.jpg"
    }
];

export const devopsSoftSkills = {
    "Leadership & Mentoring": ["Team Leadership", "Technical Mentoring", "Knowledge Sharing", "Project Coordination"],
    "Communication": ["Technical Documentation", "Cross-team Collaboration", "Stakeholder Communication", "Presentation Skills"],
    "Problem Solving": ["Root Cause Analysis", "Troubleshooting", "Critical Thinking", "Decision Making"],
    "Adaptability": ["Fast Learner", "Flexible Mindset", "Change Management", "Continuous Improvement"],
    "Time Management": ["Task Prioritization", "Meeting Deadlines", "Multi-tasking", "Efficient Planning"],
    "Collaboration": ["Team Player", "Agile Methodologies", "Remote Work", "Pair Programming"]
};

export const devopsAboutMe = [
    "RHCSA-certified DevOps Engineer with hands-on experience designing secure, scalable cloud infrastructures and automating CI/CD pipelines. Skilled in Infrastructure-as-Code (Terraform, Ansible), containerization (Docker, Kubernetes), and multi-cloud environments (AWS, Azure, GCP, HWC).",
    "I've developed compliance-focused deployment strategies, optimized build workflows, and maintained high-availability systems across development and production environments. I combine strong Linux administration, automation, and troubleshooting skills with modern DevOps practices to deliver resilient and secure solutions.",
    "I'm passionate about bridging development and operations, improving system reliability, and mentoring future engineers. Currently seeking opportunities to contribute to scalable infrastructure projects, optimize CI/CD pipelines, and drive DevOps adoption in enterprise environments."
];
