import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import {
  titleVariant,
  containerVariant,
  getOrbitalItemVariant,
  viewportOptions
} from '../utils/animationVariants';
import useIsMobile from '../hooks/useIsMobile';
import PreviewableImage from './PreviewableImage';

export default function Internships({ isVisible, internships = [], themeColor = 'cyan' }) {
  const isMobile = useIsMobile();
  const accentColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
  const borderHover = themeColor === 'purple' ? 'hover:border-purple-500/50' : 'hover:border-cyan-500/50';

  return (
    <motion.section
      id="internships"
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
          <span className="text-surface">My</span> <span className="highlight">Internships</span>
        </motion.h2>

        {/* Phase 2: Content container with delayed staggered children */}
        <motion.div
          variants={containerVariant}
          className="space-y-4 sm:space-y-6 lg:space-y-8"
        >
          {internships.map((internship, index) => (
            <motion.div
              key={index}
              variants={getOrbitalItemVariant(index, isMobile)}
              whileHover={{ scale: 1.02, y: -3 }}
              className={`ds-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 relative ${borderHover} transition-all duration-500 hover:shadow-md`}
            >
              <div className="mb-3 sm:mb-4">
                <h3 className={`text-xl sm:text-2xl font-bold ${accentColor}`}>{internship.title}</h3>
                <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                  <Briefcase size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                  {internship.link ? (
                    <a href={internship.link} target="_blank" rel="noopener noreferrer" className={`font-semibold transition-colors duration-300 ${themeColor === 'purple' ? 'hover:text-purple-400' : 'hover:text-cyan-400'}`}>
                      {internship.company}
                    </a>
                  ) : (
                    <span className="font-semibold">{internship.company}</span>
                  )}
                </div>
                <div className="text-gray-400 text-xs sm:text-sm mb-1">{internship.location} • {internship.type}</div>
                <div className="text-gray-400 text-xs sm:text-sm">{internship.period}</div>
              </div>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
                {internship.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className={`${accentColor} flex-shrink-0 leading-relaxed mt-0.5`}>▹</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>

              {/* Badges/images: absolute on md+; inline row on mobile for better layout */}
              <div className="absolute bottom-4 right-4 flex items-end gap-2 hidden md:flex">
                {internship.company && internship.company.toLowerCase().includes('information technology institute') && (
                  <PreviewableImage
                    src="/images/certifications/ITI-certified-system-administration.jpg"
                    alt="ITI Certificate"
                    className="w-24 lg:w-28 h-16 lg:h-20 object-contain bg-black/20"
                  />
                )}

                {internship.company && internship.company.toLowerCase().includes('depi') && (
                  <PreviewableImage
                    src="/images/certifications/DEPI-R1-certified-devops-omar-mohamed-abdelsalam.jpg"
                    alt="DEPI Badge"
                    className="w-24 lg:w-28 h-16 lg:h-20 object-contain bg-black/20"
                  />
                )}
                {internship.title && internship.title.toLowerCase().includes('artificial intelligence') && (
                  <PreviewableImage
                    src="/images/certifications/we-certified-artificial-intelligence.jpg"
                    alt="WE Certificate"
                    className="w-24 lg:w-28 h-16 lg:h-20 object-contain bg-black/20"
                  />
                )}
              </div>

              {/* Mobile: show badges inline below content to avoid overflow; right-justify to match desktop edge */}
              <div className="mt-4 flex items-center gap-2 md:hidden justify-end">
                {internship.company && internship.company.toLowerCase().includes('information technology institute') && (
                  <PreviewableImage
                    src="/images/certifications/ITI-certified-system-administration.jpg"
                    alt="ITI Certificate"
                    className="w-20 xs:w-24 h-14 xs:h-16 object-contain bg-black/20"
                  />
                )}

                {internship.company && internship.company.toLowerCase().includes('depi') && (
                  <PreviewableImage
                    src="/images/certifications/DEPI-R1-certified-devops-omar-mohamed-abdelsalam.jpg"
                    alt="DEPI Badge"
                    className="w-20 xs:w-24 h-14 xs:h-16 object-contain bg-black/20"
                  />
                )}
                {internship.title && internship.title.toLowerCase().includes('artificial intelligence') && (
                  <PreviewableImage
                    src="/images/certifications/we-certified-artificial-intelligence.jpg"
                    alt="WE Certificate"
                    className="w-20 xs:w-24 h-14 xs:h-16 object-contain bg-black/20"
                  />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
