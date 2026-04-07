import axios from 'axios';

// Use build-time env vars, then fall back to the nginx-proxied API path.
// For local direct access, set VITE_BACKEND_URL=http://localhost:8001.
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || '/api';

export async function sendTextMessage(message, stream = false) {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat`, {
            user_input: message,
            stream
        });
        return response.data;
    } catch (error) {
        console.error('Error sending text message:', error);
        return { Answer: 'Sorry, I could not reach the chatbot service.' };
    }
}

export async function sendImageMessage(imageUrl, message, responseType = 'text', audioVoice = null, stream = false) {
    try {
        const response = await axios.post(`${API_BASE_URL}/image_conversation`, {
            image_url: imageUrl,
            user_input: message,
            response_type: responseType,
            audio_voice: audioVoice,
            stream
        });
        return response.data;
    } catch (error) {
        console.error('Error sending image message:', error);
        return { Answer: 'Sorry, I could not process the image.' };
    }
}

export async function uploadFile(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.file_url;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

/**
 * Transcribe an audio file (voice message) to text using Whisper.
 * @param {File|Blob} audioFile - Audio file to transcribe
 * @returns {Promise<{text: string, language?: string}>}
 */
export async function transcribeAudio(audioFile) {
    try {
        const formData = new FormData();
        formData.append('file', audioFile);
        const response = await axios.post(`${API_BASE_URL}/transcribe`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error transcribing audio:', error);
        return { text: '' };
    }
}

/**
 * Convert text to speech and return audio blob.
 * @param {string} text - Text to speak
 * @param {string} voice - TTS engine ('gtts' or 'openai')
 * @returns {Promise<Blob>}
 */
export async function speakText(text, voice = 'gtts') {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/speak`,
            { text, voice },
            { responseType: 'blob' }
        );
        return response.data;
    } catch (error) {
        console.error('Error generating speech:', error);
        throw error;
    }
}

/**
 * Analyze a PDF document with a question.
 * @param {File} pdfFile - PDF file to analyze
 * @param {string} question - Question about the PDF
 * @returns {Promise<{response: string, media_type: string}>}
 */
export async function analyzePdf(pdfFile, question) {
    try {
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('question', question);
        const response = await axios.post(`${API_BASE_URL}/analyze/pdf`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error analyzing PDF:', error);
        return { response: 'Sorry, I could not analyze the PDF.' };
    }
}

/**
 * Analyze a video with a question.
 * @param {File} videoFile - Video file to analyze
 * @param {string} question - Question about the video
 * @returns {Promise<{response: string, media_type: string}>}
 */
export async function analyzeVideo(videoFile, question) {
    try {
        const formData = new FormData();
        formData.append('file', videoFile);
        formData.append('question', question);
        const response = await axios.post(`${API_BASE_URL}/analyze/video`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error analyzing video:', error);
        return { response: 'Sorry, I could not analyze the video.' };
    }
}
