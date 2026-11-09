import React from 'react';
import { createPortal } from 'react-dom';
// simple button — avoid framer-motion to keep frontend build self-contained
import { FaArrowUp } from 'react-icons/fa';
// lightweight runtime language detection to avoid depending on project context
import useScrollVisibility from '../hooks/useScrollVisibility';

export default function UpArrowButton({ className = '' }) {
    // Runtime-safe detection (SSR-safe)
    const lang = (typeof navigator !== 'undefined' && navigator.language) || (typeof document !== 'undefined' && document.documentElement?.lang) || 'en';
    const isRTL = typeof document !== 'undefined' ? (document.dir === 'rtl' || String(lang).toLowerCase().startsWith('ar')) : String(lang).toLowerCase().startsWith('ar');

    const show = useScrollVisibility(100); // shows after 100px

    const handleClick = (e) => {
        e?.preventDefault();
        if (typeof window !== 'undefined' && window.scrollTo) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Position UpArrowButton cleanly on the bottom-left corner with 0 overlap
    const arrowStyle = {
        left: isRTL ? 'auto' : 24,
        right: isRTL ? 24 : 'auto',
        bottom: 24,
        transition: 'opacity .25s, transform .2s'
    };

    const content = show ? (
        <button
            key="up-arrow"
            onClick={handleClick}
            aria-label={'Scroll to top'}
            title={'Scroll to top'}
            role="button"
            className={`up-arrow-button fixed z-[9999] p-2 sm:p-3 rounded-full bg-[#0B0B1A]/80 backdrop-blur-sm text-white shadow-lg hover:scale-105 active:scale-95 transform-gpu transition-all duration-200 ${className}`}
            style={arrowStyle}
        >
            <FaArrowUp size={16} />
        </button>
    ) : null;

    // Render into document.body to escape any parent stacking contexts (transforms, z-index, etc.)
    if (typeof document !== 'undefined' && document.body) {
        return createPortal(content, document.body);
    }

    return content;
}
