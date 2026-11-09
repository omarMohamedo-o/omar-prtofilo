import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles, MessageSquare, Volume2, VolumeX, X, Minimize2,
    Maximize2, Send, Mic, MicOff, RefreshCw, Compass, ShieldCheck,
    Cpu, Award, Briefcase, ChevronRight, Play
} from 'lucide-react';
import { sendTextMessage } from '../services/chatbotService';

// =============================================================================
// PROCEDURAL PIXEL TEXTURE GENERATORS (Pixel-perfect Minecraft aesthetic)
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
 * Generate 64x64 face texture with brown hair, cyan eyes, glasses & smile
 */
function createHeadTexture() {
    const { canvas, ctx } = createPixelCanvas(64, 64);

    // Base skin tone (#d9a07a with subtle pixel variations)
    ctx.fillStyle = '#d79b76';
    ctx.fillRect(0, 0, 64, 64);

    // Subtle skin noise
    const skinTones = ['#cf926d', '#db9f79', '#c88b66', '#e0a47f'];
    for (let x = 0; x < 64; x += 8) {
        for (let y = 0; y < 64; y += 8) {
            if (Math.random() > 0.5) {
                ctx.fillStyle = skinTones[Math.floor(Math.random() * skinTones.length)];
                ctx.fillRect(x, y, 8, 8);
            }
        }
    }

    // Hair: Dark brown pixel locks on top and forehead
    const hairTones = ['#2c1810', '#3b2216', '#22130c', '#4a2c1d'];
    for (let x = 0; x < 64; x += 8) {
        for (let y = 0; y < 24; y += 8) {
            ctx.fillStyle = hairTones[Math.floor(Math.random() * hairTones.length)];
            ctx.fillRect(x, y, 8, 8);
        }
    }
    // Sideburns
    ctx.fillStyle = '#2c1810';
    ctx.fillRect(0, 24, 8, 16);
    ctx.fillRect(56, 24, 8, 16);
    // Forehead bangs
    ctx.fillRect(16, 24, 8, 8);
    ctx.fillRect(40, 24, 8, 8);

    // Eyebrows
    ctx.fillStyle = '#1e110b';
    ctx.fillRect(8, 24, 16, 4);
    ctx.fillRect(40, 24, 16, 4);

    // Eyes: White sclera + Cyan/blue pupil
    // Left eye
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(12, 32, 12, 8);
    ctx.fillStyle = '#06b6d4'; // Cyan AI eye
    ctx.fillRect(16, 32, 8, 8);
    ctx.fillStyle = '#083344'; // Pupil center
    ctx.fillRect(20, 34, 4, 4);

    // Right eye
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(40, 32, 12, 8);
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(40, 32, 8, 8);
    ctx.fillStyle = '#083344';
    ctx.fillRect(40, 34, 4, 4);

    // Modern Developer Glasses / Tech specs
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 28, 20, 14);
    ctx.strokeRect(36, 28, 20, 14);
    ctx.beginPath();
    ctx.moveTo(28, 34);
    ctx.lineTo(36, 34);
    ctx.stroke();

    // Friendly smile
    ctx.fillStyle = '#995a3a';
    ctx.fillRect(24, 50, 16, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(26, 50, 12, 2);

    // Beard / stubble hint
    ctx.fillStyle = '#7a4228';
    ctx.fillRect(20, 56, 24, 4);

    return canvasToTexture(canvas);
}

/**
 * Generate 64x64 Torso texture:
 * Developer Hoodie with crisp white GitHub Invertocat logo on the chest,
 * terminal prompt (>_), circuit board tracings, and lanyard ID badge.
 */
function createTorsoTexture() {
    const { canvas, ctx } = createPixelCanvas(64, 64);

    // Deep tech charcoal/black developer hoodie base
    const darkTones = ['#18181b', '#121214', '#202024', '#09090b'];
    for (let x = 0; x < 64; x += 8) {
        for (let y = 0; y < 64; y += 8) {
            ctx.fillStyle = darkTones[Math.floor(Math.random() * darkTones.length)];
            ctx.fillRect(x, y, 8, 8);
        }
    }

    // Collar / neckline / skin
    ctx.fillStyle = '#d79b76';
    ctx.fillRect(24, 0, 16, 6);
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(22, 6, 20, 3);

    // Subtle cyan circuit lines down both flanks
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(6, 12, 2, 28);
    ctx.fillRect(8, 22, 4, 2);
    ctx.fillRect(12, 20, 2, 6);
    ctx.fillRect(56, 12, 2, 28);
    ctx.fillRect(52, 26, 4, 2);
    ctx.fillRect(50, 24, 2, 6);

    // --- GITHUB INVERTOCAT PIXEL LOGO ON CHEST ---
    // Outer circular Octocat badge background (crisp white)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(22, 14, 20, 16);
    ctx.fillRect(20, 16, 24, 12);
    // Cat ears
    ctx.fillRect(22, 11, 6, 4);
    ctx.fillRect(36, 11, 6, 4);
    ctx.fillRect(24, 9, 3, 3);
    ctx.fillRect(37, 9, 3, 3);

    // Invertocat inner face silhouette (dark hoodie inside)
    ctx.fillStyle = '#18181b';
    ctx.fillRect(26, 18, 12, 9);
    ctx.fillRect(24, 20, 16, 6);
    // Ear cutouts
    ctx.fillRect(26, 15, 3, 4);
    ctx.fillRect(35, 15, 3, 4);

    // Whiskers / inner highlights
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(28, 22, 3, 2);
    ctx.fillRect(33, 22, 3, 2);
    ctx.fillRect(30, 24, 4, 1);

    // --- TERMINAL PROMPT & GIT BRANCH UNDER LOGO ---
    // Terminal green prompt: >_
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(22, 34, 3, 1);
    ctx.fillRect(24, 35, 2, 2);
    ctx.fillRect(22, 37, 3, 1);
    // Blinking cursor
    ctx.fillRect(27, 37, 4, 1);

    // Git branch icon in cyan
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(34, 34, 2, 5);
    ctx.fillRect(36, 36, 3, 1);
    ctx.fillRect(39, 34, 2, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(33, 33, 4, 2);
    ctx.fillRect(38, 33, 4, 2);
    ctx.fillRect(33, 38, 4, 2);

    // --- FRONT HOODIE POCKET & DEV BADGE ---
    ctx.fillStyle = '#09090b';
    ctx.fillRect(14, 44, 36, 14);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(14, 44, 36, 14);

    // Dev ID lanyard badge hanging into pocket
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(18, 41, 10, 12);
    ctx.fillStyle = '#e0e7ff';
    ctx.fillRect(20, 43, 6, 4); // Photo
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(20, 49, 6, 2); // "DEV" green bar

    // Belt
    ctx.fillStyle = '#27272a';
    ctx.fillRect(0, 58, 64, 6);
    ctx.fillStyle = '#38bdf8'; // Cyan buckle
    ctx.fillRect(28, 58, 8, 6);

    return canvasToTexture(canvas);
}

/**
 * Generate 32x64 Limb textures for Arms (Sleeves with tech symbols & smartwatch)
 */
function createArmTexture(isLeft = false) {
    const { canvas, ctx } = createPixelCanvas(32, 64);

    // Dark charcoal hoodie sleeve
    const sleeveTones = ['#18181b', '#121214', '#202024'];
    for (let x = 0; x < 32; x += 8) {
        for (let y = 0; y < 44; y += 8) {
            ctx.fillStyle = sleeveTones[Math.floor(Math.random() * sleeveTones.length)];
            ctx.fillRect(x, y, 8, 8);
        }
    }

    if (isLeft) {
        // Left arm: Git & Python tech badges
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(14, 4, 4, 36);
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(8, 10, 8, 4);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(16, 14, 8, 4);
    } else {
        // Right arm: Smartwatch on wrist + circuit stripes
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(14, 8, 4, 32);
        // Smartwatch band
        ctx.fillStyle = '#09090b';
        ctx.fillRect(0, 36, 32, 6);
        // Glowing cyan watch face
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(8, 35, 16, 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(12, 38, 8, 2);
    }

    // Sleeve cuff
    ctx.fillStyle = '#3f3f46';
    ctx.fillRect(0, 42, 32, 3);

    // Skin hand
    ctx.fillStyle = '#d79b76';
    ctx.fillRect(0, 45, 32, 19);
    ctx.fillStyle = '#c88b66';
    ctx.fillRect(4, 52, 8, 7);

    return canvasToTexture(canvas);
}

/**
 * Generate 64x64 Tactical Laptop Backpack texture with nylon grid, MOLLE webbing & cyan accents
 */
function createBackpackTexture() {
    const { canvas, ctx } = createPixelCanvas(64, 64);

    // Deep tech ballistic nylon dark slate
    const nylonTones = ['#0f172a', '#1e293b', '#0b1120', '#172554'];
    for (let x = 0; x < 64; x += 8) {
        for (let y = 0; y < 64; y += 8) {
            ctx.fillStyle = nylonTones[Math.floor(Math.random() * nylonTones.length)];
            ctx.fillRect(x, y, 8, 8);
        }
    }

    // Main top laptop zipper in neon cyan
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(8, 8, 48, 4);
    ctx.fillStyle = '#e2e8f0'; // Silver zipper pulls
    ctx.fillRect(28, 6, 8, 6);

    // MOLLE / webbing loops across the center
    ctx.fillStyle = '#334155';
    ctx.fillRect(12, 24, 40, 6);
    ctx.fillRect(12, 38, 40, 6);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(16, 24, 4, 6);
    ctx.fillRect(28, 24, 4, 6);
    ctx.fillRect(40, 24, 4, 6);
    ctx.fillRect(16, 38, 4, 6);
    ctx.fillRect(28, 38, 4, 6);
    ctx.fillRect(40, 38, 4, 6);

    // Reflective safety tape
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(14, 50, 36, 4);

    return canvasToTexture(canvas);
}

/**
 * Generate 64x64 Laptop texture with sleek space-gray aluminum and glowing GitHub logo on lid
 */
function createLaptopTexture() {
    const { canvas, ctx } = createPixelCanvas(64, 64);

    // Brushed space-gray aluminum lid
    const grayTones = ['#64748b', '#475569', '#52627a', '#3f4e66'];
    for (let x = 0; x < 64; x += 8) {
        for (let y = 0; y < 64; y += 8) {
            ctx.fillStyle = grayTones[Math.floor(Math.random() * grayTones.length)];
            ctx.fillRect(x, y, 8, 8);
        }
    }

    // Outer dark bezel/frame
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 60, 60);

    // Glowing cyan GitHub Octocat logo on the laptop lid!
    ctx.fillStyle = '#38bdf8';
    // Head circle
    ctx.fillRect(24, 20, 16, 14);
    ctx.fillRect(22, 22, 20, 10);
    // Cat ears
    ctx.fillRect(24, 16, 5, 4);
    ctx.fillRect(35, 16, 5, 4);
    // Inner logo cutout
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(28, 24, 8, 6);
    // Glowing center
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(30, 26, 4, 2);

    // "DEV / AI" branding on bottom edge
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(22, 48, 20, 3);

    return canvasToTexture(canvas);
}

/**
 * Generate 32x64 Leg textures (Denim pants + dark cyber boots)
 */
function createLegTexture() {
    const { canvas, ctx } = createPixelCanvas(32, 64);

    // Dark navy denim
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 32, 46);
    ctx.fillStyle = '#334155';
    ctx.fillRect(4, 8, 24, 30);

    // Boots
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 46, 32, 18);
    ctx.fillStyle = '#38bdf8'; // Cyan sole accent
    ctx.fillRect(0, 60, 32, 4);

    return canvasToTexture(canvas);
}

/**
 * Generate 64x64 Laptop Keyboard texture with key rows, spacebar & trackpad
 */
function createKeyboardTexture() {
    const { canvas, ctx } = createPixelCanvas(64, 64);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 64, 64);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(4, 4, 56, 36);

    ctx.fillStyle = '#334155';
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 8; col++) {
            ctx.fillRect(6 + col * 6.5, 6 + row * 7.5, 5, 5.5);
        }
    }
    ctx.fillStyle = '#475569';
    ctx.fillRect(20, 31, 24, 6);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(20, 44, 24, 16);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 44, 24, 16);

    return canvasToTexture(canvas);
}

/**
 * Generate Holographic Projector Canvas for Laptop screen & floating hologram
 */
function createHologramCanvas(title = 'HistoryVerse (Grade: A+)', status = 'AWS Fargate • 204 Tests') {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#02182b';
    ctx.fillRect(0, 0, 256, 128);

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 248, 120);

    for (let y = 10; y < 120; y += 8) {
        ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
        ctx.fillRect(6, y, 244, 4);
    }

    ctx.fillStyle = '#22c55e';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('>_ PROJECT_INSPECTOR //', 14, 24);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 13px monospace';
    ctx.fillText(title.slice(0, 26), 14, 52);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '11px monospace';
    ctx.fillText(`• ${status.slice(0, 28)}`, 14, 76);
    ctx.fillStyle = '#a855f7';
    ctx.fillText('• 204 Tests • 99.9% Uptime', 14, 98);

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(230, 16, 6, 10);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return { canvas, ctx, texture };
}

// =============================================================================
// MAIN 3D MINECRAFT COMPONENT
// =============================================================================

export default function MinecraftGuide3D({ onStartTour }) {
    const containerRef = useRef(null);
    const canvasContainerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const characterGroupRef = useRef(null);
    const headGroupRef = useRef(null);
    const leftArmGroupRef = useRef(null);
    const rightArmGroupRef = useRef(null);
    const leftLegGroupRef = useRef(null);
    const rightLegGroupRef = useRef(null);
    const torchMeshRef = useRef(null);
    const torchGroupRef = useRef(null);
    const backpackLaptopMeshRef = useRef(null);
    const heldLaptopGroupRef = useRef(null);
    const laptopScreenHingeRef = useRef(null);
    const hologramCanvasRef = useRef(null);
    const hologramGroupRef = useRef(null);
    const laptopTimeoutRef = useRef(null);

    // Animation state refs
    const animStateRef = useRef({
        mode: 'idle', // 'idle' | 'walk' | 'wave' | 'talk' | 'jump' | 'laptop_open'
        targetLook: { x: 0, y: 0 },
        jumpProgress: 0,
        talkTimer: 0
    });

    // Component UI state
    const [isOpen, setIsOpen] = useState(true);
    const [isMinimized, setIsMinimized] = useState(false);
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'guide' | 'skills'
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 'init-1',
            from: 'steve',
            text: "⛏️ Hey there, adventurer! I'm **Steve Omar**, your 3D Minecraft Portfolio Guide!\n\nI can tour you through the portfolio, answer questions with **MORA LLM**, or tell you about Omar's work at **PlayerHub.GG**, **CliniSoft**, and **HistoryVerse**!"
        }
    ]);
    const [isThinking, setIsThinking] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [actionBadge, setActionBadge] = useState('Idle');
    const chatEndRef = useRef(null);

    // Speech synthesis helper
    const speakText = useCallback((text) => {
        if (!voiceEnabled || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();

        const clean = text.replace(/[*_#`[\]()•]/g, ' ').replace(/\s+/g, ' ').trim();
        const utterance = new SpeechSynthesisUtterance(clean);
        const isArabic = /[\u0600-\u06FF]/.test(clean);
        utterance.lang = isArabic ? 'ar-SA' : 'en-US';
        utterance.rate = 1.05;
        utterance.pitch = 1.1; // Friendly higher pitch for Minecraft companion

        utterance.onstart = () => {
            setIsSpeaking(true);
            animStateRef.current.mode = 'talk';
            setActionBadge('Speaking');
        };
        utterance.onend = () => {
            setIsSpeaking(false);
            animStateRef.current.mode = 'idle';
            setActionBadge('Idle');
        };
        utterance.onerror = () => {
            setIsSpeaking(false);
            animStateRef.current.mode = 'idle';
            setActionBadge('Idle');
        };

        window.speechSynthesis.speak(utterance);
    }, [voiceEnabled]);

    // Pull laptop from backpack and project section / project specs
    const showLaptopProject = useCallback((title, subtitle = 'Production Deployed', speechMessage) => {
        if (hologramCanvasRef.current) {
            const { ctx, texture } = hologramCanvasRef.current;
            ctx.fillStyle = '#02182b';
            ctx.fillRect(0, 0, 256, 128);
            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 2;
            ctx.strokeRect(4, 4, 248, 120);

            for (let y = 10; y < 120; y += 8) {
                ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
                ctx.fillRect(6, y, 244, 4);
            }

            ctx.fillStyle = '#22c55e';
            ctx.font = 'bold 12px monospace';
            ctx.fillText('>_ PROJECT_INSPECTOR //', 14, 24);

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 13px monospace';
            ctx.fillText(title.slice(0, 26), 14, 52);

            ctx.fillStyle = '#e2e8f0';
            ctx.font = '11px monospace';
            ctx.fillText(`• ${subtitle.slice(0, 28)}`, 14, 76);
            ctx.fillStyle = '#a855f7';
            ctx.fillText('• 204 Tests • 99.9% Uptime', 14, 98);

            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(230, 16, 6, 10);

            texture.needsUpdate = true;
        }

        animStateRef.current.mode = 'laptop_open';
        setActionBadge(`Inspecting: ${title.slice(0, 16)}`);

        if (speechMessage) {
            speakText(speechMessage);
        }

        if (laptopTimeoutRef.current) clearTimeout(laptopTimeoutRef.current);
        laptopTimeoutRef.current = setTimeout(() => {
            animStateRef.current.mode = 'idle';
            setActionBadge('Idle');
        }, 7000);
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

        // Trigger wave animation on user interaction
        setTimeout(() => {
            animStateRef.current.mode = 'wave';
            setActionBadge('Waving');
            setTimeout(() => {
                animStateRef.current.mode = 'idle';
                setActionBadge('Thinking...');
            }, 1200);
        }, 500);

        try {
            const history = messages.slice(-5).map(m => ({
                role: m.from === 'steve' ? 'assistant' : 'user',
                content: m.text
            }));

            const response = await sendTextMessage(text, history);
            const botAnswer = response?.Answer || response?.answer || "I'm ready for another question!";

            const botMsg = {
                id: `b-${Date.now()}`,
                from: 'steve',
                text: botAnswer
            };
            setMessages(prev => [...prev, botMsg]);
            speakText(botAnswer);
        } catch (err) {
            console.error('3D Guide chat error:', err);
            const errorMsg = {
                id: `b-${Date.now()}`,
                from: 'steve',
                text: "⚠️ Hit bedrock! You can ask me about PlayerHub, CliniSoft, HistoryVerse, or Omar's contact info!"
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsThinking(false);
            setActionBadge('Idle');
            animStateRef.current.mode = 'idle';
        }
    };

    // Auto scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking]);

    // Trigger walk and wave when tour is launched
    const handleLaunchTour = () => {
        animStateRef.current.mode = 'walk';
        setActionBadge('Guiding Tour');
        setMessages(prev => [
            ...prev,
            {
                id: `t-${Date.now()}`,
                from: 'steve',
                text: "🚀 **Launching the Guided Tour!** Follow me as we explore Omar's engineering achievements section by section!"
            }
        ]);
        speakText("Launching the portfolio tour! Follow me as we explore Omar's achievements!");

        if (typeof onStartTour === 'function') {
            onStartTour();
        } else {
            // Trigger window event for InteractiveTour
            window.dispatchEvent(new CustomEvent('start-portfolio-tour'));
        }

        setTimeout(() => {
            animStateRef.current.mode = 'wave';
            setTimeout(() => {
                animStateRef.current.mode = 'idle';
                setActionBadge('Idle');
            }, 1800);
        }, 2000);
    };

    // Listen for live tour step events to synchronize 3D guide animations & voice
    useEffect(() => {
        const handleTourStep = (e) => {
            const detail = e.detail;
            if (!detail) return;

            // Pull laptop from backpack and open it projecting this section/project!
            showLaptopProject(
                detail.title,
                detail.badge || 'Guided Tour Step',
                `${detail.title}. ${detail.description}`
            );

            const stepNotice = `🧭 **[Step ${detail.stepIndex + 1}/${detail.totalSteps}] ${detail.title}:**\n${detail.description}`;
            setMessages(prev => [...prev.slice(-8), {
                id: `tour-${Date.now()}`,
                from: 'steve',
                text: stepNotice
            }]);
        };

        const handleTourEnd = () => {
            animStateRef.current.mode = 'idle';
            setActionBadge('Idle');
        };

        const handleToggleGuide = (e) => {
            const forceOpen = e?.detail?.open;
            setIsOpen(prev => (forceOpen !== undefined ? forceOpen : !prev));
            setIsMinimized(false);
            if (forceOpen !== false) {
                // Dispatch event so 2D chat widget collapses cleanly
                window.dispatchEvent(new CustomEvent('close-chat-widget'));
                animStateRef.current.mode = 'jump';
                setActionBadge('Hello!');
                setTimeout(() => {
                    animStateRef.current.mode = 'wave';
                    setTimeout(() => {
                        animStateRef.current.mode = 'idle';
                        setActionBadge('Idle');
                    }, 1500);
                }, 500);
            }
        };

        window.addEventListener('portfolio-tour-step', handleTourStep);
        window.addEventListener('portfolio-tour-ended', handleTourEnd);
        window.addEventListener('toggle-3d-minecraft-guide', handleToggleGuide);

        return () => {
            window.removeEventListener('portfolio-tour-step', handleTourStep);
            window.removeEventListener('portfolio-tour-ended', handleTourEnd);
            window.removeEventListener('toggle-3d-minecraft-guide', handleToggleGuide);
        };
    }, [showLaptopProject]);

    // Section transition observer: when user scrolls through sections, Steve opens laptop to inspect the section
    useEffect(() => {
        const sections = [
            { id: 'home', title: 'Omarmohamed-portfolio', tech: 'AI & MLOps Showcase' },
            { id: 'about', title: 'About Omar Mohamed', tech: 'M.Sc. CGPA 4.0 • Applied ML' },
            { id: 'experience', title: 'PlayerHub & CliniSoft', tech: 'High-Availability MLOps' },
            { id: 'internships', title: 'Engineering Internships', tech: 'DEPI • Telecom Egypt' },
            { id: 'skills', title: 'LLMs, RAG & Cloud', tech: 'Kubernetes • Docker • PyTorch' },
            { id: 'projects', title: 'HistoryVerse (Grade: A+)', tech: 'YOLOv5 • AWS Fargate' },
            { id: 'education', title: 'Academic Honors', tech: 'AASTMT • ITI • BHI' },
            { id: 'certifications', title: 'RHCSA #250-068-707', tech: 'Red Hat Certified Admin' },
            { id: 'contact', title: 'Get In Touch', tech: 'Hire • Consult • Collaborate' }
        ];

        let lastActiveSection = '';
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
                        const secId = entry.target.id;
                        if (secId && secId !== lastActiveSection) {
                            lastActiveSection = secId;
                            const sec = sections.find(s => s.id === secId);
                            if (sec) {
                                showLaptopProject(sec.title, sec.tech);
                            }
                        }
                    }
                }
            },
            { threshold: 0.45 }
        );

        sections.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [showLaptopProject]);

    // =========================================================================
    // THREE.JS SETUP & VOXEL RIGGING
    // =========================================================================
    useEffect(() => {
        const mount = canvasContainerRef.current;
        if (!mount) return;

        const width = mount.clientWidth || 220;
        const height = mount.clientHeight || 260;

        // Scene, Camera, Renderer
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
        camera.position.set(0, 1.2, 5.2);

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = false; // Keep smooth and fast
        mount.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lighting (Minecraft blocky ambience)
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight(0x38bdf8, 1.6); // Cyan rim light
        keyLight.position.set(3, 4, 3);
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0xf472b6, 0.8); // Subtle pink fill
        fillLight.position.set(-3, 2, 2);
        scene.add(fillLight);

        // Textures
        const headTex = createHeadTexture();
        const torsoTex = createTorsoTexture();
        const leftArmTex = createArmTexture(true);
        const rightArmTex = createArmTexture(false);
        const legTex = createLegTexture();
        const backpackTex = createBackpackTexture();
        const laptopTex = createLaptopTexture();

        // Materials
        const headMat = new THREE.MeshLambertMaterial({ map: headTex });
        const torsoMat = new THREE.MeshLambertMaterial({ map: torsoTex });
        const leftArmMat = new THREE.MeshLambertMaterial({ map: leftArmTex });
        const rightArmMat = new THREE.MeshLambertMaterial({ map: rightArmTex });
        const legMat = new THREE.MeshLambertMaterial({ map: legTex });
        const backpackMat = new THREE.MeshLambertMaterial({ map: backpackTex });
        const laptopMat = new THREE.MeshLambertMaterial({ map: laptopTex });

        // Character Root Group (hero 3/4 angle showing GitHub logo & Laptop backpack)
        const characterGroup = new THREE.Group();
        characterGroup.position.set(0, -0.2, 0);
        characterGroup.rotation.y = -0.22;
        scene.add(characterGroup);
        characterGroupRef.current = characterGroup;

        // 1. Torso (1.0 wide, 1.35 high, 0.55 deep)
        const torsoGeo = new THREE.BoxGeometry(1.0, 1.35, 0.55);
        const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
        torsoMesh.position.y = 0.68;
        characterGroup.add(torsoMesh);

        // =====================================================================
        // 3D LAPTOP BACKPACK ("labtop backbag") RIGGING
        // =====================================================================
        const backpackGroup = new THREE.Group();
        backpackGroup.position.set(0, 0.02, -0.38); // Centered on back of torso
        torsoMesh.add(backpackGroup);

        // A. Main tactical backpack body
        const backpackBodyGeo = new THREE.BoxGeometry(0.86, 1.15, 0.38);
        const backpackBodyMesh = new THREE.Mesh(backpackBodyGeo, backpackMat);
        backpackGroup.add(backpackBodyMesh);

        // B. Laptop peeking out of the top compartment slot!
        const laptopGeo = new THREE.BoxGeometry(0.72, 0.52, 0.08);
        const laptopMesh = new THREE.Mesh(laptopGeo, laptopMat);
        laptopMesh.position.set(0, 0.62, -0.06);
        laptopMesh.rotation.x = -0.16; // Tilted back resting in sleeve
        backpackGroup.add(laptopMesh);
        backpackLaptopMeshRef.current = laptopMesh;

        // C. Illuminated Green Power LED on laptop corner
        const ledGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
        const ledMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
        const ledMesh = new THREE.Mesh(ledGeo, ledMat);
        ledMesh.position.set(0.28, 0.86, -0.10);
        backpackGroup.add(ledMesh);

        // D. Lower utility pocket with cyan zipper
        const frontPocketGeo = new THREE.BoxGeometry(0.68, 0.46, 0.16);
        const frontPocketMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
        const frontPocketMesh = new THREE.Mesh(frontPocketGeo, frontPocketMat);
        frontPocketMesh.position.set(0, -0.25, -0.24);
        backpackGroup.add(frontPocketMesh);

        // Cyan zipper teeth on pocket
        const zipGeo = new THREE.BoxGeometry(0.62, 0.04, 0.02);
        const zipMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
        const zipMesh = new THREE.Mesh(zipGeo, zipMat);
        zipMesh.position.set(0, 0.08, -0.09);
        frontPocketMesh.add(zipMesh);

        // E. Water bottle / thermos flask in side pocket
        const bottleGeo = new THREE.BoxGeometry(0.20, 0.52, 0.20);
        const bottleMat = new THREE.MeshLambertMaterial({ color: 0x38bdf8 });
        const bottleMesh = new THREE.Mesh(bottleGeo, bottleMat);
        bottleMesh.position.set(-0.48, -0.10, 0.02);
        backpackGroup.add(bottleMesh);

        const bottleCapGeo = new THREE.BoxGeometry(0.12, 0.10, 0.12);
        const bottleCapMat = new THREE.MeshLambertMaterial({ color: 0x0f172a });
        const bottleCap = new THREE.Mesh(bottleCapGeo, bottleCapMat);
        bottleCap.position.y = 0.30;
        bottleMesh.add(bottleCap);

        // F. 3D Shoulder Straps wrapping over shoulders to the front chest
        const strapMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
        const strapGeo = new THREE.BoxGeometry(0.18, 1.34, 0.12);

        const leftStrap = new THREE.Mesh(strapGeo, strapMat);
        leftStrap.position.set(-0.32, 0.02, 0.28);
        torsoMesh.add(leftStrap);

        const rightStrap = new THREE.Mesh(strapGeo, strapMat);
        rightStrap.position.set(0.32, 0.02, 0.28);
        torsoMesh.add(rightStrap);

        // Cyan chest buckle connector
        const chestClipGeo = new THREE.BoxGeometry(0.44, 0.08, 0.08);
        const chestClipMat = new THREE.MeshLambertMaterial({ color: 0x06b6d4 });
        const chestClip = new THREE.Mesh(chestClipGeo, chestClipMat);
        chestClip.position.set(0, 0.15, 0.32);
        torsoMesh.add(chestClip);

        // =====================================================================
        // HELD LAPTOP & HOLOGRAPHIC PROJECTOR RIGGING
        // =====================================================================
        const heldLaptopGroup = new THREE.Group();
        heldLaptopGroup.position.set(0, 0.38, 0.54);
        heldLaptopGroup.visible = false;
        torsoMesh.add(heldLaptopGroup);
        heldLaptopGroupRef.current = heldLaptopGroup;

        // Base with keyboard & trackpad
        const keyboardTex = createKeyboardTexture();
        const keyboardMat = new THREE.MeshLambertMaterial({ map: keyboardTex });
        const baseGeo = new THREE.BoxGeometry(0.76, 0.05, 0.52);
        const baseMesh = new THREE.Mesh(baseGeo, keyboardMat);
        heldLaptopGroup.add(baseMesh);

        // Screen Hinge Group (rotates from 0 closed to -1.85 rad open)
        const screenHinge = new THREE.Group();
        screenHinge.position.set(0, 0.025, -0.25);
        heldLaptopGroup.add(screenHinge);
        laptopScreenHingeRef.current = screenHinge;

        // Screen Lid (back face with glowing GitHub logo)
        const lidGeo = new THREE.BoxGeometry(0.76, 0.52, 0.04);
        const lidMesh = new THREE.Mesh(lidGeo, laptopMat);
        lidMesh.position.set(0, 0.26, 0.02);
        screenHinge.add(lidMesh);

        // Screen LCD Display
        const holoData = createHologramCanvas();
        hologramCanvasRef.current = holoData;
        const displayGeo = new THREE.PlaneGeometry(0.70, 0.46);
        const displayMat = new THREE.MeshBasicMaterial({ map: holoData.texture });
        const displayMesh = new THREE.Mesh(displayGeo, displayMat);
        displayMesh.position.set(0, 0.26, -0.021);
        displayMesh.rotation.y = Math.PI; // Face the user
        screenHinge.add(displayMesh);

        // Floating Holographic Display above laptop
        const hologramGroup = new THREE.Group();
        hologramGroup.position.set(0, 0.88, -0.15);
        heldLaptopGroup.add(hologramGroup);
        hologramGroupRef.current = hologramGroup;

        const holoPlaneGeo = new THREE.PlaneGeometry(0.95, 0.50);
        const holoPlaneMat = new THREE.MeshBasicMaterial({
            map: holoData.texture,
            transparent: true,
            opacity: 0.90,
            side: THREE.DoubleSide
        });
        const holoPlaneMesh = new THREE.Mesh(holoPlaneGeo, holoPlaneMat);
        hologramGroup.add(holoPlaneMesh);

        // Glowing cyber-beam from screen to hologram
        const beamGeo = new THREE.ConeGeometry(0.55, 0.75, 4, 1, true);
        const beamMat = new THREE.MeshBasicMaterial({
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.22,
            wireframe: true
        });
        const beamMesh = new THREE.Mesh(beamGeo, beamMat);
        beamMesh.position.set(0, 0.40, -0.15);
        beamMesh.rotation.x = Math.PI;
        heldLaptopGroup.add(beamMesh);

        // 2. Head Group & Mesh (Pivots at neck)
        const headGroup = new THREE.Group();
        headGroup.position.set(0, 1.38, 0);
        characterGroup.add(headGroup);
        headGroupRef.current = headGroup;

        const headGeo = new THREE.BoxGeometry(0.95, 0.95, 0.95);
        const headMesh = new THREE.Mesh(headGeo, headMat);
        headMesh.position.set(0, 0.48, 0);
        headGroup.add(headMesh);

        // Floating Diamond / Redstone Torch held in hand
        const torchGroup = new THREE.Group();
        const torchGeo = new THREE.BoxGeometry(0.14, 0.8, 0.14);
        const torchMat = new THREE.MeshLambertMaterial({ color: 0x38bdf8 });
        const torchStick = new THREE.Mesh(torchGeo, torchMat);
        const flameGeo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
        const flame = new THREE.Mesh(flameGeo, flameMat);
        flame.position.y = 0.42;
        torchGroup.add(torchStick);
        torchGroup.add(flame);
        torchMeshRef.current = flame;

        // 3. Left Arm Group (Pivots at shoulder)
        const leftArmGroup = new THREE.Group();
        leftArmGroup.position.set(-0.76, 1.28, 0);
        characterGroup.add(leftArmGroup);
        leftArmGroupRef.current = leftArmGroup;

        const armGeo = new THREE.BoxGeometry(0.44, 1.3, 0.44);
        const leftArmMesh = new THREE.Mesh(armGeo, leftArmMat);
        leftArmMesh.position.set(0, -0.58, 0);
        leftArmGroup.add(leftArmMesh);

        // 4. Right Arm Group (Pivots at shoulder)
        const rightArmGroup = new THREE.Group();
        rightArmGroup.position.set(0.76, 1.28, 0);
        characterGroup.add(rightArmGroup);
        rightArmGroupRef.current = rightArmGroup;

        const rightArmMesh = new THREE.Mesh(armGeo, rightArmMat);
        rightArmMesh.position.set(0, -0.58, 0);
        rightArmGroup.add(rightArmMesh);

        // Attach torch to right hand
        torchGroup.position.set(0, -1.0, 0.35);
        torchGroup.rotation.x = Math.PI / 4;
        rightArmGroup.add(torchGroup);
        torchGroupRef.current = torchGroup;

        // 5. Left Leg Group (Pivots at hip)
        const leftLegGroup = new THREE.Group();
        leftLegGroup.position.set(-0.28, 0.05, 0);
        characterGroup.add(leftLegGroup);
        leftLegGroupRef.current = leftLegGroup;

        const legGeo = new THREE.BoxGeometry(0.45, 1.35, 0.45);
        const leftLegMesh = new THREE.Mesh(legGeo, legMat);
        leftLegMesh.position.set(0, -0.65, 0);
        leftLegGroup.add(leftLegMesh);

        // 6. Right Leg Group (Pivots at hip)
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

            // Flame pulse
            if (torchMeshRef.current) {
                const scale = 1.0 + Math.sin(time * 12) * 0.15;
                torchMeshRef.current.scale.set(scale, scale, scale);
            }

            // Head tracking lerp
            if (headGroupRef.current) {
                headGroupRef.current.rotation.y += (anim.targetLook.x - headGroupRef.current.rotation.y) * 0.1;
                headGroupRef.current.rotation.x += (anim.targetLook.y - headGroupRef.current.rotation.x) * 0.1;
            }

            // Body animations by mode
            switch (anim.mode) {
                case 'walk':
                    // Minecraft walk cycle
                    const walkSpeed = 9;
                    if (characterGroupRef.current) {
                        characterGroupRef.current.position.y = -0.2 + Math.abs(Math.sin(time * walkSpeed)) * 0.14;
                    }
                    if (leftLegGroupRef.current) leftLegGroupRef.current.rotation.x = Math.sin(time * walkSpeed) * 0.7;
                    if (rightLegGroupRef.current) rightLegGroupRef.current.rotation.x = -Math.sin(time * walkSpeed) * 0.7;
                    if (leftArmGroupRef.current) leftArmGroupRef.current.rotation.x = -Math.sin(time * walkSpeed) * 0.6;
                    if (rightArmGroupRef.current) rightArmGroupRef.current.rotation.x = Math.sin(time * walkSpeed) * 0.6;
                    break;

                case 'wave':
                    // Right arm waving high
                    if (characterGroupRef.current) {
                        characterGroupRef.current.position.y = -0.2 + Math.sin(time * 3) * 0.05;
                    }
                    if (rightArmGroupRef.current) {
                        rightArmGroupRef.current.rotation.x = -2.6;
                        rightArmGroupRef.current.rotation.z = -0.4 + Math.sin(time * 14) * 0.45;
                    }
                    if (leftArmGroupRef.current) leftArmGroupRef.current.rotation.x = 0.1;
                    if (leftLegGroupRef.current) leftLegGroupRef.current.rotation.x = 0;
                    if (rightLegGroupRef.current) rightLegGroupRef.current.rotation.x = 0;
                    break;

                case 'talk':
                    // Enthusiastic nodding and gesturing
                    if (characterGroupRef.current) {
                        characterGroupRef.current.position.y = -0.2 + Math.sin(time * 5) * 0.04;
                    }
                    if (headGroupRef.current) {
                        headGroupRef.current.rotation.x += Math.sin(time * 10) * 0.08;
                    }
                    if (rightArmGroupRef.current) {
                        rightArmGroupRef.current.rotation.x = -1.1 + Math.sin(time * 8) * 0.3;
                        rightArmGroupRef.current.rotation.z = -0.2 + Math.cos(time * 6) * 0.15;
                    }
                    if (leftArmGroupRef.current) leftArmGroupRef.current.rotation.x = -0.3 + Math.cos(time * 4) * 0.1;
                    break;

                case 'jump':
                    anim.jumpProgress += 0.1;
                    const jumpY = Math.sin(anim.jumpProgress) * 0.4;
                    if (characterGroupRef.current) {
                        characterGroupRef.current.position.y = -0.2 + Math.max(0, jumpY);
                    }
                    if (anim.jumpProgress >= Math.PI) {
                        anim.jumpProgress = 0;
                        anim.mode = 'idle';
                    }
                    break;

                case 'laptop_open':
                    // Steve withdraws laptop from backpack, hinges open screen, and types actively!
                    if (backpackLaptopMeshRef.current) backpackLaptopMeshRef.current.visible = false;
                    if (torchGroupRef.current) torchGroupRef.current.visible = false;
                    if (heldLaptopGroupRef.current) heldLaptopGroupRef.current.visible = true;

                    // Smoothly open screen hinge to -1.85 radians
                    if (laptopScreenHingeRef.current) {
                        laptopScreenHingeRef.current.rotation.x += (-1.85 - laptopScreenHingeRef.current.rotation.x) * 0.16;
                    }

                    // Body and head: slight lean forward to focus on screen
                    if (characterGroupRef.current) {
                        characterGroupRef.current.position.y = -0.2 + Math.sin(time * 3) * 0.02;
                    }
                    if (headGroupRef.current) {
                        headGroupRef.current.rotation.x += (0.38 - headGroupRef.current.rotation.x) * 0.14;
                    }

                    // Active typing motions on the keyboard
                    if (leftArmGroupRef.current) {
                        leftArmGroupRef.current.rotation.x = -1.18 + Math.sin(time * 26) * 0.14;
                        leftArmGroupRef.current.rotation.y = 0.38;
                        leftArmGroupRef.current.rotation.z = 0.22;
                    }
                    if (rightArmGroupRef.current) {
                        rightArmGroupRef.current.rotation.x = -1.18 + Math.cos(time * 28) * 0.14;
                        rightArmGroupRef.current.rotation.y = -0.38;
                        rightArmGroupRef.current.rotation.z = -0.22;
                    }

                    // Hologram gentle floating & rotation
                    if (hologramGroupRef.current) {
                        hologramGroupRef.current.position.y = 0.88 + Math.sin(time * 4) * 0.05;
                        hologramGroupRef.current.rotation.y = Math.sin(time * 2) * 0.10;
                    }
                    break;

                case 'idle':
                default:
                    // Gracefully close laptop if returning to idle
                    if (heldLaptopGroupRef.current && heldLaptopGroupRef.current.visible) {
                        if (laptopScreenHingeRef.current) {
                            laptopScreenHingeRef.current.rotation.x += (0 - laptopScreenHingeRef.current.rotation.x) * 0.22;
                            if (Math.abs(laptopScreenHingeRef.current.rotation.x) < 0.08) {
                                heldLaptopGroupRef.current.visible = false;
                                if (backpackLaptopMeshRef.current) backpackLaptopMeshRef.current.visible = true;
                                if (torchGroupRef.current) torchGroupRef.current.visible = true;
                            }
                        }
                    }

                    // Subtle breathing and swaying
                    if (characterGroupRef.current) {
                        characterGroupRef.current.position.y = -0.2 + Math.sin(time * 2.2) * 0.05;
                        characterGroupRef.current.rotation.y = Math.sin(time * 0.8) * 0.06;
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
            backpackTex.dispose();
            laptopTex.dispose();
        };
    }, []);

    // Quick prompt buttons
    const QUICK_PROMPTS = [
        { label: "🧭 Tour Portfolio", action: handleLaunchTour },
        {
            label: "💻 Open Laptop (3D)",
            action: () => showLaptopProject("Developer Workstation", "Linux • Docker • K8s", "Pulling my developer laptop from my tactical backpack!")
        },
        {
            label: "🏛️ Inspect HistoryVerse",
            action: () => showLaptopProject("HistoryVerse (Grade: A+)", "AWS Fargate • 204 Tests", "Inspecting HistoryVerse: Multilingual AI/AR platform with 204 passing tests!")
        },
        {
            label: "🏢 Inspect PlayerHub",
            action: () => showLaptopProject("PlayerHub.GG Dubai", "HAProxy • MariaDB • K8s", "Inspecting PlayerHub.GG high availability MLOps infrastructure!")
        },
        { label: "🐙 GitHub Projects", text: "Tell me about Omar's GitHub repositories and open-source projects" },
        { label: "🏥 CliniSoft Healthcare", text: "Tell me about Omar's healthcare AI work at CliniSoft" },
        { label: "📜 Certifications & RHCSA", text: "What certifications does Omar hold?" },
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
            className={`fixed bottom-6 right-6 z-50 flex flex-col font-mono transition-all duration-300 ${
                isMinimized ? 'w-[280px]' : 'w-[360px] sm:w-[410px]'
            }`}
        >
            {/* Minecraft Window Container with authentic retro pixel styling */}
            <div className="relative rounded-2xl bg-[#0f172a]/95 border-2 border-cyan-500/50 shadow-[0_12px_45px_rgba(6,182,212,0.25),0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur-xl overflow-hidden flex flex-col">

                {/* Header Bar */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-slate-900 via-[#0e273c] to-slate-900 border-b border-cyan-500/30">
                    <div className="flex items-center gap-2">
                        {/* Minecraft head avatar icon */}
                        <div className="w-7 h-7 rounded-md bg-cyan-900/60 border border-cyan-400/80 flex items-center justify-center text-sm shadow-inner">
                            ⛏️
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-cyan-300 tracking-wide">Steve Omar</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/50 font-bold">
                                    Lv. 4.0 M.Sc
                                </span>
                            </div>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                {actionBadge}
                            </span>
                        </div>
                    </div>

                    {/* Window Controls */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setVoiceEnabled(!voiceEnabled)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                                voiceEnabled
                                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
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
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-colors"
                            title="Close"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* 3D Character Stage & Speech Bubble */}
                <div className="relative bg-gradient-to-b from-[#0a192f] via-[#091424] to-[#0f172a] p-3 flex flex-col items-center justify-center border-b border-cyan-500/20 overflow-hidden">
                    {/* Subtle grid pattern background */}
                    <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

                    {/* Speech bubble above character */}
                    <div className="relative z-10 w-full mb-1">
                        <div className="bg-[#1e293b]/90 border border-cyan-400/40 rounded-xl px-3 py-2 text-xs text-slate-100 shadow-lg relative">
                            <p className="line-clamp-2 leading-relaxed">
                                {messages[messages.length - 1]?.text?.replace(/[*_#`[\]()•]/g, ' ') || "Ask me about Omar's engineering work!"}
                            </p>
                            {/* Speech bubble pointer notch */}
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#1e293b] border-r border-b border-cyan-400/40 rotate-45" />
                        </div>
                    </div>

                    {/* Three.js Canvas Container */}
                    <div
                        ref={canvasContainerRef}
                        className="relative w-full h-[190px] cursor-pointer flex items-center justify-center select-none"
                        onClick={() => {
                            animStateRef.current.mode = 'jump';
                            setActionBadge('Jumping!');
                            setTimeout(() => {
                                animStateRef.current.mode = 'wave';
                                setActionBadge('Waving');
                                setTimeout(() => {
                                    animStateRef.current.mode = 'idle';
                                    setActionBadge('Idle');
                                }, 1500);
                            }, 500);
                        }}
                        title="Click Steve to jump and wave!"
                    >
                        {/* Instructions overlay badge */}
                        <div className="absolute bottom-1 right-2 text-[9px] text-cyan-400/70 bg-slate-950/70 px-2 py-0.5 rounded border border-cyan-500/20 pointer-events-none">
                            🖱️ Hover to track • Click to jump
                        </div>
                    </div>

                    {/* Action Hotbar (Minecraft Inventory Style) */}
                    <div className="relative z-10 w-full flex items-center justify-between gap-1.5 pt-1">
                        <button
                            onClick={handleLaunchTour}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 transition-all border border-cyan-300/40"
                        >
                            <Compass size={13} className="animate-spin-slow" />
                            <span>Tour</span>
                        </button>
                        <button
                            onClick={() => {
                                showLaptopProject(
                                    "Developer Workstation",
                                    "Linux • Docker • K8s",
                                    "Pulling my developer laptop from my tactical backpack!"
                                );
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                            title="Withdraw Laptop from Backpack"
                        >
                            💻 Laptop
                        </button>
                        <button
                            onClick={() => {
                                animStateRef.current.mode = 'wave';
                                setActionBadge('Waving');
                                speakText("Hello! Welcome to Omar Mohamed's engineering portfolio!");
                                setTimeout(() => {
                                    animStateRef.current.mode = 'idle';
                                    setActionBadge('Idle');
                                }, 2000);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all"
                            title="Make Steve Wave"
                        >
                            👋 Wave
                        </button>
                    </div>
                </div>

                {/* Expanded Chat Log & Controls (Hidden when minimized) */}
                {!isMinimized && (
                    <div className="flex flex-col h-[230px] bg-slate-950/90">
                        {/* Quick Prompts Chips Carousel */}
                        <div className="p-2 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-thin scrollbar-thumb-cyan-700/50">
                            {QUICK_PROMPTS.map((p, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => p.action ? p.action() : handleSend(p.text)}
                                    className="whitespace-nowrap px-2.5 py-1 rounded-md bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/40 text-[11px] text-cyan-200 transition-all flex items-center gap-1"
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
                                    {m.from === 'steve' && (
                                        <div className="w-5 h-5 rounded bg-cyan-950 border border-cyan-400 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                                            ⛏️
                                        </div>
                                    )}
                                    <div
                                        className={`rounded-xl px-3 py-2 max-w-[85%] leading-relaxed ${
                                            m.from === 'user'
                                                ? 'bg-cyan-600 text-white rounded-tr-none'
                                                : 'bg-slate-900/90 border border-cyan-500/20 text-slate-200 rounded-tl-none'
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap">{m.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isThinking && (
                                <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold pl-2 py-1">
                                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                                    <span>Consulting MORA LLM...</span>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input Box */}
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="p-2.5 bg-slate-900 border-t border-cyan-500/30 flex items-center gap-2"
                        >
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="[Chat] Ask Minecraft Omar..."
                                disabled={isThinking}
                                className="flex-1 bg-slate-950 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none transition-all font-mono"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim() || isThinking}
                                className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all shadow-md shadow-cyan-600/30"
                                title="Send"
                            >
                                <Send size={14} />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
