import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, Brain, Target, Clock, Lightbulb, Heart, Puzzle } from 'lucide-react';
import {
    titleVariant,
    containerVariant,
    itemVariant,
    getGridOrbitalVariant,
    viewportOptions
} from '../utils/animationVariants';
import useIsMobile from '../hooks/useIsMobile';

export default function SoftSkills({ isVisible, softSkills = {}, themeColor = 'cyan' }) {
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
        const iconMap = {
            'Leadership': Users,
            'Communication': MessageCircle,
            'Problem': Brain,
            'Goal': Target,
            'Time': Clock,
            'Creative': Lightbulb,
            'Emotional': Heart,
            'Adaptability': Puzzle,
            'Collaboration': Users,
            'Critical': Brain,
            'Teamwork': Users,
            'Interpersonal': Heart
        };

        for (const [key, Icon] of Object.entries(iconMap)) {
            if (category.includes(key)) return <Icon size={20} />;
        }
        return <Users size={20} />;
    };

    return (
        <motion.section
            id="soft-skills"
            className="py-24 px-6 scroll-mt-20"
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
                    <span className="text-surface">Soft</span> <span className="highlight">Skills</span>
                </motion.h2>

                {/* Phase 2: Content container with delayed staggered children */}
                <motion.div
                    variants={containerVariant}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {Object.entries(softSkills).map(([category, items], index) => (
                        <motion.div
                            key={index}
                            variants={getGridOrbitalVariant(index, gridColumns)}
                            whileHover={{ scale: 1.05, y: -3 }}
                            className={`ds-card rounded-xl p-6 ${borderHover} transition-all duration-500 hover:shadow-xl`}
                        >
                            <h3 className={`text-xl font-bold ${textColor} mb-4 flex items-center gap-2`}>
                                {getIcon(category)}
                                {category}
                            </h3>
                            <motion.div variants={containerVariant} className="flex flex-wrap gap-2">
                                {items.map((skill, i) => (
                                    <span key={i} className={`bg-white/10 px-3 py-1 rounded-full text-sm text-white ${skillHover}`}>
                                        {skill}
                                    </span>
                                ))}
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </motion.section>
    );
}
