import React, { memo } from 'react';
import { motion } from 'framer-motion';
import {
  titleVariant,
  containerVariant,
  itemVariant,
  viewportOptions
} from '../utils/animationVariants';

const About = function About({ isVisible, aboutMe = [], themeColor = 'cyan' }) {
  const borderHover = themeColor === 'purple'
    ? 'hover:border-purple-500/30'
    : 'hover:border-cyan-500/30';

  return (
    <motion.section
      id="about"
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
          <span className="text-surface">About</span> <span className="highlight">Me</span>
        </motion.h2>

        {/* Phase 2: Content container with delayed children */}
        <motion.div variants={containerVariant}>
          <motion.div
            variants={itemVariant}
            whileHover={{ scale: 1.01, y: -3, boxShadow: "0 0 20px rgba(0, 240, 255, 0.1)" }}
            className={`ds-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 backdrop-blur-md border border-gray-800 shadow-xl transition-all duration-500`}
          >
            {aboutMe.map((paragraph, index) => (
              <p key={index} className={`text-base sm:text-lg text-gray-300 leading-relaxed ${index < aboutMe.length - 1 ? 'mb-4 sm:mb-6' : ''}`}>
                {paragraph}
              </p>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default memo(About);