import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, X, ChevronRight, ChevronLeft, Download, Volume2,
    VolumeX, Award, Sparkles, CheckCircle2,
    Layers, Cpu, ShieldCheck, Eye, ExternalLink, FileText, Bookmark,
    MoveHorizontal
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
        themeColor: 'from-cyan-600 via-blue-600 to-slate-950',
        badge: 'Official Thesis Acknowledgement',
        badgeAr: 'شكر رسمي في الأطروحة الأكاديمية',
        coverColor: 'bg-gradient-to-br from-[#071d2b] via-[#0a2f46] to-[#05141e]',
        borderColor: 'border-cyan-500/60',
        pdfUrl: '/Books/AI-Powered%20Retinal%20OCT%20Disease%20Diagnosis%20and%20Analysis%20System.pdf',
        pageImages: {
            basePath: '/Books/retinal-oct-thesis/',
            totalPages: 65,
            prefix: 'page-',
            ext: '.webp'
        },
        chapters: [
            {
                id: 'ch1',
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
                id: 'ch2',
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
                id: 'ch3',
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
                id: 'ch4',
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
            prefix: 'page-',
            ext: '.webp'
        },
        chapters: [
            {
                id: 'ch1',
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
                id: 'ch2',
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
                id: 'ch3',
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

/**
 * Single authentic book page rendering component
 */
function SinglePage({
    pageNum,
    totalBookPages,
    activeBook,
    formatPageSrc,
    side, // 'left' | 'right'
    isInteractive = false,
    onClick,
    onMouseDown,
    isDragging = false
}) {
    if (!pageNum || pageNum > totalBookPages) {
        // Authentic blank endpaper for the back inside cover
        return (
            <div className={`w-full h-full relative overflow-hidden bg-[#faf9f5] flex flex-col justify-between p-3 sm:p-5 md:p-6 select-none ${
                side === 'left' ? 'border-r border-[#e2ded2]' : ''
            }`}>
                <div className="flex items-center justify-between pb-1.5 border-b border-black/10 text-[10px] sm:text-[11px] font-serif text-slate-400">
                    <span>{activeBook?.titleEn}</span>
                    <span>End of Document</span>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-serif text-xs gap-2">
                    <BookOpen size={28} className="opacity-25" />
                    <span className="italic">Official Academic Research Archive</span>
                </div>
                <div className="pt-1 border-t border-black/10 text-[9px] font-serif text-slate-400 text-center">
                    Palestine Polytechnic University · 2025–2026
                </div>
            </div>
        );
    }

    const src = formatPageSrc(pageNum);

    return (
        <div
            onClick={onClick}
            onMouseDown={onMouseDown}
            className={`w-full h-full relative overflow-hidden bg-[#faf9f5] flex flex-col justify-between p-2 sm:p-4 md:p-5 select-none ${
                side === 'left' ? 'border-r border-[#e2ded2]' : ''
            } ${isInteractive ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
            title={isInteractive ? (side === 'right' ? 'Drag or click to flip forward' : 'Drag or click to flip backward') : undefined}
        >
            {/* Top Academic Header */}
            <div className="flex items-center justify-between pb-1 border-b border-black/10 text-[10px] sm:text-[11px] font-serif text-slate-600 select-none pointer-events-none">
                {side === 'left' ? (
                    <>
                        <span className="truncate max-w-[80%] font-medium">
                            {pageNum === 1 ? 'Palestine Polytechnic University · Title' : `Palestine Polytechnic University · Page ${pageNum}`}
                        </span>
                        <span className="font-semibold">{pageNum}</span>
                    </>
                ) : (
                    <>
                        <span className="font-semibold">{pageNum}</span>
                        <span className="truncate max-w-[80%] font-medium">
                            {pageNum === 1
                                ? 'Thesis Cover & Title'
                                : pageNum === 2
                                ? '⭐ Official Thesis Acknowledgment Citation'
                                : `Dept. of Computer Science · Page ${pageNum}`}
                        </span>
                    </>
                )}
            </div>

            {/* Scanned Thesis Image Viewport */}
            <div className="flex-1 w-full flex items-center justify-center overflow-hidden py-1 pointer-events-none">
                <img
                    src={src}
                    alt={`Thesis Page ${pageNum}`}
                    className="w-full h-full object-contain filter contrast-[1.02] shadow-sm select-none pointer-events-none"
                    loading="eager"
                    draggable={false}
                />
            </div>

            {/* Bottom Academic Running Footer */}
            <div className="pt-1 border-t border-black/10 flex items-center justify-between text-[9px] sm:text-[10px] font-serif text-slate-500 select-none pointer-events-none">
                {side === 'left' ? (
                    <>
                        <span className="truncate max-w-[80%]">AI-Powered Retinal OCT Diagnosis</span>
                        <span className="font-mono">{pageNum}</span>
                    </>
                ) : (
                    <>
                        <span className="font-mono">{pageNum}</span>
                        <span className="truncate max-w-[80%]">{activeBook?.titleEn || 'Graduation Thesis'}</span>
                    </>
                )}
            </div>

            {/* Inner Spine Shadow Gradient */}
            <div
                className={`absolute top-0 bottom-0 ${
                    side === 'left' ? 'right-0 w-8 bg-gradient-to-l' : 'left-0 w-8 bg-gradient-to-r'
                } from-black/15 to-transparent pointer-events-none z-10`}
            />

            {/* Interactive Corner Hint Cue */}
            {isInteractive && (
                <div
                    className={`absolute bottom-1 ${
                        side === 'left' ? 'left-1' : 'right-1'
                    } opacity-35 hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-1 text-[8px] sm:text-[9px] font-sans font-medium text-slate-600 bg-black/5 hover:bg-black/10 px-1.5 py-0.5 rounded shadow-sm`}
                >
                    {side === 'left' ? '◄ Drag to flip' : 'Drag to flip ►'}
                </div>
            )}
        </div>
    );
}

export default function ThreeDBookModal() {
    const { isRTL } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState('volunteer');
    const [viewMode, setViewMode] = useState('pages'); // 'pages' = authentic 2-page book spread, 'summary' = chapter cards
    const [spreadIndex, setSpreadIndex] = useState(0); // 0-based spread: Spread 0 = Pages 1 & 2
    const [mobilePage, setMobilePage] = useState(1);
    const [isMobile, setIsMobile] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);

    // Interactive 3D drag & flip physics state
    const [flipState, setFlipState] = useState({
        active: false,
        direction: null, // 'next' | 'prev'
        progress: 0,     // 0 to 1
        source: 'idle'   // 'drag' | 'auto'
    });

    const dragRef = useRef({
        active: false,
        startX: 0,
        startY: 0,
        width: 400,
        direction: null,
        progress: 0,
        moved: false
    });
    const animatingRef = useRef(false);
    const animationFrameRef = useRef(null);
    const bookRef = useRef(null);

    const activeBook = BOOKS_DATA[selectedBookId];
    const totalBookPages = activeBook?.pageImages?.totalPages || 65;
    // Spread 0: Left = Page 1, Right = Page 2
    // Spread 1: Left = Page 3, Right = Page 4
    // Total Spreads: Math.ceil(totalBookPages / 2)
    const totalSpreads = Math.ceil(totalBookPages / 2);

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const formatPageSrc = useCallback((pageNum) => {
        if (!pageNum || pageNum > totalBookPages) return null;
        const prefix = activeBook?.pageImages?.prefix || 'page-';
        const padded = String(pageNum).padStart(2, '0');
        return `${activeBook.pageImages.basePath}${prefix}${padded}${activeBook.pageImages.ext}`;
    }, [activeBook, totalBookPages]);

    // Finish 3D flip animation smoothly with physics cubic ease-out
    const finishFlipAnimation = useCallback((direction, startP, targetP) => {
        animatingRef.current = true;
        const duration = 260; // ms
        const startTime = performance.now();

        if (targetP === 1 && soundEnabled) {
            playPageTurnSound();
        }

        const animate = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(1, elapsed / duration);
            // Smooth ease-out cubic
            const ease = 1 - Math.pow(1 - t, 3);
            const currentP = startP + (targetP - startP) * ease;

            setFlipState({
                active: true,
                direction,
                progress: currentP,
                source: 'auto'
            });

            if (t < 1) {
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                animatingRef.current = false;
                setFlipState({ active: false, direction: null, progress: 0, source: 'idle' });
                if (targetP === 1) {
                    if (isMobile) {
                        if (direction === 'next') {
                            setMobilePage((p) => Math.min(totalBookPages, p + 1));
                        } else {
                            setMobilePage((p) => Math.max(1, p - 1));
                        }
                    } else {
                        if (direction === 'next') {
                            setSpreadIndex((s) => Math.min(totalSpreads - 1, s + 1));
                        } else {
                            setSpreadIndex((s) => Math.max(0, s - 1));
                        }
                    }
                }
            }
        };
        animationFrameRef.current = requestAnimationFrame(animate);
    }, [soundEnabled, isMobile, totalBookPages, totalSpreads]);

    // Automated trigger for buttons / keyboard
    const startAutoFlip = useCallback((direction) => {
        if (animatingRef.current || flipState.active) return;
        if (isMobile) {
            if (direction === 'next' && mobilePage >= totalBookPages) return;
            if (direction === 'prev' && mobilePage <= 1) return;
        } else {
            if (direction === 'next' && spreadIndex >= totalSpreads - 1) return;
            if (direction === 'prev' && spreadIndex <= 0) return;
        }
        finishFlipAnimation(direction, 0, 1);
    }, [isMobile, mobilePage, totalBookPages, spreadIndex, totalSpreads, flipState.active, finishFlipAnimation]);

    // Window-level mouse/touch drag handlers for fluid drag-to-turn
    const handlePointerMove = useCallback((e) => {
        if (!dragRef.current.active) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const deltaX = clientX - dragRef.current.startX;
        const deltaY = clientY - dragRef.current.startY;

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            dragRef.current.moved = true;
        }

        if (isMobile) {
            const width = dragRef.current.width || 320;
            if (deltaX < 0 && mobilePage < totalBookPages) {
                const p = Math.min(1, Math.max(0, -deltaX / (width * 0.75)));
                dragRef.current.direction = 'next';
                dragRef.current.progress = p;
                setFlipState({ active: true, direction: 'next', progress: p, source: 'drag' });
            } else if (deltaX > 0 && mobilePage > 1) {
                const p = Math.min(1, Math.max(0, deltaX / (width * 0.75)));
                dragRef.current.direction = 'prev';
                dragRef.current.progress = p;
                setFlipState({ active: true, direction: 'prev', progress: p, source: 'drag' });
            }
            return;
        }

        const halfWidth = dragRef.current.width || 420;
        let p = 0;
        if (dragRef.current.direction === 'next') {
            p = Math.min(1, Math.max(0, -deltaX / halfWidth));
        } else if (dragRef.current.direction === 'prev') {
            p = Math.min(1, Math.max(0, deltaX / halfWidth));
        }
        dragRef.current.progress = p;
        setFlipState((prev) => ({ ...prev, progress: p }));
    }, [isMobile, mobilePage, totalBookPages]);

    const handlePointerUp = useCallback(() => {
        if (!dragRef.current.active) return;
        const { direction, progress, moved } = dragRef.current;
        dragRef.current.active = false;

        if (!moved) {
            // Click without drag
            setFlipState({ active: false, direction: null, progress: 0, source: 'idle' });
            if (!isMobile && direction) {
                startAutoFlip(direction);
            }
            return;
        }

        // Drag release: if dragged > 16% of width, complete page flip; otherwise spring back
        if (progress > 0.16 && direction) {
            finishFlipAnimation(direction, progress, 1);
        } else if (direction) {
            finishFlipAnimation(direction, progress, 0);
        }
    }, [isMobile, startAutoFlip, finishFlipAnimation]);

    useEffect(() => {
        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('mouseup', handlePointerUp);
        window.addEventListener('touchmove', handlePointerMove, { passive: false });
        window.addEventListener('touchend', handlePointerUp);
        return () => {
            window.removeEventListener('mousemove', handlePointerMove);
            window.removeEventListener('mouseup', handlePointerUp);
            window.removeEventListener('touchmove', handlePointerMove);
            window.removeEventListener('touchend', handlePointerUp);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [handlePointerMove, handlePointerUp]);

    // Mouse down on book pages
    const handleMouseDownOnPage = (side) => (e) => {
        if (e.button !== 0 || animatingRef.current) return;
        const rect = bookRef.current?.getBoundingClientRect();
        if (!rect) return;

        if (side === 'right' && spreadIndex >= totalSpreads - 1) return;
        if (side === 'left' && spreadIndex <= 0) return;

        dragRef.current = {
            active: true,
            startX: e.clientX,
            startY: e.clientY,
            width: rect.width / 2,
            direction: side === 'right' ? 'next' : 'prev',
            progress: 0,
            moved: false
        };
        setFlipState({
            active: true,
            direction: side === 'right' ? 'next' : 'prev',
            progress: 0,
            source: 'drag'
        });
    };

    // Touch start for mobile / touch devices
    const handleTouchStart = (e) => {
        if (e.touches.length !== 1 || animatingRef.current) return;
        const touch = e.touches[0];
        const rect = bookRef.current?.getBoundingClientRect();
        if (!rect) return;

        if (isMobile) {
            dragRef.current = {
                active: true,
                startX: touch.clientX,
                startY: touch.clientY,
                width: rect.width,
                direction: null,
                progress: 0,
                moved: false
            };
            return;
        }

        const relX = touch.clientX - rect.left;
        const isRight = relX >= rect.width / 2;
        const side = isRight ? 'right' : 'left';

        if (side === 'right' && spreadIndex >= totalSpreads - 1) return;
        if (side === 'left' && spreadIndex <= 0) return;

        dragRef.current = {
            active: true,
            startX: touch.clientX,
            startY: touch.clientY,
            width: rect.width / 2,
            direction: side === 'right' ? 'next' : 'prev',
            progress: 0,
            moved: false
        };
        setFlipState({
            active: true,
            direction: side === 'right' ? 'next' : 'prev',
            progress: 0,
            source: 'drag'
        });
    };

    // Listen for custom trigger event
    useEffect(() => {
        const handleOpenBook = (e) => {
            const requestedBook = e?.detail?.bookId;
            if (requestedBook && BOOKS_DATA[requestedBook]) {
                setSelectedBookId(requestedBook);
            }
            if (typeof e?.detail?.pageIndex === 'number') {
                const requestedPage = Math.max(1, e.detail.pageIndex);
                setSpreadIndex(Math.floor((requestedPage - 1) / 2));
                setMobilePage(requestedPage);
            } else {
                setSpreadIndex(0);
                setMobilePage(1);
            }
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
                startAutoFlip('next');
            } else if (e.key === 'ArrowLeft') {
                startAutoFlip('prev');
            } else if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, startAutoFlip]);

    const switchBook = (bookId) => {
        if (bookId !== selectedBookId) {
            setSelectedBookId(bookId);
            setSpreadIndex(0);
            setMobilePage(1);
            setActiveChapterIndex(0);
            if (soundEnabled) playPageTurnSound();
        }
    };

    const jumpToAcknowledgment = () => {
        // Page 2 is the official acknowledgment page (on Spread 0, right side)
        setSpreadIndex(0);
        setMobilePage(2);
        if (soundEnabled) playPageTurnSound();
    };

    if (!isOpen) return null;

    // Spread calculations for authentic 2-page layout
    // Spread 0: Left = Page 1, Right = Page 2
    // Spread 1: Left = Page 3, Right = Page 4
    // Spread s: Left = 2*s + 1, Right = 2*s + 2
    const currentLeftPage = spreadIndex * 2 + 1;
    const currentRightPage = spreadIndex * 2 + 2;

    const nextLeftPage = (spreadIndex + 1) * 2 + 1;
    const nextRightPage = (spreadIndex + 1) * 2 + 2;

    const prevLeftPage = (spreadIndex - 1) * 2 + 1;
    const prevRightPage = (spreadIndex - 1) * 2 + 2;

    const p = flipState.progress;

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
                    selectedBookId === 'volunteer' ? 'bg-cyan-500' : 'bg-blue-500'
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
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
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
                            <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono">3p</span>
                        </button>
                    </div>

                    {/* Center: View Mode Toggle & Quick Jump */}
                    <div className="flex items-center gap-2">
                        {selectedBookId === 'volunteer' && (
                            <button
                                onClick={jumpToAcknowledgment}
                                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/25 transition-all text-xs font-semibold cursor-pointer shadow-sm animate-pulse"
                                title="Jump directly to Page 2 where Omar Mohamed is officially acknowledged in the thesis"
                            >
                                <Bookmark size={13} className="text-cyan-400" />
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
                                <span>Executive Summary</span>
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
                                className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
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
                {/* MAIN 3D OPEN BOOK STAGE WITH REALISTIC MOUSE DRAGGING PHYSICS */}
                {/* ============================================================= */}
                <div
                    className="relative z-10 w-full max-w-6xl flex-1 flex items-center justify-center px-1 sm:px-4 py-1"
                    style={{ perspective: '2400px' }}
                >
                    {viewMode === 'pages' ? (
                        /* REAL PHYSICAL HARDCOVER BOOK CONTAINER */
                        <div
                            ref={bookRef}
                            onTouchStart={handleTouchStart}
                            className="relative w-full max-w-[1080px] h-[520px] xs:h-[560px] sm:h-[620px] md:h-[680px] lg:h-[720px] max-h-[calc(100dvh-140px)] flex items-center justify-center"
                        >
                            {/* Outer Floating Navigation: Previous Spread */}
                            <button
                                onClick={() => startAutoFlip('prev')}
                                disabled={isMobile ? mobilePage <= 1 : spreadIndex <= 0}
                                className={`absolute left-0 sm:-left-6 md:-left-10 z-50 p-2 sm:p-3 rounded-full bg-slate-900/90 border border-slate-700/80 text-white shadow-2xl transition-all cursor-pointer ${
                                    (isMobile ? mobilePage <= 1 : spreadIndex <= 0)
                                        ? 'opacity-20 cursor-not-allowed pointer-events-none'
                                        : 'hover:scale-110 active:scale-95 hover:bg-cyan-500 hover:text-slate-950'
                                }`}
                                aria-label="Previous Page"
                                title="Previous Page (◄ Arrow Left)"
                            >
                                <ChevronLeft size={20} strokeWidth={2.5} />
                            </button>

                            {/* Outer Floating Navigation: Next Spread */}
                            <button
                                onClick={() => startAutoFlip('next')}
                                disabled={isMobile ? mobilePage >= totalBookPages : spreadIndex >= totalSpreads - 1}
                                className={`absolute right-0 sm:-right-6 md:-right-10 z-50 p-2 sm:p-3 rounded-full bg-slate-900/90 border border-slate-700/80 text-white shadow-2xl transition-all cursor-pointer ${
                                    (isMobile ? mobilePage >= totalBookPages : spreadIndex >= totalSpreads - 1)
                                        ? 'opacity-20 cursor-not-allowed pointer-events-none'
                                        : 'hover:scale-110 active:scale-95 hover:bg-cyan-500 hover:text-slate-950'
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
                                    perspective: '2400px',
                                    transformStyle: 'preserve-3d',
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
                                {/* Center Book Spine Gutter Shadow */}
                                {!isMobile && (
                                    <>
                                        {/* Center Vertical Deep Crease Line */}
                                        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-black/25 z-40 pointer-events-none" />

                                        {/* Central Spine Shadow Gradient spanning Left and Right pages */}
                                        <div
                                            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[70px] pointer-events-none z-35"
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
                                {/* DESKTOP VIEW: DUAL-PAGE SPREAD WITH 3D FLIP MECHANICS     */}
                                {/* --------------------------------------------------------- */}
                                {!isMobile ? (
                                    <div className="w-full h-full relative flex" style={{ transformStyle: 'preserve-3d' }}>
                                        {/* LEFT HALF OF BOOK */}
                                        <div className="w-1/2 h-full relative overflow-hidden">
                                            {/* Static Base Left Page */}
                                            <SinglePage
                                                pageNum={currentLeftPage}
                                                totalBookPages={totalBookPages}
                                                activeBook={activeBook}
                                                formatPageSrc={formatPageSrc}
                                                side="left"
                                                isInteractive={!flipState.active && spreadIndex > 0}
                                                onMouseDown={handleMouseDownOnPage('left')}
                                                isDragging={flipState.active && flipState.direction === 'prev'}
                                            />

                                            {/* Shadow on Left Page when Next page turns towards it */}
                                            {flipState.active && flipState.direction === 'next' && p > 0.5 && (
                                                <div
                                                    className="absolute inset-0 pointer-events-none z-20"
                                                    style={{
                                                        background: 'linear-gradient(to left, rgba(0,0,0,0.4), transparent)',
                                                        opacity: Math.sin(p * Math.PI) * 0.45
                                                    }}
                                                />
                                            )}

                                            {/* Underneath Page Revealed during Prev flip */}
                                            {flipState.active && flipState.direction === 'prev' && (
                                                <div className="absolute inset-0 z-0">
                                                    <SinglePage
                                                        pageNum={prevLeftPage}
                                                        totalBookPages={totalBookPages}
                                                        activeBook={activeBook}
                                                        formatPageSrc={formatPageSrc}
                                                        side="left"
                                                    />
                                                    <div
                                                        className="absolute inset-0 pointer-events-none z-10"
                                                        style={{
                                                            background: 'linear-gradient(to left, rgba(0,0,0,0.4), transparent)',
                                                            opacity: Math.sin(p * Math.PI) * 0.35
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* RIGHT HALF OF BOOK */}
                                        <div className="w-1/2 h-full relative overflow-hidden">
                                            {/* Static Base Right Page */}
                                            <SinglePage
                                                pageNum={currentRightPage}
                                                totalBookPages={totalBookPages}
                                                activeBook={activeBook}
                                                formatPageSrc={formatPageSrc}
                                                side="right"
                                                isInteractive={!flipState.active && spreadIndex < totalSpreads - 1}
                                                onMouseDown={handleMouseDownOnPage('right')}
                                                isDragging={flipState.active && flipState.direction === 'next'}
                                            />

                                            {/* Shadow on Right Page when Prev page turns towards it */}
                                            {flipState.active && flipState.direction === 'prev' && p > 0.5 && (
                                                <div
                                                    className="absolute inset-0 pointer-events-none z-20"
                                                    style={{
                                                        background: 'linear-gradient(to right, rgba(0,0,0,0.4), transparent)',
                                                        opacity: Math.sin(p * Math.PI) * 0.45
                                                    }}
                                                />
                                            )}

                                            {/* Underneath Page Revealed during Next flip */}
                                            {flipState.active && flipState.direction === 'next' && (
                                                <div className="absolute inset-0 z-0">
                                                    <SinglePage
                                                        pageNum={nextRightPage}
                                                        totalBookPages={totalBookPages}
                                                        activeBook={activeBook}
                                                        formatPageSrc={formatPageSrc}
                                                        side="right"
                                                    />
                                                    <div
                                                        className="absolute inset-0 pointer-events-none z-10"
                                                        style={{
                                                            background: 'linear-gradient(to right, rgba(0,0,0,0.4), transparent)',
                                                            opacity: Math.sin(p * Math.PI) * 0.35
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* ========================================================= */}
                                        {/* 3D TURNING LEAF (NEXT FLIP: PIVOTS FROM SPINE TO LEFT)    */}
                                        {/* ========================================================= */}
                                        {flipState.active && flipState.direction === 'next' && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: '50%',
                                                    width: '50%',
                                                    height: '100%',
                                                    transformOrigin: 'left center',
                                                    transform: `rotateY(${-p * 180}deg)`,
                                                    transformStyle: 'preserve-3d',
                                                    zIndex: 30,
                                                    pointerEvents: 'none'
                                                }}
                                            >
                                                {/* Front Face: Current Right Page */}
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        backfaceVisibility: 'hidden',
                                                        WebkitBackfaceVisibility: 'hidden',
                                                        transform: 'rotateY(0deg)'
                                                    }}
                                                >
                                                    <SinglePage
                                                        pageNum={currentRightPage}
                                                        totalBookPages={totalBookPages}
                                                        activeBook={activeBook}
                                                        formatPageSrc={formatPageSrc}
                                                        side="right"
                                                    />
                                                    <div
                                                        className="absolute inset-0 pointer-events-none z-10"
                                                        style={{
                                                            background: `linear-gradient(to right, rgba(0,0,0,${0.35 * Math.sin(p * Math.PI)}), transparent 60%)`
                                                        }}
                                                    />
                                                </div>

                                                {/* Back Face: Next Left Page */}
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        backfaceVisibility: 'hidden',
                                                        WebkitBackfaceVisibility: 'hidden',
                                                        transform: 'rotateY(180deg)'
                                                    }}
                                                >
                                                    <SinglePage
                                                        pageNum={nextLeftPage}
                                                        totalBookPages={totalBookPages}
                                                        activeBook={activeBook}
                                                        formatPageSrc={formatPageSrc}
                                                        side="left"
                                                    />
                                                    <div
                                                        className="absolute inset-0 pointer-events-none z-10"
                                                        style={{
                                                            background: `linear-gradient(to left, rgba(0,0,0,${0.35 * Math.sin(p * Math.PI)}), transparent 60%)`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* ========================================================= */}
                                        {/* 3D TURNING LEAF (PREV FLIP: PIVOTS FROM SPINE TO RIGHT)   */}
                                        {/* ========================================================= */}
                                        {flipState.active && flipState.direction === 'prev' && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '50%',
                                                    height: '100%',
                                                    transformOrigin: 'right center',
                                                    transform: `rotateY(${p * 180}deg)`,
                                                    transformStyle: 'preserve-3d',
                                                    zIndex: 30,
                                                    pointerEvents: 'none'
                                                }}
                                            >
                                                {/* Front Face: Current Left Page */}
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        backfaceVisibility: 'hidden',
                                                        WebkitBackfaceVisibility: 'hidden',
                                                        transform: 'rotateY(0deg)'
                                                    }}
                                                >
                                                    <SinglePage
                                                        pageNum={currentLeftPage}
                                                        totalBookPages={totalBookPages}
                                                        activeBook={activeBook}
                                                        formatPageSrc={formatPageSrc}
                                                        side="left"
                                                    />
                                                    <div
                                                        className="absolute inset-0 pointer-events-none z-10"
                                                        style={{
                                                            background: `linear-gradient(to left, rgba(0,0,0,${0.35 * Math.sin(p * Math.PI)}), transparent 60%)`
                                                        }}
                                                    />
                                                </div>

                                                {/* Back Face: Previous Right Page */}
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        backfaceVisibility: 'hidden',
                                                        WebkitBackfaceVisibility: 'hidden',
                                                        transform: 'rotateY(180deg)'
                                                    }}
                                                >
                                                    <SinglePage
                                                        pageNum={prevRightPage}
                                                        totalBookPages={totalBookPages}
                                                        activeBook={activeBook}
                                                        formatPageSrc={formatPageSrc}
                                                        side="right"
                                                    />
                                                    <div
                                                        className="absolute inset-0 pointer-events-none z-10"
                                                        style={{
                                                            background: `linear-gradient(to right, rgba(0,0,0,${0.35 * Math.sin(p * Math.PI)}), transparent 60%)`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    /* --------------------------------------------------------- */
                                    /* MOBILE VIEW: SINGLE PAGE DISPLAY WITH TOUCH DRAG SUPPORT  */
                                    /* --------------------------------------------------------- */
                                    <div className="w-full h-full relative overflow-hidden bg-[#faf9f5] flex flex-col justify-between p-3 sm:p-5">
                                        <div className="flex items-center justify-between pb-1.5 border-b border-black/10 text-xs font-serif text-slate-700">
                                            <span className="font-bold text-cyan-700">Page {mobilePage} of {totalBookPages}</span>
                                            <span className="text-[11px] text-slate-500 font-sans">{activeBook.badge}</span>
                                        </div>

                                        <div
                                            className="flex-1 w-full flex items-center justify-center overflow-hidden py-1 relative"
                                            style={{
                                                transform: flipState.active
                                                    ? `translateX(${flipState.direction === 'next' ? -p * 20 : p * 20}px)`
                                                    : 'none',
                                                transition: flipState.source === 'auto' ? 'transform 0.25s ease' : 'none'
                                            }}
                                        >
                                            <img
                                                src={formatPageSrc(mobilePage)}
                                                alt={`Thesis Page ${mobilePage}`}
                                                className="w-full h-full object-contain filter contrast-[1.02]"
                                                loading="eager"
                                                draggable={false}
                                            />
                                        </div>

                                        <div className="pt-1 border-t border-black/10 flex items-center justify-between text-[11px] font-serif text-slate-600">
                                            <span>Swipe or tap arrows to flip</span>
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
                            {/* Chapter Selector Tabs */}
                            {activeBook.chapters && (
                                <div className="flex items-center gap-1.5 p-3 border-b border-white/10 bg-black/20 overflow-x-auto">
                                    {activeBook.chapters.map((ch, idx) => (
                                        <button
                                            key={ch.id || idx}
                                            onClick={() => setActiveChapterIndex(idx)}
                                            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                                activeChapterIndex === idx
                                                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                                                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                                            }`}
                                        >
                                            {isRTL ? ch.chapterAr.split(':')[0] : `Chapter ${idx + 1}`}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Chapter Content View */}
                            {activeBook.chapters && activeBook.chapters[activeChapterIndex] && (
                                <div className="p-4 sm:p-7 md:p-9 flex flex-col justify-between h-full overflow-y-auto">
                                    <div>
                                        <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-xs font-mono text-slate-400">
                                            <span className={selectedBookId === 'volunteer' ? 'text-cyan-400 font-bold' : 'text-amber-400 font-bold'}>
                                                {isRTL
                                                    ? activeBook.chapters[activeChapterIndex].chapterAr
                                                    : activeBook.chapters[activeChapterIndex].chapterEn}
                                            </span>
                                            <span>Published Academic Thesis Summary</span>
                                        </div>

                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-3">
                                            {isRTL
                                                ? activeBook.chapters[activeChapterIndex].titleAr
                                                : activeBook.chapters[activeChapterIndex].titleEn}
                                        </h2>

                                        <div className="text-slate-200 text-xs sm:text-sm md:text-[15px] leading-relaxed whitespace-pre-line mb-4 font-normal">
                                            {isRTL
                                                ? activeBook.chapters[activeChapterIndex].contentAr
                                                : activeBook.chapters[activeChapterIndex].contentEn}
                                        </div>

                                        {/* Highlights Row */}
                                        {activeBook.chapters[activeChapterIndex].highlights && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3">
                                                {activeBook.chapters[activeChapterIndex].highlights.map((h, i) => (
                                                    <div key={i} className="bg-black/40 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 font-bold text-xs text-cyan-300">
                                                            <CheckCircle2 size={14} className="text-cyan-400" />
                                                            <span>{h.titleEn}</span>
                                                        </div>
                                                        <p className="text-[11px] text-slate-300 leading-snug">{h.descEn}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Official Acknowledgment Citation */}
                                        <div className="mt-4 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-100">
                                            <div className="font-bold text-xs uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
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
                                            className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer hover:bg-cyan-400 shadow-md"
                                        >
                                            <BookOpen size={14} />
                                            <span>Open Authentic 2-Page Scans</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ============================================================= */}
                {/* BOTTOM SCRUBBER & PAGE INDICATOR BAR                          */}
                {/* ============================================================= */}
                <div className="relative z-30 w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 shadow-xl text-xs text-slate-300">
                    {/* Left: Spread / Page Counter */}
                    <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-cyan-400">
                            {!isMobile ? (
                                `Pages ${currentLeftPage} – ${Math.min(currentRightPage, totalBookPages)} of ${totalBookPages}`
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
                            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                            title="Scrub across thesis pages"
                        />
                    </div>

                    {/* Right: Quick Page Flippers */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => startAutoFlip('prev')}
                            disabled={isMobile ? mobilePage <= 1 : spreadIndex <= 0}
                            className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 cursor-pointer font-bold"
                        >
                            ◄
                        </button>
                        <button
                            onClick={() => startAutoFlip('next')}
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
