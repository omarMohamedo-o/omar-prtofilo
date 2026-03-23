import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaTrash, FaPlay, FaPause, FaPaperPlane, FaUser } from 'react-icons/fa';

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// A simple WhatsApp-like voice chat UI (record, preview, send, display)
export default function VoiceChat({ simulateUpload = true }) {
    const [recording, setRecording] = useState(false);
    const [paused, setPaused] = useState(false);
    const [duration, setDuration] = useState(0);
    const durationRef = useRef(0);
    const timerRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const [preview, setPreview] = useState(null); // { url, blob, duration, ts }
    const [messages, setMessages] = useState([]);

    const audioPlayerRef = useRef(null);

    // Start recording (request mic permission if needed)
    const startRecording = async () => {
        if (recording) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const options = { mimeType: 'audio/webm' };
            const mr = new MediaRecorder(stream, options);
            mediaRecorderRef.current = mr;
            chunksRef.current = [];

            mr.addEventListener('dataavailable', (e) => {
                if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
            });

            mr.addEventListener('stop', () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                const ts = new Date();
                setPreview({ url, blob, duration: durationRef.current, ts });
            });

            mr.start();
            durationRef.current = 0;
            setDuration(0);
            setRecording(true);
            setPaused(false);

            timerRef.current = setInterval(() => {
                durationRef.current += 1;
                setDuration(durationRef.current);
            }, 1000);
        } catch (err) {
            console.error('Microphone error', err);
            alert('Microphone access denied or not available');
        }
    };

    const stopRecording = () => {
        if (!recording || !mediaRecorderRef.current) return;
        try {
            mediaRecorderRef.current.stop();
            // stop tracks
            mediaRecorderRef.current.stream?.getTracks().forEach((t) => t.stop());
        } catch (e) { }
        setRecording(false);
        setPaused(false);
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    };

    const pauseRecording = () => {
        if (!recording || !mediaRecorderRef.current) return;
        try {
            mediaRecorderRef.current.pause();
            setPaused(true);
            if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        } catch (e) { }
    };

    const resumeRecording = () => {
        if (!recording || !mediaRecorderRef.current) return;
        try {
            mediaRecorderRef.current.resume();
            setPaused(false);
            timerRef.current = setInterval(() => {
                durationRef.current += 1;
                setDuration(durationRef.current);
            }, 1000);
        } catch (e) { }
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (preview?.url) URL.revokeObjectURL(preview.url);
            messages.forEach(m => m.url && URL.revokeObjectURL(m.url));
        };
    }, []);

    // Play/pause preview audio
    const togglePreviewPlay = () => {
        const ap = audioPlayerRef.current;
        if (!ap) return;
        if (ap.paused) ap.play(); else ap.pause();
    };

    const deletePreview = () => {
        if (preview) {
            URL.revokeObjectURL(preview.url);
            setPreview(null);
            durationRef.current = 0;
            setDuration(0);
        }
    };

    // Simulated upload/send
    const sendPreview = async () => {
        if (!preview) return;
        // simulate upload delay
        if (simulateUpload) await new Promise(r => setTimeout(r, 600));
        const msg = {
            id: Date.now(),
            url: preview.url,
            duration: preview.duration,
            ts: preview.ts
        };
        setMessages(prev => [...prev, msg]);
        setPreview(null);
        durationRef.current = 0;
        setDuration(0);
    };

    // Chat bubble player controls
    const toggleMessagePlay = (msg, ev) => {
        ev?.stopPropagation();
        const audio = document.getElementById(`audio-${msg.id}`);
        if (!audio) return;
        if (audio.paused) audio.play(); else audio.pause();
    };

    return (
        <div className="voicechat-root">
            <div className="recorder-row">
                <div className="mic-area">
                    <button
                        className={`mic-btn ${recording ? 'recording' : ''}`}
                        onPointerDown={(e) => {
                            // Start on pointer down (supports hold-to-record)
                            e.preventDefault();
                            startRecording();
                        }}
                        onPointerUp={(e) => {
                            // Stop on pointer up (hold-to-record behaviour)
                            e.preventDefault();
                            // if user tapped quickly, also treat as toggle: stop if recording
                            if (recording) stopRecording();
                        }}
                        onClick={(e) => {
                            // For desktop, click toggles start/stop
                            e.preventDefault();
                            if (!recording) startRecording(); else stopRecording();
                        }}
                        aria-label="Record voice"
                        title="Record voice"
                    >
                        <FaMicrophone />
                    </button>
                    <div className="record-meta">
                        <div className="rec-timer">{formatTime(duration)}</div>
                        <div className={`wavebars ${recording ? 'anim' : ''}`} aria-hidden>
                            <span></span><span></span><span></span><span></span><span></span>
                        </div>
                    </div>
                </div>

                <div className="rec-actions">
                    {recording && (
                        <>
                            {!paused ? (
                                <button className="small-btn" onClick={pauseRecording} title="Pause">Pause</button>
                            ) : (
                                <button className="small-btn" onClick={resumeRecording} title="Resume">Resume</button>
                            )}
                            <button className="small-btn" onClick={stopRecording} title="Stop">Stop</button>
                        </>
                    )}
                </div>
            </div>

            {/* Preview bar */}
            {preview && (
                <div className="voice-preview">
                    <div className="preview-left">
                        <button className="icon-btn" onClick={togglePreviewPlay}><FaPlay /></button>
                        <audio ref={audioPlayerRef} id={`preview-audio`} src={preview.url} onEnded={() => { }} />
                        <div className="preview-duration">{formatTime(preview.duration)}</div>
                    </div>
                    <div className="preview-actions">
                        <button className="icon-btn danger" onClick={deletePreview}><FaTrash /></button>
                        <button className="icon-btn send" onClick={sendPreview}><FaPaperPlane /></button>
                    </div>
                </div>
            )}

            {/* Messages list */}
            <div className="voice-messages">
                {messages.map(msg => (
                    <div className="voice-bubble sent" key={msg.id} onClick={(e) => toggleMessagePlay(msg, e)}>
                        <div className="bubble-left">
                            <button className="icon-btn small" onClick={(e) => toggleMessagePlay(msg, e)}>
                                <FaPlay />
                            </button>
                        </div>
                        <div className="bubble-body">
                            <audio id={`audio-${msg.id}`} src={msg.url} controls style={{ display: 'none' }} />
                            <div className="bubble-duration">{formatTime(msg.duration)}</div>
                        </div>
                        <div className="bubble-right">
                            <div className="bubble-ts">{msg.ts.toLocaleTimeString()}</div>
                            <div className="avatar"><FaUser /></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
