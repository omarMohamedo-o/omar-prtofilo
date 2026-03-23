import React from 'react';
import { motion } from 'framer-motion';
import {
  titleVariant,
  containerVariant,
  getOrbitalItemVariant,
  viewportOptions
} from '../utils/animationVariants';
import useIsMobile from '../hooks/useIsMobile';

export default function Education({ isVisible, education = [], themeColor = 'cyan' }) {
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
          <span className="text-surface">My</span> <span className="highlight">Education</span>
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
              {(edu.cgpa || edu.gpa) && <div className="text-gray-300 text-xs sm:text-sm">CGPA: {edu.cgpa || edu.gpa}</div>}
              {edu.project && <div className="text-gray-300 text-xs sm:text-sm mt-2">Graduation Project: {edu.project}</div>}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
