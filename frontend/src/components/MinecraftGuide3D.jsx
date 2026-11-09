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
 * Generate 64x64 Torso texture: Cyber teal hoodie with "AI" emblem & pocket
 */
function createTorsoTexture() {
    const { canvas, ctx } = createPixelCanvas(64, 64);

    // Dark slate cyan hoodie base
    const cyanTones = ['#0f766e', '#115e59', '#134e4a', '#14b8a6'];
    for (let x = 0; x < 64; x += 8) {
        for (let y = 0; y < 64; y += 8) {
            ctx.fillStyle = cyanTones[Math.floor(Math.random() * (cyanTones.length - 1))];
            ctx.fillRect(x, y, 8, 8);
        }
    }

    // Collar / neckline
    ctx.fillStyle = '#d79b76';
    ctx.fillRect(24, 0, 16, 8);
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(20, 8, 24, 4);

    // Center glowing emblem "AI"
    ctx.fillStyle = '#38bdf8';
    // 'A'
    ctx.fillRect(24, 22, 6, 14);
    ctx.fillRect(30, 22, 6, 4);
    ctx.fillRect(30, 28, 6, 3);
    ctx.fillRect(36, 22, 6, 14);

    // Front hoodie pocket
    ctx.fillStyle = '#042f2e';
    ctx.fillRect(12, 42, 40, 16);
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 42, 40, 16);

    // Belt
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 58, 64, 6);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(28, 58, 8, 6);

    return canvasToTexture(canvas);
}

/**
 * Generate 32x32 Limb textures for Arms (sleeves + skin hands)
 */
function createArmTexture() {
    const { canvas, ctx } = createPixelCanvas(32, 64);

    // Sleeve
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(0, 0, 32, 44);
    ctx.fillStyle = '#14b8a6';
    ctx.fillRect(0, 40, 32, 4);

    // Skin hand
    ctx.fillStyle = '#d79b76';
    ctx.fillRect(0, 44, 32, 20);
    ctx.fillStyle = '#c88b66';
    ctx.fillRect(4, 52, 10, 8);

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

    // Animation state refs
    const animStateRef = useRef({
        mode: 'idle', // 'idle' | 'walk' | 'wave' | 'talk' | 'jump'
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
            animStateRef.current.mode = 'walk';
            setActionBadge(`Guiding: ${detail.badge || 'Section'}`);

            const stepNotice = `🧭 **[Step ${detail.stepIndex + 1}/${detail.totalSteps}] ${detail.title}:**\n${detail.description}`;
            setMessages(prev => [...prev.slice(-8), {
                id: `tour-${Date.now()}`,
                from: 'steve',
                text: stepNotice
            }]);

            speakText(`${detail.title}. ${detail.description}`);

            setTimeout(() => {
                animStateRef.current.mode = 'wave';
                setTimeout(() => {
                    animStateRef.current.mode = 'idle';
                    setActionBadge('Idle');
                }, 1500);
            }, 1200);
        };

        const handleTourEnd = () => {
            animStateRef.current.mode = 'idle';
            setActionBadge('Idle');
        };

        const handleToggleGuide = () => {
            setIsOpen(true);
            setIsMinimized(false);
            animStateRef.current.mode = 'jump';
            setActionBadge('Hello!');
            setTimeout(() => {
                animStateRef.current.mode = 'wave';
                setTimeout(() => {
                    animStateRef.current.mode = 'idle';
                    setActionBadge('Idle');
                }, 1500);
            }, 500);
        };

        window.addEventListener('portfolio-tour-step', handleTourStep);
        window.addEventListener('portfolio-tour-ended', handleTourEnd);
        window.addEventListener('toggle-3d-minecraft-guide', handleToggleGuide);

        return () => {
            window.removeEventListener('portfolio-tour-step', handleTourStep);
            window.removeEventListener('portfolio-tour-ended', handleTourEnd);
            window.removeEventListener('toggle-3d-minecraft-guide', handleToggleGuide);
        };
    }, [speakText]);

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
        const armTex = createArmTexture();
        const legTex = createLegTexture();

        // Materials
        const headMat = new THREE.MeshLambertMaterial({ map: headTex });
        const torsoMat = new THREE.MeshLambertMaterial({ map: torsoTex });
        const armMat = new THREE.MeshLambertMaterial({ map: armTex });
        const legMat = new THREE.MeshLambertMaterial({ map: legTex });

        // Character Root Group
        const characterGroup = new THREE.Group();
        characterGroup.position.set(0, -0.2, 0);
        scene.add(characterGroup);
        characterGroupRef.current = characterGroup;

        // 1. Torso (1.0 wide, 1.4 high, 0.6 deep)
        const torsoGeo = new THREE.BoxGeometry(1.0, 1.35, 0.55);
        const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
        torsoMesh.position.y = 0.68;
        characterGroup.add(torsoMesh);

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
        const leftArmMesh = new THREE.Mesh(armGeo, armMat);
        leftArmMesh.position.set(0, -0.58, 0);
        leftArmGroup.add(leftArmMesh);

        // 4. Right Arm Group (Pivots at shoulder)
        const rightArmGroup = new THREE.Group();
        rightArmGroup.position.set(0.76, 1.28, 0);
        characterGroup.add(rightArmGroup);
        rightArmGroupRef.current = rightArmGroup;

        const rightArmMesh = new THREE.Mesh(armGeo, armMat);
        rightArmMesh.position.set(0, -0.58, 0);
        rightArmGroup.add(rightArmMesh);

        // Attach torch to right hand
        torchGroup.position.set(0, -1.0, 0.35);
        torchGroup.rotation.x = Math.PI / 4;
        rightArmGroup.add(torchGroup);

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

                case 'idle':
                default:
                    // Subtle breathing and swaying
                    if (characterGroupRef.current) {
                        characterGroupRef.current.position.y = -0.2 + Math.sin(time * 2.2) * 0.05;
                        characterGroupRef.current.rotation.y = Math.sin(time * 0.8) * 0.06;
                    }
                    if (leftArmGroupRef.current) leftArmGroupRef.current.rotation.x = Math.sin(time * 2.2) * 0.08;
                    if (rightArmGroupRef.current) {
                        rightArmGroupRef.current.rotation.x = -0.2 - Math.sin(time * 2.2) * 0.08;
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
            armTex.dispose();
            legTex.dispose();
        };
    }, []);

    // Quick prompt buttons
    const QUICK_PROMPTS = [
        { label: "🧭 Tour Portfolio", action: handleLaunchTour },
        { label: "🏢 PlayerHub (Dubai)", text: "What does Omar do at PlayerHub.GG in Dubai?" },
        { label: "🏥 CliniSoft Healthcare", text: "Tell me about Omar's healthcare AI work at CliniSoft" },
        { label: "🏛️ HistoryVerse (A+)", text: "What is HistoryVerse and what technologies did Omar use?" },
        { label: "📜 Certifications & RHCSA", text: "What certifications does Omar hold?" },
        { label: "📬 How to Contact", text: "How can I contact or hire Omar Gad?" }
    ];

    if (!isOpen) {
        return (
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => { setIsOpen(true); setIsMinimized(false); }}
                className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#1e293b]/95 border-2 border-cyan-500/60 shadow-[0_0_25px_rgba(6,182,212,0.35)] backdrop-blur-md text-white font-mono text-sm group hover:border-cyan-400 transition-all"
                title="Open 3D Minecraft Guide"
            >
                <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-lg shadow-inner group-hover:rotate-6 transition-transform">
                    ⛏️
                </div>
                <div className="flex flex-col text-left">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">3D AI Guide</span>
                    <span className="text-xs text-slate-200 font-semibold">Minecraft Omar</span>
                </div>
                <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
            </motion.button>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bottom-6 left-6 z-40 flex flex-col font-mono transition-all duration-300 ${
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
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 transition-all border border-cyan-300/40"
                        >
                            <Compass size={14} className="animate-spin-slow" />
                            <span>Tour Guide</span>
                        </button>
                        <button
                            onClick={() => {
                                animStateRef.current.mode = 'wave';
                                setActionBadge('Waving');
                                speakText("Hello! Welcome to Omar Gad's engineering portfolio!");
                                setTimeout(() => {
                                    animStateRef.current.mode = 'idle';
                                    setActionBadge('Idle');
                                }, 2000);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all"
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
