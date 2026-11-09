import React from 'react';
import { createPortal } from 'react-dom';
import { FaArrowUp } from 'react-icons/fa';
import useScrollVisibility from '../hooks/useScrollVisibility';
import { useLanguage } from '../context/LanguageContext';

export default function UpArrowButton({ className = '' }) {
    const { isRTL, t } = useLanguage();
    const show = useScrollVisibility(100);

    const handleClick = (e) => {
        e?.preventDefault();
        if (typeof window !== 'undefined' && window.scrollTo) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Position UpArrowButton cleanly above the WhatsApp FAB on the left side with 0 overlap
    const arrowStyle = {
        left: 24,
        right: 'auto',
        bottom: 92, // 24px (FAB bottom) + 56px (FAB height) + 12px (clean gap) = 92px
        transition: 'opacity .25s, transform .2s'
    };

    const content = show ? (
        <button
            key="up-arrow"
            onClick={handleClick}
            aria-label={t('scrollToTopAria')}
            title={t('scrollToTopAria')}
            role="button"
            className={`up-arrow-button fixed z-[9999] p-2 sm:p-3 rounded-full bg-[#0B0B1A]/80 backdrop-blur-sm text-white shadow-lg hover:scale-105 active:scale-95 transform-gpu transition-all duration-200 ${className}`}
            style={arrowStyle}
        >
            <FaArrowUp size={16} />
        </button>
    ) : null;

    if (typeof document !== 'undefined' && document.body) {
        return createPortal(content, document.body);
    }

    return content;
}
