import React from 'react';
import { motion } from 'framer-motion';
import {
    getOrbitalItemVariant,
    getGridOrbitalVariant,
    containerVariant,
    itemVariant
} from '../utils/animationVariants';
import { getOptimizedImagePath } from '../utils/imageOptimization';
import SectionWrapper from './SectionWrapper';
import ButtonCard from './ButtonCard';
import useIsMobile from '../hooks/useIsMobile';
import PreviewableImage from './PreviewableImage';
import { useLanguage } from '../context/LanguageContext';

export function getImagePath(item) {
    let basePath = '';
    if (Array.isArray(item.images) && item.images.length) {
        basePath = `/images/certifications/${item.images[0]}`;
    } else if (item.image) {
        basePath = `/images/certifications/${item.image}`;
    } else {
        const slug = String(item.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        basePath = `/images/certifications/${slug}.png`;
    }
    return getOptimizedImagePath(basePath);
}

export function getImages(item) {
    let basePaths = [];
    if (Array.isArray(item.images) && item.images.length) {
        basePaths = item.images.map((f) => `/images/certifications/${f}`);
    } else if (item.image) {
        basePaths = [`/images/certifications/${item.image}`];
    } else {
        const slug = String(item.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        basePaths = [`/images/certifications/${slug}.png`];
    }
    return basePaths.map(path => getOptimizedImagePath(path));
}

export function handleImageError(e, name) {
    const slug = String(name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const fallback = getOptimizedImagePath(`/images/certifications/${slug}.png`);

    if (e.currentTarget.src.endsWith(fallback)) {
        e.currentTarget.onerror = null;
        e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="520" height="320"><rect width="100%" height="100%" fill="%230a0b10"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23666" font-family="system-ui" font-size="16">Image not available</text></svg>';
    } else {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallback;
    }
}

export function Certifications({ isVisible, certifications = [], themeColor = 'cyan' }) {
    const { t } = useLanguage();
    const isMobile = useIsMobile();
    const accentColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
    const borderHover = themeColor === 'purple' ? 'hover:border-purple-500/50' : 'hover:border-cyan-500/50';

    return (
        <SectionWrapper id="certifications" titleLeft={t('certificationsTitle1')} titleRight={t('certificationsTitle2')} childrenWrapperClassName="space-y-4 sm:space-y-6 lg:space-y-8">
            {certifications.map((cert, index) => (
                <motion.div
                    key={index}
                    variants={getOrbitalItemVariant(index, isMobile)}
                    whileHover={{ scale: 1.02, y: -3 }}
                    className={`relative ds-card rounded-xl p-4 sm:p-5 lg:p-6 card-orbital ${borderHover} transition-all duration-500 hover:shadow-lg`}
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="flex-shrink-0 sm:mr-4 lg:mr-6 pt-2 w-full sm:w-auto">
                            <PreviewableImage
                                src={getImagePath(cert)}
                                images={getImages(cert)}
                                alt={cert.name}
                                ariaLabel={`View ${cert.name} certificate`}
                                className="w-full sm:w-44 lg:w-52 h-auto max-h-[200px] sm:max-h-[140px] lg:max-h-[160px] object-contain bg-black/10 block"
                                wrapperClassName="w-full sm:w-auto"
                                onError={(e) => handleImageError(e, cert.name)}
                            />
                        </div>

                        <motion.div variants={containerVariant} className="flex-1 mt-3 sm:mt-0">
                            <motion.h3 variants={itemVariant} className={`text-lg sm:text-xl lg:text-2xl font-bold ${accentColor}`}>{cert.name}</motion.h3>
                            <motion.div variants={itemVariant} className="text-surface/80 text-sm sm:text-base font-semibold mt-1 sm:mt-2">
                                {Array.isArray(cert.issuerLinks) && cert.issuerLinks.length ? (
                                    cert.issuer
                                        .split('/')
                                        .map((part) => part.trim())
                                        .map((part, i) => (
                                            <span key={i}>
                                                {i > 0 && <span className="mx-1">/</span>}
                                                {cert.issuerLinks[i] ? (
                                                    <a href={cert.issuerLinks[i]} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                        {part}
                                                    </a>
                                                ) : (
                                                    part
                                                )}
                                            </span>
                                        ))
                                ) : cert.issuerLink ? (
                                    <a href={cert.issuerLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        {cert.issuer}
                                    </a>
                                ) : (
                                    cert.issuer
                                )}
                            </motion.div>
                            <motion.div variants={itemVariant} className="text-surface/70 text-xs sm:text-sm">{cert.date}</motion.div>
                        </motion.div>

                        <motion.div variants={containerVariant} className="mt-3 sm:mt-0 sm:ml-4 flex items-center gap-2">
                            {cert.pdf && (
                                <ButtonCard variants={itemVariant} href={cert.pdf} external className="bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold">
                                    PDF 📄
                                </ButtonCard>
                            )}
                            {cert.verified && (
                                <ButtonCard variants={itemVariant} href={cert.link} external className="bg-green-500/10 text-green-300 px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold">
                                    {t('verified')}
                                </ButtonCard>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            ))}
        </SectionWrapper>
    );
}

export function Courses({ isVisible, courses = [], themeColor = 'cyan' }) {
    const { t } = useLanguage();
    const isMobile = useIsMobile();
    const accentColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
    const borderHover = themeColor === 'purple' ? 'hover:border-purple-500/50' : 'hover:border-cyan-500/50';

    const gridColumns = isMobile ? 1 : 3;

    return (
        <SectionWrapper id="courses" titleLeft={t('coursesTitle1')} titleRight={t('coursesTitle2')} childrenWrapperClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {courses.map((course, index) => (
                <motion.div
                    key={index}
                    variants={getGridOrbitalVariant(index, gridColumns)}
                    whileHover={{ scale: 1.05, y: -3 }}
                    className={`ds-card rounded-xl p-4 sm:p-5 lg:p-6 card-orbital ${borderHover} transition-all duration-500 hover:shadow-lg`}
                >
                    <div className="relative">
                        <div className="flex items-center justify-center pt-2 mb-2">
                            <PreviewableImage
                                src={getImagePath(course)}
                                images={getImages(course)}
                                alt={course.name}
                                ariaLabel={`View ${course.name} certificate`}
                                className="w-full sm:w-48 lg:w-56 h-auto max-h-[200px] sm:max-h-[140px] lg:max-h-[160px] object-contain bg-black/10 block"
                                wrapperClassName="w-full sm:w-auto"
                                onError={(e) => handleImageError(e, course.name)}
                            />
                        </div>

                        <h3 className={`text-lg sm:text-xl font-bold ${accentColor}`}>{course.name}</h3>
                        <div className="text-surface/80 text-sm font-semibold mt-1 sm:mt-2 mb-1">
                            {Array.isArray(course.providerLinks) && course.providerLinks.length ? (
                                course.provider
                                    .split('/')
                                    .map((part) => part.trim())
                                    .map((part, i) => (
                                        <span key={i}>
                                            {i > 0 && <span className="mx-1">/</span>}
                                            {course.providerLinks[i] ? (
                                                <a href={course.providerLinks[i]} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                    {part}
                                                </a>
                                            ) : (
                                                part
                                            )}
                                        </span>
                                    ))
                            ) : course.providerLink ? (
                                <a href={course.providerLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {course.provider}
                                </a>
                            ) : (
                                course.provider
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-2 sm:mt-3">
                            <div className="text-surface/70 text-xs sm:text-sm">{course.date}</div>
                            {course.verified && (
                                <ButtonCard href={course.link} external className="bg-green-500/10 text-green-300 px-2 py-1 rounded-full text-xs font-semibold">
                                    ✓ Verified
                                </ButtonCard>
                            )}
                        </div>
                        {course.platform && <div className="text-gray-400 text-xs mt-2">on {course.platform}</div>}
                    </div>
                </motion.div>
            ))}
        </SectionWrapper>
    );
}

export default Certifications;
