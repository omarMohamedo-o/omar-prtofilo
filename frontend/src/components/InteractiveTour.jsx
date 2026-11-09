import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, ChevronRight, ChevronLeft, X, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function InteractiveTour({ onTourToggle }) {
  const { t, currentLocale } = useLanguage();
  const tourSteps = currentLocale?.tourSteps || [];

  const [showPrompt, setShowPrompt] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const previousHighlightRef = useRef(null);

  // Check if first-time user on mount
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('mora_tour_completed');
    if (!hasSeenTour) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Register global trigger so any button can launch the tour
  useEffect(() => {
    const launch = () => {
      setShowPrompt(false);
      setCurrentStep(0);
      setTourActive(true);
    };

    window.startPortfolioTour = launch;
    window.addEventListener('start-portfolio-tour', launch);

    return () => {
      delete window.startPortfolioTour;
      window.removeEventListener('start-portfolio-tour', launch);
    };
  }, []);

  // Smooth scroll helper
  const scrollToTarget = useCallback((targetId) => {
    if (!targetId) return;

    if (targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(targetId);
    if (!element) return;

    const nav = document.querySelector('nav');
    const navOffset = nav ? nav.offsetHeight + 20 : 80;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = Math.max(0, elementPosition - navOffset);

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }, []);

  // Sync scroll & spotlight highlight
  useEffect(() => {
    if (!tourActive || !tourSteps.length) return;

    const activeStep = tourSteps[currentStep] || tourSteps[0];
    if (!activeStep) return;

    scrollToTarget(activeStep.targetId);

    if (previousHighlightRef.current) {
      previousHighlightRef.current.classList.remove('tour-focused-element');
    }

    const targetEl = activeStep.targetId === 'home'
      ? document.getElementById('home') || document.querySelector('.hero-section')
      : document.getElementById(activeStep.targetId);

    if (targetEl) {
      targetEl.classList.add('tour-focused-element');
      previousHighlightRef.current = targetEl;
    }

    if (onTourToggle) onTourToggle(true);

    return () => {
      if (previousHighlightRef.current) {
        previousHighlightRef.current.classList.remove('tour-focused-element');
      }
    };
  }, [tourActive, currentStep, scrollToTarget, onTourToggle, tourSteps]);

  // Cleanup on unmount or tour deactivation
  useEffect(() => {
    if (!tourActive) {
      if (previousHighlightRef.current) {
        previousHighlightRef.current.classList.remove('tour-focused-element');
        previousHighlightRef.current = null;
      }
      if (onTourToggle) onTourToggle(false);
      window.dispatchEvent(new CustomEvent('portfolio-tour-ended'));
    }
  }, [tourActive, onTourToggle]);

  // Keyboard navigation
  useEffect(() => {
    if (!tourActive) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleCloseTour();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tourActive, currentStep, tourSteps.length]);

  const handleStartTour = () => {
    setShowPrompt(false);
    setCurrentStep(0);
    setTourActive(true);
  };

  const handleDeclinePrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('mora_tour_completed', 'true');
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleCompleteTour();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleCloseTour = () => {
    setTourActive(false);
    localStorage.setItem('mora_tour_completed', 'true');
    if (previousHighlightRef.current) {
      previousHighlightRef.current.classList.remove('tour-focused-element');
      previousHighlightRef.current = null;
    }
  };

  const handleCompleteTour = () => {
    handleCloseTour();
  };

  if (!tourSteps.length) return null;

  const step = tourSteps[currentStep] || tourSteps[0];
  const progressPercent = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <>
      {/* Spotlight CSS injection */}
      <style>{`
        .tour-focused-element {
          position: relative !important;
          z-index: 35 !important;
          outline: 2px solid rgba(127, 234, 255, 0.7) !important;
          box-shadow: 0 0 35px rgba(127, 234, 255, 0.25) !important;
          border-radius: 1rem !important;
          transition: outline 0.3s ease, box-shadow 0.3s ease !important;
        }
        .tour-backdrop-overlay {
          pointer-events: none;
          position: fixed;
          inset: 0;
          background: radial-gradient(circle at center, transparent 30%, rgba(3, 5, 15, 0.65) 90%);
          z-index: 30;
          transition: opacity 0.4s ease;
        }
      `}</style>

      {/* Dimmed backdrop when tour is active */}
      {tourActive && <div className="tour-backdrop-overlay" aria-hidden="true" />}

      {/* 1. First-time Welcome Prompt Modal */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#121629] via-[#0d1021] to-[#070914] border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 text-surface overflow-hidden"
            >
              {/* Decorative glow */}
              <div className="absolute -top-16 -right-16 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 flex-shrink-0 animate-pulse">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {t('tourInteractiveGuide')}
                    </span>
                    <span className="text-xs text-gray-400">{t('tourPortfolioSub')}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {t('tourModalTitle')}
                  </h3>
                </div>
              </div>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                {t('tourModalDesc')}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleDeclinePrompt}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-medium text-sm transition-colors duration-200"
                >
                  {t('tourModalDecline')}
                </button>
                <button
                  type="button"
                  onClick={handleStartTour}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t('tourModalStart')}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Floating Interactive Tour Card during active guide */}
      <AnimatePresence>
        {tourActive && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-xl"
          >
            <div className="relative rounded-2xl bg-[#0d1021]/95 backdrop-blur-xl border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 p-5 sm:p-6 text-white overflow-hidden">
              {/* Progress bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Header row */}
              <div className="flex items-center justify-between gap-2 mb-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs">
                    {currentStep + 1}/{tourSteps.length}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                    {step.badge}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleCloseTour}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors"
                    aria-label={t('tourExitTitle')}
                    title={t('tourExitTitle')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Title & Body */}
              <h4 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span>{step.title}</span>
              </h4>

              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                {step.description}
              </p>

              {/* Highlights pills */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {step.itemHighlights && step.itemHighlights.map((highlight, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-cyan-950/60 text-cyan-200 border border-cyan-800/50 flex items-center gap-1"
                  >
                    <span className="text-cyan-400 font-bold">▹</span>
                    <span>{highlight}</span>
                  </span>
                ))}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-800/80">
                <button
                  type="button"
                  onClick={handleCloseTour}
                  className="text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors py-1 px-2"
                >
                  {t('tourSkip')}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className={`px-3 py-1.5 rounded-xl border border-gray-700 text-xs font-medium flex items-center gap-1 transition-all ${currentStep === 0
                      ? 'opacity-40 cursor-not-allowed text-gray-500'
                      : 'text-gray-300 hover:text-white hover:border-gray-500 active:scale-95'
                      }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>{t('tourBack')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>{currentStep === tourSteps.length - 1 ? t('tourFinish') : t('tourNext')}</span>
                    {currentStep === tourSteps.length - 1 ? (
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
