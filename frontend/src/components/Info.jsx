import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Phone, MapPin, FileText, Infinity, Brain, ChevronDown } from 'lucide-react';
import { MODES, modeInfo } from '../data/data';
import { getOptimizedImagePath } from '../utils/imageOptimization';
import ButtonCard from './ButtonCard';
import { containerVariant, itemVariant } from '../utils/animationVariants';
import { useLanguage } from '../context/LanguageContext';

export default function Info({ isVisible = () => false, personalInfo = {}, themeColor = 'cyan', currentMode = MODES.DEVOPS, onModeChange = () => { }, scrollToSection = () => { } }) {
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const { t, isRTL } = useLanguage();

  const accentColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
  const bgAccent = themeColor === 'purple' ? 'bg-purple-500' : 'bg-cyan-500';
  const bgAccentHover = themeColor === 'purple' ? 'hover:bg-purple-600' : 'hover:bg-cyan-600';
  const hoverText = themeColor === 'purple' ? 'hover:text-neonPurple' : 'hover:text-cyanGlow';
  const bgBlob1 = themeColor === 'purple' ? 'bg-purple-500/10' : 'bg-blue-500/10';
  const bgBlob2 = themeColor === 'purple' ? 'bg-pink-500/10' : 'bg-cyan-500/10';
  const gradientClasses = themeColor === 'purple' ? 'from-purple-400 via-pink-400 to-purple-500' : 'from-blue-400 via-cyan-400 to-blue-500';

  return (
    <section id="home" className="min-h-svh flex flex-col lg:flex-row items-center justify-center relative px-4 sm:px-6 md:px-8 pt-[var(--header-height,100px)] lg:pt-0 pb-8 sm:pb-12 lg:pb-16 overflow-hidden" style={{ scrollMarginTop: '6rem' }}>

      {/* Floating Mode Switcher - Desktop Only */}
      <div className={`hidden lg:block absolute top-28 ${isRTL ? 'left-8' : 'right-8'} z-40 mode-switcher-float`}>
        <div className="relative">
          <button
            onClick={() => setShowModeDropdown(!showModeDropdown)}
            onBlur={() => setTimeout(() => setShowModeDropdown(false), 200)}
            className={`mode-switcher-btn flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${showModeDropdown ? 'mode-switcher-btn-open' : ''}`}
            aria-label="Switch portfolio view mode"
            aria-haspopup="listbox"
            aria-expanded={showModeDropdown}
          >
            {currentMode === MODES.DEVOPS ? <Infinity size={18} /> : <Brain size={18} />}
            <span>{t('viewAs')}</span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${showModeDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          <div className={`absolute top-full ${isRTL ? 'left-0' : 'right-0'} mt-3 mode-switcher-dropdown rounded-xl p-2 min-w-[180px] transition-all duration-300 ${showModeDropdown ? 'mode-switcher-dropdown-open' : 'mode-switcher-dropdown-closed'}`} role="listbox">
            {Object.entries(modeInfo).map(([mode, info]) => (
              <button
                key={mode}
                role="option"
                aria-selected={currentMode === mode}
                onClick={() => { onModeChange(mode); setShowModeDropdown(false); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onModeChange(mode); setShowModeDropdown(false); } }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${currentMode === mode
                  ? mode === MODES.DEVOPS
                    ? 'bg-cyan-500 text-gray-900 shadow-lg shadow-cyan-500/40 focus-visible:ring-cyan-400'
                    : 'bg-purple-500 text-white shadow-lg shadow-purple-500/40 focus-visible:ring-purple-400'
                  : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/70 hover:text-white focus-visible:ring-gray-500'
                  }`}
              >
                {mode === MODES.DEVOPS ? <Infinity size={16} /> : <Brain size={16} />}
                <span>{isRTL ? (info.labelAr || info.label) : info.label}</span>
              </button>
            ))}
            <div className={`mt-2 text-center text-xs px-3 py-1.5 rounded-full ${currentMode === MODES.DEVOPS
              ? 'bg-cyan-500/20 text-cyan-400'
              : 'bg-purple-500/20 text-purple-400'
              }`}>
              {isRTL ? (modeInfo[currentMode]?.descriptionAr || modeInfo[currentMode]?.description) : modeInfo[currentMode]?.description}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute w-96 h-96 ${bgBlob1} rounded-full blur-3xl -top-48 -left-48 animate-pulse`}></div>
        <div className={`absolute w-96 h-96 ${bgBlob2} rounded-full blur-3xl -bottom-48 -right-48 animate-pulse`} style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="z-10 max-w-7xl w-full flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12 xl:gap-20 mx-auto">

        {/* Left: Text Content */}
        <motion.div
          className="flex-1 lg:max-w-[70%] text-center lg:text-left order-2 lg:order-1 relative z-20 px-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Brand Identity & Authority Badge */}
          <div className="mb-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-bold tracking-wide">Omarmohamed-portfolio</span>
            <span className="text-slate-400 hidden sm:inline">• Official AI & MLOps Showcase</span>
          </div>

          {/* Desktop: small title above name (keeps existing appearance) */}
          <div className="hidden lg:block mb-4">
            <span className={`${accentColor} text-xl font-bold tracking-wider uppercase`}>{personalInfo.title}</span>
          </div>

          <div className="hidden lg:block">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight break-words lg:whitespace-nowrap bg-gradient-to-r ${gradientClasses} bg-clip-text text-transparent`}
            >
              {personalInfo.name}
            </motion.h1>
          </div>

          {/* Mobile: name then title */}
          <div className="block lg:hidden mt-2">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`text-2xl xs:text-2xl sm:text-3xl font-bold mb-2 leading-tight break-words bg-gradient-to-r ${gradientClasses} bg-clip-text text-transparent`}
            >
              {personalInfo.name}
            </motion.h1>
            <div className={`${accentColor} text-xs xs:text-sm font-bold tracking-wider uppercase mb-4 text-center`}>{personalInfo.title}</div>

            {/* Mobile tagline - now visible */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm sm:text-base text-surface/85 mb-4 leading-relaxed px-2"
            >
              {personalInfo.tagline}
            </motion.p>

            <div className="flex lg:hidden justify-center mb-4">
              <a href={personalInfo.linkedin || '#'} target="_blank" rel="noopener noreferrer" className={`text-gray-400 ${hoverText} transition-colors flex items-center`}>
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-surface/90 mb-8 leading-relaxed hidden lg:block"
          >
            {personalInfo.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-base sm:text-lg text-surface/80 mb-10 leading-relaxed hidden lg:block max-w-2xl"
          >
            {personalInfo.description}
          </motion.p>

          <motion.div
            className="flex gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8 lg:mb-10 flex-wrap"
            variants={containerVariant}
          >
            <ButtonCard
              href="#"
              className={`${bgAccent} ${bgAccentHover} text-gray-900 min-w-[190px]`}
              onClick={() => scrollToSection('discovery')}
              variants={itemVariant}
            >
              <FileText size={18} className="sm:w-5 sm:h-5" />
              <span className="whitespace-nowrap">{t('bookDiscoveryCall')}</span>
            </ButtonCard>
            {personalInfo.resume && (
              <ButtonCard href={personalInfo.resume} external className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white" variants={itemVariant}>
                <FileText size={18} className="sm:w-5 sm:h-5" />
                {t('resume')}
              </ButtonCard>
            )}
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-6 lg:gap-8 justify-center sm:justify-start text-gray-500 text-xs sm:text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <a href={`mailto:${personalInfo.email}`} className={`flex items-center gap-2 ${hoverText} transition-colors duration-300 justify-center sm:justify-start`}>
              <Mail size={16} className="flex-shrink-0" />
              <span className="max-w-[220px] sm:max-w-none break-words">{personalInfo.email}</span>
            </a>
            {personalInfo.phone && (
              <a href={`tel:${personalInfo.phone?.replace(/\s/g, '')}`} className={`flex items-center gap-2 ${hoverText} transition-colors duration-300 justify-center sm:justify-start`}>
                <Phone size={16} className="flex-shrink-0" />
                <span>{personalInfo.phone}</span>
              </a>
            )}
            {personalInfo.location && (
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(personalInfo.location)}`} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 ${hoverText} transition-colors duration-300 justify-center sm:justify-start`}>
                <MapPin size={16} className="flex-shrink-0" />
                <span>{personalInfo.location}</span>
              </a>
            )}
          </motion.div>
        </motion.div>

        {/* Right: Image (mobile: show above text) -> Order 1 on mobile, Order 2 on desktop */}
        <motion.div
          className="flex-shrink-0 order-1 lg:order-2 flex flex-col items-center justify-center relative z-10"
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="relative w-40 h-40 xs:w-48 xs:h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-[26rem] xl:w-96 xl:h-[30rem]">
            {/* Orbital rings */}
            <div className="absolute inset-[-20%] rounded-full border border-cyanGlow/20 animate-spin-slow pointer-events-none" style={{ animationDuration: '30s' }} />
            <div className="absolute inset-[-10%] rounded-full border border-neonPurple/20 animate-spin-reverse-slow pointer-events-none" style={{ animationDuration: '25s' }} />

            {/* Image container */}
            <div className={`w-full h-full rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-gray-700/50 backdrop-blur-sm bg-deepSpace/40 shadow-2xl glass-card relative z-10 group`}>
              <div className="absolute inset-0 bg-gradient-to-t from-deepSpace/80 via-transparent to-transparent opacity-60 z-20"></div>
              <img
                src={getOptimizedImagePath(personalInfo.image || '/images/me/profile.jpg')}
                alt={personalInfo.name || 'Profile'}
                className="w-full h-full object-cover"
                style={{ objectPosition: '35% 12%' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>

            {/* Floating Badge removed as requested */}
          </div>

          <div className="mt-8 hidden lg:flex justify-center z-20 transform -translate-y-6">
            <a href={personalInfo.linkedin || '#'} target="_blank" rel="noopener noreferrer" className={`text-gray-400 ${hoverText} transform hover:scale-110 transition-all duration-300 flex items-center p-2`}>
              <Linkedin size={32} />
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
