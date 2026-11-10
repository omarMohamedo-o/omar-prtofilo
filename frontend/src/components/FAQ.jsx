import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function FAQ({ isVisible, themeColor = 'cyan' }) {
    const { t, isRTL } = useLanguage();
    // All FAQ items closed by default
    const [openIndex, setOpenIndex] = useState(null);

    const items = t('faqItems') || [];

    const toggleFAQ = (index) => {
        setOpenIndex((prev) => (prev === index ? -1 : index));
    };

    const isPurple = themeColor === 'purple';
    const accentText = isPurple ? 'text-purple-400' : 'text-cyan-400';
    const activeBorder = isPurple
        ? 'border-purple-500/50 shadow-lg shadow-purple-500/10'
        : 'border-cyan-500/50 shadow-lg shadow-cyan-500/10';
    const activeBtn = isPurple
        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
        : 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30';

    return (
        <section id="faq" className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-20">
            <div className="max-w-4xl mx-auto">
                {/* Section Header: FAQS */}
                <div className="text-center mb-10 sm:mb-14">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight uppercase">
                        FA<span className={accentText}>QS</span>
                    </h2>
                    <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                        {t('faqSubtitle')}
                    </p>
                </div>

                {/* FAQ Accordion List */}
                <div className="space-y-4">
                    {items.map((item, index) => {
                        const num = String(index + 1).padStart(2, '0');
                        const isOpen = openIndex === index;

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={`rounded-2xl border transition-all duration-300 backdrop-blur-md overflow-hidden ${
                                    isOpen
                                        ? `bg-slate-900/90 ${activeBorder}`
                                        : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700/90'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between gap-4 text-left rtl:text-right transition-colors focus:outline-none cursor-pointer"
                                    aria-expanded={isOpen}
                                >
                                    <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
                                        <span className="font-mono text-base sm:text-lg font-bold text-slate-400 tracking-wider flex-shrink-0">
                                            {num}
                                        </span>
                                        <span className="text-base sm:text-lg font-semibold text-white leading-snug">
                                            {item.q}
                                        </span>
                                    </div>

                                    <div
                                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                                            isOpen
                                                ? activeBtn
                                                : 'bg-slate-800/90 text-slate-300 border border-slate-700/60 hover:bg-slate-700/90 hover:text-white'
                                        }`}
                                    >
                                        {isOpen ? (
                                            <Minus size={18} strokeWidth={2.5} />
                                        ) : (
                                            <Plus size={18} strokeWidth={2.5} />
                                        )}
                                    </div>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 border-t border-slate-800/50">
                                                <div className="ps-8 sm:ps-12 rtl:ps-0 rtl:pe-8 rtl:sm:pe-12 text-slate-300 text-sm sm:text-base leading-relaxed">
                                                    {item.a}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default memo(FAQ);
