import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, BookOpen } from 'lucide-react';
import {
  titleVariant,
  containerVariant,
  getOrbitalItemVariant,
  viewportOptions
} from '../utils/animationVariants';
import useIsMobile from '../hooks/useIsMobile';
import { useLanguage } from '../context/LanguageContext';

function CompanyLogo({ logo, name, FallbackIcon = GraduationCap }) {
  const [hasError, setHasError] = useState(false);

  if (!logo || hasError) {
    return <FallbackIcon size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0 text-gray-400" />;
  }

  return (
    <span className="w-5 h-5 sm:w-[22px] sm:h-[22px] rounded-md bg-white/[0.06] border border-white/10 p-0.5 inline-flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-110">
      <img
        src={logo}
        alt={name || 'Organization logo'}
        className="w-full h-full object-contain"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </span>
  );
}

const Volunteering = function Volunteering({ isVisible, volunteering = [], themeColor = 'cyan' }) {
  const { isRTL, t } = useLanguage();
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
          <span className="text-surface">{t('volunteeringTitle1')}</span> <span className="highlight">{t('volunteeringTitle2')}</span>
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
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                      themeColor === 'purple'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    }`}>
                      <Award size={13} />
                      <span>{item.badge}</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                  <CompanyLogo logo={item.logo} name={item.company} FallbackIcon={GraduationCap} />
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

              {/* Thesis Action Button (Opens 3D Book Modal) */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-end">
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-3d-book', { detail: { bookId: 'volunteer' } }))}
                  className={`px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 group ${
                    themeColor === 'purple'
                      ? 'bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border-purple-500/40 hover:shadow-purple-500/20'
                      : 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border-cyan-500/40 hover:shadow-cyan-500/20'
                  }`}
                  title={isRTL ? 'عرض وتصفح الأطروحة الأكاديمية' : 'Open Published Academic Research Thesis'}
                >
                  <BookOpen size={14} className="group-hover:scale-110 transition-transform" />
                  <span>{isRTL ? 'تصفح الأطروحة الأكاديمية' : 'Thesis'}</span>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default memo(Volunteering);
