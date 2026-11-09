import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import {
  titleVariant,
  containerVariant,
  getOrbitalItemVariant,
  viewportOptions
} from '../utils/animationVariants';
import useIsMobile from '../hooks/useIsMobile';
import { useLanguage } from '../context/LanguageContext';

const Experience = function Experience({ isVisible, experiences = [], themeColor = 'cyan' }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const textColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
  const borderHover = themeColor === 'purple'
    ? 'hover:border-purple-500/50 hover:shadow-purple-500/10'
    : 'hover:border-cyan-500/50 hover:shadow-cyan-500/10';

  return (
    <motion.section
      id="experience"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 ds-section scroll-mt-20"
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
          <span className="text-surface">{t('experienceTitle1')}</span> <span className="highlight">{t('experienceTitle2')}</span>
        </motion.h2>

        {/* Phase 2: Content container with delayed staggered children */}
        <motion.div
          variants={containerVariant}
          className="space-y-4 sm:space-y-6 lg:space-y-8"
        >
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              variants={getOrbitalItemVariant(index, isMobile)}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`ds-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 card-orbital backdrop-blur-md border border-gray-800 transition-all duration-500 group drop-shadow-lg ${borderHover}`}
            >
              <div className="mb-3 sm:mb-4">
                <h3 className={`text-xl sm:text-2xl font-bold ${textColor}`}>{exp.title}</h3>
                <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                  <Briefcase size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                  {exp.link ? (
                    <a href={exp.link} target="_blank" rel="noopener noreferrer" className={`font-semibold transition-colors duration-300 ${themeColor === 'purple' ? 'hover:text-purple-400' : 'hover:text-cyan-400'}`}>
                      {exp.company}
                    </a>
                  ) : (
                    <span className="font-semibold">{exp.company}</span>
                  )}
                </div>
                <div className="text-gray-400 text-xs sm:text-sm mb-1">{exp.location} • {exp.type}</div>
                <div className="text-gray-400 text-xs sm:text-sm">{exp.period}</div>
              </div>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className={`${textColor} flex-shrink-0 leading-relaxed mt-0.5`}>▹</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default memo(Experience);