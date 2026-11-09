import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaWhatsapp, FaPaperclip, FaMicrophone, FaStop, FaPlay, FaPause, FaTrash, FaUser, FaPhoneAlt, FaCommentDots } from 'react-icons/fa';
import { Sparkles, Copy, Check, RotateCcw } from 'lucide-react';
import { sendTextMessage, sendImageMessage, uploadFile, transcribeAudio } from '../services/chatbotService';
import SpeakerButton from './ChatTTS';
import DownArrowButton from './DownArrowButton';
import { useLanguage } from '../context/LanguageContext';

function FormattedMessageText({ text }) {
    if (!text) return null;
    const lines = text.split('\n');
    return (
        <div className="space-y-1.5 leading-relaxed">
            {lines.map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={i} className="h-1.5" />;
                const isBullet = trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('* ');
                const cleanLine = isBullet ? trimmed.replace(/^[•\-\*]\s*/, '') : line;
                const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

                return (
                    <div key={i} className={isBullet ? 'flex items-start gap-1.5 pl-1 text-[13px]' : 'text-[13px]'}>
                        {isBullet && <span className="text-cyan-400 font-bold flex-shrink-0 mt-0.5">▹</span>}
                        <div>
                            {parts.map((part, pIdx) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                    return <strong key={pIdx} className="font-semibold text-cyan-300">{part.slice(2, -2)}</strong>;
                                }
                                return part;
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function ChatWidget() {
    const { t, currentLocale, language } = useLanguage();
    const suggestedPrompts = currentLocale?.chatSuggestedPrompts || [];
    const [open, setOpen] = useState(false);
    const [showNotice, setShowNotice] = useState(true);
    const [value, setValue] = useState('');
    const [messages, setMessages] = useState(() => [
        {
            id: 1,
            from: 'bot',
            text: t('chatBotWelcome')
        }
    ]);

    useEffect(() => {
        setMessages(prev => {
            if (prev.length === 1 && prev[0].from === 'bot') {
                return [{ id: 1, from: 'bot', text: t('chatBotWelcome') }];
            }
            return prev;
        });
    }, [language]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [recording, setRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const fileInputRef = useRef(null);
    const recordingTimerRef = useRef(null);
    const recordingCancelledRef = useRef(false);
    const recordingDurationRef = useRef(0);
    const streamRef = useRef(null);
    const [pendingVoice, setPendingVoice] = useState(null);
    const [playingAudioId, setPlayingAudioId] = useState(null);
    const audioRefs = useRef({});
    const playbackAudioRef = useRef(null);
    const widgetRef = useRef(null);
    const fabRef = useRef(null);
    const panelRef = useRef(null);
    const chatBodyRef = useRef(null);
    const userNearBottomRef = useRef(true);
    const [showScrollDown, setShowScrollDown] = useState(false);
    const prevScrollTop = useRef(0);
    const [lastMessageSender, setLastMessageSender] = useState(null);
    const [copiedId, setCopiedId] = useState(null);

    const send = async () => {
        if (!value.trim()) return;
        console.debug('ChatWidget: Sending message', value);
        const userMsg = { id: Date.now(), from: 'user', text: value.trim() };
        const updatedHistory = [...messages, userMsg];
        setMessages(updatedHistory);
        setLastMessageSender('user');
        const userQuery = value.trim();
        setValue('');
        setIsLoading(true);

        try {
            let response;

            // If there's an uploaded file (image), use image conversation
            if (uploadedFile && uploadedFile.type.startsWith('image/')) {
                const imageUrl = await uploadFile(uploadedFile);
                response = await sendImageMessage(imageUrl, userQuery, 'text', null, false);
                setUploadedFile(null); // Clear uploaded file after use
            } else {
                // Regular text conversation with conversational memory
                response = await sendTextMessage(userQuery, updatedHistory, false);
            }

            // Extract answer from response
            const botAnswer = response.Answer || response.answer || t('chatBotError');

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                from: 'bot',
                text: botAnswer
            }]);
            setLastMessageSender('bot');

            console.debug('ChatWidget: Bot answer received', botAnswer);
        } catch (error) {
            console.error('Error communicating with chatbot:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                from: 'bot',
                text: t('chatBotError')
            }]);
            setLastMessageSender('bot');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestedPrompt = async (queryText) => {
        if (isLoading) return;
        const userMsg = { id: Date.now(), from: 'user', text: queryText };
        const updatedHistory = [...messages, userMsg];
        setMessages(updatedHistory);
        setLastMessageSender('user');
        setIsLoading(true);

        try {
            const response = await sendTextMessage(queryText, updatedHistory, false);
            const botAnswer = response.Answer || response.answer || t('chatBotError');
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                from: 'bot',
                text: botAnswer
            }]);
            setLastMessageSender('bot');
        } catch (error) {
            console.error('Error communicating with chatbot:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                from: 'bot',
                text: t('chatBotWelcome')
            }]);
            setLastMessageSender('bot');
        } finally {
            setIsLoading(false);
        }
    };

    // TTS is handled by the per-message `SpeakerButton` (ChatTTS).

    // Format seconds to mm:ss
    const formatTime = (seconds) => {
        if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Toggle audio playback for voice messages
    const toggleAudioPlayback = async (msgId, audioUrl) => {
        const hiddenAudio = audioRefs.current[msgId];
        if (!hiddenAudio && !audioUrl) return;

        if (playingAudioId === msgId) {
            playbackAudioRef.current?.pause();
            setPlayingAudioId(null);
            return;
        }

        // Pause any currently playing audio before starting a new one.
        Object.values(audioRefs.current).forEach(a => a?.pause());
        playbackAudioRef.current?.pause();

        const targetAudio = new Audio(audioUrl || hiddenAudio?.src);
        playbackAudioRef.current = targetAudio;
        targetAudio.currentTime = 0;
        targetAudio.volume = 1;

        const handleEnded = () => setPlayingAudioId(null);
        const handleError = (err) => {
            console.warn('Voice playback failed', err);
            setPlayingAudioId(null);
        };

        targetAudio.addEventListener('ended', handleEnded, { once: true });
        targetAudio.addEventListener('error', handleError, { once: true });

        try {
            const playPromise = targetAudio.play();
            if (playPromise && typeof playPromise.then === 'function') {
                await playPromise;
            }
            setPlayingAudioId(msgId);
        } catch (err) {
            handleError(err);
        }
    };

    const playAudioByRef = async (audioKey, fallbackAudioUrl = null) => {
        const audio = audioRefs.current[audioKey];
        if (!audio && !fallbackAudioUrl) return false;

        const targetAudio = audio || new Audio(fallbackAudioUrl);

        try {
            targetAudio.currentTime = 0;
            targetAudio.volume = 1;
            const playPromise = targetAudio.play();
            if (playPromise && typeof playPromise.then === 'function') {
                await playPromise;
            }
            return true;
        } catch (err) {
            console.warn('Audio playback failed', err);
            return false;
        }
    };

    const audioBufferToWavBlob = (audioBuffer) => {
        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const length = audioBuffer.length;
        const bitsPerSample = 16;
        const bytesPerSample = bitsPerSample / 8;
        const blockAlign = numChannels * bytesPerSample;
        const byteRate = sampleRate * blockAlign;
        const dataSize = length * blockAlign;
        const buffer = new ArrayBuffer(44 + dataSize);
        const view = new DataView(buffer);

        const writeString = (offset, str) => {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        };

        writeString(0, 'RIFF');
        view.setUint32(4, 36 + dataSize, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, byteRate, true);
        view.setUint16(32, blockAlign, true);
        view.setUint16(34, bitsPerSample, true);
        writeString(36, 'data');
        view.setUint32(40, dataSize, true);

        let offset = 44;
        for (let i = 0; i < length; i++) {
            for (let ch = 0; ch < numChannels; ch++) {
                const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(ch)[i]));
                view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
                offset += 2;
            }
        }

        return new Blob([buffer], { type: 'audio/wav' });
    };

    const convertAudioFileToWav = async (file) => {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return file;

        const ctx = new AudioCtx();
        try {
            const arrayBuffer = await file.arrayBuffer();
            const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
            const wavBlob = audioBufferToWavBlob(decoded);
            return new File([wavBlob], `voice-${Date.now()}.wav`, { type: 'audio/wav' });
        } finally {
            try { await ctx.close(); } catch (e) { }
        }
    };

    // Cancel recording and discard
    const cancelRecording = () => {
        // mark as cancelled so stop handler doesn't process/upload the audio
        recordingCancelledRef.current = true;
        const mr = mediaRecorderRef.current;
        if (mr && mr.state !== 'inactive') {
            try { mr.stop(); } catch (e) { }
        }
        // Stop all tracks
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        mediaRecorderRef.current = null;
        if (recordingTimerRef.current) {
            clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = null;
        }
        setRecording(false);
        setRecordingDuration(0);
        recordingDurationRef.current = 0;
        audioChunksRef.current = [];
    };

    const startRecording = async () => {
        if (recording) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Detect supported MIME type
            let mimeType = 'audio/webm';
            if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                mimeType = 'audio/webm;codecs=opus';
            } else if (MediaRecorder.isTypeSupported('audio/webm')) {
                mimeType = 'audio/webm';
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                mimeType = 'audio/mp4';
            } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
                mimeType = 'audio/ogg';
            }

            const mr = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mr;
            audioChunksRef.current = [];
            recordingCancelledRef.current = false;

            // Start recording timer
            setRecordingDuration(0);
            recordingDurationRef.current = 0;
            recordingTimerRef.current = setInterval(() => {
                recordingDurationRef.current += 1;
                setRecordingDuration(recordingDurationRef.current);
            }, 1000);

            mr.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mr.onstop = () => {
                // Clear timer
                if (recordingTimerRef.current) {
                    clearInterval(recordingTimerRef.current);
                    recordingTimerRef.current = null;
                }

                // Stop all tracks
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(t => t.stop());
                    streamRef.current = null;
                }

                // If user cancelled the recording, do nothing and reset flag
                if (recordingCancelledRef.current) {
                    recordingCancelledRef.current = false;
                    setRecording(false);
                    setRecordingDuration(0);
                    recordingDurationRef.current = 0;
                    audioChunksRef.current = [];
                    setIsLoading(false);
                    return;
                }

                const finalDuration = recordingDurationRef.current;
                const chunks = audioChunksRef.current;

                if (chunks.length === 0) {
                    console.warn('No audio chunks recorded');
                    setRecording(false);
                    setRecordingDuration(0);
                    recordingDurationRef.current = 0;
                    return;
                }

                const blob = new Blob(chunks, { type: mimeType });
                const ext = mimeType.includes('webm') ? 'webm' : mimeType.includes('mp4') ? 'm4a' : 'ogg';
                const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: blob.type });

                // store preview in input area (pendingVoice) - user must choose send or delete
                const preview = {
                    id: Date.now(),
                    audioUrl: URL.createObjectURL(blob),
                    file,
                    audioDuration: finalDuration || 1
                };
                setPendingVoice(preview);
                setRecording(false);
                setRecordingDuration(0);
                recordingDurationRef.current = 0;
                audioChunksRef.current = [];
                setIsLoading(false);
            };

            // Start recording - use timeslice for continuous data capture
            mr.start(250);
            setRecording(true);
        } catch (err) {
            console.error('Microphone access denied or failed', err);
            setRecording(false);
        }
    };

    const stopRecording = () => {
        const mr = mediaRecorderRef.current;
        if (!mr || mr.state === 'inactive') return;
        try {
            mr.stop();
            mediaRecorderRef.current = null;
        } catch (err) {
            console.warn('Error stopping recorder', err);
        }
    };

    // Voice message player component
    const VoiceMessagePlayer = ({ msg }) => {
        const [progress, setProgress] = useState(0);
        const [duration, setDuration] = useState(msg.audioDuration || 0);
        const [currentTime, setCurrentTime] = useState(0);
        const [waveform, setWaveform] = useState([]);
        const isPlaying = playingAudioId === msg.id;

        useEffect(() => {
            const audio = audioRefs.current[msg.id];
            if (!audio) return;

            const handleTimeUpdate = () => {
                const ct = Number.isFinite(audio.currentTime) ? Math.floor(audio.currentTime) : 0;
                const dur = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : (msg.audioDuration || 0);
                const prog = dur > 0 && Number.isFinite(dur) ? Math.max(0, Math.min(100, (audio.currentTime / dur) * 100)) : 0;
                setCurrentTime(ct);
                setProgress(prog);
            };
            const handleLoadedMetadata = () => {
                const d = Number.isFinite(audio.duration) && audio.duration > 0 ? Math.floor(audio.duration) : (msg.audioDuration || 0);
                setDuration(d);
            };
            const handleEnded = () => {
                setPlayingAudioId(null);
                setProgress(0);
                setCurrentTime(0);
            };

            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('ended', handleEnded);

            // Generate waveform bars from audio data (decode audio buffer)
            let cancelled = false;
            const generateWaveform = async () => {
                try {
                    if (!msg.audioUrl) return;
                    const resp = await fetch(msg.audioUrl);
                    const arrayBuffer = await resp.arrayBuffer();
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    if (!AudioCtx) return;
                    const ctx = new AudioCtx();
                    const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
                    const raw = audioBuffer.getChannelData(0);
                    const bars = 40;
                    const blockSize = Math.floor(raw.length / bars);
                    const values = [];
                    for (let i = 0; i < bars; i++) {
                        let start = i * blockSize;
                        let sum = 0;
                        for (let j = 0; j < blockSize && start + j < raw.length; j++) {
                            sum += Math.abs(raw[start + j]);
                        }
                        const avg = blockSize > 0 ? (sum / blockSize) : 0;
                        // scale to 12..100
                        const height = Math.max(6, Math.min(100, Math.round(avg * 1200)));
                        values.push(height);
                    }
                    if (!cancelled) setWaveform(values);
                    // close audio context if available
                    try { ctx.close(); } catch (e) { }
                } catch (e) {
                    // ignore waveform generation errors
                }
            };
            generateWaveform();

            return () => {
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('ended', handleEnded);
                cancelled = true;
            };
        }, [msg.id]);

        // Get timestamp
        const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

        return (
            <div className={`voice-message-player ${msg.from}`}>
                <audio
                    ref={el => audioRefs.current[msg.id] = el}
                    src={msg.audioUrl}
                    preload="auto"
                    style={{ display: 'none' }}
                />
                {/* Play/Pause button */}
                <button
                    type="button"
                    className="voice-play-btn"
                    onClick={(e) => { e.stopPropagation(); toggleAudioPlayback(msg.id, msg.audioUrl); }}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                </button>

                {/* Waveform and progress */}
                <div className="voice-content">
                    <div className="voice-waveform">
                        <div className="voice-waveform-progress" style={{ width: `${progress}%` }} />
                        <div className="voice-waveform-bars">
                            {(waveform.length ? waveform : new Array(35).fill(28)).map((h, i) => (
                                <span key={i} className="voice-bar" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                        {/* Progress dot */}
                        <div className="voice-progress-dot" style={{ left: `${progress}%` }} />
                    </div>
                    {/* Duration below waveform */}
                    <div className="voice-meta">
                        <span className="voice-duration">{formatTime(isPlaying ? currentTime : duration)}</span>
                    </div>
                </div>
            </div>
        );
    };

    // send the pending voice message stored in input preview: transcribe then send to chatbot
    const sendVoiceMessage = async () => {
        const pv = pendingVoice;
        if (!pv) return;
        const voiceMsgId = Date.now();
        const voiceMessage = {
            id: voiceMsgId,
            from: 'user',
            text: '🎤 Voice message',
            audioUrl: pv.audioUrl,
            audioDuration: pv.audioDuration,
            voiceStatus: 'transcribing'
        };

        // Move the recording preview into the chat immediately so it no longer
        // stays stuck in the recorder bar while transcription runs.
        setMessages(prev => [...prev, voiceMessage]);
        setLastMessageSender('user');
        setPendingVoice(null);
        setIsLoading(true);
        try {
            const file = pv.file;
            if (!file || (file.size === 0)) {
                console.error('Attempting to send empty audio file', file);
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    from: 'bot',
                    text: 'Recording appears empty. Please try again.'
                }]);
                return;
            }

            let transcription = await transcribeAudio(file);
            let transcribedText = (transcription && transcription.text) ? transcription.text.trim() : '';

            // Fallback: convert to WAV and retry transcription for better accuracy.
            if (!transcribedText) {
                try {
                    const wavFile = await convertAudioFileToWav(file);
                    if (wavFile && wavFile !== file) {
                        transcription = await transcribeAudio(wavFile);
                        transcribedText = (transcription && transcription.text) ? transcription.text.trim() : '';
                    }
                } catch (convErr) {
                    console.warn('Voice WAV conversion fallback failed', convErr);
                }
            }

            console.debug('ChatWidget: Transcription result', transcription);

            // If transcription succeeded, send it as text to the chatbot
            if (transcribedText) {
                setMessages(prev => prev.map(m => (
                    m.id === voiceMsgId
                        ? { ...m, text: `🎤 "${transcribedText}"`, voiceStatus: 'ready' }
                        : m
                )));

                const response = await sendTextMessage(transcribedText, false);
                const botAnswer = response?.Answer || response?.answer || t('chatBotError');
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    from: 'bot',
                    text: botAnswer
                }]);
                setLastMessageSender('bot');

                console.debug('ChatWidget: Bot answer received (voice flow)', botAnswer);
                // NOTE: TTS playback is only triggered by user interaction (speaker button).
            } else {
                // Transcription empty — show clear feedback and avoid sending empty content
                console.warn('Transcription returned empty text for file:', file);
                setMessages(prev => prev.map(m => (
                    m.id === voiceMsgId
                        ? { ...m, voiceStatus: 'failed' }
                        : m
                )));

                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    from: 'bot',
                    text: t('chatVoiceError')
                }]);
                setLastMessageSender('bot');
            }
        } catch (err) {
            console.error('Error sending voice message', err);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                from: 'bot',
                text: t('chatVoiceFailed')
            }]);
            setLastMessageSender('bot');
        } finally {
            setIsLoading(false);
        }
    };

    const deleteVoiceMessage = (msgId) => {
        // if deleting from messages (older behavior) support id; otherwise clear pendingVoice
        if (pendingVoice && pendingVoice.id === msgId) {
            try { URL.revokeObjectURL(pendingVoice.audioUrl); } catch (e) { }
            setPendingVoice(null);
            return;
        }
        const msg = messages.find(m => m.id === msgId);
        if (msg && msg.audioUrl) {
            try { URL.revokeObjectURL(msg.audioUrl); } catch (e) { }
        }
        setMessages(prev => prev.filter(m => m.id !== msgId));
    };

    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const fileMsg = {
                id: Date.now(),
                from: 'user',
                text: `📎 ${file.name}`,
                file: file
            };
            setMessages(prev => [...prev, fileMsg]);
            setLastMessageSender('user');

            // Store the file for use with next message
            setUploadedFile(file);

            // Reset file input
            e.target.value = '';

            // If it's an image, show preview message
            if (file.type.startsWith('image/')) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    from: 'bot',
                    text: t('chatImageReceived')
                }]);
                setLastMessageSender('bot');
            } else if (file.type === 'application/pdf') {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    from: 'bot',
                    text: t('chatPdfReceived')
                }]);
                setLastMessageSender('bot');
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    from: 'bot',
                    text: t('chatFileReceived')
                }]);
                setLastMessageSender('bot');
            }
        }
    };

    // Position chat panel above the FAB to avoid overlap.
    const positionPanelAboveFab = () => {
        const fab = fabRef.current;
        const panel = panelRef.current;
        const widget = widgetRef.current;
        if (!fab || !panel || !widget) return;

        // Get fab height and apply as bottom offset for the panel plus a small gap
        const fabRect = fab.getBoundingClientRect();
        const gap = 12; // px gap between fab and panel
        // Since panel is absolutely positioned inside widget, set bottom relative to widget
        panel.style.bottom = `${fabRect.height + gap}px`;

        // Ensure panel does not go off-screen horizontally on very small viewports
        const panelRect = panel.getBoundingClientRect();
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
        if (panelRect.right > vw - 8) {
            // nudge left by the overflow amount
            const overflow = panelRect.right - (vw - 8);
            panel.style.right = `${overflow + 8}px`;
        } else {
            panel.style.right = '0px';
        }
    };

    // Reposition panel when opened and on resize
    useEffect(() => {
        if (open) {
            // position after next paint to ensure layout settled
            requestAnimationFrame(() => {
                positionPanelAboveFab();
            });
        }

        const onResize = () => positionPanelAboveFab();
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, [open]);

    // Smart auto-scroll: scroll to bottom only when user is already near bottom
    const scrollToBottomIfNeeded = (force = false) => {
        const container = chatBodyRef.current;
        if (!container) return;

        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

        if (force || isNearBottom || userNearBottomRef.current) {
            // scroll after DOM updates
            requestAnimationFrame(() => {
                try { container.scrollTop = container.scrollHeight; } catch (e) { }
            });
        }
    };

    // Track user scroll interactions to avoid forcing scroll when user reads older messages
    useEffect(() => {
        const c = chatBodyRef.current;
        if (!c) return;

        // initialize
        prevScrollTop.current = c.scrollTop;

        const onScroll = () => {
            const cur = c.scrollTop;
            const scrolledUpBy = prevScrollTop.current - cur; // positive when scrolled up
            const near = c.scrollHeight - cur - c.clientHeight < 120;
            userNearBottomRef.current = near;

            // Show when user scrolls up by a small threshold (start of scroll up)
            // Use a very small threshold so small wheel/touch moves trigger the button.
            if (scrolledUpBy > 2 && !near) {
                setShowScrollDown(true);
            }

            // Hide when user scrolls back near bottom or scrolls down
            if (near || scrolledUpBy < -2) {
                setShowScrollDown(false);
            }

            prevScrollTop.current = cur;
        };

        c.addEventListener('scroll', onScroll, { passive: true });
        // Initialize visibility based on current position
        onScroll();
        return () => c.removeEventListener('scroll', onScroll);
    }, [open]);

    // When messages change, always scroll for user messages; only follow bot when near bottom
    useEffect(() => {
        const c = chatBodyRef.current;
        if (!c) return;

        const isNearBottom = c.scrollHeight - c.scrollTop - c.clientHeight < 120;

        if (lastMessageSender === 'user') {
            scrollToBottomIfNeeded(true);
            return;
        }

        if (lastMessageSender === 'bot' && (isNearBottom || userNearBottomRef.current)) {
            scrollToBottomIfNeeded(true);
        }
    }, [messages, lastMessageSender]);

    // Listen for custom open/close events across the application
    useEffect(() => {
        const handleCloseChat = () => setOpen(false);
        const handleOpenChat = () => {
            setOpen(true);
            setShowNotice(false);
        };
        window.addEventListener('close-chat-widget', handleCloseChat);
        window.addEventListener('open-chat-widget', handleOpenChat);
        return () => {
            window.removeEventListener('close-chat-widget', handleCloseChat);
            window.removeEventListener('open-chat-widget', handleOpenChat);
        };
    }, []);

    // When chat opens, close notice and ensure scroll to bottom
    useEffect(() => {
        if (open) {
            if (showNotice) setShowNotice(false);
            // Close 3D Minecraft guide so they don't overlap on the right side
            window.dispatchEvent(new CustomEvent('toggle-3d-minecraft-guide', { detail: { open: false } }));
            // force scroll to bottom when opening to show latest messages
            scrollToBottomIfNeeded(true);
            setShowScrollDown(false);
        } else {
            setShowScrollDown(false);
        }
    }, [open]);

    return (
        <>
            {/* WhatsApp Floating Action Button (Bottom Left - Previous Design) */}
            <a
                className="whatsapp-fab glow-btn"
                href="https://wa.me/201011297869"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('chatWhatsAppTitle')}
                title={t('chatWhatsAppTitle')}
            >
                <span className="whatsapp-fab-icon" aria-hidden>
                    <FaWhatsapp className="text-white" />
                </span>
            </a>

            <div className="chat-widget" aria-hidden={false} ref={widgetRef}>
            {/* Small notification bubble above the widget */}
            {showNotice && !open && (
                <div className="chat-notice" role="status" aria-live="polite">
                    <div className="chat-notice-inner">
                        <div className="chat-notice-title">{t('chatNoticeTitle')}</div>
                        <div className="chat-notice-body">{t('chatNoticeBody')}</div>
                    </div>
                    <button className="chat-notice-close" aria-label={t('closeChatTitle')} onClick={() => setShowNotice(false)}>✕</button>
                </div>
            )}
                <div ref={panelRef} className={`chat-panel ${open ? 'open' : ''}`} role="dialog" aria-label="Chat widget">
                    <div className="chat-header">
                        <div className="flex items-center gap-2">
                            <div className="chat-title">MORA</div>
                            <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                                <span>{t('chatAgentBadge')}</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => setMessages([messages[0]])}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors"
                                title={t('chatResetTitle')}
                                aria-label={t('chatResetTitle')}
                            >
                                <RotateCcw size={14} />
                            </button>
                            <button className="chat-close" aria-label={t('closeChatTitle')} onClick={() => setOpen(false)}>✕</button>
                        </div>
                    </div>

                    <div ref={chatBodyRef} className="chat-body">
                        {messages.map(m => (
                            <div key={m.id} className={`chat-msg ${m.from === 'bot' ? 'bot' : 'user'} ${m.audioUrl ? 'audio' : ''}`}>
                                {m.audioUrl ? (
                                    <VoiceMessagePlayer msg={m} />
                                ) : (
                                    <>
                                        <div className="chat-text">
                                            <FormattedMessageText text={m.text} />
                                        </div>
                                        {m.from === 'bot' && (
                                            <div className="chat-msg-actions flex items-center gap-1 mt-1 justify-end opacity-75 hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const clean = m.text.replace(/[*_#`]/g, '');
                                                        navigator.clipboard?.writeText(clean);
                                                        setCopiedId(m.id);
                                                        setTimeout(() => setCopiedId(null), 1500);
                                                    }}
                                                    className="p-1 rounded text-gray-400 hover:text-cyan-300 hover:bg-gray-800/60 transition-colors"
                                                    title={copiedId === m.id ? t('chatCopied') : t('chatCopyTitle')}
                                                    aria-label={t('chatCopyTitle')}
                                                >
                                                    {copiedId === m.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                                                </button>
                                                <SpeakerButton text={m.text} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-msg bot">
                                <div className="chat-text">
                                    <span className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick suggested prompt chips */}
                    <div className="chat-suggested-chips flex items-center gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar border-t border-gray-800/80 bg-[#080b18]">
                        {suggestedPrompts.map((sp, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => handleSuggestedPrompt(sp.query)}
                                disabled={isLoading}
                                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-gray-800/70 hover:bg-cyan-950/80 text-gray-300 hover:text-cyan-300 border border-gray-700/60 hover:border-cyan-500/50 transition-all flex-shrink-0 active:scale-95 cursor-pointer"
                            >
                                {sp.label}
                            </button>
                        ))}
                    </div>

                    <div className="chat-input">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
                        />
                        {recording ? (
                            /* WhatsApp-style recording UI */
                            <div className="recording-bar">
                                <button
                                    className="recording-cancel-btn"
                                    onClick={cancelRecording}
                                    aria-label="Cancel recording"
                                    title="Cancel recording"
                                >
                                    <FaTrash />
                                </button>
                                <span className="recording-indicator"></span>
                                <span className="recording-time">{formatTime(recordingDuration)}</span>
                                <div className="recording-waveform">
                                    {[...Array(30)].map((_, i) => (
                                        <span key={i} className="recording-wave-bar" style={{ animationDelay: `${i * 0.05}s` }} />
                                    ))}
                                </div>
                                <button
                                    className="recording-stop-btn"
                                    onClick={stopRecording}
                                    aria-label="Stop and send"
                                    title="Stop and send"
                                >
                                    <FaStop />
                                </button>
                            </div>
                        ) : pendingVoice ? (
                            /* Voice preview bar - after recording, before sending */
                            <div className="voice-preview-bar">
                                <button
                                    type="button"
                                    className="voice-preview-play"
                                    onClick={async () => {
                                        const audio = audioRefs.current['preview'];
                                        if (!audio) return;
                                        if (playingAudioId === 'preview') {
                                            audio.pause();
                                            setPlayingAudioId(null);
                                            return;
                                        }

                                        Object.values(audioRefs.current).forEach(a => a?.pause());
                                        const started = await playAudioByRef('preview', pendingVoice.audioUrl);
                                        if (started) {
                                            setPlayingAudioId('preview');
                                        } else {
                                            setPlayingAudioId(null);
                                        }
                                    }}
                                    aria-label={playingAudioId === 'preview' ? 'Pause preview' : 'Play preview'}
                                >
                                    {playingAudioId === 'preview' ? <FaPause /> : <FaPlay />}
                                </button>
                                <audio
                                    ref={el => audioRefs.current['preview'] = el}
                                    src={pendingVoice.audioUrl}
                                    onEnded={() => setPlayingAudioId(null)}
                                    preload="auto"
                                    style={{ display: 'none' }}
                                />
                                <span className="voice-preview-duration">{formatTime(pendingVoice.audioDuration)}</span>
                                <div className="voice-preview-waveform">
                                    {[...Array(20)].map((_, i) => (
                                        <span key={i} className="voice-preview-bar-item" />
                                    ))}
                                </div>
                                <button
                                    className="voice-preview-delete"
                                    onClick={() => deleteVoiceMessage(pendingVoice.id)}
                                    aria-label="Delete recording"
                                >
                                    <FaTrash />
                                </button>
                                <button
                                    className="voice-preview-send"
                                    onClick={sendVoiceMessage}
                                    aria-label="Send voice message"
                                    disabled={isLoading}
                                >
                                    <FaPaperPlane />
                                </button>
                            </div>
                        ) : (
                            /* Normal input UI */
                            <>
                                <div className="chat-input-wrapper">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        aria-label={t('chatAttachAria')}
                                        className="chat-attach-btn-inside"
                                        title={t('chatAttachAria')}
                                    >
                                        <FaPaperclip />
                                    </button>
                                    <input
                                        value={value}
                                        onChange={e => setValue(e.target.value)}
                                        placeholder={t('chatPlaceholder')}
                                        onKeyDown={e => { if (e.key === 'Enter') send(); }}
                                        className="chat-text-input"
                                    />
                                    <button
                                        className="chat-record-btn"
                                        aria-label={t('chatRecordStartAria')}
                                        title={t('chatRecordStartAria')}
                                        onClick={startRecording}
                                    >
                                        <FaMicrophone />
                                    </button>
                                </div>
                                <button onClick={send} aria-label={t('chatSendAria')} className="chat-send-btn"><FaPaperPlane /></button>
                            </>
                        )}
                    </div>

                    {/* Render the scroll-down button inside the chat panel */}
                    <DownArrowButton
                        visible={open && showScrollDown}
                        inline
                        onClick={() => {
                            scrollToBottomIfNeeded(true);
                            setShowScrollDown(false);
                        }}
                    />
                </div>

                {/* Unified "Need help?" Action Badge on the Right */}
                {!open ? (
                    <div className="need-help-card shadow-2xl transition-all duration-300">
                        {/* Header: Logo + "Need help?" + Tour badge */}
                        <div className="flex items-center justify-between mb-2.5">
                            <div className="flex items-center gap-2.5">
                                {/* Circular Logo Badge with green online pulse */}
                                <div className="relative">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 via-teal-500 to-blue-600 p-[1.5px] shadow-sm flex items-center justify-center">
                                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-cyan-300 font-bold text-xs">
                                            ⚙️
                                        </div>
                                    </div>
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900 animate-pulse" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                        {t('needHelpTitle')}
                                    </span>
                                    <span className="text-[10px] text-slate-500 dark:text-cyan-400/80 font-medium">
                                        {t('needHelpSubtitle')}
                                    </span>
                                </div>
                            </div>
                            {/* Guided Tour Trigger Button */}
                            <button
                                type="button"
                                onClick={() => window.dispatchEvent(new CustomEvent('start-portfolio-tour'))}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 font-semibold transition-colors"
                                title={t('tourGuide')}
                            >
                                {t('needHelpTourBtn')}
                            </button>
                        </div>

                        {/* Action Buttons Row: Ask anything + Chat Icon + 3D Minecraft Guide */}
                        <div className="flex items-center gap-2">
                            {/* 1. "Ask anything" Pill Button */}
                            <button
                                type="button"
                                onClick={() => setOpen(true)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full border border-teal-600/50 dark:border-cyan-400/60 bg-teal-50/60 dark:bg-cyan-950/40 hover:bg-teal-100/70 dark:hover:bg-cyan-900/50 text-teal-700 dark:text-cyan-300 font-semibold text-xs transition-all shadow-sm group/ask"
                                title={t('needHelpAskTitle')}
                            >
                                <FaPhoneAlt size={10} className="text-teal-600 dark:text-cyan-400 -rotate-12 group-hover/ask:rotate-0 transition-transform" />
                                <span>{t('needHelpAskAnything')}</span>
                            </button>

                            {/* 2. Chat Icon Button */}
                            <button
                                type="button"
                                ref={fabRef}
                                onClick={() => setOpen(true)}
                                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-cyan-300 flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
                                title={t('needHelpChatAria')}
                                aria-label={t('needHelpChatAria')}
                            >
                                <FaCommentDots size={15} />
                            </button>

                            {/* 3. 3D Minecraft Guide Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    window.dispatchEvent(new CustomEvent('toggle-3d-minecraft-guide', { detail: { open: true } }));
                                }}
                                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-cyan-300 flex items-center justify-center transition-transform hover:scale-110 shadow-sm text-sm"
                                title={t('needHelp3DGuideAria')}
                                aria-label={t('needHelp3DGuideAria')}
                            >
                                ⛏️
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        ref={fabRef}
                        className="chat-fab glow-btn"
                        onClick={() => setOpen(false)}
                        aria-label={t('closeChatTitle')}
                        title={t('closeChatTitle')}
                    >
                        <span className="chat-fab-icon text-white text-lg font-bold" aria-hidden>
                            ✕
                        </span>
                    </button>
                )}
            </div>
        </>
    );
}