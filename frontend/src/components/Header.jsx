import { motion } from "framer-motion";
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ChevronDown, Infinity, Brain, Menu, X, Globe, Check } from 'lucide-react';
import { MODES, modeInfo } from '../data/data';
import { getOptimizedImagePath } from '../utils/imageOptimization';
import { useLanguage } from '../context/LanguageContext';

export default function Header({
    scrollToSection = () => { },
    themeColor = 'cyan',
    currentMode = MODES.DEVOPS,
    onModeChange = () => { }
}) {
    const [showModeDropdown, setShowModeDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [hoveredSection, setHoveredSection] = useState(null);
    const navRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        onScroll(); // set correct state on mount
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Scroll spy to dynamically track active section and colorize the nav buttons
    useEffect(() => {
        const sectionIds = ['about', 'experience', 'internships', 'skills', 'projects', 'education', 'certifications', 'contact'];
        const handleScrollSpy = () => {
            const scrollPos = window.scrollY + 220;
            for (let i = sectionIds.length - 1; i >= 0; i--) {
                const el = document.getElementById(sectionIds[i]);
                if (el && el.offsetTop <= scrollPos) {
                    setActiveSection(sectionIds[i]);
                    return;
                }
            }
            if (window.scrollY < 300) {
                setActiveSection('');
            }
        };

        window.addEventListener('scroll', handleScrollSpy, { passive: true });
        handleScrollSpy();
        return () => window.removeEventListener('scroll', handleScrollSpy);
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

    const { language, setLanguage, toggleLanguage, t, isRTL } = useLanguage();
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const langDropdownRef = useRef(null);

    // Close language dropdown on outside click or Escape key
    useEffect(() => {
        if (!langDropdownOpen) return;
        const handleClickOutside = (event) => {
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
                setLangDropdownOpen(false);
            }
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setLangDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [langDropdownOpen]);

    const accentColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
    const hoverAccent = themeColor === 'purple' ? 'hover:text-purple-400' : 'hover:text-cyan-400';
    const borderAccent = themeColor === 'purple' ? 'border-purple-400' : 'border-cyan-400';
    const bgAccent = themeColor === 'purple' ? 'bg-purple-500' : 'bg-cyan-500';

    const navItems = [
        { id: 'about', label: t('navAbout') },
        { id: 'experience', label: t('navExperience') },
        { id: 'internships', label: t('navInternships') },
        { id: 'skills', label: t('navSkills') },
        { id: 'projects', label: t('navProjects') },
        { id: 'education', label: t('navEducation') },
        { id: 'certifications', label: t('navCertifications') },
        { id: 'contact', label: t('navContact') }
    ];

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
                    <div className="flex items-center flex-shrink-0 nav-logo-wrapper">
                        <img
                            src={getOptimizedImagePath(currentMode === MODES.DEVOPS ? "/images/me/OmarsLogo-dev.svg" : currentMode === MODES.MLNLP ? "/images/me/OmarsLogo-ml.svg" : "/images/me/OmarsLogo.svg")}
                            alt={currentMode === MODES.DEVOPS ? "Omar - DevOps Logo" : currentMode === MODES.MLNLP ? "Omar - ML Logo" : "Omar's Logo"}
                            className="cursor-pointer nav-logo object-contain"
                            onClick={() => handleNavClick('home')}
                        />
                    </div>

                    {/* Desktop Navigation: Animated & Colorable Buttons */}
                    <div className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 2xl:gap-3 ps-4 xl:ps-6">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.id;
                            const isHovered = hoveredSection === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveSection(item.id);
                                        scrollToSection(item.id);
                                    }}
                                    onMouseEnter={() => setHoveredSection(item.id)}
                                    onMouseLeave={() => setHoveredSection(null)}
                                    className={`relative px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                                        isActive
                                            ? `${accentColor} font-semibold`
                                            : 'text-slate-300 hover:text-white hover:scale-105'
                                    }`}
                                >
                                    {/* Active Glowing Animated Pill */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeNavPill"
                                            className={`absolute inset-0 rounded-lg border ${borderAccent} ${
                                                themeColor === 'purple'
                                                    ? 'bg-purple-500/15 shadow-[0_0_12px_rgba(168,85,247,0.35)]'
                                                    : 'bg-cyan-500/15 shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                                            }`}
                                            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                                        />
                                    )}

                                    {/* Hover Pill when not active */}
                                    {!isActive && isHovered && (
                                        <motion.div
                                            layoutId="hoverNavPill"
                                            className="absolute inset-0 rounded-lg bg-white/5 border border-white/10"
                                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                                        />
                                    )}

                                    <span className="relative z-10 flex items-center">
                                        {item.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Desktop Right: Discovery and Language Dropdown (Far Right) */}
                    <div className="hidden lg:flex items-center gap-3">
                        {/* Book a Discovery Call */}
                        <button
                            onClick={() => scrollToSection('discovery')}
                            className={`px-4 py-2 border ${borderAccent} rounded-lg text-sm font-medium ${accentColor} glow-btn`}
                        >
                            {t('bookDiscoveryCall')}
                        </button>

                        {/* Language Dropdown Menu (Far Right) */}
                        <div className="relative" ref={langDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setLangDropdownOpen((prev) => !prev)}
                                className={`flex items-center gap-2 px-3 py-2 border ${borderAccent} rounded-lg text-sm font-semibold ${accentColor} glow-btn transition-all duration-300 hover:scale-105`}
                                title={t('languageSelect')}
                                aria-label={t('languageSelect')}
                                aria-expanded={langDropdownOpen}
                                aria-haspopup="listbox"
                            >
                                <Globe size={15} />
                                <span>{language === 'ar' ? 'العربية' : 'English'}</span>
                                <ChevronDown size={14} className={`transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {langDropdownOpen && (
                                <div
                                    className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-36 bg-slate-900/95 backdrop-blur-xl border ${borderAccent} rounded-xl shadow-2xl py-1.5 z-50 overflow-hidden`}
                                    role="listbox"
                                    aria-label={t('languageSelect')}
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLanguage('en');
                                            setLangDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3.5 py-2 text-sm transition-colors duration-150 ${
                                            language === 'en'
                                                ? `${accentColor} font-semibold bg-white/5`
                                                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                                        }`}
                                        role="option"
                                        aria-selected={language === 'en'}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">EN</span>
                                            <span>{t('langEnglish')}</span>
                                        </span>
                                        {language === 'en' && <Check size={14} className={accentColor} />}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLanguage('ar');
                                            setLangDropdownOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3.5 py-2 text-sm transition-colors duration-150 ${
                                            language === 'ar'
                                                ? `${accentColor} font-semibold bg-white/5`
                                                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                                        }`}
                                        role="option"
                                        aria-selected={language === 'ar'}
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono px-1 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60">AR</span>
                                            <span>{t('langArabic')}</span>
                                        </span>
                                        {language === 'ar' && <Check size={14} className={accentColor} />}
                                    </button>
                                </div>
                            )}
                        </div>
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

                    {/* Language Switcher in Mobile Drawer */}
                    <div className="px-4 xs:px-6 py-3 border-b border-gray-800/80">
                        <p className="text-gray-500 text-xs xs:text-sm mb-2">{t('languageSelect')}:</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setLanguage('en');
                                    setMobileMenuOpen(false);
                                }}
                                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border text-xs xs:text-sm font-semibold transition-all duration-200 ${
                                    language === 'en'
                                        ? `${borderAccent} ${accentColor} bg-white/5`
                                        : 'border-gray-800 text-gray-400 hover:text-white'
                                }`}
                            >
                                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700/60">EN</span>
                                <span>{t('langEnglish')}</span>
                                {language === 'en' && <Check size={14} className={accentColor} />}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setLanguage('ar');
                                    setMobileMenuOpen(false);
                                }}
                                className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg border text-xs xs:text-sm font-semibold transition-all duration-200 ${
                                    language === 'ar'
                                        ? `${borderAccent} ${accentColor} bg-white/5`
                                        : 'border-gray-800 text-gray-400 hover:text-white'
                                }`}
                            >
                                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700/60">AR</span>
                                <span>{t('langArabic')}</span>
                                {language === 'ar' && <Check size={14} className={accentColor} />}
                            </button>
                        </div>
                    </div>

                    {/* Navigation Links - touch-friendly spacing */}
                    <div className="flex flex-col px-4 xs:px-6 py-2 gap-1.5">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavClick(item.id)}
                                    className={`${isRTL ? 'text-right' : 'text-left'} transition-all duration-200 text-sm xs:text-base font-medium py-2.5 px-3.5 rounded-xl touch-manipulation flex items-center justify-between ${
                                        isActive
                                            ? `${accentColor} ${borderAccent} border bg-white/5 font-semibold shadow-sm`
                                            : 'text-surface/90 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <span>{item.label}</span>
                                    {isActive && <div className={`w-2 h-2 rounded-full ${bgAccent} shadow-[0_0_8px_currentColor]`} />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Mode Switcher */}
                    <div className="px-4 xs:px-6 py-4">
                        <p className="text-gray-500 text-xs xs:text-sm mb-2 xs:mb-3">{t('viewAs')}:</p>
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
                                    <span>{isRTL ? (info.labelAr || info.label) : info.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Book Discovery Call */}
                    <div className="px-4 xs:px-6 py-4 mt-auto mb-6 xs:mb-8 pb-safe flex flex-col gap-2">
                        <button
                            onClick={() => handleNavClick('discovery')}
                            className={`w-full py-2.5 xs:py-3 ${bgAccent} text-gray-900 rounded-lg font-semibold text-sm xs:text-base text-center touch-manipulation active:opacity-90`}
                        >
                            {t('bookDiscoveryCall')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
