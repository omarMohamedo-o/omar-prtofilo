import { useState, useEffect } from 'react';

/**
 * Custom hook that detects if the viewport is mobile-sized.
 * Uses a media query to track screen width changes.
 *
 * @param {number} breakpoint - The max-width breakpoint for mobile (default: 768px)
 * @returns {boolean} - Whether the viewport is mobile-sized
 */
export default function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // SSR guard
        if (typeof window === 'undefined') return;

        // Create media query
        const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

        // Set initial value
        setIsMobile(mediaQuery.matches);

        // Handler for changes
        const handleChange = (e) => {
            setIsMobile(e.matches);
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
            // Legacy browsers
            mediaQuery.addListener(handleChange);
            return () => mediaQuery.removeListener(handleChange);
        }
    }, [breakpoint]);

    return isMobile;
}
