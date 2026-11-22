import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, X, ChevronRight, ChevronLeft, Download, Volume2,
    VolumeX, Award, Sparkles, CheckCircle2,
    Layers, Cpu, ShieldCheck, Eye, ExternalLink, FileText, Bookmark
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Synthesize realistic paper-turn rustle sound effect via Web Audio API
function playPageTurnSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        // White noise burst shaped with dual-band filter for authentic paper friction
        const bufferSize = ctx.sampleRate * 0.14;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.14);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.008, ctx.currentTime + 0.14);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
    } catch {
        // Silently handled if audio policy blocks
    }
}

export const BOOKS_DATA = {
    volunteer: {
        id: 'volunteer',
        titleEn: 'Palestine Polytechnic University: AI Retinal Diagnosis',
        titleAr: 'جامعة بوليتكنك فلسطين: نظام تشخيص أمراض شبكية العين',
        subtitleEn: 'Published Academic Graduation Research Thesis (2025–2026)',
        subtitleAr: 'أطروحة مشروع تخرج هندسي معتمدة ومنشورة (2025–2026)',
        themeColor: 'from-emerald-600 via-teal-600 to-emerald-950',
        badge: 'Official Thesis Acknowledgement',
        badgeAr: 'شكر رسمي في الأطروحة الأكاديمية',
        coverColor: 'bg-gradient-to-br from-[#06241b] via-[#093527] to-[#041a13]',
        borderColor: 'border-emerald-500/60',
        pdfUrl: '/Books/AI-Powered%20Retinal%20OCT%20Disease%20Diagnosis%20and%20Analysis%20System.pdf',
        pageImages: {
            basePath: '/Books/retinal-oct-thesis/',
            totalPages: 65,
            prefix: 'page-',
            ext: '.webp'
        },
        pages: [
            {
                type: 'cover',
                tagEn: 'Academic Research & Volunteer Mentorship',
                tagAr: 'بحث أكاديمي وإشراف تقني تطوعي',
                titleEn: 'DEEP LEARNING FOR RETINAL OCT DISEASE DIAGNOSIS',
                titleAr: 'التعلم العميق لتشخيص أمراض شبكية العين',
                subtitleEn: 'Engineering Graduation Thesis Mentorship & Technical Guidance at Palestine Polytechnic University (PPU)',
                subtitleAr: 'الإشراف التقني والإرشاد البحثي لمشروع تخرج هندسي في جامعة بوليتكنك فلسطين',
                metaEn: [
                    { label: 'Remote Technical Mentor', value: 'Omar Mohamed Abdelsalam' },
                    { label: 'Institution', value: 'Palestine Polytechnic University (PPU)' },
                    { label: 'Location', value: 'Hebron, Palestine (Remote Mentorship)' },
                    { label: 'Scope', value: 'Deep Learning, CNNs, Transformers & MLOps' },
                    { label: 'Period', value: '2025 – 2026 Academic Year' }
                ],
                metaAr: [
                    { label: 'المرشد والمشرف التقني عن بُعد', value: 'عمر محمد عبد السلام' },
                    { label: 'الجامعة', value: 'جامعة بوليتكنك فلسطين (PPU)' },
                    { label: 'المقر', value: 'الخليل، فلسطين (إشراف تقني عن بُعد)' },
                    { label: 'المجال', value: 'التعلم العميق والشبكات العصبية و MLOps' },
                    { label: 'الفترة', value: 'العام الأكاديمي 2025 – 2026' }
                ]
            },
            {
                chapterEn: 'Chapter 1: The Clinical Challenge',
                chapterAr: 'الفصل الأول: التحدي الطبي والسريري',
                titleEn: 'Automated Retinal Pathology Detection',
                titleAr: 'الكشف الآلي المبكر عن اعتلالات الشبكية',
                contentEn: `Optical Coherence Tomography (OCT) is the gold standard imaging modality for diagnosing blinding retinal conditions such as:
• Choroidal Neovascularization (CNV)
• Diabetic Macular Edema (DME)
• Drusen (precursor to Age-Related Macular Degeneration)
• Normal retinal cross-sections

In resource-constrained medical centers across Palestine, access to specialized retinal ophthalmologists is critically scarce. Developing an automated, highly sensitive deep learning diagnostic platform capable of running inferences on commodity hospital hardware was an urgent clinical imperative.`,
                contentAr: `يعد التصوير المقطعي للترابط البصري (OCT) المعيار الذهبي لتشخيص أمراض الشبكية المسببة للعمى مثل:
• نمو الأوعية المشيمية غير الطبيعي (CNV)
• وذمة البقعة الصفراء السكرية (DME)
• التراكمات البروتينية (Drusen) المرتبطة بالتنكس البقعي
• صور الشبكية السليمة (NORMAL)

في ظل قلة أطباء العيون المتخصصين في المراكز الصحية الفلسطينية، كان بناء نظام تشخيص ذكي عالي الدقة يعمل على حواسيب المشافي مطلباً طبياً وإنسانياً عاجلاً.`,
                highlights: [
                    { icon: 'Eye', titleEn: 'High Sensitivity Goal', descEn: 'Minimizing false negatives to prevent irreversible vision loss' },
                    { icon: 'Cpu', titleEn: 'Edge Deployment', descEn: 'Optimized inference latency for local clinics without GPU clusters' }
                ]
            },
            {
                chapterEn: 'Chapter 2: Technical Advisory Scope',
                chapterAr: 'الفصل الثاني: نطاق الإشراف والدعم التقني',
                titleEn: 'Architectural Guidance & Model Tuning',
                titleAr: 'توجيه البنية العصبية وضبط نماذج الرؤية',
                contentEn: `As Remote Technical Mentor, Omar guided the university student research team through critical engineering hurdles:

1. Architecture Selection: Benchmarked deep residual backbones (ResNet-50, EfficientNet-B3/B4) against Vision Transformers (ViT) and TransUNet for subtle biomarker segmentation.
2. Combating Severe Class Imbalance: Formulated custom Weighted Focal Loss and engineered targeted data augmentation pipelines.
3. Explainable AI (XAI): Guided the integration of Grad-CAM++ heatmaps so clinicians could visually verify the pathological basis of each automated diagnosis.
4. Experiment Tracking: Instituted rigorous ML tracking pipelines with validation splits to prevent clinical data leakage.`,
                contentAr: `كمرشد تقني متطوع، وجّه عمر الفريق البحثي الطلابي خلال التحديات الهندسية المعقدة:
1. اختيار النماذج: مقارنة الشبكات العصبية الالتفافية (ResNet-50 و EfficientNet) مع Vision Transformers و TransUNet لتحديد تراكمات السوائل في الشبكية.
2. معالجة اختلال توازن البيانات: تطبيق Weighted Focal Loss وتطوير خطوط معالجة وتوليد بيانات طبية معدلة.
3. الذكاء الاصطناعي القابل للتفسير (XAI): دمج خرائط Grad-CAM++ لتمكين الأطباء من معاينة بؤرة الشك التي بنى عليها النموذج تشخيصه.
4. تتبع التجارب والتحقق الصارم لضمان عدم حدوث تسريب في البيانات الطبية (Data Leakage).`,
                highlights: [
                    { icon: 'Layers', titleEn: 'Grad-CAM++ Explainability', descEn: 'Clinical trust through visual attention heatmaps' },
                    { icon: 'ShieldCheck', titleEn: 'Focal Loss Regularization', descEn: 'Robust classification of rare and early-stage pathologies' }
                ]
            },
            {
                chapterEn: 'Chapter 3: Benchmarks & Clinical Validation',
                chapterAr: 'الفصل الثالث: نتائج الاختبار والتقييم السريري',
                titleEn: 'Diagnostic Metrics & ROC Evaluation',
                titleAr: 'مؤشرات الأداء ومنحنيات ROC',
                contentEn: `Through iterative feedback, hyperparameter tuning, and cross-validation on the Kermany 2018 benchmark dataset:

• Overall Classification Accuracy reached 91.8% on raw scans and 94.3% with the Grad-CAM++ EfficientNet-B3 backbone.
• TransUNet segmentation accurately localized intra-retinal and sub-retinal fluid accumulation in DME and CNV cases.
• The system was packaged into a clinician-friendly web platform for uploading OCT scans and generating instant visual diagnostic reports.`,
                contentAr: `من خلال جولات المراجعة المستمرة وضبط المعاملات والتحقق المتقاطع على مجموعة بيانات كرماني 2018:
• حقق النموذج دقة تصنيف 91.8% ووصلت إلى 94.3% عبر نموذج EfficientNet-B3 المدعوم بـ Grad-CAM++.
• نجح نموذج TransUNet في تحديد قياسات دقيقة لتراكم السوائل تحت الشبكية في حالات CNV و DME.
• تم نشر المنظومة عبر منصة ويب تفاعلية متكاملة تتيح لأطباء العيون رفع المسوحات ومراجعة التحليلات وإدارة سجلات المرضى.`,
                metrics: [
                    { label: 'Model Accuracy', val: '94.3%' },
                    { label: 'Dataset Scans', val: '84,000+' },
                    { label: 'Segmentation', val: 'TransUNet' }
                ]
            },
            {
                chapterEn: 'Chapter 4: Official Thesis Acknowledgement',
                chapterAr: 'الفصل الرابع: خطاب الشكر والتقدير الرسمي',
                titleEn: 'Official Academic Acknowledgement in Thesis',
                titleAr: 'التوثيق والشكر الرسمي بالأطروحة الجامعية',
                contentEn: `In recognition of this dedicated voluntary contribution, the engineering research team and faculty at Palestine Polytechnic University officially recognized Omar Mohamed Abdelsalam in the published graduation thesis acknowledgements (Page i):

"Special thanks to Omar Mohamed Abdelsalam Bassiouny Gad, a Software Engineer from Egypt, for his remote support and guidance. His expertise, generosity in sharing knowledge played a significant role in the development and success of this work."

This project stands as a testament to engineering solidarity, knowledge sharing, and leveraging AI for human welfare and healthcare accessibility.`,
                contentAr: `تقديراً لهذا العطاء التقني التطوعي المتواصل، قام الفريق البحثي وأعضاء هيئة التدريس بجامعة بوليتكنك فلسطين بتوثيق الشكر والتقدير رسمياً للمهندس عمر محمد عبد السلام في صفحة الإهداء والشكر بالأطروحة الأكاديمية المنشورة (صفحة i):

"Special thanks to Omar Mohamed Abdelsalam Bassiouny Gad, a Software Engineer from Egypt, for his remote support and guidance. His expertise, generosity in sharing knowledge played a significant role in the development and success of this work."

يمثل هذا العمل تجسيداً لقيم التضامن الإنساني والعطاء العلمي وتسخير الذكاء الاصطناعي لخدمة صحة الإنسان.`,
                verdict: {
                    grade: 'OFFICIAL THESIS ACKNOWLEDGEMENT',
                    status: 'Published Academic Graduation Research',
                    accreditation: 'Palestine Polytechnic University (PPU)',
                    date: '2025 – 2026'
                }
            }
        ]
    },
    graduation: {
        id: 'graduation',
        titleEn: 'HistoryVerse: AI & AR Virtual Museum Guide',
        titleAr: 'مشروع التخرج: مرشد المتاحف الذكي HistoryVerse',
        subtitleEn: 'Bachelor Graduation Thesis · Grade: A+ (Distinction)',
        subtitleAr: 'أطروحة مشروع تخرج البكالوريوس · امتياز مع مرتبة الشرف (A+)',
        themeColor: 'from-amber-600 via-yellow-600 to-amber-900',
        badge: 'Grade A+ (Distinction)',
        badgeAr: 'درجة A+ (امتياز)',
        coverColor: 'bg-gradient-to-br from-[#0b192e] via-[#0d2342] to-[#081326]',
        borderColor: 'border-amber-500/60',
        pdfUrl: '/documents/HistoryVerse-Graduation-Expose.pdf',
        pageImages: {
            basePath: '/documents/historyverse-pages/',
            totalPages: 3,
            prefix: 'page-0',
            ext: '.webp'
        },
        pages: [
            {
                type: 'cover',
                tagEn: 'B.Sc. Graduation Project',
                tagAr: 'مشروع تخرج البكالوريوس',
                titleEn: 'HISTORYVERSE',
                titleAr: 'هيستوري فيرس',
                subtitleEn: 'AI-Powered Virtual Museum Tour with Multilingual Human-Like Interaction & AR Reconstruction',
                subtitleAr: 'منصة متاحف ذكية مدعومة بالذكاء الاصطناعي التوليدي والواقع المعزز والتفاعل الصوتي متعدد اللغات',
                metaEn: [
                    { label: 'Student / AI Lead', value: 'Omar Mohamed Abdelsalam' },
                    { label: 'Academic Supervisor', value: 'Dr. Mahmoud Gamal' },
                    { label: 'Institution', value: 'Higher Institute of Engineering & Technology (BHI)' },
                    { label: 'Evaluation Grade', value: 'A+ (Highest Distinction)' },
                    { label: 'Defense Year', value: 'July 2024 · Alexandria, Egypt' }
                ],
                metaAr: [
                    { label: 'الطالب ومطور الذكاء الاصطناعي', value: 'عمر محمد عبد السلام' },
                    { label: 'المشرف الأكاديمي', value: 'د. محمود جمال' },
                    { label: 'الجهة الأكاديمية', value: 'المعهد العالي للهندسة والتكنولوجيا (BHI)' },
                    { label: 'التقدير النهائي', value: 'امتياز مرتفع A+' },
                    { label: 'عام المناقشة', value: 'يوليو 2024 · الإسكندرية، مصر' }
                ]
            },
            {
                chapterEn: 'Chapter 1: Problem Statement & Vision',
                chapterAr: 'الفصل الأول: بيان المشكلة والرؤية',
                titleEn: 'The Challenge of Traditional Museums',
                titleAr: 'تحديات المتاحف التقليدية وتراجع التفاعل',
                contentEn: `Traditional museum visits suffer from static placards and one-size-fits-all audio guides that fail to deeply engage visitors or provide tailored historical context. Modern visitors demand interactive, adaptive, and multilingual cultural experiences.

HistoryVerse was architected to bridge this gap: turning passive sightseeing into an active, multi-agent AI expedition where artifacts converse, history comes alive in 3D AR, and visitors receive personalized intelligent tour curation.`,
                contentAr: `تعاني الجولات التقليدية في المتاحف من اللوحات التعريفية الثابتة والمرشدين الصوتيين محدودي التفاعل.

تم تصميم HistoryVerse لسد هذه الفجوة: تحويل الزيارة من مجرد مشاهدة صامتة إلى رحلة استكشافية ذكية تفاعلية يتحدث فيها الأثر التاريخي بالصوت الحي والواقع المعزز، مع مسارات مخصصة لكل زائر.`,
                highlights: [
                    { icon: 'Zap', titleEn: 'Real-Time Engagement', descEn: 'Direct Q&A with historical figures through conversational LLMs' },
                    { icon: 'Eye', titleEn: 'Computer Vision', descEn: 'Instant statue recognition even when labels are missing' },
                    { icon: 'Layers', titleEn: 'Augmented Reality', descEn: '3D ARCore model overlays directly in the camera viewport' }
                ]
            },
            {
                chapterEn: 'Chapter 2: System Architecture',
                chapterAr: 'الفصل الثاني: البنية المعمارية للنظام',
                titleEn: 'Decoupled Microservices & Cloud Stack',
                titleAr: 'بنية الخدمات المصغرة السحابية الموزعة',
                contentEn: `HistoryVerse implements a robust microservices architecture ensuring high availability, modular maintenance, and zero single points of failure across web, mobile, and AI engines:`,
                contentAr: `تعتمد منظومة HistoryVerse على معمارية خدمات مصغرة (Microservices) لضمان الاستمرارية العالية وقابلية التوسع السلس وتفادي نقاط الفشل الفردية:`,
                architectureItems: [
                    { name: 'AI & NLP Core', stack: 'Python · LangChain · ChromaDB · Gemini / LLaMA API', desc: 'RAG knowledge retrieval over verified historical archives with speech synthesis.' },
                    { name: 'Vision Pipeline', stack: 'PyTorch · YOLOv5 & Vision Transformers', desc: '90–96% artifact detection and classification accuracy under diverse museum lighting.' },
                    { name: 'App Services', stack: '.NET Core & Django REST Framework', desc: 'High-throughput catalog endpoints, identity auth, and booking engines.' },
                    { name: 'Cloud & Infrastructure', stack: 'AWS Fargate · Terraform · Docker · Firebase', desc: 'Auto-scaling containerized microservices managed via Infrastructure as Code.' }
                ],
                testMetric: '204 Passing Automated Tests · Zero Production Downtime'
            },
            {
                chapterEn: 'Chapter 3: Results, Defense & Evaluation',
                chapterAr: 'الفصل الثالث: النتائج والمناقشة والتقييم',
                titleEn: 'Final Evaluation: Grade A+ (Distinction)',
                titleAr: 'التقييم الأكاديمي النهائي: امتياز مرتفع A+',
                contentEn: `HistoryVerse was rigorously evaluated and defended before the academic examination board at the Higher Institute of Engineering & Technology (BHI).

The committee commended the project's technical rigor, end-to-end cloud production deployment on AWS Fargate, high computer vision accuracy, and seamless integration of cutting-edge Generative AI with Augmented Reality.

The project was officially awarded the top grade of A+ (Distinction) and recognized as one of the most innovative engineering graduation works of the academic year.`,
                contentAr: `تمت مناقشة وتقييم مشروع HistoryVerse أمام لجنة التحكيم الأكاديمية بالمعهد العالي للهندسة والتكنولوجيا.

أشادت اللجنة بالعمق الهندسي للمشروع، ونشره الإنتاجي الكامل على سحابة AWS Fargate، وتكامله السلس بين الذكاء الاصطناعي التوليدي والواقع المعزز.

تم منح المشروع رسمياً أعلى تقدير: امتياز مع مرتبة الشرف A+، واعتبر من أبرز مشاريع التخرج الابتكارية لذلك العام.`,
                verdict: {
                    grade: 'GRADE A+ (DISTINCTION)',
                    status: 'Officially Approved & Defended',
                    accreditation: 'Bachelor of Science in Computer Engineering',
                    date: 'July 2024'
                }
            }
        ]
    }
};

export default function ThreeDBookModal() {
    const { isRTL } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState('volunteer');
    const [viewMode, setViewMode] = useState('pages'); // 'pages' = authentic 2-page book spread, 'summary' = interactive chapter cards
    const [spreadIndex, setSpreadIndex] = useState(0); // 0-based spread for 2-page layout
    const [mobilePage, setMobilePage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isFlipping, setIsFlipping] = useState(false);
    const [flipDirection, setFlipDirection] = useState('next');
    const modalRef = useRef(null);

    const activeBook = BOOKS_DATA[selectedBookId];
    const totalBookPages = activeBook?.pageImages?.totalPages || 65;
    // For 2-page spread: Spread 0 is Page 1 on right, Spread 1 is Page 2 & 3, Spread 2 is Page 4 & 5 ...
    const totalSpreads = Math.ceil((totalBookPages + 1) / 2);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Listen for custom trigger event
    useEffect(() => {
        const handleOpenBook = (e) => {
            const requestedBook = e?.detail?.bookId;
            if (requestedBook && BOOKS_DATA[requestedBook]) {
                setSelectedBookId(requestedBook);
            }
            if (typeof e?.detail?.pageIndex === 'number') {
                setSpreadIndex(Math.floor(e.detail.pageIndex / 2));
                setMobilePage(Math.max(1, e.detail.pageIndex));
            } else {
                setSpreadIndex(0);
                setMobilePage(1);
            }
            // Default to 'pages' mode for authentic open book experience matching user reference
            setViewMode('pages');
            setIsOpen(true);
            if (soundEnabled) playPageTurnSound();
        };

        window.addEventListener('open-3d-book', handleOpenBook);
        return () => window.removeEventListener('open-3d-book', handleOpenBook);
    }, [soundEnabled]);

    // Handle keyboard arrow navigation
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') {
                goNext();
            } else if (e.key === 'ArrowLeft') {
                goPrev();
            } else if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, spreadIndex, mobilePage, isMobile, totalSpreads, totalBookPages]);

    const goNext = useCallback(() => {
        if (isFlipping) return;
        if (isMobile) {
            if (mobilePage < totalBookPages) {
                setIsFlipping(true);
                setFlipDirection('next');
                if (soundEnabled) playPageTurnSound();
                setTimeout(() => {
                    setMobilePage((prev) => Math.min(totalBookPages, prev + 1));
                    setIsFlipping(false);
                }, 220);
            }
        } else {
            if (spreadIndex < totalSpreads - 1) {
                setIsFlipping(true);
                setFlipDirection('next');
                if (soundEnabled) playPageTurnSound();
                setTimeout(() => {
                    setSpreadIndex((prev) => Math.min(totalSpreads - 1, prev + 1));
                    setIsFlipping(false);
                }, 220);
            }
        }
    }, [isMobile, mobilePage, totalBookPages, spreadIndex, totalSpreads, isFlipping, soundEnabled]);

    const goPrev = useCallback(() => {
        if (isFlipping) return;
        if (isMobile) {
            if (mobilePage > 1) {
                setIsFlipping(true);
                setFlipDirection('prev');
                if (soundEnabled) playPageTurnSound();
                setTimeout(() => {
                    setMobilePage((prev) => Math.max(1, prev - 1));
                    setIsFlipping(false);
                }, 220);
            }
        } else {
            if (spreadIndex > 0) {
                setIsFlipping(true);
                setFlipDirection('prev');
                if (soundEnabled) playPageTurnSound();
                setTimeout(() => {
                    setSpreadIndex((prev) => Math.max(0, prev - 1));
                    setIsFlipping(false);
                }, 220);
            }
        }
    }, [isMobile, mobilePage, spreadIndex, isFlipping, soundEnabled]);

    const switchBook = (bookId) => {
        if (bookId !== selectedBookId) {
            setSelectedBookId(bookId);
            setSpreadIndex(0);
            setMobilePage(1);
            if (soundEnabled) playPageTurnSound();
        }
    };

    const jumpToAcknowledgment = () => {
        // Page 2 is the official acknowledgment page
        if (isMobile) {
            setMobilePage(2);
        } else {
            setSpreadIndex(1); // Spread 1 has Left = Page 2, Right = Page 3
        }
        if (soundEnabled) playPageTurnSound();
    };

    if (!isOpen) return null;

    // Determine left and right page numbers for current spread
    // Spread 0: Left = null (Inside Cover), Right = Page 1
    // Spread 1: Left = Page 2, Right = Page 3
    // Spread k: Left = 2k, Right = 2k + 1
    const leftPageNum = spreadIndex === 0 ? null : spreadIndex * 2;
    const rightPageNum = spreadIndex === 0 ? 1 : spreadIndex * 2 + 1;

    const formatPageSrc = (pageNum) => {
        if (!pageNum || pageNum > totalBookPages) return null;
        const prefix = activeBook.pageImages.prefix || 'page-';
        const padded = String(pageNum).padStart(2, '0');
        return `${activeBook.pageImages.basePath}${prefix}${padded}${activeBook.pageImages.ext}`;
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] bg-[#070b14]/95 backdrop-blur-2xl flex flex-col items-center justify-between p-2 sm:p-4 md:p-6 overflow-hidden select-none"
            >
                {/* Background Ambient Glow */}
                <div className={`absolute w-[600px] h-[600px] rounded-full blur-[160px] opacity-20 pointer-events-none ${
                    selectedBookId === 'volunteer' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />

                {/* ============================================================= */}
                {/* TOP HEADER CONTROLS BAR */}
                {/* ============================================================= */}
                <div className="relative z-30 w-full max-w-6xl flex flex-wrap items-center justify-between gap-2.5 mb-2 px-1">
                    {/* Left: Book Switcher Tabs */}
                    <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/60 p-1 rounded-full shadow-lg">
                        <button
                            onClick={() => switchBook('volunteer')}
                            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer touch-manipulation ${
                                selectedBookId === 'volunteer'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-md shadow-emerald-500/25'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                            }`}
                        >
                            <span>🤝</span>
                            <span className="hidden sm:inline">PPU Retinal AI Thesis (Volunteer)</span>
                            <span className="sm:hidden">Retinal Thesis</span>
                            <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono">65p</span>
                        </button>

                        <button
                            onClick={() => switchBook('graduation')}
                            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer touch-manipulation ${
                                selectedBookId === 'graduation'
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                            }`}
                        >
                            <span>🎓</span>
                            <span className="hidden sm:inline">HistoryVerse (Graduation A+)</span>
                            <span className="sm:hidden">HistoryVerse</span>
                        </button>
                    </div>

                    {/* Center: View Mode Toggle & Quick Jump */}
                    <div className="flex items-center gap-2">
                        {selectedBookId === 'volunteer' && (
                            <button
                                onClick={jumpToAcknowledgment}
                                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/25 transition-all text-xs font-semibold cursor-pointer shadow-sm animate-pulse"
                                title="Jump directly to Page 2 where Omar Mohamed is officially acknowledged in the thesis"
                            >
                                <Bookmark size={13} className="text-emerald-400" />
                                <span>⭐ Official Acknowledgment (Page 2)</span>
                            </button>
                        )}

                        <div className="flex items-center bg-slate-900/90 border border-slate-700/60 p-0.5 rounded-full">
                            <button
                                onClick={() => setViewMode('pages')}
                                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                                    viewMode === 'pages'
                                        ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <BookOpen size={13} />
                                <span>2-Page Spread</span>
                            </button>
                            <button
                                onClick={() => setViewMode('summary')}
                                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                                    viewMode === 'summary'
                                        ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Sparkles size={13} />
                                <span>Summary</span>
                            </button>
                        </div>
                    </div>

                    {/* Right: Actions (Download, Audio, Close) */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Audio Toggle */}
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="p-2 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                            title={soundEnabled ? 'Mute Page Flip Audio' : 'Enable Page Flip Audio'}
                            aria-label="Sound Toggle"
                        >
                            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                        </button>

                        {/* Download Original PDF */}
                        {activeBook.pdfUrl && (
                            <a
                                href={activeBook.pdfUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
                                title="Download Full Official Thesis PDF Document"
                            >
                                <Download size={13} />
                                <span className="hidden sm:inline">Download PDF</span>
                            </a>
                        )}

                        {/* Close Window */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-full bg-red-600/90 text-white hover:bg-red-500 active:scale-95 transition-all shadow-md cursor-pointer ml-1"
                            title="Close Book Reader"
                            aria-label="Close Book Reader"
                        >
                            <X size={17} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* ============================================================= */}
                {/* MAIN 3D OPEN BOOK STAGE (MATCHING USER'S REALISTIC BOOK SPREAD) */}
                {/* ============================================================= */}
                <div
                    ref={modalRef}
                    className="relative z-10 w-full max-w-6xl flex-1 flex items-center justify-center px-1 sm:px-4 py-1"
                    style={{ perspective: '2000px' }}
                >
                    {viewMode === 'pages' ? (
                        /* REAL 2-PAGE SPREAD PHYSICAL BOOK CONTAINER */
                        <div className="relative w-full max-w-[1080px] h-[520px] xs:h-[560px] sm:h-[620px] md:h-[680px] lg:h-[720px] max-h-[calc(100dvh-140px)] flex items-center justify-center">

                            {/* Outer Floating Navigation: Previous Spread */}
                            <button
                                onClick={goPrev}
                                disabled={isMobile ? mobilePage <= 1 : spreadIndex <= 0}
                                className={`absolute left-0 sm:-left-6 md:-left-10 z-40 p-2 sm:p-3 rounded-full bg-slate-900/90 border border-slate-700/80 text-white shadow-2xl transition-all cursor-pointer ${
                                    (isMobile ? mobilePage <= 1 : spreadIndex <= 0)
                                        ? 'opacity-20 cursor-not-allowed pointer-events-none'
                                        : 'hover:scale-110 active:scale-95 hover:bg-emerald-500 hover:text-slate-950'
                                }`}
                                aria-label="Previous Page"
                                title="Previous Page (◄ Arrow Left)"
                            >
                                <ChevronLeft size={20} strokeWidth={2.5} />
                            </button>

                            {/* Outer Floating Navigation: Next Spread */}
                            <button
                                onClick={goNext}
                                disabled={isMobile ? mobilePage >= totalBookPages : spreadIndex >= totalSpreads - 1}
                                className={`absolute right-0 sm:-right-6 md:-right-10 z-40 p-2 sm:p-3 rounded-full bg-slate-900/90 border border-slate-700/80 text-white shadow-2xl transition-all cursor-pointer ${
                                    (isMobile ? mobilePage >= totalBookPages : spreadIndex >= totalSpreads - 1)
                                        ? 'opacity-20 cursor-not-allowed pointer-events-none'
                                        : 'hover:scale-110 active:scale-95 hover:bg-emerald-500 hover:text-slate-950'
                                }`}
                                aria-label="Next Page"
                                title="Next Page (► Arrow Right)"
                            >
                                <ChevronRight size={20} strokeWidth={2.5} />
                            </button>

                            {/* PHYSICAL HARDCOVER BOOK SPREAD FRAME */}
                            <div
                                className="relative w-full h-full rounded-2xl bg-[#faf9f5] border border-[#d2cebf] flex overflow-hidden transition-all duration-300"
                                style={{
                                    boxShadow: `
                                        0 1px 2px rgba(0, 0, 0, 0.15),
                                        0 6px 0 -2px #f4f3ec,
                                        0 7px 1px -2px rgba(0, 0, 0, 0.15),
                                        0 12px 0 -4px #ebe9e1,
                                        0 13px 2px -4px rgba(0, 0, 0, 0.2),
                                        0 25px 45px -10px rgba(0, 0, 0, 0.75)
                                    `
                                }}
                            >
                                {/* Center Book Spine Gutter Shadow (Creates realistic 3D depth down the center crease) */}
                                {!isMobile && (
                                    <>
                                        {/* Center Vertical Deep Crease Line */}
                                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-black/25 z-30 pointer-events-none" />

                                        {/* Central Spine Shadow Gradient spanning Left and Right pages */}
                                        <div
                                            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[70px] pointer-events-none z-20"
                                            style={{
                                                background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.06) 30%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.06) 70%, rgba(0,0,0,0) 100%)'
                                            }}
                                        />
                                    </>
                                )}

                                {/* Outer Paper Edge Subtle Shading */}
                                <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/10 to-transparent pointer-events-none z-20" />
                                <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-l from-black/10 to-transparent pointer-events-none z-20" />

                                {/* --------------------------------------------------------- */}
                                {/* DESKTOP VIEW: DUAL-PAGE SPREAD (LEFT & RIGHT)            */}
                                {/* --------------------------------------------------------- */}
                                {!isMobile ? (
                                    <div className="w-full h-full flex">
                                        {/* LEFT PAGE */}
                                        <div
                                            onClick={goPrev}
                                            className="w-1/2 h-full relative overflow-hidden bg-[#faf9f5] flex flex-col justify-between p-3 sm:p-5 md:p-6 border-r border-[#e3dfd3] cursor-pointer group"
                                            title="Click left page to flip backward"
                                        >
                                            {/* Top Academic Header */}
                                            <div className="flex items-center justify-between pb-1.5 border-b border-black/10 text-[11px] font-serif text-slate-600 select-none">
                                                <span>{leftPageNum ? `Palestine Polytechnic University • Page ${leftPageNum}` : 'Palestine Polytechnic University'}</span>
                                                <span className="font-semibold">{leftPageNum ? leftPageNum : '—'}</span>
                                            </div>

                                            {/* Page Content Viewport */}
                                            <div className="flex-1 w-full flex items-center justify-center overflow-hidden py-1">
                                                {leftPageNum ? (
                                                    <img
                                                        src={formatPageSrc(leftPageNum)}
                                                        alt={`Thesis Page ${leftPageNum}`}
                                                        className="w-full h-full object-contain filter contrast-[1.02] shadow-sm select-none"
                                                        loading="eager"
                                                    />
                                                ) : (
                                                    /* Inside Front Cover / Academic Seal */
                                                    <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-[#f5f3eb] to-[#e8e4d5] rounded-xl border border-black/5 shadow-inner">
                                                        <div className="w-20 h-20 rounded-full border-2 border-emerald-600/30 flex items-center justify-center bg-white shadow-md mb-4">
                                                            <Award size={40} className="text-emerald-700" />
                                                        </div>
                                                        <h3 className="font-serif font-black text-lg text-slate-800 tracking-wide uppercase mb-1">
                                                            Palestine Polytechnic University
                                                        </h3>
                                                        <p className="font-serif text-xs text-slate-600 italic max-w-xs mb-3">
                                                            College of Information Technology & Computer Engineering
                                                        </p>
                                                        <div className="text-[11px] font-sans font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
                                                            Official Graduation Thesis · 2025–2026
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bottom Page Footer */}
                                            <div className="pt-1 border-t border-black/10 flex items-center justify-between text-[10px] font-serif text-slate-500">
                                                <span>{leftPageNum ? `AI-Powered Retinal OCT Diagnosis` : 'Cover'}</span>
                                                <span>{leftPageNum ? `${leftPageNum}` : ''}</span>
                                            </div>

                                            {/* Left Page Inner Spine Shadow */}
                                            <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-black/15 to-transparent pointer-events-none" />
                                        </div>

                                        {/* RIGHT PAGE */}
                                        <div
                                            onClick={goNext}
                                            className="w-1/2 h-full relative overflow-hidden bg-[#faf9f5] flex flex-col justify-between p-3 sm:p-5 md:p-6 cursor-pointer group"
                                            title="Click right page to flip forward"
                                        >
                                            {/* Top Academic Header */}
                                            <div className="flex items-center justify-between pb-1.5 border-b border-black/10 text-[11px] font-serif text-slate-600 select-none">
                                                <span className="font-semibold">{rightPageNum}</span>
                                                <span>{rightPageNum === 1 ? 'Title & Cover' : `Department of Computer Science • Page ${rightPageNum}`}</span>
                                            </div>

                                            {/* Page Content Viewport */}
                                            <div className="flex-1 w-full flex items-center justify-center overflow-hidden py-1">
                                                {rightPageNum <= totalBookPages ? (
                                                    <img
                                                        src={formatPageSrc(rightPageNum)}
                                                        alt={`Thesis Page ${rightPageNum}`}
                                                        className="w-full h-full object-contain filter contrast-[1.02] shadow-sm select-none"
                                                        loading="eager"
                                                    />
                                                ) : (
                                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 font-serif">
                                                        <span>End of Document</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bottom Page Footer */}
                                            <div className="pt-1 border-t border-black/10 flex items-center justify-between text-[10px] font-serif text-slate-500">
                                                <span>{rightPageNum}</span>
                                                <span>{activeBook.titleEn}</span>
                                            </div>

                                            {/* Right Page Inner Spine Shadow */}
                                            <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/15 to-transparent pointer-events-none" />
                                        </div>
                                    </div>
                                ) : (
                                    /* --------------------------------------------------------- */
                                    /* MOBILE VIEW: SINGLE PAGE DISPLAY WITH SPINE BINDING SHADOW */
                                    /* --------------------------------------------------------- */
                                    <div className="w-full h-full relative overflow-hidden bg-[#faf9f5] flex flex-col justify-between p-3 sm:p-5">
                                        <div className="flex items-center justify-between pb-1.5 border-b border-black/10 text-xs font-serif text-slate-700">
                                            <span className="font-bold text-emerald-800">Page {mobilePage} of {totalBookPages}</span>
                                            <span className="text-[11px] text-slate-500 font-sans">{activeBook.badge}</span>
                                        </div>

                                        <div className="flex-1 w-full flex items-center justify-center overflow-hidden py-1">
                                            <img
                                                src={formatPageSrc(mobilePage)}
                                                alt={`Thesis Page ${mobilePage}`}
                                                className="w-full h-full object-contain filter contrast-[1.02]"
                                                loading="eager"
                                            />
                                        </div>

                                        <div className="pt-1 border-t border-black/10 flex items-center justify-between text-[11px] font-serif text-slate-600">
                                            <span>Palestine Polytechnic University</span>
                                            <span className="font-bold">{mobilePage}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* ============================================================= */
                        /* EXECUTIVE SUMMARY VIEW: STRUCTURED BILINGUAL CHAPTER CARDS     */
                        /* ============================================================= */
                        <div
                            className={`relative w-full max-w-[880px] h-[520px] xs:h-[560px] sm:h-[620px] rounded-2xl ${activeBook.coverColor} border-2 ${activeBook.borderColor} shadow-2xl flex flex-col overflow-hidden transition-all duration-300`}
                        >
                            <div className="p-4 sm:p-7 md:p-9 flex flex-col justify-between h-full overflow-y-auto">
                                <div>
                                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-xs font-mono text-slate-400">
                                        <span className={selectedBookId === 'volunteer' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                                            {isRTL ? activeBook.pages[1].chapterAr : activeBook.pages[1].chapterEn}
                                        </span>
                                        <span>Official Published Thesis Summary</span>
                                    </div>

                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-3">
                                        {isRTL ? activeBook.pages[1].titleAr : activeBook.pages[1].titleEn}
                                    </h2>

                                    <div className="text-slate-200 text-xs sm:text-sm md:text-[15px] leading-relaxed whitespace-pre-line mb-4 font-normal">
                                        {isRTL ? activeBook.pages[1].contentAr : activeBook.pages[1].contentEn}
                                    </div>

                                    {/* Highlights Row */}
                                    {activeBook.pages[1].highlights && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3">
                                            {activeBook.pages[1].highlights.map((h, i) => (
                                                <div key={i} className="bg-black/40 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 font-bold text-xs text-emerald-300">
                                                        <CheckCircle2 size={14} className="text-emerald-400" />
                                                        <span>{h.titleEn}</span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-300 leading-snug">{h.descEn}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Official Acknowledgment Blockquote */}
                                    <div className="mt-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-100">
                                        <div className="font-bold text-xs uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                                            <Award size={14} />
                                            <span>Official Thesis Acknowledgment Citation</span>
                                        </div>
                                        <p className="text-xs sm:text-sm italic font-serif leading-relaxed">
                                            "Special thanks to Omar Mohamed Abdelsalam Bassiouny Gad, a Software Engineer from Egypt, for his remote support and guidance. His expertise, generosity in sharing knowledge played a significant role in the development and success of this work."
                                        </p>
                                        <div className="text-[11px] text-slate-400 mt-2 font-sans">
                                            — Palestine Polytechnic University Thesis Board (Supervisor: Dr. Hashem Tamimi)
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                                    <button
                                        onClick={() => setViewMode('pages')}
                                        className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer hover:bg-emerald-400 shadow-md"
                                    >
                                        <BookOpen size={14} />
                                        <span>Open Full 2-Page Book Spread</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ============================================================= */}
                {/* BOTTOM SCRUBBER & PAGE INDICATOR BAR                          */}
                {/* ============================================================= */}
                <div className="relative z-30 w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-xl text-xs text-slate-300">
                    {/* Left: Spread / Page Counter */}
                    <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-emerald-400">
                            {!isMobile ? (
                                spreadIndex === 0
                                    ? 'Cover • Page 1'
                                    : `Pages ${leftPageNum} – ${Math.min(rightPageNum, totalBookPages)} of ${totalBookPages}`
                            ) : (
                                `Page ${mobilePage} of ${totalBookPages}`
                            )}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 hidden xs:inline">{activeBook.badge}</span>
                    </div>

                    {/* Center: Slider Scrubber */}
                    <div className="flex items-center gap-2 w-full sm:w-64">
                        <input
                            type="range"
                            min={0}
                            max={isMobile ? totalBookPages : totalSpreads - 1}
                            value={isMobile ? mobilePage : spreadIndex}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (isMobile) {
                                    setMobilePage(Math.max(1, val));
                                } else {
                                    setSpreadIndex(val);
                                }
                                if (soundEnabled) playPageTurnSound();
                            }}
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                            title="Scrub across thesis pages"
                        />
                    </div>

                    {/* Right: Quick Page Flippers */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={goPrev}
                            disabled={isMobile ? mobilePage <= 1 : spreadIndex <= 0}
                            className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 cursor-pointer font-bold"
                        >
                            ◄
                        </button>
                        <button
                            onClick={goNext}
                            disabled={isMobile ? mobilePage >= totalBookPages : spreadIndex >= totalSpreads - 1}
                            className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 cursor-pointer font-bold"
                        >
                            ►
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
