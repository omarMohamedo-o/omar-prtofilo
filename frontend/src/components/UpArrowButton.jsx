import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useScrollVisibility from '../hooks/useScrollVisibility';
import { useLanguage } from '../context/LanguageContext';

export default function UpArrowButton({ className = '' }) {
    const { isRTL, t } = useLanguage();
    const show = useScrollVisibility(100);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

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

    // Position cleanly above WhatsApp FAB with no overlap
    const arrowStyle = {
        left: isRTL ? 'auto' : (isMobile ? 16 : 24),
        right: isRTL ? (isMobile ? 16 : 24) : 'auto',
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
            className={`up-arrow-button group fixed z-[9999] flex items-center justify-center rounded-full shadow-lg hover:shadow-[0_0_18px_rgba(255,87,34,0.35)] hover:scale-105 active:scale-95 transform-gpu transition-all duration-200 cursor-pointer ${className}`}
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
                    stroke="#2E2E38"
                    strokeWidth="2.5"
                    fill="none"
                />
                {/* Dynamic Progress Stroke */}
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    stroke="#FF5722"
                    strokeWidth="2.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                    style={{ transition: 'stroke-dashoffset 0.15s ease-out' }}
                />
            </svg>

            {/* Inner Dark Circle with Orange Up Arrow */}
            <div className="absolute inset-0 m-auto w-[32px] h-[32px] sm:w-[35px] sm:h-[35px] rounded-full bg-[#151520] border border-[#2B2B38] flex items-center justify-center shadow-inner group-hover:bg-[#1A1A28] transition-colors">
                <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF5722] transform group-hover:-translate-y-0.5 transition-transform duration-200"
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
