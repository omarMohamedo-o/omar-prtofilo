import React from 'react';
import { motion } from 'framer-motion';
import {
  titleVariant,
  containerVariant,
  getOrbitalItemVariant,
  viewportOptions
} from '../utils/animationVariants';
import useIsMobile from '../hooks/useIsMobile';

export default function Languages({ isVisible, languages = [], themeColor = 'cyan' }) {
  const isMobile = useIsMobile();
  const accentColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
  const borderHover = themeColor === 'purple' ? 'hover:border-purple-500/50' : 'hover:border-cyan-500/50';

  return (
    <motion.section
      id="languages"
      className="py-24 px-6 scroll-mt-20"
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
          <span className="text-surface">My</span> <span className="highlight">Languages</span>
        </motion.h2>

        {/* Phase 2: Content container with delayed staggered children */}
        <motion.div
          variants={containerVariant}
          className="flex justify-center gap-8"
        >
          {languages.map((lang, index) => (
            <motion.div
              key={index}
              variants={getOrbitalItemVariant(index, isMobile)}
              whileHover={{ scale: 1.05, y: -3 }}
              className={`ds-card rounded-xl p-6 ${borderHover} transition-all duration-500 text-center`}
            >
              <h3 className={`text-xl font-bold ${accentColor} mb-2`}>{lang.name}</h3>
              <p className="text-gray-300">{lang.level}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
