import { motion } from "framer-motion";
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ChevronDown, Infinity, Brain, Menu, X, Sparkles } from 'lucide-react';
import { MODES, modeInfo } from '../data/data';
import { getOptimizedImagePath } from '../utils/imageOptimization';

export default function Header({
    scrollToSection = () => { },
    themeColor = 'cyan',
    currentMode = MODES.DEVOPS,
    onModeChange = () => { }
}) {
    const [showModeDropdown, setShowModeDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        onScroll();                                       // set correct state on mount
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Keep a CSS variable with the nav's current height so the hero can
    // offset itself correctly and avoid being covered by the fixed header.
    useLayoutEffect(() => {
        const setNavHeightVar = () => {
            const el = navRef.current;
            if (!el) return;
            const h = el.offsetHeight;
            document.documentElement.style.setProperty('--header-height', `${h}px`);
        };

        // Keep updates responsive but avoid running too often during scroll.
        let ticking = false;
        const rafUpdate = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                setNavHeightVar();
                ticking = false;
            });
        };

        // initial measurement
        setNavHeightVar();

        // update on resize and while scrolling
        window.addEventListener('resize', setNavHeightVar);
        window.addEventListener('scroll', rafUpdate, { passive: true });

        // also update when the nav finishes a CSS transition (height may change)
        const el = navRef.current;
        if (el && el.addEventListener) {
            el.addEventListener('transitionend', rafUpdate);
        }

        return () => {
            window.removeEventListener('resize', setNavHeightVar);
            window.removeEventListener('scroll', rafUpdate);
            if (el && el.removeEventListener) el.removeEventListener('transitionend', rafUpdate);
        };
    }, [scrolled, mobileMenuOpen]);

    const handleNavClick = (section) => {
        setMobileMenuOpen(false);
        scrollToSection(section);
    };

    const accentColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
    const hoverAccent = themeColor === 'purple' ? 'hover:text-purple-400' : 'hover:text-cyan-400';
    const borderAccent = themeColor === 'purple' ? 'border-purple-400' : 'border-cyan-400';
    const bgAccent = themeColor === 'purple' ? 'bg-purple-500' : 'bg-cyan-500';

    const navItems = ['About', 'Experience', 'Internships', 'Skills', 'Projects', 'Education', 'Certifications', 'FAQ', 'Contact'];

    const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : false);

    // track viewport size to adjust header heights for desktop vs mobile
    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <motion.nav
                ref={navRef}
                // Desktop expanded header blends with hero (one unit). Shrinks on scroll.
                initial={{ height: isDesktop ? 140 : 80, backgroundColor: "transparent" }}
                animate={{
                    height: scrolled ? (isDesktop ? 72 : 60) : (isDesktop ? 140 : 80),
                    backgroundColor: scrolled ? "rgba(6,8,15,0.95)" : "transparent",
                    borderColor: scrolled ? "rgba(31,41,55,0.5)" : "transparent"
                }}
                transition={{ duration: 0.34, ease: "easeOut" }}
                className={`fixed top-0 w-full z-50 border-b text-surface transition-all duration-300 ${scrolled ? "scrolled shadow-lg" : "border-transparent"}`}>
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex items-center">
                        <img
                            src={getOptimizedImagePath(currentMode === MODES.DEVOPS ? "/images/me/OmarsLogo-dev.svg" : currentMode === MODES.MLNLP ? "/images/me/OmarsLogo-ml.svg" : "/images/me/Omar'sLogo.svg")}
                            alt={currentMode === MODES.DEVOPS ? "Omar - DevOps Logo" : currentMode === MODES.MLNLP ? "Omar - ML Logo" : "Omar's Logo"}
                            className="h-8 md:h-10 cursor-pointer nav-logo object-contain"
                            onClick={() => handleNavClick('home')}
                        />
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex gap-6">
                        {navItems.map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase())}
                                className={`text-surface/90 ${hoverAccent} transition-all duration-300 text-sm font-medium glow-btn`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* Desktop Right: View as & Discovery Button */}
                    <div className="hidden lg:flex items-center gap-4">
                        {/* View as Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowModeDropdown(!showModeDropdown)}
                                onBlur={() => setTimeout(() => setShowModeDropdown(false), 150)}
                                className={`flex items-center gap-2 px-3 py-2 border ${borderAccent} rounded-lg text-sm font-medium ${accentColor} glow-btn transition-all duration-300`}
                                aria-label="Switch portfolio view mode"
                                aria-haspopup="listbox"
                                aria-expanded={showModeDropdown}
                            >
                                View as
                                <ChevronDown size={14} className={`text-gray-600 transition-transform duration-200 ${showModeDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {showModeDropdown && (
                                <div className="absolute top-full right-0 mt-2 bg-gray-900/95 backdrop-blur-md rounded-xl p-2 border border-gray-700 shadow-xl min-w-[160px]" role="listbox">
                                    {Object.entries(modeInfo).map(([mode, info]) => (
                                        <button
                                            key={mode}
                                            role="option"
                                            aria-selected={currentMode === mode}
                                            onClick={() => { onModeChange(mode); setShowModeDropdown(false); }}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { onModeChange(mode); setShowModeDropdown(false); } }}
                                            className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 ${currentMode === mode
                                                ? mode === MODES.DEVOPS
                                                    ? 'bg-cyan-500 text-gray-900 shadow-lg shadow-cyan-500/30 focus:ring-cyan-400'
                                                    : 'bg-purple-500 text-white shadow-lg shadow-purple-500/30 focus:ring-purple-400'
                                                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 focus:ring-gray-500'
                                                }`}
                                        >
                                            {mode === MODES.DEVOPS ? <Infinity size={16} /> : <Brain size={16} />}
                                            <span>{info.label}</span>
                                        </button>
                                    ))}
                                    <div className={`mt-2 text-center text-xs px-3 py-1 rounded-full ${currentMode === MODES.DEVOPS
                                        ? 'bg-cyan-500/20 text-cyan-400'
                                        : 'bg-purple-500/20 text-purple-400'
                                        }`}>
                                        {modeInfo[currentMode]?.description}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Interactive Tour Guide button */}
                        <button
                            type="button"
                            onClick={() => window.startPortfolioTour && window.startPortfolioTour()}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 ${accentColor} border border-cyan-500/30 transition-all hover:scale-105 active:scale-95`}
                            title="Start Guided Interactive Tour"
                        >
                            <Sparkles size={14} className={accentColor} />
                            <span>Tour Guide</span>
                        </button>

                        {/* 3D Minecraft Guide button */}
                        <button
                            type="button"
                            onClick={() => {
                                window.dispatchEvent(new CustomEvent('toggle-3d-minecraft-guide'));
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all hover:scale-105 active:scale-95 font-mono"
                            title="Open 3D Minecraft Guide & LLM Companion"
                        >
                            <span>⛏️</span>
                            <span>3D Guide</span>
                        </button>

                        {/* Book a Discovery Call */}
                        <button
                            onClick={() => scrollToSection('discovery')}
                            className={`px-4 py-2 border ${borderAccent} rounded-lg text-sm font-medium ${accentColor} glow-btn`}
                        >
                            Book a Discovery Call
                        </button>
                    </div>

                    {/* Mobile: Hamburger Menu Button */}
                    <button
                        className="lg:hidden p-2 text-surface"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Slide-in - responsive width */}
            <div className={`fixed top-0 right-0 h-full w-[80vw] max-w-[320px] xs:max-w-[300px] bg-gray-900/98 backdrop-blur-lg z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full overflow-y-auto">
                    {/* Close button */}
                    <div className="flex justify-end p-3 xs:p-4">
                        <button onClick={() => setMobileMenuOpen(false)} className="text-surface p-2 touch-manipulation">
                            <X size={24} className="xs:w-7 xs:h-7" />
                        </button>
                    </div>

                    {/* Navigation Links - touch-friendly spacing */}
                    <div className="flex flex-col px-4 xs:px-6 py-2 gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item}
                                onClick={() => handleNavClick(item.toLowerCase())}
                                className={`text-left text-surface/90 ${hoverAccent} transition-all duration-300 text-base xs:text-lg font-medium py-3 xs:py-3.5 border-b border-gray-700/50 touch-manipulation active:bg-gray-800/50`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* Mode Switcher */}
                    <div className="px-4 xs:px-6 py-4">
                        <p className="text-gray-500 text-xs xs:text-sm mb-2 xs:mb-3">View as:</p>
                        <div className="flex flex-col gap-2">
                            {Object.entries(modeInfo).map(([mode, info]) => (
                                <button
                                    key={mode}
                                    onClick={() => { onModeChange(mode); setMobileMenuOpen(false); }}
                                    className={`w-full flex items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2.5 xs:py-3 rounded-lg text-sm font-medium transition-all duration-300 touch-manipulation ${currentMode === mode
                                        ? mode === MODES.DEVOPS
                                            ? 'bg-cyan-500 text-gray-900'
                                            : 'bg-purple-500 text-white'
                                        : 'bg-gray-800/50 text-gray-300 active:bg-gray-700/50'
                                        }`}
                                >
                                    {mode === MODES.DEVOPS ? <Infinity size={16} className="xs:w-[18px] xs:h-[18px]" /> : <Brain size={16} className="xs:w-[18px] xs:h-[18px]" />}
                                    <span>{info.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tour Guide & Book Discovery Call */}
                    <div className="px-4 xs:px-6 py-4 mt-auto mb-6 xs:mb-8 pb-safe flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                if (window.startPortfolioTour) window.startPortfolioTour();
                            }}
                            className={`w-full py-2.5 rounded-lg border border-cyan-500/40 text-cyan-300 bg-cyan-500/10 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95`}
                        >
                            <Sparkles size={16} />
                            <span>Start Guided Tour</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                window.dispatchEvent(new CustomEvent('toggle-3d-minecraft-guide'));
                            }}
                            className={`w-full py-2.5 rounded-lg border border-emerald-500/40 text-emerald-300 bg-emerald-500/10 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 font-mono`}
                        >
                            <span>⛏️</span>
                            <span>3D Minecraft Guide</span>
                        </button>
                        <button
                            onClick={() => handleNavClick('discovery')}
                            className={`w-full py-2.5 xs:py-3 ${bgAccent} text-gray-900 rounded-lg font-semibold text-sm xs:text-base text-center touch-manipulation active:opacity-90`}
                        >
                            Book a Discovery Call
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
