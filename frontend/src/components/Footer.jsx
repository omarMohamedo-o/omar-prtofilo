import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Phone, BadgeCheck, FileText } from 'lucide-react';

const Footer = function Footer({ personalInfo = {}, themeColor = 'cyan' }) {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="py-12 px-6 border-t border-gray-800/50 bg-deepSpace/80 backdrop-blur-md relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-cyanGlow/5 to-transparent pointer-events-none" />
            <div className="max-w-6xl mx-auto text-center relative z-10">
                <div className="flex justify-center gap-4 mb-4">
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-surface/90 hover:text-surface transition-all duration-300 transform hover:scale-110 glow-btn p-2 rounded-lg">
                        <Linkedin size={24} />
                    </a>
                    <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-surface/90 hover:text-surface transition-all duration-300 transform hover:scale-110 glow-btn p-2 rounded-lg">
                        <Github size={24} />
                    </a>
                    <a href={personalInfo.credly} target="_blank" rel="noopener noreferrer" className="text-surface/90 hover:text-surface transition-all duration-300 transform hover:scale-110 glow-btn p-2 rounded-lg">
                        <BadgeCheck size={24} />
                    </a>
                    {personalInfo.resume && (
                        <a href={personalInfo.resume} target="_blank" rel="noopener noreferrer" className="text-surface/90 hover:text-surface transition-all duration-300 transform hover:scale-110 glow-btn p-2 rounded-lg">
                            <FileText size={24} />
                        </a>
                    )}
                    <a href={`mailto:${personalInfo.email}`} className="text-surface/90 hover:text-surface transition-all duration-300 transform hover:scale-110 glow-btn p-2 rounded-lg">
                        <Mail size={24} />
                    </a>
                    <a href={`tel:${personalInfo.phone?.replace(/\s/g, '')}`} className="text-surface/90 hover:text-surface transition-all duration-300 transform hover:scale-110 glow-btn p-2 rounded-lg">
                        <Phone size={24} />
                    </a>
                </div>
                <p className="text-sm text-surface/70">© {new Date().getFullYear()} {personalInfo.name}</p>
            </div>
        </motion.footer>
    );
}

export default memo(Footer);