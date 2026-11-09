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
                <div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
                    <span className="px-3 py-1 rounded-full bg-slate-900 border border-cyan-500/30 text-cyan-300">
                        Brand: <strong>Omarmohamed-portfolio</strong>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Last Updated: November 2026 (Live Release v2.4)
                    </span>
                    <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300">
                        RHCSA Certified #250-068-707
                    </span>
                </div>
                <p className="text-sm text-surface/70">© {new Date().getFullYear()} Omarmohamed-portfolio — {personalInfo.name} ({personalInfo.fullName}). All rights reserved.</p>
            </div>
        </motion.footer>
    );
}

export default memo(Footer);