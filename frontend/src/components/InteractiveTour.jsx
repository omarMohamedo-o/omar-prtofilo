import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Sparkles, ChevronRight, ChevronLeft, X, CheckCircle, Bot, ArrowDown } from 'lucide-react';

const TOUR_STEPS = [
  {
    targetId: 'home',
    title: 'Welcome to Omar Gad\'s Portfolio',
    badge: 'Overview',
    description: 'Omar is a Computer Engineer & M.Sc. candidate (CGPA 4.0) specializing in AI, LLMs & RAG, and MLOps & Cloud. You can switch between "DevOps & MLOps" and "AI & ML" modes anytime to tailor the view!',
    itemHighlights: ['Omar Gad • Computer Engineer', 'M.Sc. Candidate (CGPA 4.0)', 'DevOps/MLOps & AI/ML Mode Switcher']
  },
  {
    targetId: 'about',
    title: 'About Omar',
    badge: 'Background',
    description: 'Learn about Omar\'s journey, research interests in applied ML, generative AI, and multilingual conversational systems, and his experience bridging research into production-grade systems.',
    itemHighlights: ['Applied ML & Multilingual Systems', 'Production-first Engineering', 'Academic Excellence']
  },
  {
    targetId: 'experience',
    title: 'Professional Experience',
    badge: 'Production Roles',
    description: 'Explore live enterprise engineering work, including MLOps & AI Infrastructure Engineer at PlayerHub.GG (Dubai), AI & ML Engineer at CliniSoft (Alexandria), ChloroMaster, and instructional roles at EYouth and Black Horse.',
    itemHighlights: ['PlayerHub.GG • MLOps & AI Infra', 'CliniSoft • Clinical Healthcare AI', 'ChloroMaster • Cloud & DevOps', 'EYouth & Black Horse • Teaching 50+ Students']
  },
  {
    targetId: 'internships',
    title: 'Engineering Internships',
    badge: 'Hands-on Training',
    description: 'High-impact internships including DEPI (Delivered 5 DevOps projects with Terraform, Ansible, K8s, 99.5% uptime) and Telecom Egypt (Enterprise NLP pipelines & PyTorch vision models).',
    itemHighlights: ['DEPI • DevOps & Cloud Infrastructure', 'Telecom Egypt • AI & NLP Chatbots']
  },
  {
    targetId: 'skills',
    title: 'Core Technical Skills',
    badge: 'Tech Stack',
    description: 'A deep, production-tested toolkit spanning LLMs & Generative AI (RAG, Multi-agent, MCP, LoRA), ML/NLP frameworks, MLOps & Cloud (Docker, Kubernetes, Terraform, AWS, Azure, GCP), and High Availability Databases.',
    itemHighlights: ['LLMs, RAG, Multi-Agent & MCP', 'PyTorch, Transformers, YOLOv5, Whisper', 'Docker, Kubernetes, Terraform, Helm', 'HashiCorp Vault, Prometheus & Grafana']
  },
  {
    targetId: 'projects',
    title: 'Featured Projects',
    badge: 'Flagship Systems',
    description: 'Explore flagship systems: HistoryVerse (A+ Multilingual AI/AR Museum Guide on AWS Fargate with YOLOv5), SDXL LoRA Fine-tuning pipeline (MLflow & Diffusers), and PlayerHub live gaming infrastructure.',
    itemHighlights: ['HistoryVerse (Grade: A+, 204 tests, AWS Fargate)', 'SDXL LoRA Mosque Fine-Tuning', 'PlayerHub Production Infrastructure', 'MORA Portfolio AI Assistant']
  },
  {
    targetId: 'education',
    title: 'Education & Academics',
    badge: 'Academics',
    description: 'M.Sc. in Computer Engineering at Arab Academy (CGPA 4.0 / 4.0), Software Engineering Code Camp at ITI, and B.Sc. in Computer Engineering with Very Good (B+) honors.',
    itemHighlights: ['M.Sc. Computer Engineering (CGPA 4.0 / 4.0)', 'ITI Intensive Code Camp Diploma', 'B.Sc. in Computer Engineering (Grade: Very Good)']
  },
  {
    targetId: 'certifications',
    title: 'Certifications & Credentials',
    badge: 'Verified Honors',
    description: 'Industry-recognized credentials including the Aspire Leaders Program, Red Hat Certified System Administrator (RHCSA), Huawei Cloud Developer (HCCDA), and IBM Docker Essentials.',
    itemHighlights: ['Aspire Leaders Program (Aspire Institute)', 'RHCSA (Red Hat Certified)', 'HCCDA Huawei Cloud Developer', 'Docker Essentials (IBM)']
  },
  {
    targetId: 'contact',
    title: 'Connect & Chat with MORA',
    badge: 'Get in Touch',
    description: 'Ready to collaborate? Reach out directly via the Discovery form, WhatsApp, Email, or chat live with MORA — Omar\'s AI assistant in the bottom-right corner, ready to answer questions about any project or skill!',
    itemHighlights: ['Interactive Discovery Inquiry Form', 'Direct WhatsApp & Email', 'MORA AI Chatbot with Voice & RAG']
  }
];

export default function InteractiveTour({ onTourToggle }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [tourActive, setTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
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
    window.startPortfolioTour = () => {
      setShowPrompt(false);
      setCurrentStep(0);
      setTourActive(true);
    };
    return () => {
      delete window.startPortfolioTour;
    };
  }, []);

  // Scroll to and highlight current step target
  const scrollToTarget = useCallback((targetId) => {
    // Clean up previous highlight
    if (previousHighlightRef.current) {
      previousHighlightRef.current.classList.remove('tour-focused-element');
    }

    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth'
      });

      element.classList.add('tour-focused-element');
      previousHighlightRef.current = element;
    }
  }, []);

  // Trigger scroll on step change
  useEffect(() => {
    if (tourActive) {
      const targetId = TOUR_STEPS[currentStep].targetId;
      scrollToTarget(targetId);
      if (onTourToggle) onTourToggle(true);
    } else {
      if (previousHighlightRef.current) {
        previousHighlightRef.current.classList.remove('tour-focused-element');
        previousHighlightRef.current = null;
      }
      if (onTourToggle) onTourToggle(false);
    }
  }, [tourActive, currentStep, scrollToTarget, onTourToggle]);

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
  }, [tourActive, currentStep]);

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
    if (currentStep < TOUR_STEPS.length - 1) {
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

  const step = TOUR_STEPS[currentStep];
  const progressPercent = ((currentStep + 1) / TOUR_STEPS.length) * 100;

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
                      Interactive Guide
                    </span>
                    <span className="text-xs text-gray-400">Omar Gad Portfolio</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    Welcome! Take a Quick Tour?
                  </h3>
                </div>
              </div>

              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                I'm <strong className="text-cyan-300 font-semibold">MORA</strong>, your portfolio AI guide. Would you like a brief interactive walkthrough of Omar Gad's background, production AI systems (<span className="text-purple-300 font-medium">PlayerHub</span>, <span className="text-cyan-300 font-medium">CliniSoft</span>, <span className="text-amber-300 font-medium">HistoryVerse</span>), skills, and experience?
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleDeclinePrompt}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-medium text-sm transition-colors duration-200"
                >
                  No thanks, explore freely
                </button>
                <button
                  type="button"
                  onClick={handleStartTour}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Guided Tour</span>
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
                    {currentStep + 1}/{TOUR_STEPS.length}
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
                    aria-label="Exit tour"
                    title="Exit tour (Esc)"
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
                {step.itemHighlights.map((highlight, idx) => (
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
                  Skip Tour
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className={`px-3 py-1.5 rounded-xl border border-gray-700 text-xs font-medium flex items-center gap-1 transition-all ${
                      currentStep === 0
                        ? 'opacity-40 cursor-not-allowed text-gray-500'
                        : 'text-gray-300 hover:text-white hover:border-gray-500 active:scale-95'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <span>{currentStep === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next'}</span>
                    {currentStep === TOUR_STEPS.length - 1 ? (
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
