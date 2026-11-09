import React from 'react';
import { createPortal } from 'react-dom';
import { FaArrowDown } from 'react-icons/fa';
import { useLanguage } from '../context/LanguageContext';

export default function DownArrowButton({ visible = false, onClick = () => { }, className = '', inline = false }) {
    const { isRTL, t } = useLanguage();
    if (!visible) return null;

    if (inline) {
        return (
            <button
                key="down-arrow-inline"
                onClick={(e) => { e?.preventDefault(); onClick(e); }}
                aria-label={t('scrollToLatestAria')}
                title={t('scrollToLatestAria')}
                role="button"
                className={`chat-scroll-down ${className}`}
            >
                <FaArrowDown size={16} />
            </button>
        );
    }

    let arrowStyle = { right: isRTL ? 'auto' : 16, left: isRTL ? 16 : 'auto', bottom: 24, transition: 'opacity .25s, transform .2s' };
    if (typeof document !== 'undefined') {
        const fab = document.querySelector('.chat-fab, .whatsapp-fab');
        if (fab) {
            try {
                const fabRect = fab.getBoundingClientRect();
                const fabHeight = Math.round(fabRect.height) || 56;
                const gap = 12;
                const bottomOffset = 24 + fabHeight + gap;
                if (!isRTL) {
                    arrowStyle = { left: 24, right: 'auto', bottom: bottomOffset, transition: 'opacity .25s, transform .2s' };
                } else {
                    arrowStyle = { right: 24, left: 'auto', bottom: bottomOffset, transition: 'opacity .25s, transform .2s' };
                }
            } catch (e) {}
        }
    }

    const content = (
        <button
            key="down-arrow"
            onClick={(e) => { e?.preventDefault(); onClick(e); }}
            aria-label={t('scrollToLatestAria')}
            title={t('scrollToLatestAria')}
            role="button"
            className={`down-arrow-button fixed z-[9999] p-2 sm:p-3 rounded-full bg-[#0B0B1A]/80 backdrop-blur-sm text-white shadow-lg hover:scale-105 active:scale-95 transform-gpu transition-all duration-200 ${className}`}
            style={arrowStyle}
        >
            <FaArrowDown size={16} />
        </button>
    );

    if (typeof document !== 'undefined' && document.body) {
        return createPortal(content, document.body);
    }

    return content;
}
