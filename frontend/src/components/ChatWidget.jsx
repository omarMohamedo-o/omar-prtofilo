import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaRobot, FaWhatsapp, FaPaperclip, FaMicrophone, FaStop, FaPlay, FaPause, FaTrash, FaUser } from 'react-icons/fa';
import { sendTextMessage, sendImageMessage, uploadFile, transcribeAudio } from '../services/chatbotService';
import SpeakerButton from './ChatTTS';

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [showNotice, setShowNotice] = useState(true);
    const [value, setValue] = useState('');
    const [messages, setMessages] = useState([]);
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
    const widgetRef = useRef(null);
    const fabRef = useRef(null);
    const panelRef = useRef(null);

    const send = async () => {
        if (!value.trim()) return;

        const userMsg = { id: Date.now(), from: 'user', text: value.trim() };
        setMessages(prev => [...prev, userMsg]);
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
                // Regular text conversation
                response = await sendTextMessage(userQuery, false);
            }

            // Extract answer from response
            const botAnswer = response.Answer || response.answer || 'Sorry, I could not process your request.';

            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                from: 'bot',
                text: botAnswer
            }]);
        } catch (error) {
            console.error('Error communicating with chatbot:', error);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                from: 'bot',
                text: 'Sorry, I\'m having trouble connecting. Please try again later.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Speak text: prefer backend TTS endpoint, fallback to browser SpeechSynthesis
    const speakText = async (text) => {
        if (!text) return;
        try {
            const audioBlob = await speakTextService(text, 'gtts');
            if (audioBlob) {
                const audioUrl = URL.createObjectURL(audioBlob);
                const audio = new Audio(audioUrl);
                audio.play().catch(() => { });
                audio.onended = () => URL.revokeObjectURL(audioUrl);
                return;
            }
        } catch (err) {
            // fall through to browser TTS
            console.warn('Backend TTS failed, falling back to browser TTS', err);
        }

        try {
            const synth = window.speechSynthesis;
            if (synth) {
                synth.cancel();
                const utter = new SpeechSynthesisUtterance(text);
                utter.lang = navigator.language || 'en-US';
                synth.speak(utter);
            }
        } catch (e) {
            console.warn('Browser TTS unavailable', e);
        }
    };

    // Format seconds to mm:ss
    const formatTime = (seconds) => {
        if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Toggle audio playback for voice messages
    const toggleAudioPlayback = (msgId, audioUrl) => {
        const audio = audioRefs.current[msgId];
        if (!audio) return;

        if (playingAudioId === msgId) {
            audio.pause();
            setPlayingAudioId(null);
        } else {
            // Pause any currently playing audio
            Object.values(audioRefs.current).forEach(a => a?.pause());
            audio.currentTime = 0;
            audio.play();
            setPlayingAudioId(msgId);
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
                    style={{ display: 'none' }}
                />
                {/* Play/Pause button */}
                <button
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
                setPendingVoice(null);
                return;
            }

            const transcription = await transcribeAudio(file);
            const transcribedText = (transcription && transcription.text) ? transcription.text.trim() : '';

            // If transcription succeeded, send it as text to the chatbot
            if (transcribedText) {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    from: 'user',
                    text: `🎤 "${transcribedText}"`,
                    audioUrl: pv.audioUrl,
                    audioDuration: pv.audioDuration
                }]);

                const response = await sendTextMessage(transcribedText, false);
                const botAnswer = response?.Answer || response?.answer || 'Sorry, I could not process your request.';

                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    from: 'bot',
                    text: botAnswer
                }]);
            } else {
                // Transcription empty — show clear feedback and avoid sending empty content
                console.warn('Transcription returned empty text for file:', file);
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    from: 'user',
                    text: '🎤 Voice message',
                    audioUrl: pv.audioUrl,
                    audioDuration: pv.audioDuration
                }]);

                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    from: 'bot',
                    text: 'Sorry, I could not understand the audio. Please try again or type your message.'
                }]);
            }

            // clear pending preview
            setPendingVoice(null);
        } catch (err) {
            console.error('Error sending voice message', err);
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                from: 'bot',
                text: 'Failed to process voice message. Please try again.'
            }]);
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

            // Store the file for use with next message
            setUploadedFile(file);

            // Reset file input
            e.target.value = '';

            // If it's an image, show preview message
            if (file.type.startsWith('image/')) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    from: 'bot',
                    text: 'Image received! Ask me anything about this image.'
                }]);
            } else if (file.type === 'application/pdf') {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    from: 'bot',
                    text: 'PDF received! Ask me questions about the document.'
                }]);
            } else {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    from: 'bot',
                    text: 'File received!'
                }]);
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

    return (
        <>
            <a
                className="whatsapp-fab glow-btn"
                href="https://wa.me/201011297869"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact Omar on WhatsApp"
                title="Contact Omar on WhatsApp"
            >
                <span className="whatsapp-fab-icon" aria-hidden>
                    <FaWhatsapp className="text-white" />
                </span>
            </a>

            <div className="chat-widget" aria-hidden={!open} ref={widgetRef}>
                {/* Small notification bubble above the chat FAB */}
                {showNotice && (
                    <div className="chat-notice" role="status" aria-live="polite">
                        <div className="chat-notice-inner">
                            <div className="chat-notice-title">MORA – Your Guide to Omar</div>
                            <div className="chat-notice-body">Ask me anything about Omar, including his skills, projects, experience, and ways you can collaborate. <strong>Ask me now!</strong></div>
                        </div>
                        <button className="chat-notice-close" aria-label="Close" onClick={() => setShowNotice(false)}>✕</button>
                    </div>
                )}
                <div ref={panelRef} className={`chat-panel ${open ? 'open' : ''}`} role="dialog" aria-label="Chat widget">
                    <div className="chat-header">
                        <div className="chat-title">MORA</div>
                        <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
                    </div>

                    <div className="chat-body">
                        {messages.map(m => (
                            <div key={m.id} className={`chat-msg ${m.from === 'bot' ? 'bot' : 'user'}`}>
                                {m.audioUrl ? (
                                    <VoiceMessagePlayer msg={m} />
                                ) : (
                                    <>
                                        <div className="chat-text">{m.text}</div>
                                        {m.from === 'bot' && (
                                            <SpeakerButton text={m.text} />
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
                                    className="voice-preview-play"
                                    onClick={() => {
                                        const audio = audioRefs.current['preview'];
                                        if (!audio) return;
                                        if (playingAudioId === 'preview') {
                                            audio.pause();
                                            setPlayingAudioId(null);
                                        } else {
                                            Object.values(audioRefs.current).forEach(a => a?.pause());
                                            audio.currentTime = 0;
                                            audio.play();
                                            setPlayingAudioId('preview');
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
                                        aria-label="Attach file"
                                        className="chat-attach-btn-inside"
                                        title="Attach file"
                                    >
                                        <FaPaperclip />
                                    </button>
                                    <input
                                        value={value}
                                        onChange={e => setValue(e.target.value)}
                                        placeholder="Type your message..."
                                        onKeyDown={e => { if (e.key === 'Enter') send(); }}
                                        className="chat-text-input"
                                    />
                                    <button
                                        className="chat-record-btn"
                                        aria-label="Start recording"
                                        title="Start recording"
                                        onClick={startRecording}
                                    >
                                        <FaMicrophone />
                                    </button>
                                </div>
                                <button onClick={send} aria-label="Send" className="chat-send-btn"><FaPaperPlane /></button>
                            </>
                        )}
                    </div>
                </div>

                <button ref={fabRef} className="chat-fab glow-btn" onClick={() => setOpen(v => !v)} aria-label="Open chat">
                    <span className="chat-fab-icon" aria-hidden>
                        <FaRobot className="text-white" />
                    </span>
                </button>
            </div>
        </>
    );
}