import React, { useState, useEffect, useMemo } from 'react';

// Import components
import Header from './Header';
import Info from './Info';
import About from './About';
import Experience from './Experience';
import Internships from './Internships';
import Skills from './Skills';
import SoftSkills from './SoftSkills';
import Projects from './Projects';
import Education from './Education';
import { Certifications, Courses } from './Certificates';
import Languages from './Languages';
import Contact from './Contact';
import Footer from './Footer';
import ChatWidget from './ChatWidget';
import UpArrowButton from './UpArrowButton';
import DiscoveryForm from './DiscoveryForm';
import SpaceBackground from './SpaceBackground';
import InteractiveTour from './InteractiveTour';
import MinecraftGuide3D from './MinecraftGuide3D';

// Import data with mode support
import { MODES, getPortfolioData } from '../data/data';

// CSS Styles
const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px) rotate(-1deg);
    }
    to {
      opacity: 1;
      transform: translateX(0) rotate(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px) rotate(1deg);
    }
    to {
      opacity: 1;
      transform: translateX(0) rotate(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95) rotate(-0.5deg);
    }
    to {
      opacity: 1;
      transform: scale(1) rotate(0);
    }
  }

  /* Orbital entry animation for cards */
  @keyframes orbitalEntry {
    0% {
      opacity: 0;
      transform: translateY(40px) translateX(-20px) rotate(-2deg) scale(0.95);
    }
    60% {
      opacity: 0.9;
      transform: translateY(-5px) translateX(3px) rotate(0.5deg) scale(1.01);
    }
    100% {
      opacity: 1;
      transform: translateY(0) translateX(0) rotate(0) scale(1);
    }
  }

  @keyframes orbitalEntryRight {
    0% {
      opacity: 0;
      transform: translateY(40px) translateX(20px) rotate(2deg) scale(0.95);
    }
    60% {
      opacity: 0.9;
      transform: translateY(-5px) translateX(-3px) rotate(-0.5deg) scale(1.01);
    }
    100% {
      opacity: 1;
      transform: translateY(0) translateX(0) rotate(0) scale(1);
    }
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .animate-fade-in {
    animation: fadeIn 0.8s ease-out forwards;
  }

  .animate-slide-in-left {
    animation: orbitalEntry 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .animate-slide-in-right {
    animation: orbitalEntryRight 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .animate-scale-in {
    animation: scaleIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  /* Staggered delays for sequential card reveal */
  .stagger-1 { animation-delay: 0.05s; }
  .stagger-2 { animation-delay: 0.12s; }
  .stagger-3 { animation-delay: 0.19s; }
  .stagger-4 { animation-delay: 0.26s; }
  .stagger-5 { animation-delay: 0.33s; }
  .stagger-6 { animation-delay: 0.40s; }
  .stagger-7 { animation-delay: 0.47s; }
  .stagger-8 { animation-delay: 0.54s; }
  .stagger-9 { animation-delay: 0.61s; }
  .stagger-10 { animation-delay: 0.68s; }
  .stagger-11 { animation-delay: 0.75s; }
  .stagger-12 { animation-delay: 0.82s; }

  /* Scoped smooth transitions on interactive controls only (avoids global reflow jank) */
  a, button, input, textarea, select, .glow-btn, .ds-card {
    transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }
  
  /* Ensure cards start invisible before animation */
  .opacity-0 {
    opacity: 0;
  }
`;

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [currentMode, setCurrentMode] = useState(MODES.DEVOPS);

  // Get portfolio data based on current mode
  const portfolioData = useMemo(() => getPortfolioData(currentMode), [currentMode]);

  // Prevent browser auto-scroll to hash on refresh and ensure page opens at top
  useEffect(() => {
    // If URL contains a hash, remove it without navigating so browser won't auto-scroll
    if (window.location.hash) {
      const url = window.location.pathname + window.location.search;
      try {
        history.replaceState(null, '', url);
      } catch (e) {
        // ignore
      }
    }

    // Allow layout to settle, then scroll to top
    const t = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, 50);

    return () => clearTimeout(t);
  }, []);

  // Handle mode change
  const handleModeChange = (newMode) => {
    setCurrentMode(newMode);
    // Reset visible sections for fresh animations
    setVisibleSections(new Set());
    // Scroll to top on mode change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for section-level animations
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections
    document.querySelectorAll('section[id]').forEach((section) => {
      sectionObserver.observe(section);
    });

    // Card-level intersection observer for staggered reveal
    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target;
            // Add visible class to trigger animation
            card.classList.add('card-visible');
            card.classList.remove('card-hidden');
            // Stop observing once animated
            cardObserver.unobserve(card);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    // Delay to ensure DOM is ready, then observe all cards
    const observeCards = () => {
      document.querySelectorAll('.ds-card').forEach((card, index) => {
        // Add initial hidden state and stagger delay
        if (!card.classList.contains('card-visible')) {
          card.classList.add('card-hidden');
          card.style.setProperty('--card-index', index);
        }
        cardObserver.observe(card);
      });
    };

    // Run after a short delay to ensure components are mounted
    const timeoutId = setTimeout(observeCards, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      sectionObserver.disconnect();
      cardObserver.disconnect();
      clearTimeout(timeoutId);
    };
  }, [currentMode]); // Re-run when mode changes

  // Wrap last word of headings (h1..h4) with a highlight span for consistent styling
  useEffect(() => {
    const wrapLastWord = (el) => {
      if (!el) return;
      if (el.querySelector('.title-highlight')) return;
      const children = Array.from(el.childNodes).filter(n => !(n.nodeType === 3 && !n.textContent.trim()));
      const hasElementChildren = children.some(n => n.nodeType === 1);
      if (hasElementChildren) return;
      const text = el.textContent.trim();
      if (!text) return;
      const parts = text.split(' ');
      if (parts.length < 2) return;
      const last = parts.pop();
      const first = parts.join(' ');
      el.textContent = first + ' ';
      const span = document.createElement('span');
      span.className = 'title-highlight';
      span.textContent = last;
      el.appendChild(span);
    };

    const run = () => {
      const headings = document.querySelectorAll('h1,h2,h3,h4,h5');
      headings.forEach(h => wrapLastWord(h));
    };

    run();
    const mo = new MutationObserver(run);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  // Smooth scroll with offset for fixed header
  const SCROLLED_HEADER_HEIGHT = 56;

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const isAtTop = window.pageYOffset < 100;

      if (isAtTop) {
        // First: instant scroll to trigger header shrink
        window.scrollTo({ top: 100, behavior: 'instant' });

        // Then: smooth scroll to target after header has shrunk
        requestAnimationFrame(() => {
          const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
          const target = Math.max(0, elementTop - SCROLLED_HEADER_HEIGHT);
          window.scrollTo({ top: target, behavior: 'smooth' });
        });
      } else {
        // Already scrolled, header is small - direct smooth scroll
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const target = Math.max(0, elementTop - SCROLLED_HEADER_HEIGHT);
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
    }
  };

  const isVisible = (sectionId) => visibleSections.has(sectionId);

  // Dynamic theme class based on mode
  const themeColor = portfolioData.themeColor === 'purple' ? 'purple' : 'cyan';

  return (
    <div className={`space-theme space-theme-${themeColor} text-surface min-h-screen relative overflow-x-hidden`}>
      <SpaceBackground themeColor={themeColor} />
      <style>{styles}</style>

      {/* Header Navigation */}
      <Header
        scrollToSection={scrollToSection}
        themeColor={themeColor}
        currentMode={currentMode}
        onModeChange={handleModeChange}
      />

      {/* Hero Section */}
      <Info
        isVisible={isVisible}
        personalInfo={portfolioData.personalInfo}
        themeColor={themeColor}
        currentMode={currentMode}
        onModeChange={handleModeChange}
        scrollToSection={scrollToSection}
      />

      {/* About Section */}
      <About isVisible={isVisible} aboutMe={portfolioData.aboutMe} themeColor={themeColor} />

      {/* Experience Section */}
      <Experience isVisible={isVisible} experiences={portfolioData.experiences} themeColor={themeColor} />

      {/* Internships Section */}
      <Internships isVisible={isVisible} internships={portfolioData.internships} themeColor={themeColor} />

      {/* Skills Section */}
      <Skills isVisible={isVisible} skills={portfolioData.skills} themeColor={themeColor} />

      {/* Soft Skills Section */}
      <SoftSkills isVisible={isVisible} softSkills={portfolioData.softSkills} themeColor={themeColor} />

      {/* Projects Section */}
      <Projects isVisible={isVisible} projects={portfolioData.projects} themeColor={themeColor} />

      {/* Education Section */}
      <Education isVisible={isVisible} education={portfolioData.education} themeColor={themeColor} />

      {/* Certifications Section */}
      <section id="certifications" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <Certifications isVisible={isVisible} certifications={portfolioData.certifications} themeColor={themeColor} />

          {/* Courses Section */}
          <div className="mt-10 sm:mt-12 lg:mt-16">
            <Courses isVisible={isVisible} courses={portfolioData.courses} themeColor={themeColor} />
          </div>
        </div>
      </section>

      {/* Languages Section */}
      {portfolioData.languages && portfolioData.languages.length > 0 && (
        <Languages isVisible={isVisible} languages={portfolioData.languages} themeColor={themeColor} />
      )}

      {/* Discovery Form Section */}
      <DiscoveryForm isVisible={isVisible} themeColor={themeColor} />

      {/* Contact Section */}
      <Contact isVisible={isVisible} personalInfo={portfolioData.personalInfo} themeColor={themeColor} />

      {/* Footer */}
      <Footer personalInfo={portfolioData.personalInfo} themeColor={themeColor} />

      {/* Up arrow (above chat widget) */}
      <UpArrowButton />

      {/* 3D Minecraft Guide Character & LLM Companion */}
      <MinecraftGuide3D />

      {/* Interactive Animated Guide & Tour */}
      <InteractiveTour />

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
