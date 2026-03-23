import { useState, useEffect } from 'react';

/**
 * Custom hook that returns true when the page is scrolled past a given threshold.
 * @param {number} threshold - The scroll position (in pixels) after which to return true.
 * @returns {boolean} - Whether the scroll position is past the threshold.
 */
export default function useScrollVisibility(threshold = 100) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // SSR guard
        if (typeof window === 'undefined') return;

        const handleScroll = () => {
            const scrollY = window.scrollY || window.pageYOffset || 0;
            setIsVisible(scrollY > threshold);
        };

        // Check initial scroll position
        handleScroll();

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [threshold]);

    return isVisible;
}
