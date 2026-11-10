import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, MessageSquare, Volume2, VolumeX, X, Minimize2,
    Maximize2, Send, Compass, ShieldCheck, Cpu, Award, Briefcase,
    ChevronRight, ChevronLeft, CheckCircle, Zap, Flame, Radio
} from 'lucide-react';
import { sendTextMessage } from '../services/chatbotService';
import { useLanguage } from '../context/LanguageContext';

// =============================================================================
// PROCEDURAL PIXEL TEXTURE GENERATORS: MONKEY D. LUFFY (ONE PIECE)
// =============================================================================

function createPixelCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { canvas, ctx };
}

function canvasToTexture(canvas) {
    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    return texture;
}

/**
 * Generate 64x64 Luffy Head Texture:
 * Sun-kissed tan skin, messy jet-black anime hair bangs, large expressive anime eyes,
 * left-eye stitch scar (under eye), and big signature confident "D." grin!
 */
function createLuffyHeadTexture() {
    const { canvas, ctx } = createPixelCanvas(64, 64);

    // Warm sun-kissed anime skin tone
    ctx.fillStyle = '#fbd0a5';
    ctx.fillRect(0, 0, 64, 64);

    // Subtle anime shading under chin and hairline
    ctx.fillStyle = '#f4be8e';
    ctx.fillRect(0, 56, 64, 8);
    ctx.fillRect(0, 20, 64, 4);

    // Cute anime cheek blush
    ctx.fillStyle = 'rgba(248, 113, 113, 0.45)';
    ctx.fillRect(10, 42, 10, 4);
    ctx.fillRect(44, 42, 10, 4);

    // Jet black messy anime hair base
    const hairTones = ['#09090b', '#18181b', '#111827', '#030712'];
    for (let x = 0; x < 64; x += 8) {
        for (let y = 0; y < 22; y += 8) {
            ctx.fillStyle = hairTones[(x + y) % hairTones.length];
            ctx.fillRect(x, y, 8, 8);
        }
    }

    // Sideburn locks framing face
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 22, 10, 22);
    ctx.fillRect(54, 22, 10, 22);
    ctx.fillRect(0, 44, 6, 8);
    ctx.fillRect(58, 44, 6, 8);

    // Spiky anime bangs dangling over forehead
    ctx.fillRect(14, 22, 8, 10);
    ctx.fillRect(18, 30, 4, 4); // Bang tip
    ctx.fillRect(26, 22, 12, 8);
    ctx.fillRect(30, 28, 4, 4); // Center bang tip
    ctx.fillRect(42, 22, 8, 10);
    ctx.fillRect(44, 30, 4, 4); // Right bang tip

    // Sharp anime eyebrows
    ctx.fillStyle = '#09090b';
    ctx.fillRect(14, 26, 12, 3);
    ctx.fillRect(38, 26, 12, 3);

    // Anime Eyes: Big circular black rings, white sclera, dark iris & shiny catchlights
    // Left eye (viewer's left)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(14, 31, 12, 9);
    ctx.fillStyle = '#09090b';
    ctx.strokeRect(14, 31, 12, 9);
    ctx.fillRect(18, 32, 7, 7); // Pupil
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(19, 33, 3, 3); // White catchlight gleam

    // Right eye (viewer's right)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(38, 31, 12, 9);
    ctx.fillStyle = '#09090b';
    ctx.strokeRect(38, 31, 12, 9);
    ctx.fillRect(39, 32, 7, 7); // Pupil
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(40, 33, 3, 3); // White catchlight gleam

    // Signature stitch scar under left eye (iconic Luffy feature!)
    ctx.fillStyle = '#991b1b'; // Dark crimson scar line
    ctx.fillRect(16, 42, 9, 2);
    // Vertical stitch sutures
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(18, 40, 2, 5);
    ctx.fillRect(22, 40, 2, 5);

    // Big signature confident "D." smile!
    ctx.fillStyle = '#881337'; // Mouth interior dark ruby
    ctx.beginPath();
    ctx.arc(32, 49, 11, 0, Math.PI, false);
    ctx.fill();

    // Gleaming white teeth row
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(23, 49, 18, 5);
    ctx.fillStyle = '#09090b';
    ctx.strokeRect(23, 49, 18, 5);
    // Tooth lines
    ctx.fillRect(28, 49, 1, 5);
    ctx.fillRect(32, 49, 1, 5);
    ctx.fillRect(36, 49, 1, 5);

    return canvasToTexture(canvas);
}

/**
 * Generate 64x64 Luffy Torso Texture:
 * Open scarlet red pirate vest, exposed chest with Akainu X-scar,
 * bright golden yellow waist sash belt, and golden pirate vest buttons.
 */
function createLuffyTorsoTexture() {
    const { canvas, ctx } = createPixelCanvas(64, 64);

    // Warm sun-kissed skin base
    ctx.fillStyle = '#fbd0a5';
    ctx.fillRect(0, 0, 64, 64);

    // Defined pectoral and abs shadows
    ctx.fillStyle = '#f4be8e';
    ctx.fillRect(22, 16, 20, 2); // Collarbone
    ctx.fillRect(31, 18, 2, 28); // Sternum line
    ctx.fillRect(24, 28, 16, 2); // Pec line
    ctx.fillRect(26, 36, 12, 2); // Upper abs
    ctx.fillRect(27, 42, 10, 2); // Mid abs

    // --- ICONIC X-SCAR ON CHEST (from Akainu at Marineford) ---
    ctx.fillStyle = '#991b1b'; // Deep crimson burned scar
    // Slash 1: Top-left to bottom-right
    for (let i = 0; i < 22; i++) {
        ctx.fillRect(21 + i, 16 + i, 3, 3);
    }
    // Slash 2: Top-right to bottom-left
    for (let i = 0; i < 22; i++) {
        ctx.fillRect(41 - i, 16 + i, 3, 3);
    }
    // Highlight raised edges of scar
    ctx.fillStyle = '#fca5a5';
    ctx.fillRect(20, 16, 2, 2);
    ctx.fillRect(42, 16, 2, 2);
    ctx.fillRect(30, 26, 4, 3); // Center burn junction

    // --- OPEN RED PIRATE VEST ---
    // Left vest panel
    ctx.fillStyle = '#dc2626'; // Vibrant scarlet red
    ctx.fillRect(0, 0, 19, 48);
    ctx.fillStyle = '#b91c1c'; // Shadow border
    ctx.fillRect(17, 0, 2, 48);

    // Right vest panel
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(45, 0, 19, 48);
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(45, 0, 2, 48);

    // Vest collar folds at top shoulders
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(0, 0, 16, 8);
    ctx.fillRect(48, 0, 16, 8);

    // Golden brass vest buttons on inner flaps
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(14, 18, 3, 4);
    ctx.fillRect(14, 30, 3, 4);
    ctx.fillRect(14, 40, 3, 4);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(15, 19, 1, 2);
    ctx.fillRect(15, 31, 1, 2);
    ctx.fillRect(15, 41, 1, 2);

    // --- BRIGHT GOLDEN YELLOW PIRATE WAIST SASH ---
    const sashYellows = ['#f59e0b', '#fbbf24', '#d97706', '#fcd34d'];
    for (let x = 0; x < 64; x += 8) {
        for (let y = 48; y < 62; y += 4) {
            ctx.fillStyle = sashYellows[(x + y) % sashYellows.length];
            ctx.fillRect(x, y, 8, 4);
        }
    }
    // Sash cloth wrinkles & hanging knot on left hip
    ctx.fillStyle = '#b45309';
    ctx.fillRect(0, 54, 64, 2);
    ctx.fillRect(12, 52, 10, 12);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(14, 54, 6, 10);

    // Lower hem
    ctx.fillStyle = '#1d4ed8'; // Blue shorts top rim peeking through
    ctx.fillRect(0, 60, 64, 4);

    return canvasToTexture(canvas);
}

/**
 * Generate 32x64 Luffy Arm Texture:
 * Red sleeveless vest shoulder cuff, muscular sun-kissed skin arm,
 * and Left wrist holds the golden navigational Log Pose!
 */
function createLuffyArmTexture(isLeft = false) {
    const { canvas, ctx } = createPixelCanvas(32, 64);

    // Top vest sleeve cuff in scarlet red
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 0, 32, 12);
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(0, 10, 32, 2);

    // Sun-kissed skin arm
    ctx.fillStyle = '#fbd0a5';
    ctx.fillRect(0, 12, 32, 52);

    // Subtle muscle shadows
    ctx.fillStyle = '#f4be8e';
    ctx.fillRect(4, 22, 6, 18);
    ctx.fillRect(22, 22, 6, 18);

    if (isLeft) {
        // --- LOG POSE ON LEFT WRIST ---
        // Leather/brass wristband
        ctx.fillStyle = '#d97706';
        ctx.fillRect(0, 36, 32, 10);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(0, 38, 32, 6);

        // Glass sphere dome of Log Pose
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(8, 34, 16, 14);
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(10, 36, 6, 4); // Glass reflection gleam

        // Floating compass needle pointing to next Grand Line Island!
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(15, 37, 2, 4);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(15, 41, 2, 4);
    } else {
        // Right arm: clenched strong pirate fist
        ctx.fillStyle = '#f4be8e';
        ctx.fillRect(6, 46, 20, 4);
        ctx.fillRect(10, 52, 12, 8);
    }

    return canvasToTexture(canvas);
}

/**
 * Generate 32x64 Luffy Leg Texture:
 * Denim blue shorts, fluffy rolled white cuffs, bare tan calves,
 * and straw woven sandals (waraji/zōri) with black straps.
 */
function createLuffyLegTexture() {
    const { canvas, ctx } = createPixelCanvas(32, 64);

    // Denim blue shorts
    const denimBlues = ['#2563eb', '#1d4ed8', '#1e40af'];
    for (let x = 0; x < 32; x += 8) {
        for (let y = 0; y < 36; y += 8) {
            ctx.fillStyle = denimBlues[(x + y) % denimBlues.length];
            ctx.fillRect(x, y, 8, 8);
        }
    }
    // Denim side seam
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(14, 0, 4, 36);

    // Fluffy rolled white cuffs at shorts hem
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 36, 32, 8);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, 42, 32, 2);

    // Bare tan calves
    ctx.fillStyle = '#fbd0a5';
    ctx.fillRect(0, 44, 32, 12);
    ctx.fillStyle = '#f4be8e';
    ctx.fillRect(4, 46, 8, 8);

    // Straw sandals (Waraji / Zōri)
    ctx.fillStyle = '#d97706'; // Woven golden straw sole
    ctx.fillRect(0, 56, 32, 8);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(2, 58, 28, 4);

    // Black/red sandal thongs
    ctx.fillStyle = '#09090b';
    ctx.fillRect(10, 56, 4, 6);
    ctx.fillRect(18, 56, 4, 6);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(14, 57, 4, 3);

    return canvasToTexture(canvas);
}

/**
 * Web Audio Synthesizer: Plays heroic anime chime fanfare chords
 */
function playAnimeFanfare(type = 'chime') {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();

        if (type === 'gear5') {
            // Drums of Liberation cheerful pentatonic arpeggio (C5, E5, G5, A5, C6)
            const freqs = [523.25, 659.25, 783.99, 880.00, 1046.50];
            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

                gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(ctx.currentTime + idx * 0.08);
                osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
            });
        } else {
            // Quick friendly Grand Line chime (G4, C5, E5)
            const freqs = [392.00, 523.25, 659.25];
            freqs.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);

                gain.gain.setValueAtTime(0.10, ctx.currentTime + idx * 0.09);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.3);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(ctx.currentTime + idx * 0.09);
                osc.stop(ctx.currentTime + idx * 0.09 + 0.35);
            });
        }
    } catch (e) {
        // AudioContext policy suppression gracefully handled
    }
}

/**
 * Generate Grand Line / One Piece Holographic Projector Canvas:
 * Displays current Arc, Gear status, Poneglyph runes, and production specs
 */
function createOnePieceHologramCanvas(arcBadge = 'EAST BLUE ARC', title = 'Setting Sail on the Grand Line!', specs = 'Omar Mohamed • AI & MLOps Captain') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Deep ocean pirate navigator dark backdrop
    ctx.fillStyle = '#061325';
    ctx.fillRect(0, 0, 256, 128);

    // Glowing Golden Straw Hat / Poneglyph frame
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(4, 4, 248, 120);

    // Corner decorative corner brackets
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    // Top-left
    ctx.strokeRect(2, 2, 14, 14);
    // Top-right
    ctx.strokeRect(240, 2, 14, 14);
    // Bottom-left
    ctx.strokeRect(2, 112, 14, 14);
    // Bottom-right
    ctx.strokeRect(240, 112, 14, 14);

    // Scanlines
    for (let y = 10; y < 120; y += 8) {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.06)';
        ctx.fillRect(6, y, 244, 4);
    }

    // Arc Header with Jolly Roger emoji
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`☠️ [LOG POSE] ${arcBadge.toUpperCase().slice(0, 24)}`, 14, 24);

    // Title / Milestone
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText(title.slice(0, 26), 14, 52);

    // Tech specs / Achievements
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px monospace';
    ctx.fillText(`• ${specs.slice(0, 30)}`, 14, 76);

    // Status / Gear mode
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('• 204 Passing Tests • Zero Downtime', 14, 98);

    // Floating blinking indicator
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(230, 16, 6, 10);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return { canvas, ctx, texture };
}

// =============================================================================
// THE 9 LEGENDARY ONE PIECE ARCS (Mapping sections to Luffy's journey)
// =============================================================================

const ONE_PIECE_ARCS = [
    {
        id: 'home',
        arcBadge: '⛵ East Blue Arc • Romance Dawn',
        title: 'Setting Sail for the Grand Line!',
        specs: 'Omar Mohamed • AI & MLOps Captain',
        quoteEn: "I'm gonna be the King of the Pirates! Welcome to Omar's Grand Line portfolio!",
        quoteAr: "سأصبح ملك القراصنة! أهلاً بك في محفظة المهندس عمر الرقمية على خط الجراند لاين!",
        gear: 'Romance Dawn',
        targetId: 'home'
    },
    {
        id: 'about',
        arcBadge: '🍖 Baratie & Loguetown Arc',
        title: 'Pirate Ambition & Engineering Philosophy',
        specs: 'M.Sc. CGPA 4.0 • Applied AI Research',
        quoteEn: "A true engineer never gives up on their dream! From research to production, full speed ahead!",
        quoteAr: "طريق المجد لا يعرف التراجع! من البحث الأكاديمي إلى بيئات الإنتاج بأعلى كفاءة!",
        gear: 'Baratie Code',
        targetId: 'about'
    },
    {
        id: 'experience',
        arcBadge: '🚂 Water 7 & Enies Lobby Arc',
        title: 'Gear 2: High Concurrency Battles!',
        specs: 'PlayerHub.GG Dubai • CliniSoft • Zero-Downtime',
        quoteEn: "Gear Second! Pumping high-concurrency traffic through PlayerHub and CliniSoft with zero downtime!",
        quoteAr: "جير سكند! ضخ حركة البيانات العالية في PlayerHub و CliniSoft دون أي توقف!",
        gear: '⚡ Gear 2',
        targetId: 'experience'
    },
    {
        id: 'internships',
        arcBadge: '🏝️ Rusukaina 2-Year Training Arc',
        title: 'Haki Mastery with Silvers Rayleigh',
        specs: 'DEPI 5 Projects • Telecom Egypt • Linux Red Hat',
        quoteEn: "3D2Y! Two years of rigorous training mastering Cloud, DevOps, and Deep Learning pipelines!",
        quoteAr: "عامان من التدريب المكثف وإتقان أدوات السحابة و DevOps والذكاء الاصطناعي!",
        gear: '⚔️ Haki Focus',
        targetId: 'internships'
    },
    {
        id: 'skills',
        arcBadge: '🍩 Whole Cake Island Arc',
        title: 'Advanced Observation Haki (Future AI)',
        specs: 'LLMs • RAG • Multi-Agent • Kubernetes • Docker',
        quoteEn: "I can see the future! Generative AI, RAG architectures, and Cloud Kubernetes mastery!",
        quoteAr: "هاكي التنبؤ بالمستقبل! نماذج اللغة التوليدية، RAG، وبنية الحاويات السحابية!",
        gear: '👁️ Future Sight',
        targetId: 'skills'
    },
    {
        id: 'projects',
        arcBadge: '⚡ Wano Country Arc (Onigashima)',
        title: 'Gear 5 Awakening: HistoryVerse (A+)',
        specs: 'HistoryVerse • AWS Fargate • 204 Verified Tests',
        quoteEn: "Drums of Liberation! Gear 5 Awakening — HistoryVerse delivered with A+ honors and 204 tests!",
        quoteAr: "طبول الحرية وجير فيفث! مشروع HistoryVerse بتقدير ممتاز A+ و 204 اختبارات مؤكدة!",
        gear: '☀️ Gear 5 Sun God',
        targetId: 'projects'
    },
    {
        id: 'education',
        arcBadge: '🔬 Egghead Island Arc',
        title: "Dr. Vegapunk's 500-Year Future Tech",
        specs: 'M.Sc. Arab Academy (CGPA 4.0) • ITI Camp',
        quoteEn: "Dr. Vegapunk would love this tech! M.Sc. in Computer Engineering with CGPA 4.0/4.0!",
        quoteAr: "تقنيات المستقبل من جزيرة إيجهيد! ماجستير هندسة الحاسب بمعدل 4.0 كامل!",
        gear: '🔬 Future Tech',
        targetId: 'education'
    },
    {
        id: 'certifications',
        arcBadge: '🎖️ Egghead Arc • Verified Credentials',
        title: 'Red Hat RHCSA #250-068-707',
        specs: 'RHCSA • Aspire Leaders • Huawei HCCDA',
        quoteEn: "Official credentials recognized across all seas! Red Hat Certified System Administrator!",
        quoteAr: "اعتمادات عالمية موثقة! شهادة مهندس نظم معتمد من ريد هات RHCSA!",
        gear: '📜 Verified Creds',
        targetId: 'certifications'
    },
    {
        id: 'faq',
        arcBadge: '📜 Laugh Tale Arc • The Poneglyphs',
        title: 'Uncovering All Answers & Technical Specs',
        specs: 'Architecture Specs • Hiring FAQs • Live Stack',
        quoteEn: "The Rio Poneglyph has revealed all the answers! Everything you need to know about Omar's tech stack!",
        quoteAr: "نقوش البونيغليف تكشف كل الإجابات! كل ما تريد معرفته عن مهارات وخبرات عمر!",
        gear: '📜 Poneglyph',
        targetId: 'faq'
    },
    {
        id: 'contact',
        arcBadge: '🏴‍☠️ Straw Hat Grand Fleet Arc',
        title: 'Join The Crew! Book a Discovery Call',
        specs: 'Direct Contracts • Consulting • Hire Omar',
        quoteEn: "Join our Grand Fleet! Reach out now or book a Discovery Call to build something legendary together!",
        quoteAr: "انضم إلى الأسطول! احجز استشارة تقنية أو تواصل مباشرة لبناء أنظمة أسطورية!",
        gear: '🤝 Join Fleet',
        targetId: 'contact'
    }
];

// =============================================================================
// MAIN 3D COMPANION COMPONENT (MONKEY D. LUFFY)
// =============================================================================

export default function MinecraftGuide3D({ onStartTour }) {
    const containerRef = useRef(null);
    const canvasContainerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const characterGroupRef = useRef(null);
    const headGroupRef = useRef(null);
    const strawHatGroupRef = useRef(null);
    const leftArmGroupRef = useRef(null);
    const rightArmGroupRef = useRef(null);
    const leftLegGroupRef = useRef(null);
    const rightLegGroupRef = useRef(null);
    const meatPropRef = useRef(null);
    const auraMeshRef = useRef(null);
    const heldLogPoseGroupRef = useRef(null);
    const hologramCanvasRef = useRef(null);
    const hologramGroupRef = useRef(null);
    const inspectTimeoutRef = useRef(null);

    // Animation state refs
    const animStateRef = useRef({
        mode: 'idle', // 'idle' | 'walk' | 'wave' | 'talk' | 'jump' | 'gear2' | 'gear5' | 'meat' | 'inspect'
        targetLook: { x: 0, y: 0 },
        jumpProgress: 0,
        talkTimer: 0
    });

    const { t, currentLocale, isRTL } = useLanguage();
    const tourSteps = currentLocale?.tourSteps || [];
    const previousHighlightRef = useRef(null);

    // Component UI state
    const [isOpen, setIsOpen] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [currentArcIndex, setCurrentArcIndex] = useState(0);
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 'init-1',
            from: 'luffy',
            text: isRTL
                ? "🏴‍☠️ **أهلاً بك يا بطل! أنا مونكي دي لوفي!** 🍖\n\nأنا قائد طاقم قبعة القش ومرشدك في محفظة المهندس **عمر محمد**! سآخذك في رحلة عبر جزر وأركات الجراند لاين؛ من **PlayerHub** و **CliniSoft** إلى **HistoryVerse**!"
                : "🏴‍☠️ **Ahoy, adventurer! I'm Monkey D. Luffy!** 🍖\n\nCaptain of the Straw Hat crew and your AI guide through **Omar Mohamed's Grand Line** portfolio! As you scroll, we will sail across legendary One Piece Arcs from **East Blue** all the way to **Wano Gear 5** and **Egghead Island**!"
        }
    ]);
    const [isThinking, setIsThinking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [actionBadge, setActionBadge] = useState('⛵ Romance Dawn');
    const [tourData, setTourData] = useState(null);
    const [tourChatMode, setTourChatMode] = useState(false);
    const chatEndRef = useRef(null);

    const activeArc = ONE_PIECE_ARCS[currentArcIndex] || ONE_PIECE_ARCS[0];

    // Speech synthesis helper
    const speakText = useCallback((text) => {
        if (!voiceEnabled || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const clean = text.replace(/[*_#`[\]()•]/g, ' ').replace(/\s+/g, ' ').trim();
        const utterance = new SpeechSynthesisUtterance(clean);
        const isArabicText = /[\u0600-\u06FF]/.test(clean);
        utterance.lang = isArabicText ? 'ar-SA' : 'en-US';
        utterance.rate = 1.08;
        utterance.pitch = 1.15; // Energetic, youthful Luffy pitch!

        utterance.onstart = () => {
            setIsSpeaking(true);
            animStateRef.current.mode = 'talk';
            setActionBadge('Speaking');
        };
        utterance.onend = () => {
            setIsSpeaking(false);
            animStateRef.current.mode = 'idle';
            setActionBadge(activeArc.gear);
        };
        utterance.onerror = () => {
            setIsSpeaking(false);
            animStateRef.current.mode = 'idle';
            setActionBadge(activeArc.gear);
        };

        window.speechSynthesis.speak(utterance);
    }, [voiceEnabled, activeArc]);

    // Update Grand Line Holographic Projector
    const showArcHologram = useCallback((arc, customSpeech) => {
        if (hologramCanvasRef.current) {
            const { ctx, texture } = hologramCanvasRef.current;
            ctx.fillStyle = '#061325';
            ctx.fillRect(0, 0, 256, 128);

            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2.5;
            ctx.strokeRect(4, 4, 248, 120);

            ctx.strokeStyle = '#fbbf24';
            ctx.lineWidth = 4;
            ctx.strokeRect(2, 2, 14, 14);
            ctx.strokeRect(240, 2, 14, 14);
            ctx.strokeRect(2, 112, 14, 14);
            ctx.strokeRect(240, 112, 14, 14);

            for (let y = 10; y < 120; y += 8) {
                ctx.fillStyle = 'rgba(245, 158, 11, 0.06)';
                ctx.fillRect(6, y, 244, 4);
            }

            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 11px monospace';
            ctx.fillText(`☠️ [LOG POSE] ${arc.arcBadge.toUpperCase().slice(0, 24)}`, 14, 24);

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 13px sans-serif';
            ctx.fillText(arc.title.slice(0, 26), 14, 52);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '11px monospace';
            ctx.fillText(`• ${arc.specs.slice(0, 30)}`, 14, 76);

            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 11px monospace';
            ctx.fillText('• 204 Tests • Drums of Liberation', 14, 98);

            ctx.fillStyle = '#22c55e';
            ctx.fillRect(230, 16, 6, 10);

            texture.needsUpdate = true;
        }

        animStateRef.current.mode = 'inspect';
        setActionBadge(arc.gear);

        if (customSpeech) {
            speakText(customSpeech);
        }

        if (inspectTimeoutRef.current) clearTimeout(inspectTimeoutRef.current);
        inspectTimeoutRef.current = setTimeout(() => {
            animStateRef.current.mode = 'idle';
            setActionBadge(arc.gear);
        }, 6500);
    }, [speakText]);

    // Handle user message submission
    const handleSend = async (customPrompt) => {
        const text = (customPrompt || inputText).trim();
        if (!text || isThinking) return;

        setInputText('');
        const userMsg = { id: `u-${Date.now()}`, from: 'user', text };
        setMessages(prev => [...prev, userMsg]);

        setIsThinking(true);
        setActionBadge('Thinking...');
        animStateRef.current.mode = 'jump';

        setTimeout(() => {
            animStateRef.current.mode = 'wave';
            setActionBadge('Yoooo!');
            setTimeout(() => {
                animStateRef.current.mode = 'idle';
                setActionBadge(activeArc.gear);
            }, 1200);
        }, 500);

        try {
            const history = messages.slice(-5).map(m => ({
                role: m.from === 'luffy' ? 'assistant' : 'user',
                content: m.text
            }));

            const response = await sendTextMessage(text, history);
            const botAnswer = response?.Answer || response?.answer || "I'm ready for another Grand Line adventure!";

            const botMsg = {
                id: `b-${Date.now()}`,
                from: 'luffy',
                text: botAnswer
            };
            setMessages(prev => [...prev, botMsg]);
            speakText(botAnswer);
        } catch (err) {
            console.error('Luffy guide chat error:', err);
            const errorMsg = {
                id: `b-${Date.now()}`,
                from: 'luffy',
                text: isRTL
                    ? "⚠️ واجهنا عاصفة في الجراند لاين! يمكنك سؤالي عن PlayerHub أو CliniSoft أو HistoryVerse أو طرق التواصل مع عمر!"
                    : "⚠️ Sea King encountered! You can ask me about PlayerHub, CliniSoft, HistoryVerse, or Omar's contact info!"
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsThinking(false);
            setActionBadge(activeArc.gear);
            animStateRef.current.mode = 'idle';
        }
    };

    // Auto scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking]);

    // Smooth scroll helper
    const scrollToTarget = useCallback((targetId) => {
        if (!targetId) return;
        if (targetId === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        const element = document.getElementById(targetId);
        if (!element) return;
        const nav = document.querySelector('nav');
        const navOffset = nav ? nav.offsetHeight + 20 : 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = Math.max(0, elementPosition - navOffset);
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }, []);

    // End tour
    const endTour = useCallback(() => {
        if (previousHighlightRef.current) {
            previousHighlightRef.current.classList.remove('tour-focused-element');
            previousHighlightRef.current = null;
        }
        setTourData(null);
        setTourChatMode(false);
        animStateRef.current.mode = 'idle';
        setActionBadge(activeArc.gear);
    }, [activeArc]);

    // Jump to specific tour step
    const goToTourStep = useCallback((stepIndex) => {
        if (!tourSteps || !tourSteps.length) return;
        const idx = Math.max(0, Math.min(stepIndex, tourSteps.length - 1));
        const step = tourSteps[idx];
        if (!step) return;

        setIsOpen(true);
        setIsMinimized(false);
        setTourChatMode(false);
        setTourData({
            stepIndex: idx,
            totalSteps: tourSteps.length,
            title: step.title,
            description: step.description,
            badge: step.badge,
            targetId: step.targetId
        });

        // Correlate step with One Piece Arc
        const matchingArc = ONE_PIECE_ARCS.find(a => a.id === step.targetId) || ONE_PIECE_ARCS[idx % ONE_PIECE_ARCS.length];
        const arcIndex = ONE_PIECE_ARCS.indexOf(matchingArc);
        if (arcIndex !== -1) setCurrentArcIndex(arcIndex);

        setActionBadge(matchingArc.gear);
        scrollToTarget(step.targetId);

        if (previousHighlightRef.current) {
            previousHighlightRef.current.classList.remove('tour-focused-element');
        }
        const targetEl = step.targetId === 'home'
            ? document.getElementById('home') || document.querySelector('.hero-section')
            : document.getElementById(step.targetId);
        if (targetEl) {
            targetEl.classList.add('tour-focused-element');
            previousHighlightRef.current = targetEl;
        }

        playAnimeFanfare('chime');
        showArcHologram(matchingArc, `${matchingArc.title}. ${step.description}`);

        animStateRef.current.mode = 'walk';
        setTimeout(() => {
            animStateRef.current.mode = 'wave';
            setTimeout(() => {
                animStateRef.current.mode = 'idle';
            }, 1500);
        }, 600);
    }, [tourSteps, scrollToTarget, showArcHologram]);

    // Launch tour starting from step 0
    const handleLaunchTour = useCallback(() => {
        animStateRef.current.mode = 'walk';
        setActionBadge('Setting Sail!');
        playAnimeFanfare('gear5');
        setMessages(prev => [
            ...prev,
            {
                id: `t-${Date.now()}`,
                from: 'luffy',
                text: isRTL
                    ? "🚀 **أبحرنا نحو الجراند لاين!** اتبعني لاستكشاف إنجازات المهندس عمر ومحطات مسيرته في كل أرك!"
                    : "🚀 **Setting sail across the Grand Line!** Follow me as we explore Omar's engineering achievements section by section!"
            }
        ]);
        goToTourStep(0);
    }, [goToTourStep, isRTL]);

    // Global listener for tour triggers
    useEffect(() => {
        window.startPortfolioTour = () => goToTourStep(0);
        const onStart = () => goToTourStep(0);
        const onClose = () => endTour();
        const onNext = () => {
            setTourData(prev => {
                if (!prev) return null;
                if (prev.stepIndex < prev.totalSteps - 1) {
                    goToTourStep(prev.stepIndex + 1);
                } else {
                    endTour();
                }
                return prev;
            });
        };
        const onPrev = () => {
            setTourData(prev => {
                if (!prev || prev.stepIndex <= 0) return prev;
                goToTourStep(prev.stepIndex - 1);
                return prev;
            });
        };

        window.addEventListener('start-portfolio-tour', onStart);
        window.addEventListener('portfolio-tour-close', onClose);
        window.addEventListener('portfolio-tour-next', onNext);
        window.addEventListener('portfolio-tour-prev', onPrev);

        return () => {
            delete window.startPortfolioTour;
            window.removeEventListener('start-portfolio-tour', onStart);
            window.removeEventListener('portfolio-tour-close', onClose);
            window.removeEventListener('portfolio-tour-next', onNext);
            window.removeEventListener('portfolio-tour-prev', onPrev);
        };
    }, [goToTourStep, endTour]);

    // Keyboard navigation when tour is active
    useEffect(() => {
        if (!tourData) return;
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' || e.key === 'Enter') {
                if (tourData.stepIndex < tourData.totalSteps - 1) {
                    goToTourStep(tourData.stepIndex + 1);
                } else {
                    endTour();
                }
            } else if (e.key === 'ArrowLeft') {
                if (tourData.stepIndex > 0) {
                    goToTourStep(tourData.stepIndex - 1);
                }
            } else if (e.key === 'Escape') {
                endTour();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [tourData, goToTourStep, endTour]);

    // Listen for toggle guide event from external buttons
    useEffect(() => {
        const handleToggleGuide = (e) => {
            const forceOpen = e?.detail?.open;
            setIsOpen(prev => (forceOpen !== undefined ? forceOpen : !prev));
            setIsMinimized(false);
            if (forceOpen !== false) {
                window.dispatchEvent(new CustomEvent('close-chat-widget'));
                animStateRef.current.mode = 'jump';
                setActionBadge('Yoooo!');
                setTimeout(() => {
                    animStateRef.current.mode = 'wave';
                    setTimeout(() => {
                        animStateRef.current.mode = 'idle';
                        setActionBadge(activeArc.gear);
                    }, 1500);
                }, 500);
            }
        };

        window.addEventListener('toggle-3d-minecraft-guide', handleToggleGuide);
        return () => window.removeEventListener('toggle-3d-minecraft-guide', handleToggleGuide);
    }, [activeArc]);

    // Section transition observer: dynamically triggers the 9 One Piece Arcs!
    useEffect(() => {
        let lastActiveSection = '';
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.40) {
                        const secId = entry.target.id;
                        if (secId && secId !== lastActiveSection) {
                            lastActiveSection = secId;
                            const arcIdx = ONE_PIECE_ARCS.findIndex(s => s.id === secId);
                            if (arcIdx !== -1) {
                                setCurrentArcIndex(arcIdx);
                                const arc = ONE_PIECE_ARCS[arcIdx];
                                showArcHologram(arc);

                                // Special reaction for flagship Arcs
                                if (secId === 'projects') {
                                    playAnimeFanfare('gear5');
                                    animStateRef.current.mode = 'gear5';
                                    setTimeout(() => {
                                        animStateRef.current.mode = 'inspect';
                                    }, 1800);
                                } else if (secId === 'experience') {
                                    animStateRef.current.mode = 'gear2';
                                    setTimeout(() => {
                                        animStateRef.current.mode = 'inspect';
                                    }, 1600);
                                }
                            }
                        }
                    }
                }
            },
            { threshold: 0.40 }
        );

        ONE_PIECE_ARCS.forEach(arc => {
            const el = document.getElementById(arc.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [showArcHologram]);

    // =========================================================================
    // THREE.JS SETUP & LUFFY 3D RIGGING
    // =========================================================================
    useEffect(() => {
        const mount = canvasContainerRef.current;
        if (!mount) return;

        const width = mount.clientWidth || 220;
        const height = mount.clientHeight || 260;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
        camera.position.set(0, 1.25, 5.2);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = false;
        mount.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
        scene.add(ambientLight);

        // Golden sunny Grand Line rim light
        const sunLight = new THREE.DirectionalLight(0xfde047, 1.8);
        sunLight.position.set(3, 4, 3);
        scene.add(sunLight);

        // Ocean cyan fill light
        const oceanLight = new THREE.DirectionalLight(0x38bdf8, 0.7);
        oceanLight.position.set(-3, 2, 2);
        scene.add(oceanLight);

        // Textures
        const headTex = createLuffyHeadTexture();
        const torsoTex = createLuffyTorsoTexture();
        const leftArmTex = createLuffyArmTexture(true);
        const rightArmTex = createLuffyArmTexture(false);
        const legTex = createLuffyLegTexture();

        // Materials
        const headMat = new THREE.MeshLambertMaterial({ map: headTex });
        const torsoMat = new THREE.MeshLambertMaterial({ map: torsoTex });
        const leftArmMat = new THREE.MeshLambertMaterial({ map: leftArmTex });
        const rightArmMat = new THREE.MeshLambertMaterial({ map: rightArmTex });
        const legMat = new THREE.MeshLambertMaterial({ map: legTex });

        // Character Root Group
        const characterGroup = new THREE.Group();
        characterGroup.position.set(0, -0.22, 0);
        characterGroup.rotation.y = -0.15;
        scene.add(characterGroup);
        characterGroupRef.current = characterGroup;

        // Divine Sun God / Gear Aura (pulsing glowing ring behind Luffy)
        const auraGeo = new THREE.RingGeometry(0.8, 1.4, 32);
        const auraMat = new THREE.MeshBasicMaterial({
            color: 0xfacc15,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.18
        });
        const auraMesh = new THREE.Mesh(auraGeo, auraMat);
        auraMesh.position.set(0, 0.8, -0.45);
        characterGroup.add(auraMesh);
        auraMeshRef.current = auraMesh;

        // 1. Torso (Open red vest & X-scar)
        const torsoGeo = new THREE.BoxGeometry(1.0, 1.35, 0.55);
        const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
        torsoMesh.position.y = 0.68;
        characterGroup.add(torsoMesh);

        // =====================================================================
        // 3D STRAW HAT (MUGIWARA) RIGGING
        // =====================================================================
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 1.38, 0);
        characterGroup.add(headGroup);
        headGroupRef.current = headGroup;

        // Head Box Mesh
        const headGeo = new THREE.BoxGeometry(0.95, 0.95, 0.95);
        const headMesh = new THREE.Mesh(headGeo, headMat);
        headMesh.position.set(0, 0.48, 0);
        headGroup.add(headMesh);

        // Mugiwara Straw Hat Group mounted to head
        const strawHatGroup = new THREE.Group();
        strawHatGroup.position.set(0, 0.96, -0.04);
        strawHatGroup.rotation.x = -0.16; // Tilted slightly back so his face & bangs show clearly!
        headGroup.add(strawHatGroup);
        strawHatGroupRef.current = strawHatGroup;

        // Straw Hat Material (warm golden yellow woven straw)
        const strawMat = new THREE.MeshLambertMaterial({ color: 0xeab308 });
        const ribbonMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });

        // 1. Wide circular straw brim
        const brimGeo = new THREE.CylinderGeometry(1.06, 1.06, 0.05, 32);
        const brimMesh = new THREE.Mesh(brimGeo, strawMat);
        strawHatGroup.add(brimMesh);

        // 2. Signature Scarlet Red Ribbon Band
        const ribbonGeo = new THREE.CylinderGeometry(0.58, 0.58, 0.12, 32);
        const ribbonMesh = new THREE.Mesh(ribbonGeo, ribbonMat);
        ribbonMesh.position.y = 0.08;
        strawHatGroup.add(ribbonMesh);

        // 3. Straw Crown Dome
        const crownGeo = new THREE.CylinderGeometry(0.53, 0.56, 0.32, 32);
        const crownMesh = new THREE.Mesh(crownGeo, strawMat);
        crownMesh.position.y = 0.28;
        strawHatGroup.add(crownMesh);

        // 4. Hat chinstrap string hanging behind neck
        const stringGeo = new THREE.TorusGeometry(0.55, 0.02, 8, 24, Math.PI);
        const stringMat = new THREE.MeshBasicMaterial({ color: 0x18181b });
        const stringMesh = new THREE.Mesh(stringGeo, stringMat);
        stringMesh.position.set(0, -0.22, 0.15);
        stringMesh.rotation.x = Math.PI / 2.2;
        strawHatGroup.add(stringMesh);

        // =====================================================================
        // HELD PROPS: 🍖 GIANT ANIME ROAST MEAT & 🧭 LOG POSE PROJECTOR
        // =====================================================================
        // Anime Meat Prop in Right Hand
        const meatGroup = new THREE.Group();
        meatGroup.position.set(0, -1.0, 0.32);
        meatGroup.rotation.x = Math.PI / 4;

        // Bone cylinder
        const boneGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.95, 12);
        const boneMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
        const boneMesh = new THREE.Mesh(boneGeo, boneMat);
        meatGroup.add(boneMesh);

        // Juicy golden-brown savory roast meat drumstick
        const meatDrumGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.52, 16);
        const meatDrumMat = new THREE.MeshLambertMaterial({ color: 0x92400e });
        const meatDrum = new THREE.Mesh(meatDrumGeo, meatDrumMat);
        meatGroup.add(meatDrum);
        meatPropRef.current = meatGroup;

        // 2. Left Arm Group (holds Log Pose on wrist)
        const leftArmGroup = new THREE.Group();
        leftArmGroup.position.set(-0.76, 1.28, 0);
        characterGroup.add(leftArmGroup);
        leftArmGroupRef.current = leftArmGroup;

        const armGeo = new THREE.BoxGeometry(0.44, 1.3, 0.44);
        const leftArmMesh = new THREE.Mesh(armGeo, leftArmMat);
        leftArmMesh.position.set(0, -0.58, 0);
        leftArmGroup.add(leftArmMesh);

        // 3. Right Arm Group (holds Meat)
        const rightArmGroup = new THREE.Group();
        rightArmGroup.position.set(0.76, 1.28, 0);
        characterGroup.add(rightArmGroup);
        rightArmGroupRef.current = rightArmGroup;

        const rightArmMesh = new THREE.Mesh(armGeo, rightArmMat);
        rightArmMesh.position.set(0, -0.58, 0);
        rightArmGroup.add(rightArmMesh);
        rightArmGroup.add(meatGroup);

        // 4. Log Pose Holographic Projector Group
        const heldLogPoseGroup = new THREE.Group();
        heldLogPoseGroup.position.set(0, 0.40, 0.60);
        heldLogPoseGroup.visible = false;
        torsoMesh.add(heldLogPoseGroup);
        heldLogPoseGroupRef.current = heldLogPoseGroup;

        // Grand Line Hologram Screen
        const initialArc = ONE_PIECE_ARCS[0];
        const holoData = createOnePieceHologramCanvas(initialArc.arcBadge, initialArc.title, initialArc.specs);
        hologramCanvasRef.current = holoData;

        const holoPlaneGeo = new THREE.PlaneGeometry(1.05, 0.54);
        const holoPlaneMat = new THREE.MeshBasicMaterial({
            map: holoData.texture,
            transparent: true,
            opacity: 0.94,
            side: THREE.DoubleSide
        });
        const holoPlaneMesh = new THREE.Mesh(holoPlaneGeo, holoPlaneMat);
        heldLogPoseGroup.add(holoPlaneMesh);
        hologramGroupRef.current = heldLogPoseGroup;

        // Golden beam light cone to hologram
        const beamGeo = new THREE.ConeGeometry(0.65, 0.85, 4, 1, true);
        const beamMat = new THREE.MeshBasicMaterial({
            color: 0xf59e0b,
            transparent: true,
            opacity: 0.20,
            wireframe: true
        });
        const beamMesh = new THREE.Mesh(beamGeo, beamMat);
        beamMesh.position.set(0, -0.45, 0);
        beamMesh.rotation.x = Math.PI;
        heldLogPoseGroup.add(beamMesh);

        // 5. Left Leg (Denim shorts & sandals)
        const leftLegGroup = new THREE.Group();
        leftLegGroup.position.set(-0.28, 0.05, 0);
        characterGroup.add(leftLegGroup);
        leftLegGroupRef.current = leftLegGroup;

        const legGeo = new THREE.BoxGeometry(0.45, 1.35, 0.45);
        const leftLegMesh = new THREE.Mesh(legGeo, legMat);
        leftLegMesh.position.set(0, -0.65, 0);
        leftLegGroup.add(leftLegMesh);

        // 6. Right Leg (Denim shorts & sandals)
        const rightLegGroup = new THREE.Group();
        rightLegGroup.position.set(0.28, 0.05, 0);
        characterGroup.add(rightLegGroup);
        rightLegGroupRef.current = rightLegGroup;

        const rightLegMesh = new THREE.Mesh(legGeo, legMat);
        rightLegMesh.position.set(0, -0.65, 0);
        rightLegGroup.add(rightLegMesh);

        // Mouse Tracking
        const handleMouseMove = (e) => {
            const rect = mount.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const normX = Math.max(-1, Math.min(1, (e.clientX - centerX) / (window.innerWidth * 0.4)));
            const normY = Math.max(-1, Math.min(1, (e.clientY - centerY) / (window.innerHeight * 0.4)));
            animStateRef.current.targetLook = {
                x: normX * 0.65,
                y: -normY * 0.45
            };
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Animation Loop
        let animationFrameId;
        let clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const time = clock.getElapsedTime();
            const anim = animStateRef.current;

            // Aura slow rotation and pulse
            if (auraMeshRef.current) {
                auraMeshRef.current.rotation.z = time * 0.5;
                const auraScale = 1.0 + Math.sin(time * 3) * 0.08;
                auraMeshRef.current.scale.set(auraScale, auraScale, 1);
            }

            // Head tracking lerp
            if (headGroupRef.current) {
                headGroupRef.current.rotation.y += (anim.targetLook.x - headGroupRef.current.rotation.y) * 0.1;
                headGroupRef.current.rotation.x += (anim.targetLook.y - headGroupRef.current.rotation.x) * 0.1;
            }

            // Mode animations
            switch (anim.mode) {
                case 'gear5':
                    // Gear 5 Sun God Nika: Joyful bounce, laughing head tilt, arms spread wide!
                    if (characterGroupRef.current) {
                        characterGroupRef.current.position.y = -0.22 + Math.abs(Math.sin(time * 12)) * 0.35;
                        characterGroupRef.current.rotation.y = Math.sin(time * 6) * 0.25;
                    }
                    if (headGroupRef.current) {
                        headGroupRef.current.rotation.x = -0.2 + Math.sin(time * 14) * 0.18;
                    }
                    if (rightArmGroupRef.current) {
                        rightArmGroupRef.current.rotation.x = -2.2 + Math.sin(time * 10) * 0.3;
                        rightArmGroupRef.current.rotation.z = -0.6;
                    }
                    if (leftArmGroupRef.current) {
                        leftArmGroupRef.current.rotation.x = -2.2 + Math.cos(time * 10) * 0.3;
                        leftArmGroupRef.current.rotation.z = 0.6;
                    }
                    if (auraMeshRef.current) {
                        auraMeshRef.current.material.opacity = 0.55 + Math.sin(time * 16) * 0.25;
                    }
                    break;

                case 'gear2':
                    // Gear 2: Low battle stance, rapid breathing, high speed!
                    if (characterGroupRef.current) {
                        characterGroupRef.current.position.y = -0.32 + Math.sin(time * 18) * 0.04;
                    }
                    if (rightArmGroupRef.current) {
                        rightArmGroupRef.current.rotation.x = -1.2 + Math.sin(time * 24) * 0.2;
                    }
                    if (leftArmGroupRef.current) {
                        leftArmGroupRef.current.rotation.x = 0.4 + Math.cos(time * 24) * 0.2;
                    }
                    break;

                case 'meat':
                    // Chomp chomp on the giant roast meat!
                    if (characterGroupRef.current) {
                        characterGroupRef.current.position.y = -0.22 + Math.abs(Math.sin(time * 8)) * 0.15;
                    }
                    if (rightArmGroupRef.current) {
                        rightArmGroupRef.current.rotation.x = -1.9 + Math.sin(time * 12) * 0.2;
                        rightArmGroupRef.current.rotation.y = -0.4;
                    }
                    break;

                case 'walk':
                    const walkSpeed = 9;
                    if (characterGroupRef.current) {
                        characterGroupRef.current.position.y = -0.22 + Math.abs(Math.sin(time * walkSpeed)) * 0.14;
                    }
                    if (leftLegGroupRef.current) leftLegGroupRef.current.rotation.x = Math.sin(time * walkSpeed) * 0.7;
                    if (rightLegGroupRef.current) rightLegGroupRef.current.rotation.x = -Math.sin(time * walkSpeed) * 0.7;
                    if (leftArmGroupRef.current) leftArmGroupRef.current.rotation.x = -Math.sin(time * walkSpeed) * 0.6;
                    if (rightArmGroupRef.current) rightArmGroupRef.current.rotation.x = Math.sin(time * walkSpeed) * 0.6;
                    break;

                case 'wave':
                    if (characterGroupRef.current) {
                        characterGroupRef.current.position.y = -0.22 + Math.sin(time * 3) * 0.05;
                    }
                    if (rightArmGroupRef.current) {
                        rightArmGroupRef.current.rotation.x = -2.6;
                        rightArmGroupRef.current.rotation.z = -0.4 + Math.sin(time * 14) * 0.45;
                    }
                    if (leftArmGroupRef.current) leftArmGroupRef.current.rotation.x = 0.1;
                    break;

                case 'talk':
                    if (characterGroupRef.current) {
                        characterGroupRef.current.position.y = -0.22 + Math.sin(time * 5) * 0.04;
                    }
                    if (headGroupRef.current) {
                        headGroupRef.current.rotation.x += Math.sin(time * 10) * 0.08;
                    }
                    if (rightArmGroupRef.current) {
                        rightArmGroupRef.current.rotation.x = -1.1 + Math.sin(time * 8) * 0.3;
                    }
                    break;

                case 'jump':
                    anim.jumpProgress += 0.1;
                    const jumpY = Math.sin(anim.jumpProgress) * 0.45;
                    if (characterGroupRef.current) {
                        characterGroupRef.current.position.y = -0.22 + Math.max(0, jumpY);
                    }
                    if (anim.jumpProgress >= Math.PI) {
                        anim.jumpProgress = 0;
                        anim.mode = 'idle';
                    }
                    break;

                case 'inspect':
                    if (heldLogPoseGroupRef.current) heldLogPoseGroupRef.current.visible = true;
                    if (meatPropRef.current) meatPropRef.current.visible = false;

                    if (characterGroupRef.current) {
                        characterGroupRef.current.position.y = -0.22 + Math.sin(time * 3) * 0.02;
                    }
                    if (headGroupRef.current) {
                        headGroupRef.current.rotation.x += (0.28 - headGroupRef.current.rotation.x) * 0.12;
                    }
                    if (leftArmGroupRef.current) {
                        leftArmGroupRef.current.rotation.x = -1.15;
                        leftArmGroupRef.current.rotation.y = 0.35;
                    }
                    if (rightArmGroupRef.current) {
                        rightArmGroupRef.current.rotation.x = -1.15;
                        rightArmGroupRef.current.rotation.y = -0.35;
                    }
                    if (heldLogPoseGroupRef.current) {
                        heldLogPoseGroupRef.current.position.y = 0.40 + Math.sin(time * 4) * 0.04;
                        heldLogPoseGroupRef.current.rotation.y = Math.sin(time * 2) * 0.08;
                    }
                    break;

                case 'idle':
                default:
                    if (heldLogPoseGroupRef.current && heldLogPoseGroupRef.current.visible) {
                        heldLogPoseGroupRef.current.visible = false;
                        if (meatPropRef.current) meatPropRef.current.visible = true;
                    }

                    if (characterGroupRef.current) {
                        characterGroupRef.current.position.y = -0.22 + Math.sin(time * 2.2) * 0.04;
                        characterGroupRef.current.rotation.y = -0.15 + Math.sin(time * 0.8) * 0.06;
                    }
                    if (leftArmGroupRef.current) {
                        leftArmGroupRef.current.rotation.x = Math.sin(time * 2.2) * 0.08;
                        leftArmGroupRef.current.rotation.y = 0;
                        leftArmGroupRef.current.rotation.z = 0;
                    }
                    if (rightArmGroupRef.current) {
                        rightArmGroupRef.current.rotation.x = -0.2 - Math.sin(time * 2.2) * 0.08;
                        rightArmGroupRef.current.rotation.y = 0;
                        rightArmGroupRef.current.rotation.z = 0;
                    }
                    if (leftLegGroupRef.current) leftLegGroupRef.current.rotation.x = 0;
                    if (rightLegGroupRef.current) rightLegGroupRef.current.rotation.x = 0;
                    break;
            }

            renderer.render(scene, camera);
        };

        animate();

        // Handle Resize
        const handleResize = () => {
            if (!mount) return;
            const w = mount.clientWidth;
            const h = mount.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (renderer.domElement && mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
            renderer.dispose();
            headTex.dispose();
            torsoTex.dispose();
            leftArmTex.dispose();
            rightArmTex.dispose();
            legTex.dispose();
        };
    }, []);

    // Quick One Piece action prompts
    const QUICK_PROMPTS = [
        { label: "🧭 Tour Portfolio", action: handleLaunchTour },
        {
            label: "☀️ Gear 5 Sun God",
            action: () => {
                playAnimeFanfare('gear5');
                animStateRef.current.mode = 'gear5';
                setActionBadge('☀️ Gear 5 Sun God!');
                speakText(isRTL ? "طبول الحرية! طور نيكا إله الشمس!" : "Drums of Liberation! Gear 5 Sun God Nika!");
                setTimeout(() => {
                    animStateRef.current.mode = 'idle';
                    setActionBadge(activeArc.gear);
                }, 3500);
            }
        },
        {
            label: "🍖 Eat Meat!",
            action: () => {
                animStateRef.current.mode = 'meat';
                setActionBadge('🍖 Mmmm Delicious Meat!');
                speakText(isRTL ? "اللحم لذيذ جداً! جاهز للإنتاج!" : "Mikuuu! Meat is power! Ready for high-concurrency production!");
                setTimeout(() => {
                    animStateRef.current.mode = 'idle';
                    setActionBadge(activeArc.gear);
                }, 2500);
            }
        },
        {
            label: "⚡ Gear 2 (Jet Gatling)",
            action: () => {
                animStateRef.current.mode = 'gear2';
                setActionBadge('⚡ Gear 2 High-Speed');
                speakText(isRTL ? "جير سكند! سرعة استجابة فائقة!" : "Gear Second! Zero downtime, maximum concurrency!");
                setTimeout(() => {
                    animStateRef.current.mode = 'idle';
                    setActionBadge(activeArc.gear);
                }, 2500);
            }
        },
        {
            label: "🏛️ Inspect HistoryVerse",
            action: () => {
                const wanoArc = ONE_PIECE_ARCS.find(a => a.id === 'projects');
                if (wanoArc) showArcHologram(wanoArc, isRTL ? "مشروع HistoryVerse بتقدير ممتاز A+ و 204 اختبارات!" : "Inspecting HistoryVerse: A+ Flagship AI System with 204 Passing Tests!");
            }
        },
        { label: "🏢 Inspect PlayerHub", text: "Tell me about Omar's MLOps infrastructure work at PlayerHub.GG" },
        { label: "🏥 CliniSoft Healthcare", text: "Tell me about Omar's healthcare AI work at CliniSoft" },
        { label: "📜 Certifications & RHCSA", text: "What official certifications does Omar hold?" },
        { label: "📬 How to Contact", text: "How can I contact or hire Omar Mohamed?" }
    ];

    if (!isOpen) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bottom-6 right-6 z-50 flex flex-col font-mono transition-all duration-300 ${isMinimized ? 'w-[280px]' : 'w-[360px] sm:w-[410px]'
                }`}
        >
            {/* One Piece Straw Hat Ship Cabin Window Container */}
            <div className="relative rounded-2xl bg-[#091528]/95 border-2 border-amber-500/60 shadow-[0_12px_45px_rgba(245,158,11,0.25),0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl overflow-hidden flex flex-col">

                {/* Header Bar */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-amber-950/80 via-[#0a1a33] to-slate-900 border-b border-amber-500/40">
                    <div className="flex items-center gap-2">
                        {/* Straw Hat Pirate Avatar Icon */}
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-red-600 border border-amber-300/80 flex items-center justify-center text-base shadow-inner">
                            👒
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-extrabold text-amber-300 tracking-wide">
                                    Monkey D. Luffy
                                </span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950/90 text-red-300 border border-red-500/50 font-bold uppercase">
                                    Captain
                                </span>
                            </div>
                            <span className="text-[10px] text-amber-200/80 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                {actionBadge}
                            </span>
                        </div>
                    </div>

                    {/* Window Controls */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setVoiceEnabled(!voiceEnabled)}
                            className={`p-1.5 rounded-lg border transition-colors ${voiceEnabled
                                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                                }`}
                            title={voiceEnabled ? 'Mute Speech' : 'Enable Speech Voice'}
                        >
                            {voiceEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                        </button>
                        <button
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                            title={isMinimized ? 'Expand' : 'Minimize'}
                        >
                            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                        </button>
                        <button
                            onClick={() => {
                                if (tourData) {
                                    endTour();
                                }
                                setIsOpen(false);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
                            title="Close"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Progress bar across top of window during active tour */}
                {tourData && (
                    <div className="w-full h-1 bg-slate-800">
                        <div
                            className="h-full bg-gradient-to-r from-amber-400 via-red-500 to-purple-500 transition-all duration-300"
                            style={{ width: `${((tourData.stepIndex + 1) / tourData.totalSteps) * 100}%` }}
                        />
                    </div>
                )}

                {/* 3D Luffy Stage & Speech Bubble */}
                <div className="relative bg-gradient-to-b from-[#081324] via-[#091b35] to-[#0a1526] p-3 flex flex-col items-center justify-center border-b border-amber-500/20 overflow-hidden">
                    {/* Golden straw subtle ambient grid */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* Speech bubble above Luffy */}
                    <div className="relative z-10 w-full mb-1">
                        <div className="bg-[#0f2442]/90 border border-amber-400/50 rounded-xl px-3 py-2 text-xs text-slate-100 shadow-lg relative">
                            <div className="flex items-center justify-between text-[10px] text-amber-300/90 font-bold mb-0.5">
                                <span>{activeArc.arcBadge}</span>
                                <span className="text-[9px] text-red-400 font-bold uppercase">{activeArc.gear}</span>
                            </div>
                            <p className="line-clamp-2 leading-relaxed text-slate-200">
                                {tourData
                                    ? `🧭 Step ${tourData.stepIndex + 1}/${tourData.totalSteps}: ${tourData.title}`
                                    : (messages[messages.length - 1]?.text?.replace(/[*_#`[\]()•]/g, ' ') || (isRTL ? activeArc.quoteAr : activeArc.quoteEn))}
                            </p>
                            {/* Speech pointer notch */}
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0f2442] border-r border-b border-amber-400/50 rotate-45" />
                        </div>
                    </div>

                    {/* Three.js Canvas Container */}
                    <div
                        ref={canvasContainerRef}
                        className="relative w-full h-[195px] cursor-pointer flex items-center justify-center select-none"
                        onClick={() => {
                            playAnimeFanfare('gear5');
                            animStateRef.current.mode = 'jump';
                            setActionBadge('Yoooo!');
                            setTimeout(() => {
                                animStateRef.current.mode = 'wave';
                                setActionBadge('Straw Hat Wave!');
                                setTimeout(() => {
                                    animStateRef.current.mode = 'idle';
                                    setActionBadge(activeArc.gear);
                                }, 1500);
                            }, 500);
                        }}
                        title="Click Luffy to jump and wave!"
                    >
                        {/* Instructions overlay badge */}
                        <div className="absolute bottom-1 right-2 text-[9px] text-amber-300/80 bg-slate-950/80 px-2 py-0.5 rounded border border-amber-500/30 pointer-events-none">
                            👒 Hover to track • Click to jump
                        </div>
                    </div>

                    {/* Action Hotbar (Straw Hat Pirate hotbar) */}
                    <div className="relative z-10 w-full flex items-center justify-between gap-1.5 pt-1">
                        <button
                            onClick={handleLaunchTour}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white font-bold text-xs shadow-md shadow-amber-600/30 transition-all border border-amber-300/40"
                        >
                            <Compass size={13} className="animate-spin-slow" />
                            <span>Log Pose</span>
                        </button>
                        <button
                            onClick={() => {
                                playAnimeFanfare('gear5');
                                animStateRef.current.mode = 'gear5';
                                setActionBadge('☀️ Gear 5 Sun God!');
                                speakText(isRTL ? "طبول الحرية! طور نيكا إله الشمس!" : "Drums of Liberation! Gear 5 Sun God Nika!");
                                setTimeout(() => {
                                    animStateRef.current.mode = 'idle';
                                    setActionBadge(activeArc.gear);
                                }, 3500);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                            title="Activate Gear 5 Awakening"
                        >
                            ☀️ Gear 5
                        </button>
                        <button
                            onClick={() => {
                                animStateRef.current.mode = 'meat';
                                setActionBadge('🍖 Delicious Meat!');
                                speakText(isRTL ? "اللحم طاقة القراصنة! جاهز للإنتاج!" : "Meat is power! Let's conquer the Grand Line!");
                                setTimeout(() => {
                                    animStateRef.current.mode = 'idle';
                                    setActionBadge(activeArc.gear);
                                }, 2500);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all"
                            title="Eat Meat Prop"
                        >
                            🍖 Meat
                        </button>
                    </div>
                </div>

                {/* Expanded Section: Unified Tour Guide Panel OR Chat Log */}
                {!isMinimized && (
                    tourData && !tourChatMode ? (
                        <div className="flex flex-col h-[230px] bg-slate-950/95 p-3.5 justify-between border-t border-amber-500/20">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center justify-center px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs">
                                            Step {tourData.stepIndex + 1} / {tourData.totalSteps}
                                        </span>
                                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 uppercase tracking-wider">
                                            {tourData.badge}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setTourChatMode(true)}
                                            className="text-[10px] text-amber-400 hover:text-amber-200 px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 transition-colors border border-amber-500/30"
                                            title="Chat with Luffy during tour"
                                        >
                                            💬 Chat
                                        </button>
                                        <button
                                            type="button"
                                            onClick={endTour}
                                            className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 transition-colors"
                                            title="Exit Tour"
                                        >
                                            Exit ✕
                                        </button>
                                    </div>
                                </div>

                                <h4 className="text-sm font-bold text-white leading-tight mt-1">
                                    {tourData.title}
                                </h4>

                                <p className="text-xs text-slate-300 leading-relaxed max-h-24 overflow-y-auto pr-1">
                                    {tourData.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (tourData.stepIndex > 0) goToTourStep(tourData.stepIndex - 1);
                                    }}
                                    disabled={tourData.stepIndex === 0}
                                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${tourData.stepIndex === 0
                                        ? 'opacity-30 cursor-not-allowed border-slate-800 text-slate-600'
                                        : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 active:scale-95'
                                        }`}
                                >
                                    <ChevronLeft size={14} />
                                    <span>Previous</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (tourData.stepIndex === tourData.totalSteps - 1) {
                                            endTour();
                                        } else {
                                            goToTourStep(tourData.stepIndex + 1);
                                        }
                                    }}
                                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-amber-500/25 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <span>{tourData.stepIndex === tourData.totalSteps - 1 ? 'Finish Tour' : 'Next Island'}</span>
                                    {tourData.stepIndex === tourData.totalSteps - 1 ? <CheckCircle size={14} /> : <ChevronRight size={14} />}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-[230px] bg-slate-950/90">
                            {tourData && tourChatMode && (
                                <div className="px-3 py-1.5 bg-amber-950/70 border-b border-amber-500/30 flex items-center justify-between text-[11px] text-amber-300">
                                    <span>🧭 Log Pose Active (Chat Mode)</span>
                                    <button
                                        onClick={() => setTourChatMode(false)}
                                        className="font-bold underline hover:text-white"
                                    >
                                        Return to Island {tourData.stepIndex + 1} →
                                    </button>
                                </div>
                            )}

                            {/* Quick Prompts Chips Carousel */}
                            <div className="p-2 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-amber-700/50">
                                {QUICK_PROMPTS.map((p, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => p.action ? p.action() : handleSend(p.text)}
                                        className="whitespace-nowrap px-2.5 py-1 rounded-md bg-slate-900 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-950/40 text-[11px] text-amber-200 transition-all flex items-center gap-1"
                                    >
                                        <span>{p.label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Messages Scroll Area */}
                            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs">
                                {messages.map((m) => (
                                    <div
                                        key={m.id}
                                        className={`flex items-start gap-2 ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {m.from === 'luffy' && (
                                            <div className="w-5 h-5 rounded bg-amber-950 border border-amber-400 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                                                👒
                                            </div>
                                        )}
                                        <div
                                            className={`rounded-xl px-3 py-2 max-w-[85%] leading-relaxed ${m.from === 'user'
                                                ? 'bg-amber-600 text-white rounded-tr-none'
                                                : 'bg-slate-900/90 border border-amber-500/20 text-slate-200 rounded-tl-none'
                                                }`}
                                        >
                                            <p className="whitespace-pre-wrap">{m.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {isThinking && (
                                    <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold pl-2 py-1">
                                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                                        <span>Consulting Den Den Mushi LLM...</span>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input Box */}
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="p-2.5 bg-slate-900 border-t border-amber-500/30 flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    placeholder={isRTL ? "[دردشة] اسأل القائد لوفي..." : "[Log Pose] Ask Captain Luffy..."}
                                    disabled={isThinking}
                                    className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all font-mono"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputText.trim() || isThinking}
                                    className="p-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-md shadow-amber-600/30"
                                    title="Send"
                                >
                                    <Send size={14} />
                                </button>
                            </form>
                        </div>
                    ))}
            </div>
        </motion.div>
    );
}
