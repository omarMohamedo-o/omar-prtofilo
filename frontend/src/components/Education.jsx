import React from 'react';
import { motion } from 'framer-motion';
import {
  titleVariant,
  containerVariant,
  getOrbitalItemVariant,
  viewportOptions
} from '../utils/animationVariants';
import useIsMobile from '../hooks/useIsMobile';
import { useLanguage } from '../context/LanguageContext';

export default function Education({ isVisible, education = [], themeColor = 'cyan' }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const textColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
  const borderHover = themeColor === 'purple'
    ? 'hover:border-purple-500/30'
    : 'hover:border-cyan-500/30';

  return (
    <motion.section
      id="education"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-20"
      initial="hidden"
      whileInView="show"
      viewport={viewportOptions}
    >
      <div className="max-w-6xl mx-auto">
        {/* Phase 1: Title appears first (standalone) */}
        <motion.h2
          variants={titleVariant}
          className="section-title"
        >
          <span className="text-surface">{t('educationTitle1')}</span> <span className="highlight">{t('educationTitle2')}</span>
        </motion.h2>

        {/* Phase 2: Content container with delayed staggered children */}
        <motion.div
          variants={containerVariant}
          className="space-y-4 sm:space-y-6 lg:space-y-8"
        >
          {education.map((edu, index) => (
            <motion.div
              key={index}
              variants={getOrbitalItemVariant(index, isMobile)}
              whileHover={{ scale: 1.02, y: -3 }}
              className={`ds-card rounded-xl p-4 sm:p-5 lg:p-6 ${borderHover} transition-all duration-500 hover:shadow-lg`}
            >
              <h3 className={`text-lg sm:text-xl font-bold ${textColor}`}>{edu.degree}</h3>
              {edu.link ? (
                <a href={edu.link} target="_blank" rel="noopener noreferrer" className={`text-gray-300 text-sm sm:text-base font-semibold block transition-colors duration-300 ${themeColor === 'purple' ? 'hover:text-purple-400' : 'hover:text-cyan-400'}`}>
                  {edu.institution}
                </a>
              ) : (
                <div className="text-gray-300 text-sm sm:text-base font-semibold">{edu.institution}</div>
              )}
              {edu.program && <div className="text-gray-400 text-xs sm:text-sm mb-1">{edu.program}</div>}
              <div className="text-gray-400 text-xs sm:text-sm mb-2">{edu.location} • {edu.period}</div>
              {(edu.cgpa || edu.gpa) && (
                <div className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${themeColor === 'purple' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'} mb-2`}>
                  {t('cgpaPrefix')} {edu.cgpa || edu.gpa}
                </div>
              )}
              {edu.highlights && <div className="text-gray-300 text-xs sm:text-sm mt-1 mb-1">{edu.highlights}</div>}
              {edu.project && <div className="text-gray-300 text-xs sm:text-sm mt-1"><strong className="text-white">{t('graduationProjectLabel')}</strong> {edu.project}</div>}
              {edu.coursework && (
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-xs text-gray-400">{t('courseworkLabel')}</span>
                  {edu.coursework.map((c, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-gray-800/80 text-gray-300 border border-gray-700/50">{c}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
