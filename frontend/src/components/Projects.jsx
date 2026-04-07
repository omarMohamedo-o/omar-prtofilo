import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import {
  titleVariant,
  containerVariant,
  getOrbitalItemVariant,
  viewportOptions
} from '../utils/animationVariants';
import useIsMobile from '../hooks/useIsMobile';
import ProjectModal from './ProjectModal';

const Projects = function Projects({ isVisible, projects = [], themeColor = 'cyan' }) {
  const isMobile = useIsMobile();
  const textColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
  const techColor = themeColor === 'purple' ? 'text-purple-300' : 'text-cyan-300';
  const borderHover = themeColor === 'purple'
    ? 'hover:border-purple-500/50 hover:shadow-purple-500/10'
    : 'hover:border-cyan-500/50 hover:shadow-cyan-500/10';
  const techHover = themeColor === 'purple'
    ? 'hover:bg-purple-500/20'
    : 'hover:bg-cyan-500/20';

  const [selected, setSelected] = useState(null);

  return (
    <motion.section
      id="projects"
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
          <span className="text-surface">Featured</span> <span className="highlight">Projects</span>
        </motion.h2>

        {/* Phase 2: Content container with delayed staggered children */}
        <motion.div
          variants={containerVariant}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={getOrbitalItemVariant(index, isMobile)}
              whileHover={{ scale: 1.03, y: -5 }}
              className={`cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl card-orbital ${borderHover} transition-all duration-500 group drop-shadow-lg hover:shadow-cyanGlow/20`}
              onClick={() => setSelected(project)}
            >
              {/* image area */}
              {project.image ? (
                <div className="w-full h-40 bg-gray-100">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-gradient-to-r from-sky-500 to-cyan-500 text-white">
                  <div className="text-lg font-semibold">{project.title}</div>
                </div>
              )}

              <div className="p-4 bg-white">
                <h4 className={`text-lg font-semibold ${textColor} truncate`}>{project.title}</h4>
                <div className="text-gray-500 text-sm mt-2 line-clamp-3">{project.description}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(project.tech || []).slice(0, 6).map((t, i) => (
                    <span key={i} className={`px-2 py-1 rounded-full text-xs bg-gray-100 ${techColor}`}>{t}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </motion.section>
  );
}

export default memo(Projects);
