import axios from 'axios';
import { queryLocalKnowledge } from '../data/portfolioKnowledgeBase';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || '/api';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY || "";

/**
 * System prompt injected with full portfolio knowledge and domain persona
 * (Architected after HistoryVerse-Chatbot TemplatedAgent design)
 */
const SYSTEM_PROMPT = `You are MORA, the official autonomous AI representative and technical assistant for Omar Mohamed (Omar Mohamed Abdelsalam).
Omar is a Computer Engineer and M.Sc. candidate (CGPA: 4.0 / 4.0 at Arab Academy for Science, Technology and Maritime Transport).
Key Facts to Ground Every Answer:
- Current Role: MLOps & AI Infrastructure Engineer at PlayerHub.GG (Dubai, UAE - Full-time, Remote, Sep 2026 - Present), operating AI agent systems, scraping pipelines, HAProxy read routing, MariaDB replication, self-healing daemons (autoheal, smartheal), and Prometheus/Grafana/Loki.
- Previous Role: AI & ML Engineer at CliniSoft (Alexandria, Apr 2026 - Aug 2026), built production healthcare AI with LLMs, NLP, and Faster-Whisper speech automation for clinical documentation, served via FastAPI.
- Teaching: EYouth (Apr 2026 - Sep 2026) and Black Horse Courses (Jan 2025 - Dec 2025, 50+ students, 95% satisfaction).
- Volunteer: Palestine Polytechnic University (advised student team on AI retinal OCT diagnosis, acknowledged in thesis).
- Previous Role: Software & DevOps Engineer at ChloroMaster (AWS, Kubernetes, Terraform, Vault, Trivy).
- Flagship Graduation Project: HistoryVerse (Grade: A+) — Multilingual AI/AR Museum Guide with 90-96% artifact accuracy using YOLOv5 & Transformers, 25+ REST endpoints with ChromaDB RAG, and AWS Fargate deployment with 204 passing automated tests.
- SDXL LoRA Fine-Tuning: Sultan Hassan Mosque, Cairo (Hugging Face diffusers, rank 32 fp16, MLflow).
- Credentials: Aspire Leaders Program (Harvard-founded Aspire Institute, Sep 2026), Red Hat Certified System Administrator (RHCSA Cert #250-068-707), Huawei Cloud Developer (HCCDA), IBM Docker Essentials, AWS Academy Cloud Foundations.
- Contact: Email: omarmo.abdelsalam@gmail.com | Phone/WhatsApp: +20 101 1297 869 | Alexandria, Egypt.

Guidelines:
1. Always maintain a professional, energetic, and helpful technical tone.
2. Ground every factual claim in Omar's actual portfolio data.
3. Automatically match the user's language (English or Arabic/Egyptian dialect).
4. If asked about off-topic subjects (sports, recipes, general coding help unrelated to Omar), politely and wittily redirect them to Omar's engineering work and availability.`;

/**
 * Call Google Gemini API directly with multi-turn conversation history
 */
async function callGeminiDirectly(userMessage, conversationHistory = []) {
    if (!GEMINI_API_KEY) return null;
    const candidateModels = [
        import.meta.env.VITE_GEMINI_MODEL || 'gemini-2.0-flash-lite',
        'gemini-2.0-flash',
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash-8b'
    ];

    // Format multi-turn contents for Gemini
    const contents = [
        {
            role: "user",
            parts: [{ text: `${SYSTEM_PROMPT}\n\nPlease acknowledge your role as MORA.` }]
        },
        {
            role: "model",
            parts: [{ text: "Understood. I am MORA, Omar Mohamed's personal AI Assistant, grounded in his verified portfolio facts." }]
        }
    ];

    // Append recent conversation history (up to last 6 messages)
    const recentHistory = (conversationHistory || []).slice(-6);
    for (const msg of recentHistory) {
        const role = msg.from === 'bot' ? 'model' : 'user';
        const text = msg.text || '';
        if (text && !text.startsWith('📎') && !text.startsWith('🎤')) {
            contents.push({
                role,
                parts: [{ text }]
            });
        }
    }

    contents.push({
        role: "user",
        parts: [{ text: userMessage }]
    });

    for (const modelName of candidateModels) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
            const response = await axios.post(url, {
                contents,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 900
                }
            }, { timeout: 6000 });

            const candidateText = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText) {
                return candidateText.trim();
            }
        } catch (err) {
            console.warn(`Gemini direct API call with ${modelName} failed or timed out:`, err?.message);
        }
    }
    return null;
}

/**
 * Send text message with multi-turn history and robust fallback
 */
export async function sendTextMessage(message, conversationHistory = [], stream = false) {
    const trimmed = (message || '').trim();
    if (!trimmed) return { Answer: 'Please ask a question about Omar Mohamed!' };

    // Layer 1: Attempt backend /api/chat with conversation history
    try {
        const response = await axios.post(`${API_BASE_URL}/chat`, {
            user_input: trimmed,
            history: conversationHistory.slice(-6).map(m => ({
                role: m.from === 'bot' ? 'assistant' : 'user',
                content: m.text || ''
            })),
            stream
        }, { timeout: 4000 });

        if (response?.data?.Answer && !response.data.Answer.includes('could not reach')) {
            return response.data;
        }
        if (response?.data?.answer) {
            return { Answer: response.data.answer };
        }
    } catch (backendError) {
        console.debug('Backend /api/chat unreachable, activating multi-turn intelligent RAG engine...');
    }

    // Layer 2: Direct Gemini API with multi-turn context
    const geminiAnswer = await callGeminiDirectly(trimmed, conversationHistory);
    if (geminiAnswer) {
        return { Answer: geminiAnswer };
    }

    // Layer 3: Intelligent Local RAG Knowledge Engine with pronoun & colloquial resolution
    const localAnswer = queryLocalKnowledge(trimmed, conversationHistory);
    if (localAnswer) {
        return { Answer: localAnswer };
    }

    return {
        Answer: `I'm MORA, Omar Mohamed's AI Assistant. You can ask me about his work at PlayerHub.GG, CliniSoft, or ChloroMaster, his flagship projects like HistoryVerse (A+), his MLOps & LLM skills, or his contact information!`
    };
}

export async function sendImageMessage(imageUrl, message, responseType = 'text', audioVoice = null, stream = false) {
    try {
        const response = await axios.post(`${API_BASE_URL}/image_conversation`, {
            image_url: imageUrl,
            user_input: message,
            response_type: responseType,
            audio_voice: audioVoice,
            stream
        }, { timeout: 7000 });
        return response.data;
    } catch (error) {
        console.warn('Image conversation backend unavailable:', error?.message);
        return { Answer: 'Image received! Omar has extensive expertise building multimodal AI systems including YOLOv5 artifact detection in HistoryVerse (90-96% accuracy) and Stable Diffusion XL LoRA fine-tuning.' };
    }
}

export async function uploadFile(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 8000
        });
        return response.data.file_url;
    } catch (error) {
        console.warn('Backend file upload fallback:', error?.message);
        return URL.createObjectURL(file);
    }
}

export async function transcribeAudio(audioFile) {
    try {
        const formData = new FormData();
        formData.append('file', audioFile);
        const response = await axios.post(`${API_BASE_URL}/transcribe`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 8000
        });
        if (response?.data?.text) return response.data;
    } catch (error) {
        console.warn('Backend Whisper transcription unavailable:', error?.message);
    }

    return { text: '' };
}

export async function speakText(text, voice = 'gtts') {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/speak`,
            { text, voice },
            { responseType: 'blob', timeout: 5000 }
        );
        return response.data;
    } catch (error) {
        // Fallback: Browser Web Speech API
        if ('speechSynthesis' in window) {
            const cleanText = text.replace(/[*_#`\[\]]/g, '');
            const utterance = new SpeechSynthesisUtterance(cleanText);
            const isArabic = /[\u0600-\u06FF]/.test(cleanText);
            utterance.lang = isArabic ? 'ar-SA' : 'en-US';
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
        }
        throw error;
    }
}

export async function analyzePdf(pdfFile, question) {
    try {
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('question', question);
        const response = await axios.post(`${API_BASE_URL}/analyze/pdf`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 8000
        });
        return response.data;
    } catch (error) {
        return { response: 'PDF received. Omar has built enterprise RAG pipelines over complex documents using LangChain, ChromaDB, and Pydantic validation.' };
    }
}

export async function analyzeVideo(videoFile, question) {
    try {
        const formData = new FormData();
        formData.append('file', videoFile);
        formData.append('question', question);
        const response = await axios.post(`${API_BASE_URL}/analyze/video`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 8000
        });
        return response.data;
    } catch (error) {
        return { response: 'Video received. Omar specializes in computer vision, video analytics, and multimodal LLM architectures.' };
    }
}
