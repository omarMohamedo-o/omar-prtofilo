import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import {
  titleVariant,
  containerVariant,
  getOrbitalItemVariant,
  viewportOptions
} from '../utils/animationVariants';
import useIsMobile from '../hooks/useIsMobile';
import { useLanguage } from '../context/LanguageContext';

const Projects = function Projects({ isVisible, projects = [], themeColor = 'cyan' }) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const textColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
  const techColor = themeColor === 'purple' ? 'text-purple-300' : 'text-cyan-300';
  const borderHover = themeColor === 'purple'
    ? 'hover:border-purple-500/50 hover:shadow-purple-500/10'
    : 'hover:border-cyan-500/50 hover:shadow-cyan-500/10';
  const techHover = themeColor === 'purple'
    ? 'hover:bg-purple-500/20'
    : 'hover:bg-cyan-500/20';

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
          <span className="text-surface">{t('projectsTitle1')}</span> <span className="highlight">{t('projectsTitle2')}</span>
        </motion.h2>

        {/* Phase 2: Content container with delayed staggered children */}
        <motion.div
          variants={containerVariant}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={getOrbitalItemVariant(index, isMobile)}
              whileHover={{ scale: 1.03, y: -5 }}
              className={`ds-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 card-orbital ${borderHover} transition-all duration-500 group drop-shadow-lg hover:shadow-cyanGlow/20`}
            >
              <h3 className={`text-xl sm:text-2xl font-bold ${textColor} flex items-center justify-between`}>
                {project.title}
                {project.github && project.github !== "#" && !(project.link && project.link !== "#") ? (
                  <span className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-2">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} - ${t('githubRepo')}`} title={t('githubRepo')} className="cursor-pointer p-2">
                      <Github size={18} />
                    </a>
                  </span>
                ) : (
                  <span className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -mr-2">
                    {project.github && project.github !== "#" ? (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} - ${t('githubRepo')}`} title={t('githubRepo')} className="cursor-pointer p-2">
                        <Github size={18} />
                      </a>
                    ) : (
                      <span className="p-2 opacity-30" aria-hidden>
                        <Github size={18} />
                      </span>
                    )}
                    {project.link && project.link !== "#" ? (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} - ${t('liveDemo')}`} title={t('liveDemo')} className="cursor-pointer p-2">
                        <ExternalLink size={18} />
                      </a>
                    ) : (
                      <span className="p-2 opacity-30" aria-hidden>
                        <ExternalLink size={18} />
                      </span>
                    )}
                  </span>
                )}
              </h3>
              <div className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed mt-3 sm:mt-4">
                {project.description ? (
                  (() => {
                    const lines = project.description.split('\n').map(l => l.trim()).filter(Boolean);
                    return (
                      <>
                        <div>{lines[0]}</div>
                        {lines.slice(1).map((line, i) => (
                          <div key={i} className="mt-2">
                            <span className="font-semibold">{line.replace(/^•\s*/, '')}</span>
                          </div>
                        ))}
                      </>
                    );
                  })()
                ) : null}
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.tech.map((tech, i) => (
                  <span
                    key={i}
                    className={`bg-white/10 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${techColor} ${techHover} transition-all duration-300 transform hover:scale-110 glow-btn`}
                  >
                    {tech}
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

export default memo(Projects);
