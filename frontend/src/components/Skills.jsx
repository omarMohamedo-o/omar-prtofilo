import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Code, Server, Shield, Brain, Database, Terminal, Cpu } from 'lucide-react';
import {
  titleVariant,
  containerVariant,
  itemVariant,
  getGridOrbitalVariant,
  viewportOptions
} from '../utils/animationVariants';
import useIsMobile from '../hooks/useIsMobile';

export default function Skills({ isVisible, skills = {}, themeColor = 'cyan' }) {
  const isMobile = useIsMobile();
  const textColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
  const borderHover = themeColor === 'purple'
    ? 'hover:border-purple-500/50 hover:shadow-purple-500/10'
    : 'hover:border-cyan-500/50 hover:shadow-cyan-500/10';
  const skillHover = themeColor === 'purple'
    ? 'hover:bg-purple-500/20 hover:text-purple-400'
    : 'hover:bg-cyan-500/20 hover:text-cyan-400';

  // Grid columns for orbital direction calculation
  const gridColumns = isMobile ? 1 : 3;

  const getIcon = (category) => {
    const iconMap = {
      'Cloud': Cloud,
      'Infrastructure': Code,
      'CI/CD': Server,
      'Containers': Server,
      'Security': Shield,
      'Machine Learning': Brain,
      'NLP': Brain,
      'Data': Database,
      'Programming': Terminal,
      'MLOps': Cpu,
      'Vector': Database,
      'Databases': Database,
      'Operating': Server,
      'Version': Code
    };

    for (const [key, Icon] of Object.entries(iconMap)) {
      if (category.includes(key)) return <Icon size={20} />;
    }
    return <Code size={20} />;
  };

  return (
    <motion.section
      id="skills"
      className="py-16 sm:py-20 lg:py-24 ds-section scroll-mt-20"
      initial="hidden"
      whileInView="show"
      viewport={viewportOptions}
    >
      <div className="container">
        {/* Phase 1: Title appears first (standalone) */}
        <motion.h2
          variants={titleVariant}
          className="section-title"
        >
          <span className="text-surface">Technical</span> <span className="highlight">Skills</span>
        </motion.h2>

        {/* Phase 2: Content container with delayed staggered children */}
        <motion.div
          variants={containerVariant}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {Object.entries(skills).map(([category, items], index) => (
            <motion.div
              key={index}
              variants={getGridOrbitalVariant(index, gridColumns)}
              whileHover={{ scale: 1.05, y: -3 }}
              className={`ds-card rounded-xl p-4 sm:p-5 lg:p-6 ${borderHover} transition-all duration-500 hover:shadow-xl`}
            >
              <h3 className={`text-lg sm:text-xl font-bold ${textColor} mb-3 sm:mb-4 flex items-center gap-2`}>
                {getIcon(category)}
                {category}
              </h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {items.map((skill, i) => (
                  <span
                    key={i}
                    className={`bg-white/10 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-white ${skillHover}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
