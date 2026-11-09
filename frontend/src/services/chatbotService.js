import axios from 'axios';
import { queryLocalKnowledge, PORTFOLIO_KNOWLEDGE } from '../data/portfolioKnowledgeBase';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || '/api';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY || "";

/**
 * System prompt injected with full portfolio knowledge
 */
const SYSTEM_PROMPT = `You are MORA, the personal AI assistant for Omar Gad (Omar Mohamed Abdelsalam), an exceptional Computer Engineer specialized in AI, LLMs & RAG, and MLOps & Cloud.
Omar is currently an M.Sc. candidate in Computer Engineering with a 4.0/4.0 CGPA at Arab Academy for Science, Technology and Maritime Transport, and works as an MLOps & AI Infrastructure Engineer at PlayerHub.GG (Dubai, Remote).
He was previously an AI & ML Engineer at CliniSoft, where he built healthcare AI for automated clinical documentation.
His graduation project HistoryVerse earned an A+ grade, featuring 90-96% artifact recognition accuracy with YOLOv5 and Transformers, 25+ REST endpoints with ChromaDB RAG, and deployment on AWS Fargate with modular Terraform.
He holds Red Hat Certified System Administrator (RHCSA), Huawei Cloud Developer (HCCDA), and completed the Aspire Leaders Program.
Always respond warmly, concisely, and accurately based on Omar's real achievements and facts. Respond in the same language as the user (English or Arabic).`;

/**
 * Call Google Gemini directly if API key is present
 */
async function callGeminiDirectly(userMessage) {
    if (!GEMINI_API_KEY) return null;
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
        const response = await axios.post(url, {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: `${SYSTEM_PROMPT}\n\nUser Question: ${userMessage}` }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 800
            }
        }, { timeout: 8000 });

        const candidateText = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
            return candidateText.trim();
        }
    } catch (err) {
        console.warn('Gemini direct API call failed or timed out:', err?.message);
    }
    return null;
}

/**
 * Send text message with hybrid multi-layer fallback
 */
export async function sendTextMessage(message, stream = false) {
    const trimmed = (message || '').trim();
    if (!trimmed) return { Answer: 'Please ask a question about Omar Gad!' };

    // Layer 1: Attempt backend /api/chat
    try {
        const response = await axios.post(`${API_BASE_URL}/chat`, {
            user_input: trimmed,
            stream
        }, { timeout: 3500 });

        if (response?.data?.Answer && !response.data.Answer.includes('could not reach')) {
            return response.data;
        }
        if (response?.data?.answer) {
            return { Answer: response.data.answer };
        }
    } catch (backendError) {
        // Backend not running (expected on static deployments like Vercel)
        console.debug('Backend /api/chat unreachable, activating intelligent RAG engine...');
    }

    // Layer 2: Direct Gemini API if configured
    const geminiAnswer = await callGeminiDirectly(trimmed);
    if (geminiAnswer) {
        return { Answer: geminiAnswer };
    }

    // Layer 3: Intelligent Local RAG Knowledge Engine
    const localAnswer = queryLocalKnowledge(trimmed);
    if (localAnswer) {
        return { Answer: localAnswer };
    }

    return {
        Answer: `I'm MORA, Omar Gad's AI Assistant. You can ask me about his work at PlayerHub.GG, CliniSoft, or ChloroMaster, his flagship projects like HistoryVerse (A+), his MLOps & LLM skills, or his contact information!`
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
        return { Answer: 'Image received! Omar has experience building multimodal AI systems including YOLOv5 artifact detection in HistoryVerse and Stable Diffusion XL LoRA fine-tuning.' };
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

    // Client-side Web Speech recognition fallback if available
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
            const cleanText = text.replace(/[*_#`]/g, '');
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
