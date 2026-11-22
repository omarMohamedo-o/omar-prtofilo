import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useScrollVisibility from '../hooks/useScrollVisibility';
import { useLanguage } from '../context/LanguageContext';

export default function UpArrowButton({ className = '', themeColor = 'cyan' }) {
    const { isRTL, t } = useLanguage();
    const show = useScrollVisibility(100);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Color identity: Cyan (default) / Purple (alternate mode)
    const isPurple = themeColor === 'purple';
    const strokeColor = isPurple ? '#a855f7' : '#00e5ff';
    const trackColor = isPurple ? 'rgba(168, 85, 247, 0.18)' : 'rgba(0, 229, 255, 0.18)';
    const arrowColor = isPurple ? '#c084fc' : '#00f5ff';
    const glowClass = isPurple
        ? 'hover:shadow-[0_0_20px_rgba(168,85,247,0.55)]'
        : 'hover:shadow-[0_0_20px_rgba(0,229,255,0.55)]';
    const innerBorder = isPurple ? 'border-purple-500/40' : 'border-cyan-400/40';

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (scrollHeight > 0) {
                const progress = (scrollTop / scrollHeight) * 100;
                setScrollProgress(Math.min(100, Math.max(0, progress)));
            } else {
                setScrollProgress(0);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleClick = (e) => {
        e?.preventDefault();
        if (typeof window !== 'undefined' && window.scrollTo) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Position cleanly on the left (never overlapping chat widget on right)
    const arrowStyle = {
        left: isMobile ? 16 : 24,
        right: 'auto',
        bottom: isMobile ? 74 : 92,
        transition: 'opacity .25s, transform .2s'
    };

    // SVG Circular Ring Configuration
    const radius = 21;
    const circumference = 2 * Math.PI * radius; // ~131.95
    const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

    const content = show ? (
        <button
            key="up-arrow"
            onClick={handleClick}
            aria-label={t('scrollToTopAria') || 'Scroll to top'}
            title={t('scrollToTopAria') || 'Scroll to top'}
            role="button"
            className={`up-arrow-button group fixed z-[9999] flex items-center justify-center rounded-full shadow-lg ${glowClass} hover:scale-105 active:scale-95 transform-gpu transition-all duration-200 cursor-pointer ${className}`}
            style={arrowStyle}
        >
            {/* SVG Progress Ring */}
            <svg
                className="w-11 h-11 sm:w-12 sm:h-12 -rotate-90 transform-gpu"
                viewBox="0 0 48 48"
            >
                {/* Background Track Circle */}
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    stroke={trackColor}
                    strokeWidth="2.5"
                    fill="none"
                />
                {/* Dynamic Progress Stroke in Brand Color */}
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
                />
            </svg>

            {/* Inner Dark Circle with Brand Color Up Arrow */}
            <div className={`absolute inset-0 m-auto w-[32px] h-[32px] sm:w-[35px] sm:h-[35px] rounded-full bg-[#080d1a]/95 backdrop-blur-md border ${innerBorder} flex items-center justify-center shadow-inner group-hover:bg-[#0c1427] transition-colors`}>
                <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 transform group-hover:-translate-y-0.5 transition-transform duration-200"
                    style={{ color: arrowColor }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
            </div>
        </button>
    ) : null;

    if (typeof document !== 'undefined' && document.body) {
        return createPortal(content, document.body);
    }

    return content;
}
