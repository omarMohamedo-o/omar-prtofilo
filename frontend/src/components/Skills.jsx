import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Code, Server, Shield, Brain, Database, Terminal, Cpu, Layers, GitBranch, Package, Image, BarChart2, MessageSquare, Archive } from 'lucide-react';
import {
    titleVariant,
    containerVariant,
    itemVariant,
    getGridOrbitalVariant,
    viewportOptions
} from '../utils/animationVariants';
import { Camera } from 'lucide-react';
import useIsMobile from '../hooks/useIsMobile';
import { useLanguage } from '../context/LanguageContext';

export default function Skills({ isVisible, skills = {}, themeColor = 'cyan' }) {
    const { t } = useLanguage();
    const isMobile = useIsMobile();
    const textColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
    const borderHover = themeColor === 'purple'
        ? 'hover:border-purple-500/50 hover:shadow-purple-500/10'
        : 'hover:border-cyan-500/50 hover:shadow-cyan-500/10';
    const skillHover = themeColor === 'purple'
        ? 'hover:bg-purple-500/20 hover:text-purple-400'
        : 'hover:bg-cyan-500/20 hover:text-cyan-400';

    // Grid columns for orbital direction calculation
    const gridColumns = isMobile ? 1 : 3;

    const getIcon = (category) => {
        if (typeof category !== 'string') return <Code size={20} />;
        const key = category.trim().toLowerCase();

        if (key.includes('llm') || key.includes('generative') || key.includes('توليدي') || key.includes('لغة')) return <Brain size={20} />;
        if (key.includes('nlp') || key.includes('speech') || key.includes('صوت') || key.includes('لغات')) return <MessageSquare size={20} />;
        if (key.includes('machine learning') || key.includes('ml &') || key.includes('تعلم الآلة')) return <Brain size={20} />;
        if (key.includes('cloud') || key.includes('سحاب')) return <Cloud size={20} />;
        if (key.includes('container') || key.includes('orchestration') || key.includes('حاويات')) return <Layers size={20} />;
        if (key.includes('infrastructure') || key.includes('iac') || key.includes('بنية')) return <Package size={20} />;
        if (key.includes('ci/cd') || key.includes('delivery') || key.includes('automation') || key.includes('تكامل')) return <Terminal size={20} />;
        if (key.includes('security') || key.includes('secret') || key.includes('أمان')) return <Shield size={20} />;
        if (key.includes('observability') || key.includes('monitor') || key.includes('test') || key.includes('eval') || key.includes('llmops') || key.includes('مراقبة')) return <BarChart2 size={20} />;
        if (key.includes('database') || key.includes('vector') || key.includes('availability') || key.includes('قواعد')) return <Database size={20} />;
        if (key.includes('operating') || key.includes('linux') || key.includes('server') || key.includes('تشغيل')) return <Server size={20} />;
        if (key.includes('programming') || key.includes('code') || key.includes('scripting') || key.includes('برمج')) return <Code size={20} />;
        if (key.includes('vision') || key.includes('image') || key.includes('رؤية')) return <Camera size={20} />;
        if (key.includes('mlops')) return <Cpu size={20} />;
        return <Code size={20} />;
    };

    return (
        <motion.section
            id="skills"
            className="py-16 sm:py-20 lg:py-24 ds-section scroll-mt-20"
            initial="hidden"
            whileInView="show"
            viewport={viewportOptions}
        >
            <div className="container">
                <motion.h2
                    variants={titleVariant}
                    className="section-title"
                >
                    <span className="text-surface">{t('skillsTitle1')}</span> <span className="highlight">{t('skillsTitle2')}</span>
                </motion.h2>

                <motion.div
                    variants={containerVariant}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
                >
                    {Object.entries(skills).map(([category, items], index) => (
                        <motion.div
                            key={index}
                            variants={getGridOrbitalVariant(index, gridColumns)}
                            whileHover={{ scale: 1.05, y: -3 }}
                            className={`ds-card rounded-xl p-4 sm:p-5 lg:p-6 ${borderHover} transition-all duration-500 hover:shadow-xl`}
                        >
                            <h3 className={`text-lg sm:text-xl font-bold ${textColor} mb-3 sm:mb-4 flex items-center gap-2`}>
                                {getIcon(category)}
                                {category}
                            </h3>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {items.map((skill, i) => (
                                    <span
                                        key={i}
                                        className={`bg-white/10 px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-white ${skillHover}`}
                                    >
                                        {skill}
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
