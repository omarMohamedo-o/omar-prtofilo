import React from 'react';
import { motion } from 'framer-motion';
import { titleVariant, containerVariant, viewportOptions } from '../utils/animationVariants';

export default function SectionWrapper({ id, titleLeft, titleRight, children, className = '', childrenWrapperClassName = '' }) {
    return (
        <motion.section id={id} initial="hidden" whileInView="show" viewport={viewportOptions} className={className}>
            <motion.h2 variants={titleVariant} className="section-title">
                <span className="text-surface">{titleLeft}</span> <span className="highlight">{titleRight}</span>
            </motion.h2>
            <motion.div variants={containerVariant} className={childrenWrapperClassName}>{children}</motion.div>
        </motion.section>
    );
}
