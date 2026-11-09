import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, BadgeCheck, FileText, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  titleVariant,
  containerVariant,
  itemVariant,
  viewportOptions
} from '../utils/animationVariants';

export function Contact({ isVisible, personalInfo = {}, themeColor = 'cyan' }) {
  const { t } = useLanguage();
  const accentColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
  const mapsUrl = personalInfo.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(personalInfo.location)}` : null;

  // Build contact links array for sequential animation
  const contactLinks = [
    personalInfo.email && {
      href: `mailto:${personalInfo.email}`,
      className: "bg-cyan-600 hover:bg-cyan-500 text-white min-w-[120px] sm:min-w-[140px]",
      icon: <Mail size={18} className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />,
      label: <span className="truncate max-w-[100px] sm:max-w-[150px] lg:max-w-none">{personalInfo.email}</span>,
      external: false
    },
    personalInfo.phone && {
      href: `tel:${personalInfo.phone?.replace(/\s/g, '')}`,
      className: "bg-green-600 hover:bg-green-500 text-white",
      icon: <Phone size={18} className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />,
      label: <span className="truncate">{personalInfo.phone}</span>,
      external: false
    },
    mapsUrl && {
      href: mapsUrl,
      className: "bg-sky-600 hover:bg-sky-500 text-white",
      icon: <MapPin size={18} className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />,
      label: t('locationLabel'),
      external: true
    },
    personalInfo.linkedin && {
      href: personalInfo.linkedin,
      className: "bg-blue-600 hover:bg-blue-500 text-white",
      icon: <Linkedin size={18} className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />,
      label: "LinkedIn",
      external: true
    },
    personalInfo.github && {
      href: personalInfo.github,
      className: "bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-800",
      icon: <Github size={18} className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />,
      label: "GitHub",
      external: true
    },
    personalInfo.credly && {
      href: personalInfo.credly,
      className: "bg-orange-600 hover:bg-orange-500 text-white",
      icon: <BadgeCheck size={18} className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />,
      label: t('badgesLabel'),
      external: true
    },
    personalInfo.resume && {
      href: personalInfo.resume,
      className: "bg-red-600 hover:bg-red-500 text-white",
      icon: <FileText size={18} className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />,
      label: t('resume'),
      external: true
    }
  ].filter(Boolean);

  return (
    <motion.section
      id="contact"
      className="py-16 sm:py-20 lg:py-24 ds-section scroll-mt-20"
      initial="hidden"
      whileInView="show"
      viewport={viewportOptions}
    >
      <div className="container max-w-4xl text-center">
        {/* Phase 1: Title appears first (standalone) */}
        <motion.h2
          variants={titleVariant}
          className="section-title"
        >
          <span className="text-surface">{t('contactTitle1')}</span> <span className="highlight">{t('contactTitle2')}</span>
        </motion.h2>

        {/* Phase 2: Content container with delayed staggered children */}
        <motion.div variants={containerVariant}>
          <motion.p
            variants={itemVariant}
            className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 lg:mb-10 leading-relaxed px-2"
          >
            {t('contactSubtitle')}
          </motion.p>

          <motion.div
            variants={containerVariant}
            className="flex flex-wrap justify-center gap-2.5 sm:gap-3 lg:gap-4"
          >
            {contactLinks.map((link, index) => (
              <motion.a
                key={index}
                variants={itemVariant}
                whileHover={{ scale: 1.05 }}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className={`flex items-center justify-center gap-2 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 hover:shadow-lg glow-btn ${link.className}`}
              >
                {link.icon}
                {typeof link.label === 'string' ? <span>{link.label}</span> : link.label}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
export default Contact;
