import React, { useState } from 'react';
import { FaVolumeUp, FaSpinner } from 'react-icons/fa';
import { speakText as speakTextService } from '../services/chatbotService';

// Speak text using backend TTS then fallback to browser TTS
export async function speakText(text) {
    if (!text) {
        console.warn('ChatTTS: No text provided');
        return;
    }

    console.log('ChatTTS: Starting to speak text:', text.substring(0, 50) + '...');

    try {
        const audioBlob = await speakTextService(text, 'gtts');
        console.log('ChatTTS: Got audio blob from backend:', audioBlob);

        if (audioBlob && audioBlob.size > 0) {
            const audioUrl = URL.createObjectURL(audioBlob);
            console.log('ChatTTS: Created audio URL:', audioUrl);

            const audio = new Audio(audioUrl);
            audio.volume = 1.0;

            audio.addEventListener('play', () => {
                console.log('ChatTTS: Audio started playing');
            });

            audio.addEventListener('error', (e) => {
                console.error('ChatTTS: Audio playback error:', e);
            });

            audio.onended = () => {
                console.log('ChatTTS: Audio playback ended');
                URL.revokeObjectURL(audioUrl);
            };

            const playPromise = audio.play();
            if (playPromise) {
                playPromise.catch((err) => {
                    console.warn('ChatTTS: Play promise rejected, trying browser TTS fallback:', err);
                    useBrowserTTS(text);
                });
            }
            return;
        } else {
            console.warn('ChatTTS: Empty audio blob from backend');
        }
    } catch (err) {
        console.warn('ChatTTS: Backend TTS failed, falling back to browser TTS:', err);
    }

    // Browser TTS fallback
    useBrowserTTS(text);
}

function useBrowserTTS(text) {
    try {
        const synth = window.speechSynthesis;
        if (!synth) {
            console.error('ChatTTS: Speech Synthesis not available');
            return;
        }

        synth.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = navigator.language || 'en-US';
        utter.rate = 1.0;
        utter.pitch = 1.0;

        utter.addEventListener('start', () => {
            console.log('ChatTTS: Browser TTS started');
        });

        utter.addEventListener('error', (e) => {
            console.error('ChatTTS: Browser TTS error:', e);
        });

        utter.addEventListener('end', () => {
            console.log('ChatTTS: Browser TTS ended');
        });

        synth.speak(utter);
        console.log('ChatTTS: Browser TTS utterance queued');
    } catch (e) {
        console.error('ChatTTS: Browser TTS unavailable:', e);
    }
}

export default function SpeakerButton({ text, className = 'chat-tts-btn' }) {
    const [isPlaying, setIsPlaying] = useState(false);

    const handleClick = async () => {
        setIsPlaying(true);
        try {
            await speakText(text);
        } catch (err) {
            console.error('SpeakerButton: Error during playback:', err);
        } finally {
            // Reset after a timeout since we can't reliably detect end
            setTimeout(() => setIsPlaying(false), 5000);
        }
    };

    return (
        <button
            aria-label="Read message"
            title={isPlaying ? 'Playing...' : 'Read message'}
            className={className}
            onClick={handleClick}
            disabled={isPlaying}
        >
            {isPlaying ? <FaSpinner className="spinner" /> : <FaVolumeUp />}
        </button>
    );
}
