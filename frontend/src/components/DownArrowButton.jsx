import React from 'react';
import { createPortal } from 'react-dom';
import { FaArrowDown } from 'react-icons/fa';

export default function DownArrowButton({ visible = false, onClick = () => { }, className = '', inline = false }) {
    if (!visible) return null;

    // Inline mode: render a simple button to be placed inside the chat panel
    if (inline) {
        return (
            <button
                key="down-arrow-inline"
                onClick={(e) => { e?.preventDefault(); onClick(e); }}
                aria-label={'Scroll to latest message'}
                title={'Scroll to latest message'}
                role="button"
                className={`chat-scroll-down ${className}`}
            >
                <FaArrowDown size={16} />
            </button>
        );
    }

    // Default portal-mounted floating button (keeps previous behavior)
    // runtime-safe detection for RTL layouts
    const lang = (typeof navigator !== 'undefined' && navigator.language) || (typeof document !== 'undefined' && document.documentElement?.lang) || 'en';
    const isRTL = typeof document !== 'undefined' ? (document.dir === 'rtl' || String(lang).toLowerCase().startsWith('ar')) : String(lang).toLowerCase().startsWith('ar');

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
            } catch (e) {
                // ignore and use default
            }
        }
    }

    const content = (
        <button
            key="down-arrow"
            onClick={(e) => { e?.preventDefault(); onClick(e); }}
            aria-label={'Scroll to latest message'}
            title={'Scroll to latest message'}
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
