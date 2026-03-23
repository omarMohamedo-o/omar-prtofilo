import React, { useState, useRef } from 'react';
import { FaMicrophone, FaStop, FaPlay, FaPause, FaTrash, FaPaperPlane } from 'react-icons/fa';

export function useVoiceRecorder() {
    const [recording, setRecording] = useState(false);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [pendingVoice, setPendingVoice] = useState(null);
    const [playingId, setPlayingId] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recordingTimerRef = useRef(null);
    const recordingCancelledRef = useRef(false);
    const recordingDurationRef = useRef(0);
    const streamRef = useRef(null);
    const audioRefs = useRef({});

    const formatTime = (seconds) => {
        if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startRecording = async () => {
        if (recording) {
            console.warn('VoiceRecorder: Already recording');
            return;
        }

        try {
            console.log('VoiceRecorder: Requesting microphone access...');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log('VoiceRecorder: Microphone access granted');
            streamRef.current = stream;

            // Detect supported MIME type
            let mimeType = 'audio/webm';
            if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                mimeType = 'audio/webm;codecs=opus';
            } else if (MediaRecorder.isTypeSupported('audio/webm')) {
                mimeType = 'audio/webm';
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                mimeType = 'audio/mp4';
            }

            console.log('VoiceRecorder: Using MIME type:', mimeType);

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
                    console.log('VoiceRecorder: Audio chunk received:', e.data.size, 'bytes');
                }
            };

            mr.onstop = () => {
                console.log('VoiceRecorder: Recording stopped');

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

                // If user cancelled, reset and return
                if (recordingCancelledRef.current) {
                    console.log('VoiceRecorder: Recording was cancelled');
                    recordingCancelledRef.current = false;
                    setRecording(false);
                    setRecordingDuration(0);
                    recordingDurationRef.current = 0;
                    audioChunksRef.current = [];
                    return;
                }

                const finalDuration = recordingDurationRef.current;
                const chunks = audioChunksRef.current;

                if (chunks.length === 0) {
                    console.error('VoiceRecorder: No audio chunks recorded');
                    setRecording(false);
                    setRecordingDuration(0);
                    recordingDurationRef.current = 0;
                    return;
                }

                const blob = new Blob(chunks, { type: mimeType });
                const ext = mimeType.includes('webm') ? 'webm' : mimeType.includes('mp4') ? 'm4a' : 'ogg';
                const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: blob.type });

                console.log('VoiceRecorder: Audio blob created:', blob.size, 'bytes, duration:', finalDuration, 's');

                // Create preview
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
            };

            // Start recording
            mr.start(250);
            setRecording(true);
            console.log('VoiceRecorder: Recording started');
        } catch (err) {
            console.error('VoiceRecorder: Microphone error:', err);
            setRecording(false);
            if (err.name === 'NotAllowedError') {
                alert('Microphone permission denied. Please allow access to microphone in your browser settings.');
            } else if (err.name === 'NotFoundError') {
                alert('No microphone found. Please connect a microphone.');
            } else {
                alert('Microphone error: ' + err.message);
            }
        }
    };

    const stopRecording = () => {
        const mr = mediaRecorderRef.current;
        if (!mr || mr.state === 'inactive') {
            console.warn('VoiceRecorder: No active recording to stop');
            return;
        }

        try {
            console.log('VoiceRecorder: Stopping recording...');
            mr.stop();
            mediaRecorderRef.current = null;
        } catch (err) {
            console.error('VoiceRecorder: Error stopping recorder:', err);
        }
    };

    const cancelRecording = () => {
        console.log('VoiceRecorder: Cancelling recording...');
        recordingCancelledRef.current = true;
        const mr = mediaRecorderRef.current;
        if (mr && mr.state !== 'inactive') {
            try {
                mr.stop();
            } catch (e) {
                console.error('VoiceRecorder: Error closing recorder:', e);
            }
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

    const deleteVoicePreview = () => {
        if (pendingVoice && pendingVoice.audioUrl) {
            try {
                URL.revokeObjectURL(pendingVoice.audioUrl);
            } catch (e) {
                console.error('VoiceRecorder: Error revoking object URL:', e);
            }
        }
        setPendingVoice(null);
    };

    const toggleAudioPlayback = (audioUrl) => {
        const audio = audioRefs.current['preview'];
        if (!audio) return;

        if (playingId === 'preview') {
            audio.pause();
            setPlayingId(null);
        } else {
            Object.values(audioRefs.current).forEach(a => a?.pause());
            audio.currentTime = 0;
            audio.play().catch(err => console.error('VoiceRecorder: Playback error:', err));
            setPlayingId('preview');
        }
    };

    return {
        // State
        recording,
        recordingDuration,
        pendingVoice,
        playingId,
        audioRefs,

        // Methods
        formatTime,
        startRecording,
        stopRecording,
        cancelRecording,
        deleteVoicePreview,
        toggleAudioPlayback,
        setPendingVoice,
        setPlayingId,
    };
}

export function VoiceRecorderUI({
    recording,
    recordingDuration,
    pendingVoice,
    playingId,
    audioRefs,
    formatTime,
    onStartRecord,
    onStopRecord,
    onCancelRecord,
    onDeletePreview,
    onPlaybackToggle,
    onSendVoice,
    isLoading,
}) {
    return (
        <>
            {recording ? (
                /* WhatsApp-style recording UI */
                <div className="recording-bar">
                    <button
                        className="recording-cancel-btn"
                        onClick={onCancelRecord}
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
                        onClick={onStopRecord}
                        aria-label="Stop recording"
                        title="Stop recording"
                    >
                        <FaStop />
                    </button>
                </div>
            ) : pendingVoice ? (
                /* Voice preview bar */
                <div className="voice-preview-bar">
                    <button
                        className="voice-preview-play"
                        onClick={() => onPlaybackToggle(pendingVoice.audioUrl)}
                        aria-label={playingId === 'preview' ? 'Pause preview' : 'Play preview'}
                    >
                        {playingId === 'preview' ? <FaPause /> : <FaPlay />}
                    </button>
                    <audio
                        ref={el => (audioRefs.current['preview'] = el)}
                        src={pendingVoice.audioUrl}
                        onEnded={() => setPlayingId(null)}
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
                        onClick={onDeletePreview}
                        aria-label="Delete recording"
                    >
                        <FaTrash />
                    </button>
                    <button
                        className="voice-preview-send"
                        onClick={onSendVoice}
                        aria-label="Send voice message"
                        disabled={isLoading}
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            ) : (
                /* Normal mic input button */
                <button
                    className="chat-record-btn"
                    aria-label="Start recording"
                    title="Start recording"
                    onClick={onStartRecord}
                    disabled={isLoading}
                >
                    <FaMicrophone />
                </button>
            )}
        </>
    );
}
