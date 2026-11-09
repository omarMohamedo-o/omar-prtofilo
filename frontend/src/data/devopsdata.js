/**
 * DevOps & MLOps Engineer Portfolio Data
 * ========================================
 * Data specific to DevOps Engineer mode - Omar Mohamed
 */

export const devopsPersonalInfo = {
    title: "MLOps & Cloud DevOps Engineer",
    tagline: "RHCSA-certified DevOps & MLOps Engineer building resilient, scalable, and automated cloud infrastructure for AI and enterprise platforms.",
    link: "https://www.playerhub.gg/en",
    resume: "/resumes/Omar Mohamed Abdelsalam-DevOps-Resume.pdf",
    themeColor: "cyan"
};

export const devopsSkills = {
    "MLOps & Cloud Platforms": ["AWS (Fargate, EC2, S3, VPC)", "Azure", "GCP", "Huawei Cloud (HCCDA)", "VMware"],
    "Containers & Orchestration": ["Docker", "Kubernetes", "Helm", "K3s", "Docker Compose"],
    "Infrastructure as Code": ["Terraform", "Ansible", "CloudFormation"],
    "CI/CD & Delivery": ["GitHub Actions", "Jenkins", "GitOps (ArgoCD)", "Rolling Deployments"],
    "Security & Secrets": ["HashiCorp Vault", "Trivy", "Snyk", "SSL/TLS Hardening", "RBAC"],
    "Observability & Monitoring": ["Prometheus", "Grafana", "Loki / Promtail", "Langfuse", "MLflow"],
    "Databases & High Availability": ["HAProxy", "MariaDB Primary+Replica", "Redis Cluster", "PostgreSQL", "MongoDB"],
    "Operating Systems & Scripting": ["Linux (RHEL, Ubuntu, Debian)", "Bash", "Python", "PowerShell", "Git"]
};

export const devopsProjects = [
    {
        title: "PlayerHub.GG — Production Game Platform & MLOps Infrastructure",
        description: "Live production gaming and AI platform infrastructure. Orchestrated a resilient containerized stack with Nginx edge, PHP-FPM (Laravel), HAProxy intelligent read routing, MariaDB primary-replica replication, and separated Redis caching clusters. Integrated Prometheus, Grafana, and Loki/Promtail observability, self-healing daemons (autoheal, smartheal), toxiproxy chaos engineering, and zero-downtime CI/CD deployment pipelines.",
        tech: ["Docker", "Kubernetes", "Nginx", "HAProxy", "MariaDB", "Redis", "Prometheus", "Grafana", "Loki", "GitHub Actions"],
        github: "https://github.com/omarMohamedo-o/playerhub-infrastructure.git",
        link: "https://www.playerhub.gg/en"
    },
    {
        title: "ChloroMaster — Production Cloud Microservices Platform",
        description: "Full-scale enterprise chemical & agricultural management platform deployed on AWS. Engineered end-to-end containerized microservices orchestration on Kubernetes with modular Terraform IaC, automated GitHub Actions CI/CD with HashiCorp Vault secrets management and Trivy security scanning, plus 24/7 Prometheus & Grafana alerting.",
        tech: ["AWS", "Kubernetes", "Docker", "Terraform", "GitHub Actions", "HashiCorp Vault", "Trivy", "Prometheus", "Grafana"],
        github: "https://github.com/omarMohamedo-o/CloroMaster.git",
        link: "https://chloromaster.com/"
    },
    {
        title: "HistoryVerse — AWS Fargate & Modular Terraform Infrastructure",
        description: "Cloud infrastructure for the graduation project (Grade: A+). Designed modular Terraform configurations deploying the multi-agent AI system onto AWS Fargate, configured automated horizontal autoscaling, Langfuse distributed tracing, and automated regression test runner with 204 passing integration tests.",
        tech: ["AWS Fargate", "Terraform", "Docker", "Langfuse", "Pydantic", "pytest", "GitHub Actions"],
        github: "https://github.com/omarMohamedo-o/HistoryVerse",
        link: "#"
    },
    {
        title: "Production Cloud-Native Voting Platform",
        description: "Production-grade microservices voting application deployed on Kubernetes with automated CI/CD and infrastructure provisioning. Features include containerized microservices, Terraform infrastructure, GitHub Actions pipelines, Helm chart deployments, Prometheus/Grafana observability, and Snyk security scanning.",
        tech: ["Kubernetes", "Docker", "Terraform", "GitHub Actions", "Helm", "PostgreSQL", "Redis"],
        github: "https://github.com/omarMohamedo-o/Cloud-Native-Microservices-Voting-App.git",
        link: "#"
    },
    {
        title: "GitOps-Driven Multi-Node Todo Application",
        description: "Full-stack application deployed on a 3-node K3s Kubernetes cluster using GitOps continuous delivery. Features include Ansible configuration automation, ArgoCD declarative deployments, Docker Compose service formulation, and MongoDB Atlas integration with secure secret management.",
        tech: ["K3s", "ArgoCD", "Ansible", "Docker Compose", "MongoDB", "GitHub Actions"],
        github: "https://github.com/omarMohamedo-o/GitOps-Driven-Multi-Node-Todo-Application.git",
        link: "#"
    },
    {
        title: "Cloud-Native DevOps CI/CD Pipeline",
        description: "End-to-end DevOps pipeline for building, containerizing, and deploying cloud-ready applications via automated workflows. Features include optimized Docker image builds, automated CI/CD lifecycle pipelines, container networking management, and adherence to zero-touch delivery pipeline best practices.",
        tech: ["Docker", "CI/CD", "GitHub Actions", "Containers", "DevOps"],
        github: "https://github.com/omarMohamedo-o/cloud-native-devops-pipeline.git",
        link: "#"
    }
];

export const devopsCertifications = [
    {
        name: "Aspire Leaders Program",
        issuer: "Aspire Institute (Founded at Harvard)",
        date: "Sep 2026",
        verified: true,
        link: "https://www.aspireleaders.org/",
        issuerLink: "https://www.aspireleaders.org/",
        image: "Aspire-Leaders-Program.png",
        pdf: "/images/certifications/Aspire-Certificate.pdf"
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

export const devopsCourses = [
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
    }
];

export const devopsSoftSkills = {
    "Leadership & Mentoring": ["Team Leadership", "Technical Mentoring (50+ students)", "Knowledge Sharing", "Project Coordination"],
    "Communication": ["Technical Documentation", "Cross-team Collaboration", "Stakeholder Communication", "Incident Response Communication"],
    "Problem Solving": ["Root Cause Analysis", "Production Troubleshooting", "High Availability Architecture", "Critical Decision Making"],
    "Adaptability": ["Fast Learner", "Continuous Improvement", "Multi-Cloud Agility", "Resilient System Design"]
};

export const devopsAboutMe = [
    "RHCSA-certified DevOps & MLOps Engineer and Computer Engineering M.Sc. candidate (CGPA 4.0 / 4.0 at Arab Academy for Science, Technology and Maritime Transport) with hands-on experience designing secure, scalable cloud architectures and automating CI/CD pipelines.",
    "Currently MLOps & AI Infrastructure Engineer at PlayerHub.GG (Dubai, UAE - Remote), owning deployment and operations for AI agent systems and self-healing multi-cloud infrastructure. Previously engineered ChloroMaster's complete cloud platform with Kubernetes, Terraform, Vault, and Prometheus.",
    "Certified in Red Hat System Administration (RHCSA) and Huawei Cloud (HCCDA), with deep expertise in Terraform, Ansible, Docker, Kubernetes, AWS, and production reliability."
];
