import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen, X, ChevronRight, ChevronLeft, Download, Volume2,
    VolumeX, Maximize2, Minimize2, Award, Sparkles, CheckCircle2,
    Layers, Cpu, ShieldCheck, HeartHandshake, Eye, ExternalLink
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Synthesize subtle paper-turn rustle sound effect via Web Audio API
function playPageTurnSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') ctx.resume();

        // White noise burst shaped with lowpass filter for gentle paper friction sound
        const bufferSize = ctx.sampleRate * 0.12;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
    } catch {
        // Silently handled if audio policy blocks
    }
}

export const BOOKS_DATA = {
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
                contentEn: `Traditional museum visits suffer from static placards and one-size-fits-all audio guides that fail to deeply engage visitors or provide tailored historical context. Despite Egypt’s unparalleled cultural heritage, modern travelers demand interactive, adaptive, and multilingual cultural experiences.

HistoryVerse was architected to bridge this gap: turning passive sightseeing into an active, multi-agent AI expedition where artifacts converse, history comes alive in 3D AR, and visitors receive personalized intelligent tour curation.`,
                contentAr: `تعاني الجولات التقليدية في المتاحف من اللوحات التعريفية الثابتة والمرشدين الصوتيين محدودي التفاعل، مما يؤدي إلى تجربة سلبية تغفل العمق التاريخي للحضارة المصرية العريقة.

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
                chapterEn: 'Chapter 3: AI & Conversational RAG Engine',
                chapterAr: 'الفصل الثالث: محرك الذكاء الاصطناعي ونظام الـ RAG',
                titleEn: 'Retrieval-Augmented Historical Dialogue',
                titleAr: 'توليد الحوار التاريخي بالاسترجاع المعرفي (RAG)',
                contentEn: `To prevent LLM hallucination and ensure factual Egyptological accuracy, our AI pipeline leverages a Retrieval-Augmented Generation (RAG) architecture powered by ChromaDB vector store.

When a visitor queries an artifact:
1. Dense vector embeddings retrieve verified historical passages and primary scholarly sources.
2. ConversationBufferMemory maintains contextual multi-turn dialogue continuity.
3. Model-agnostic routing dynamically balances inference across Google Gemini and local quantized LLaMA.
4. Multilingual speech-to-text (Whisper) and realistic neural TTS enable hands-free voice conversations in English, Arabic, and French.`,
                contentAr: `لمنع الهلوسة ولضمان الدقة التاريخية الموثقة لآثار مصر القديمة، قمنا ببناء محرك استرجاع معرفي مدعوم بقواعد البيانات الشعاعية ChromaDB:
1. تحويل استفسار الزائر لشعاع دلالي ومطابقته فورياً مع المراجع والوثائق التاريخية المعتمدة.
2. إدارة سياق المحادثة عبر ConversationBufferMemory لضمان ترابط الحوار متعدد الجولات.
3. توجيه ذكي للنماذج يوازن بين Google Gemini وسيرفرات LLaMA المحلية.
4. تحويل الكلام لنصوص (Whisper) وتوليد صوتي عصبي باللغات العربية والإنجليزية والفرنسية.`,
                metrics: [
                    { label: 'Artifact Recognition', val: '90–96%' },
                    { label: 'RAG Context Window', val: '8K Tokens' },
                    { label: 'Voice Latency', val: '< 650ms' }
                ]
            },
            {
                chapterEn: 'Chapter 4: Mobile AR & Computer Vision',
                chapterAr: 'الفصل الرابع: الرؤية الحاسوبية والواقع المعزز',
                titleEn: 'ARCore 3D Overlays & Real-Time Detection',
                titleAr: 'التعرف الآني على التماثيل ومجسمات الواقع المعزز',
                contentEn: `The native Android application, developed using Google ARCore and SceneView, empowers visitors to point their smartphone at any monument or artifact:

• Real-Time Detection: Custom-trained YOLOv5 and Vision Transformer models detect and label artifacts within milliseconds even under dim museum spotlights.
• Cloud Anchors: AR spatial anchors maintain millimeter-accurate holographic 3D models floating beside physical exhibits.
• Interactive 3D Dissections: Visitors can rotate, inspect internal chambers, and view color reconstructions of ancient statues.`,
                contentAr: `يوفر تطبيق الأندرويد المطور باستخدام ARCore و SceneView تجربة استثنائية بمجرد توجيه كاميرا الهاتف نحو أي أثر:
• كشف آني فائق السرعة عبر نماذج YOLOv5 المعدلة لتحديد أسماء وتفاصيل التماثيل تحت الإضاءة الخافتة.
• مرابط سحابية Cloud Anchors لتثبيت مجسمات الهولوجرام ثلاثية الأبعاد بدقة مليمترية بجانب المعروضات.
• تفكيك وتدوير ثلاثي الأبعاد لاستكشاف المومياوات والغرف الداخلية للآثار قبل ترميمها.`,
                features: ['YOLOv5 Custom Dataset', 'ARCore Motion Tracking', 'Cloud Anchors', '3D SceneView GlTF']
            },
            {
                chapterEn: 'Chapter 5: Smart Trip Planning & Algorithms',
                chapterAr: 'الفصل الخامس: التخطيط الذكي ومسارات A*',
                titleEn: 'Adaptive Museum Routing via A* Algorithm',
                titleAr: 'توجيه الزوار المحسن بخوارزمية A* الذكية',
                contentEn: `To solve visitor fatigue and optimize crowd density in sprawling museum corridors, HistoryVerse incorporates an algorithmic trip planner powered by the A* (A-Star) search heuristic.

The planner calculates optimal navigation pathways based on:
• User time budget (e.g. 45 min vs 3 hours)
• Personal thematic preferences (Pharaonic Gold, Old Kingdom, Warfare, Everyday Life)
• Real-time corridor foot traffic and handicap accessibility ramps.`,
                contentAr: `لتفادي إرهاق الزوار وتنظيم كثافة الحشود في ممرات المتحف، يحتوي النظام على مخطط رحلات ذكي يعمل بخوارزمية البحث الموجه A*:
• حساب المسار الأمثل جغرافياً بحسب وقت الزيارة المتاح واهتمامات الزائر (الذهب، عصر بناة الأهرام، الأسلحة).
• مراعاة الطرق المجهزة لذوي الاحتياجات الخاصة وتجنب الممرات المزدحمة آنياً.`,
                highlights: [
                    { icon: 'CheckCircle2', titleEn: 'Optimal Time Routing', descEn: 'Eliminates backtracking across sprawling multi-floor galleries' },
                    { icon: 'ShieldCheck', titleEn: 'Accessibility Aware', descEn: 'Automatic ramp and elevator priority for strollers & wheelchairs' }
                ]
            },
            {
                chapterEn: 'Chapter 6: Results, Defense & Evaluation',
                chapterAr: 'الفصل السادس: النتائج والمناقشة والتقييم',
                titleEn: 'Final Evaluation: Grade A+ (Distinction)',
                titleAr: 'التقييم الأكاديمي النهائي: امتياز مرتفع A+',
                contentEn: `HistoryVerse was rigorously evaluated and defended before the academic examination board at the Higher Institute of Engineering & Technology (BHI).

The committee commended the project's technical rigor, end-to-end cloud production deployment on AWS Fargate, high computer vision accuracy, and seamless integration of cutting-edge Generative AI with Augmented Reality.

The project was officially awarded the top grade of **A+ (Distinction)** and recognized as one of the most innovative engineering graduation works of the academic year.`,
                contentAr: `تمت مناقشة وتقييم مشروع HistoryVerse أمام لجنة التحكيم الأكاديمية بالمعهد العالي للهندسة والتكنولوجيا.

أشادت اللجنة بالعمق الهندسي للمشروع، ونشره الإنتاجي الكامل على سحابة AWS Fargate، وتكامله السلس بين الذكاء الاصطناعي التوليدي والواقع المعزز.

تم منح المشروع رسمياً أعلى تقدير: **امتياز مع مرتبة الشرف A+**، واعتبر من أبرز مشاريع التخرج الابتكارية لذلك العام.`,
                verdict: {
                    grade: 'GRADE A+ (DISTINCTION)',
                    status: 'Officially Approved & Defended',
                    accreditation: 'Bachelor of Science in Computer Engineering',
                    date: 'July 2024'
                }
            }
        ]
    },
    volunteer: {
        id: 'volunteer',
        titleEn: 'Palestine Polytechnic University: AI Retinal Diagnosis',
        titleAr: 'جامعة بوليتكنك فلسطين: نظام تشخيص أمراض شبكية العين',
        subtitleEn: 'Research Thesis & Volunteer Technical Mentorship (2025–2026)',
        subtitleAr: 'أطروحة بحثية وإشراف تقني تطوعي (2025–2026)',
        themeColor: 'from-emerald-600 via-teal-600 to-emerald-950',
        badge: 'Official Thesis Acknowledgement',
        badgeAr: 'شكر رسمي في الأطروحة الأكاديمية',
        coverColor: 'bg-gradient-to-br from-[#06241b] via-[#093527] to-[#041a13]',
        borderColor: 'border-emerald-500/60',
        pdfUrl: '#',
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

1. Architecture Selection: Benchmarked deep residual backbones (ResNet-50, EfficientNet-B4) against Vision Transformers (ViT) for subtle layer biomarker extraction.
2. Combating Severe Class Imbalance: Formulated custom Weighted Focal Loss and engineered targeted data augmentation pipelines (elastic deformations, contrast normalization).
3. Explainable AI (XAI): Guided the integration of Grad-CAM heatmaps so clinicians could visually verify the pathological basis of each automated diagnosis.
4. Experiment Tracking: Instituted rigorous ML tracking pipelines with validation splits to prevent data leakage.`,
                contentAr: `كمرشد تقني متطوع، وجّه عمر الفريق البحثي الطلابي خلال التحديات الهندسية المعقدة:
1. اختيار النماذج: مقارنة الشبكات العصبية الالتفافية (ResNet-50 و EfficientNet) مع Vision Transformers لاكتشاف التغيرات الدقيقة في طبقات الشبكية.
2. معالجة اختلال توازن البيانات: تطبيق Weighted Focal Loss وتطوير خطوط معالجة وتوليد بيانات طبية معدلة.
3. الذكاء الاصطناعي القابل للتفسير (XAI): دمج خرائط Grad-CAM لتمكين الأطباء من معاينة بؤرة الشك التي بنى عليها النموذج تشخيصه.
4. تتبع التجارب والتحقق الصارم لضمان عدم حدوث تسريب في البيانات الطبية (Data Leakage).`,
                highlights: [
                    { icon: 'Layers', titleEn: 'Grad-CAM Explainability', descEn: 'Clinical trust through visual attention heatmaps' },
                    { icon: 'ShieldCheck', titleEn: 'Focal Loss Regularization', descEn: 'Robust classification of rare and early-stage pathologies' }
                ]
            },
            {
                chapterEn: 'Chapter 3: Benchmarks & Clinical Validation',
                chapterAr: 'الفصل الثالث: نتائج الاختبار والتقييم السريري',
                titleEn: 'Diagnostic Metrics & ROC Evaluation',
                titleAr: 'مؤشرات الأداء ومنحنيات ROC',
                contentEn: `Through iterative feedback, hyperparameter tuning, and cross-validation across thousands of high-resolution B-scans:

• Overall Classification Accuracy reached exceptional clinical-grade reliability.
• High Area Under the ROC Curve (AUC > 0.98) across CNV, DME, and Drusen classes.
• False negative rates for early diabetic edema were drastically reduced, enabling reliable triage assistance in busy outpatient clinics.`,
                contentAr: `من خلال جولات المراجعة المستمرة وضبط المعاملات والتحقق المتقاطع عبر آلاف صور المسح المقطعي:
• تجاوزت دقة التصنيف الكلية معايير الأداء السريري المعتمدة.
• حقق النموذج مساحة استثنائية تحت منحنى التشخيص (AUC > 0.98) لجميع الفئات المرضية.
• خفض ملحوظ لمعدلات السلبية الخاطئة لوذمة السكري مما يعزز الثقة في فرز الحالات الحرجة مبكراً.`,
                metrics: [
                    { label: 'ROC-AUC Score', val: '> 0.98' },
                    { label: 'DME Sensitivity', val: '97.4%' },
                    { label: 'Inference Time', val: '~42ms' }
                ]
            },
            {
                chapterEn: 'Chapter 4: Official Thesis Acknowledgement',
                chapterAr: 'الفصل الرابع: خطاب الشكر والتقدير الرسمي',
                titleEn: 'Official Academic Acknowledgement in Thesis',
                titleAr: 'التوثيق والشكر الرسمي بالأطروحة الجامعية',
                contentEn: `In recognition of this dedicated voluntary contribution, the engineering research team and faculty at Palestine Polytechnic University officially recognized Omar Mohamed Abdelsalam in the published graduation thesis acknowledgements:

"We express our profound gratitude to Engineer Omar Mohamed Abdelsalam for his tireless remote mentorship, technical clarity, architectural guidance, and generous sharing of deep learning expertise that elevated the quality and rigor of our graduation research."

This project stands as a testament to engineering solidarity, knowledge sharing, and leveraging AI for human welfare and healthcare accessibility.`,
                contentAr: `تقديراً لهذا العطاء التقني التطوعي المتواصل، قام الفريق البحثي وأعضاء هيئة التدريس بجامعة بوليتكنك فلسطين بتوثيق الشكر والتقدير رسمياً للمهندس عمر محمد عبد السلام في صفحة الإهداء والشكر بالأطروحة الأكاديمية المنشورة:

"نتقدم بأسمى آيات الشكر والعرفان إلى المهندس عمر محمد عبد السلام على إشرافه التقني المتواصل وتوجيهاته القيمة التي رفعت من السوية العلمية والهندسية لهذا البحث."

يمثل هذا العمل تجسيداً لقيم التضامن الإنساني والعطاء العلمي وتسخير الذكاء الاصطناعي لخدمة صحة الإنسان.`,
                verdict: {
                    grade: 'OFFICIAL THESIS ACKNOWLEDGEMENT',
                    status: 'Published Academic Graduation Research',
                    accreditation: 'Palestine Polytechnic University (PPU)',
                    date: '2025 – 2026'
                }
            }
        ]
    }
};

export default function ThreeDBookModal() {
    const { isRTL, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState('graduation');
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);
    const [flipDirection, setFlipDirection] = useState('next');
    const modalRef = useRef(null);

    const activeBook = BOOKS_DATA[selectedBookId];
    const totalPages = activeBook.pages.length;
    const currentPage = activeBook.pages[currentPageIndex];

    // Listen for custom trigger event
    useEffect(() => {
        const handleOpenBook = (e) => {
            const requestedBook = e?.detail?.bookId;
            if (requestedBook && BOOKS_DATA[requestedBook]) {
                setSelectedBookId(requestedBook);
            }
            if (typeof e?.detail?.pageIndex === 'number') {
                setCurrentPageIndex(e.detail.pageIndex);
            } else {
                setCurrentPageIndex(0);
            }
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
                if (isRTL) goPrev();
                else goNext();
            } else if (e.key === 'ArrowLeft') {
                if (isRTL) goNext();
                else goPrev();
            } else if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentPageIndex, totalPages, isRTL]);

    const goNext = useCallback(() => {
        if (currentPageIndex < totalPages - 1 && !isFlipping) {
            setIsFlipping(true);
            setFlipDirection('next');
            if (soundEnabled) playPageTurnSound();
            setTimeout(() => {
                setCurrentPageIndex((prev) => prev + 1);
                setIsFlipping(false);
            }, 260);
        }
    }, [currentPageIndex, totalPages, isFlipping, soundEnabled]);

    const goPrev = useCallback(() => {
        if (currentPageIndex > 0 && !isFlipping) {
            setIsFlipping(true);
            setFlipDirection('prev');
            if (soundEnabled) playPageTurnSound();
            setTimeout(() => {
                setCurrentPageIndex((prev) => prev - 1);
                setIsFlipping(false);
            }, 260);
        }
    }, [currentPageIndex, isFlipping, soundEnabled]);

    const switchBook = (bookId) => {
        if (bookId !== selectedBookId) {
            setSelectedBookId(bookId);
            setCurrentPageIndex(0);
            if (soundEnabled) playPageTurnSound();
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden select-none"
            >
                {/* Background Ambient Glow */}
                <div className={`absolute w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full blur-[140px] opacity-25 pointer-events-none ${
                    selectedBookId === 'graduation' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />

                {/* Top Control Bar */}
                <div className="relative z-20 w-full max-w-5xl flex items-center justify-between gap-3 mb-2 sm:mb-4 px-2">
                    {/* Book Switcher Tabs */}
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/90 border border-slate-700/60 p-1 rounded-full shadow-lg">
                        <button
                            onClick={() => switchBook('graduation')}
                            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer touch-manipulation ${
                                selectedBookId === 'graduation'
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold shadow-md shadow-amber-500/25'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                            }`}
                        >
                            <span>🎓</span>
                            <span className="hidden sm:inline">{isRTL ? 'مشروع التخرج (HistoryVerse)' : 'HistoryVerse (Graduation)'}</span>
                            <span className="sm:hidden">{isRTL ? 'التخرج' : 'Graduation'}</span>
                            <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded font-mono">A+</span>
                        </button>

                        <button
                            onClick={() => switchBook('volunteer')}
                            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer touch-manipulation ${
                                selectedBookId === 'volunteer'
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-md shadow-emerald-500/25'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                            }`}
                        >
                            <span>🤝</span>
                            <span className="hidden sm:inline">{isRTL ? 'أطروحة بوليتكنك فلسطين' : 'PPU Retinal AI (Volunteer)'}</span>
                            <span className="sm:hidden">{isRTL ? 'التطوع' : 'Volunteer'}</span>
                        </button>
                    </div>

                    {/* Window Control Actions */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Audio Toggle */}
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="p-2 sm:p-2.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                            title={soundEnabled ? 'Mute Page Flip Sound' : 'Enable Page Flip Sound'}
                            aria-label="Sound Toggle"
                        >
                            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                        </button>

                        {/* Download Original PDF (if available) */}
                        {activeBook.pdfUrl && activeBook.pdfUrl !== '#' && (
                            <a
                                href={activeBook.pdfUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                                title="Download Full Original Exposé / Thesis PDF"
                            >
                                <Download size={14} />
                                <span className="hidden sm:inline">{isRTL ? 'تحميل الوثيقة الأصلية' : 'Download PDF'}</span>
                            </a>
                        )}

                        {/* Close Window */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 sm:p-2.5 rounded-full bg-red-600/90 text-white hover:bg-red-500 active:scale-95 transition-all shadow-md cursor-pointer ml-1"
                            title="Close Book Reader"
                            aria-label="Close Book Reader"
                        >
                            <X size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* ============================================================= */}
                {/* 3D BOOK STAGE CONTAINER (Perspective 1600px with 3D Page Flip) */}
                {/* ============================================================= */}
                <div
                    ref={modalRef}
                    className="relative z-10 w-full max-w-4xl flex-1 max-h-[calc(100dvh-130px)] flex items-center justify-center px-1"
                    style={{ perspective: '1600px' }}
                >
                    {/* The 3D Book Frame */}
                    <div
                        className={`relative w-full max-w-[860px] h-[480px] xs:h-[520px] sm:h-[560px] rounded-2xl ${activeBook.coverColor} border-2 ${activeBook.borderColor} shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transition-all duration-300`}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Book Spine Texture Gradient on the Left (Desktop) */}
                        <div className="absolute top-0 bottom-0 left-0 w-3 sm:w-5 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-30 pointer-events-none" />
                        <div className="absolute top-0 bottom-0 right-0 w-3 sm:w-5 bg-gradient-to-l from-black/80 via-black/40 to-transparent z-30 pointer-events-none" />

                        {/* Page Content Container with 3D Flip Animation */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`${selectedBookId}-${currentPageIndex}`}
                                initial={{
                                    opacity: 0,
                                    rotateY: flipDirection === 'next' ? (isRTL ? -35 : 35) : (isRTL ? 35 : -35),
                                    scale: 0.98
                                }}
                                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                                exit={{
                                    opacity: 0,
                                    rotateY: flipDirection === 'next' ? (isRTL ? 35 : -35) : (isRTL ? -35 : 35),
                                    scale: 0.98
                                }}
                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                className="relative w-full h-full p-4 sm:p-7 md:p-9 flex flex-col justify-between overflow-y-auto font-sans"
                                style={{ transformOrigin: isRTL ? 'right center' : 'left center' }}
                            >
                                {/* COVER PAGE LAYOUT */}
                                {currentPage.type === 'cover' ? (
                                    <div className="h-full flex flex-col items-center justify-between text-center py-2 sm:py-4">
                                        {/* Top Tag & Academic Seal */}
                                        <div className="flex flex-col items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                                                selectedBookId === 'graduation'
                                                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                                                    : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                                            }`}>
                                                {isRTL ? currentPage.tagAr : currentPage.tagEn}
                                            </span>

                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400/40 flex items-center justify-center bg-black/30 shadow-inner my-1 sm:my-2">
                                                <Award size={36} className={selectedBookId === 'graduation' ? 'text-amber-400' : 'text-emerald-400'} />
                                            </div>
                                        </div>

                                        {/* Main Book Title */}
                                        <div className="max-w-2xl px-2">
                                            <h1 className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-2 sm:mb-3 bg-gradient-to-r ${
                                                selectedBookId === 'graduation'
                                                    ? 'from-amber-200 via-yellow-100 to-amber-400'
                                                    : 'from-emerald-200 via-teal-100 to-emerald-400'
                                            } bg-clip-text text-transparent`}>
                                                {isRTL ? currentPage.titleAr : currentPage.titleEn}
                                            </h1>
                                            <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-medium">
                                                {isRTL ? currentPage.subtitleAr : currentPage.subtitleEn}
                                            </p>
                                        </div>

                                        {/* Metadata Table */}
                                        <div className="w-full max-w-lg bg-black/35 rounded-xl border border-white/10 p-3 sm:p-4 my-2 text-left sm:text-sm text-xs">
                                            {(isRTL ? currentPage.metaAr : currentPage.metaEn).map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between py-1 border-b border-white/5 last:border-none">
                                                    <span className="text-slate-400 font-mono text-[11px] sm:text-xs">{item.label}</span>
                                                    <span className="text-slate-100 font-semibold text-right">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Bottom Action Prompt */}
                                        <button
                                            onClick={goNext}
                                            className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm text-slate-950 transition-all flex items-center gap-2 shadow-lg cursor-pointer hover:scale-105 active:scale-95 ${
                                                selectedBookId === 'graduation'
                                                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-amber-500/30'
                                                    : 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-emerald-500/30'
                                            }`}
                                        >
                                            <span>{isRTL ? 'افتح واقرأ الكتاب' : 'Open & Flip Pages'}</span>
                                            {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                                        </button>
                                    </div>
                                ) : (
                                    /* CONTENT CHAPTER PAGE LAYOUT */
                                    <div className="h-full flex flex-col justify-between">
                                        {/* Chapter Header */}
                                        <div>
                                            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-xs font-mono text-slate-400">
                                                <span className={selectedBookId === 'graduation' ? 'text-amber-400' : 'text-emerald-400'}>
                                                    {isRTL ? currentPage.chapterAr : currentPage.chapterEn}
                                                </span>
                                                <span>{isRTL ? `صفحة ${currentPageIndex + 1} من ${totalPages}` : `Page ${currentPageIndex + 1} of ${totalPages}`}</span>
                                            </div>

                                            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-3">
                                                {isRTL ? currentPage.titleAr : currentPage.titleEn}
                                            </h2>

                                            {/* Body Text */}
                                            <div className="text-slate-200 text-xs sm:text-sm md:text-[15px] leading-relaxed whitespace-pre-line mb-4 font-normal">
                                                {isRTL ? currentPage.contentAr : currentPage.contentEn}
                                            </div>

                                            {/* Highlights / Features (if present) */}
                                            {currentPage.highlights && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 my-3">
                                                    {currentPage.highlights.map((h, i) => (
                                                        <div key={i} className="bg-black/40 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                                                            <div className="flex items-center gap-2 font-bold text-xs text-amber-300">
                                                                <CheckCircle2 size={14} className="text-emerald-400" />
                                                                <span>{h.titleEn}</span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-300 leading-snug">{h.descEn}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Architecture Items (if present) */}
                                            {currentPage.architectureItems && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2">
                                                    {currentPage.architectureItems.map((arch, i) => (
                                                        <div key={i} className="bg-black/45 border border-white/10 rounded-xl p-2.5">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="font-bold text-xs text-cyan-300">{arch.name}</span>
                                                                <span className="text-[10px] text-amber-400 font-mono">{arch.stack}</span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-300">{arch.desc}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Metrics Row (if present) */}
                                            {currentPage.metrics && (
                                                <div className="flex flex-wrap items-center gap-3 my-3">
                                                    {currentPage.metrics.map((m, i) => (
                                                        <div key={i} className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 flex flex-col items-center">
                                                            <span className="text-base sm:text-lg font-mono font-bold text-emerald-400">{m.val}</span>
                                                            <span className="text-[10px] text-slate-400 uppercase tracking-wider">{m.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Final Verdict Banner (Last Page) */}
                                            {currentPage.verdict && (
                                                <div className={`mt-3 p-3.5 rounded-xl border text-center ${
                                                    selectedBookId === 'graduation'
                                                        ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                                                        : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                                                }`}>
                                                    <div className="text-sm sm:text-base font-black tracking-wider uppercase mb-1">
                                                        🏆 {currentPage.verdict.grade}
                                                    </div>
                                                    <div className="text-xs text-slate-300 font-medium">
                                                        {currentPage.verdict.status} · {currentPage.verdict.accreditation} ({currentPage.verdict.date})
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Bottom Page Navigation Controls */}
                                        <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-2">
                                            <button
                                                onClick={goPrev}
                                                disabled={currentPageIndex === 0}
                                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                                    currentPageIndex === 0
                                                        ? 'opacity-30 cursor-not-allowed text-slate-500'
                                                        : 'bg-slate-800/80 text-white hover:bg-slate-700'
                                                }`}
                                            >
                                                {isRTL ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                                                <span>{isRTL ? 'الصفحة السابقة' : 'Previous'}</span>
                                            </button>

                                            {/* Chapter Index Quick Scrubber */}
                                            <div className="flex items-center gap-1">
                                                {activeBook.pages.map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => {
                                                            if (i !== currentPageIndex) {
                                                                setCurrentPageIndex(i);
                                                                if (soundEnabled) playPageTurnSound();
                                                            }
                                                        }}
                                                        className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                                                            i === currentPageIndex
                                                                ? selectedBookId === 'graduation' ? 'bg-amber-400 w-6' : 'bg-emerald-400 w-6'
                                                                : 'bg-slate-700 hover:bg-slate-500'
                                                        }`}
                                                        title={`Jump to Page ${i + 1}`}
                                                    />
                                                ))}
                                            </div>

                                            <button
                                                onClick={goNext}
                                                disabled={currentPageIndex === totalPages - 1}
                                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                                    currentPageIndex === totalPages - 1
                                                        ? 'opacity-30 cursor-not-allowed text-slate-500'
                                                        : selectedBookId === 'graduation'
                                                            ? 'bg-amber-500 text-slate-950 font-bold hover:bg-amber-400'
                                                            : 'bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400'
                                                }`}
                                            >
                                                <span>{isRTL ? 'الصفحة التالية' : 'Next'}</span>
                                                {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bottom Keyboard & Swipe Hint */}
                <div className="relative z-20 text-center mt-2 text-[11px] text-slate-400 font-mono flex items-center gap-3">
                    <span>💡 {isRTL ? 'استخدم الأسهم ◄ ► أو الأزرار للتقليب' : 'Use ◄ ► Arrow keys or click to flip pages'}</span>
                    <span>•</span>
                    <span>{isRTL ? 'كتاب تفاعلي ثلاثي الأبعاد' : 'Interactive 3D Book Experience'}</span>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
