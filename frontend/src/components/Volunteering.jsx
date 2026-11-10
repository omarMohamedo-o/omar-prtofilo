import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';
import {
  titleVariant,
  containerVariant,
  getOrbitalItemVariant,
  viewportOptions
} from '../utils/animationVariants';
import useIsMobile from '../hooks/useIsMobile';
import { useLanguage } from '../context/LanguageContext';

const Volunteering = function Volunteering({ isVisible, volunteering = [], themeColor = 'cyan' }) {
  const { isRTL } = useLanguage();
  const isMobile = useIsMobile();
  const textColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
  const borderHover = themeColor === 'purple'
    ? 'hover:border-purple-500/50 hover:shadow-purple-500/10'
    : 'hover:border-cyan-500/50 hover:shadow-cyan-500/10';

  if (!volunteering || volunteering.length === 0) return null;

  return (
    <motion.section
      id="volunteering"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 ds-section scroll-mt-20"
      initial="hidden"
      whileInView="show"
      viewport={viewportOptions}
    >
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <motion.h2
          variants={titleVariant}
          className="section-title"
        >
          <span className="text-surface">Volunteer &</span> <span className="highlight">Mentorship</span>
        </motion.h2>

        {/* Content container */}
        <motion.div
          variants={containerVariant}
          className="space-y-4 sm:space-y-6 lg:space-y-8"
        >
          {volunteering.map((item, index) => (
            <motion.div
              key={index}
              variants={getOrbitalItemVariant(index, isMobile)}
              whileHover={{ scale: 1.02, x: 5 }}
              className={`ds-card rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 card-orbital backdrop-blur-md border border-gray-800 transition-all duration-500 group drop-shadow-lg ${borderHover}`}
            >
              <div className="mb-3 sm:mb-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h3 className={`text-xl sm:text-2xl font-bold ${textColor}`}>{item.title}</h3>
                  {item.badge && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <Award size={13} />
                      <span>{item.badge}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                  <GraduationCap size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className={`font-semibold transition-colors duration-300 ${themeColor === 'purple' ? 'hover:text-purple-400' : 'hover:text-cyan-400'}`}>
                      {item.company}
                    </a>
                  ) : (
                    <span className="font-semibold">{item.company}</span>
                  )}
                </div>
                <div className="text-gray-400 text-xs sm:text-sm mb-1">{item.location} • {item.type}</div>
                <div className="text-gray-400 text-xs sm:text-sm">{item.period}</div>
              </div>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-300 text-sm sm:text-base">
                {item.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className={`${textColor} flex-shrink-0 leading-relaxed mt-0.5`}>▹</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>

              {/* 3D Interactive Volunteer Mentorship Thesis Button */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-3d-book', { detail: { bookId: 'volunteer' } }))}
                  className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 hover:text-slate-950 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-emerald-500/30 touch-manipulation group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">📖</span>
                  <span>{isRTL ? 'تصفح كتاب أطروحة التطوع 3D (جامعة بوليتكنك فلسطين)' : 'Open 3D Volunteer Research Book'}</span>
                </button>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  Thesis
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default memo(Volunteering);
