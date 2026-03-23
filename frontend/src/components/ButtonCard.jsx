import React from 'react';
import { motion } from 'framer-motion';
import useIsMobile from '../hooks/useIsMobile';
import { itemVariant, itemVariantMobile } from '../utils/animationVariants';

export default function ButtonCard({ href, external = false, className = '', icon, children, variants, onClick }) {
    const isMobile = useIsMobile();
    const defaultVariant = variants || (isMobile ? itemVariantMobile : itemVariant);

    return (
        <motion.a
            variants={defaultVariant}
            whileHover={{ scale: 1.05 }}
            href={href}
            onClick={onClick}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className={`flex items-center justify-center gap-2 px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-xs sm:text-sm lg:text-base transition-all duration-300 hover:shadow-lg glow-btn ${className}`}
        >
            {icon}
            {children}
        </motion.a>
    );
}
