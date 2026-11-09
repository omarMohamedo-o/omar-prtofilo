import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export const LANGUAGES = {
    EN: 'en',
    AR: 'ar'
};

const translations = {
    en: {
        // Navigation & Header
        navHome: "Home",
        navAbout: "About",
        navExperience: "Experience",
        navInternships: "Internships",
        navSkills: "Skills",
        navProjects: "Projects",
        navEducation: "Education",
        navCertifications: "Certifications",
        navContact: "Contact",
        navDiscovery: "Discovery",
        tourGuide: "Tour Guide",
        bookDiscoveryCall: "Book a Discovery Call",
        viewAs: "View as",
        switchMode: "Switch mode",
        devopsMode: "DevOps & MLOps",
        mlnlpMode: "AI & ML",

        // Hero & Info
        resume: "Resume",
        availableForRoles: "Available for Full-Time, Remote & Contract Roles Worldwide",
        locationEgypt: "Alexandria, Egypt",

        // Section Titles
        aboutTitle1: "About",
        aboutTitle2: "Me",
        experienceTitle1: "Professional",
        experienceTitle2: "Experience",
        internshipsTitle1: "Engineering",
        internshipsTitle2: "Internships",
        skillsTitle1: "Technical",
        skillsTitle2: "Skills",
        softSkillsTitle1: "Soft &",
        softSkillsTitle2: "Core Skills",
        projectsTitle1: "Featured",
        projectsTitle2: "Projects",
        educationTitle1: "Education &",
        educationTitle2: "Academics",
        certificationsTitle1: "Verified",
        certificationsTitle2: "Certifications",
        coursesTitle1: "Continuous",
        coursesTitle2: "Training & Courses",
        languagesTitle1: "My",
        languagesTitle2: "Languages",
        contactTitle1: "Get In",
        contactTitle2: "Touch",
        discoveryTitle1: "Book a",
        discoveryTitle2: "Discovery Call",

        // Common UI
        all: "All",
        liveDemo: "Live Demo",
        githubRepo: "GitHub",
        verified: "Verified ✓",
        viewPdf: "View PDF",
        filterBy: "Filter by Category",
        projectHighlights: "Key Architecture & Highlights",
        sendMessage: "Send Message",
        sending: "Sending...",
        sentSuccess: "Message Sent Successfully!",
        sentError: "Failed to send message. Please try again.",
        namePlaceholder: "Your Full Name",
        emailPlaceholder: "Your Email Address",
        subjectPlaceholder: "Project / Opportunity Subject",
        messagePlaceholder: "Describe your inquiry or engineering requirements...",
        nameLabel: "Your Name",
        emailLabel: "Your Email",
        subjectLabel: "Subject",
        messageLabel: "Message",
        discoveryDesc: "Schedule an introductory engineering consultation to discuss production architecture, MLOps, LLM systems, or hiring availability.",
        contactSubtitle: "I'm always open to discussing new projects, opportunities, or collaborations.",
        locationLabel: "Location",
        badgesLabel: "Badges",
        rightsReserved: "All rights reserved."
    },
    ar: {
        // Navigation & Header
        navHome: "الرئيسية",
        navAbout: "نبذة عني",
        navExperience: "الخبرات",
        navInternships: "التدريب",
        navSkills: "المهارات",
        navProjects: "المشاريع",
        navEducation: "التعليم",
        navCertifications: "الشهادات",
        navContact: "تواصل معي",
        navDiscovery: "استشارة",
        tourGuide: "جولة إرشادية",
        bookDiscoveryCall: "حجز استشارة تقنية",
        viewAs: "عرض كـ",
        switchMode: "تبديل العرض",
        devopsMode: "DevOps و MLOps",
        mlnlpMode: "الذكاء الاصطناعي وتعلم الآلة",

        // Hero & Info
        resume: "السيرة الذاتية",
        availableForRoles: "متاح للوظائف بدوام كامل، العمل عن بُعد، والعقود الاستشارية عالمياً",
        locationEgypt: "الإسكندرية، مصر",

        // Section Titles
        aboutTitle1: "نبذة",
        aboutTitle2: "عني",
        experienceTitle1: "الخبرات",
        experienceTitle2: "المهنية",
        internshipsTitle1: "فترات",
        internshipsTitle2: "التدريب",
        skillsTitle1: "المهارات",
        skillsTitle2: "التقنية",
        softSkillsTitle1: "المهارات",
        softSkillsTitle2: "الشخصية",
        projectsTitle1: "أبرز",
        projectsTitle2: "المشاريع",
        educationTitle1: "المسيرة",
        educationTitle2: "الأكاديمية",
        certificationsTitle1: "الشهادات",
        certificationsTitle2: "المعتمدة",
        coursesTitle1: "الدورات",
        coursesTitle2: "التدريبية",
        languagesTitle1: "إتقان",
        languagesTitle2: "اللغات",
        contactTitle1: "تواصل",
        contactTitle2: "معي",
        discoveryTitle1: "حجز",
        discoveryTitle2: "استشارة تقنية",

        // Common UI
        all: "الكل",
        liveDemo: "معاينة حية",
        githubRepo: "المستودع",
        verified: "موثق ✓",
        viewPdf: "عرض الملف PDF",
        filterBy: "تصفية حسب التصنيف",
        projectHighlights: "أبرز الإنجازات والمعمارية التقنية",
        sendMessage: "إرسال الرسالة",
        sending: "جاري الإرسال...",
        sentSuccess: "تم إرسال رسالتك بنجاح!",
        sentError: "تعذر الإرسال. يرجى المحاولة مرة أخرى.",
        namePlaceholder: "الاسم الكامل",
        emailPlaceholder: "البريد الإلكتروني",
        subjectPlaceholder: "موضوع الاستفسار أو المشروع",
        messagePlaceholder: "اكتب رسالتك أو متطلباتك الهندسية هنا...",
        nameLabel: "الاسم",
        emailLabel: "البريد الإلكتروني",
        subjectLabel: "الموضوع",
        messageLabel: "الرسالة",
        discoveryDesc: "احجز جلسة استشارية تقنية مباشرة لمناقشة بنيتك التحتية السحابية، مشاريع الذكاء الاصطناعي وLLMs، أو فرص التوظيف.",
        contactSubtitle: "يسعدني دائماً التواصل لمناقشة المشاريع الهندسية الجديدة، الفرص، والشراكات التقنية.",
        locationLabel: "الموقع الجغرافي",
        badgesLabel: "الشارات المعتمدة",
        rightsReserved: "جميع الحقوق محفوظة."
    }
};

const LanguageContext = createContext({
    language: LANGUAGES.EN,
    setLanguage: () => {},
    toggleLanguage: () => {},
    isRTL: false,
    t: () => ''
});

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState(() => {
        try {
            return localStorage.getItem('portfolio_lang') || LANGUAGES.EN;
        } catch (e) {
            return LANGUAGES.EN;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('portfolio_lang', language);
        } catch (e) {}

        const isArabic = language === LANGUAGES.AR;
        document.documentElement.lang = language;
        document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
        
        if (isArabic) {
            document.documentElement.classList.add('rtl-mode');
        } else {
            document.documentElement.classList.remove('rtl-mode');
        }
    }, [language]);

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === LANGUAGES.EN ? LANGUAGES.AR : LANGUAGES.EN));
    };

    const isRTL = language === LANGUAGES.AR;

    const t = (key) => {
        const langDict = translations[language] || translations.en;
        return langDict[key] || translations.en[key] || key;
    };

    const value = useMemo(() => ({
        language,
        setLanguage,
        toggleLanguage,
        isRTL,
        t
    }), [language]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
