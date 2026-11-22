import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, MessageSquarePlus, CheckCircle2, Quote, Award,
    GraduationCap, Briefcase, Building, X, Sparkles, User, HeartHandshake
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { INITIAL_RECOMMENDATIONS } from '../data/testimonialsData';
import {
    titleVariant,
    containerVariant,
    getOrbitalItemVariant,
    viewportOptions
} from '../utils/animationVariants';
import useIsMobile from '../hooks/useIsMobile';

const STORAGE_KEY = 'portfolio_custom_recommendations_v1';

export default function Testimonials({ isVisible, themeColor = 'cyan' }) {
    const { isRTL, t } = useLanguage();
    const isMobile = useIsMobile();
    const [activeTab, setActiveTab] = useState('all');
    const [recommendations, setRecommendations] = useState(INITIAL_RECOMMENDATIONS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Form inputs state
    const [formName, setFormName] = useState('');
    const [formRole, setFormRole] = useState('');
    const [formOrg, setFormOrg] = useState('');
    const [formCategory, setFormCategory] = useState('colleagues');
    const [formRating, setFormRating] = useState(5);
    const [formText, setFormText] = useState('');
    const [formError, setFormError] = useState('');

    const textColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
    const borderHover = themeColor === 'purple' ? 'hover:border-purple-500/50' : 'hover:border-cyan-500/50';
    const bgAccent = themeColor === 'purple' ? 'bg-purple-500' : 'bg-cyan-500';

    // Unique IDs for accessible form controls
    const nameInputId = useId();
    const roleInputId = useId();
    const orgInputId = useId();
    const categorySelectId = useId();
    const textInputId = useId();

    // Load any user-submitted recommendations from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setRecommendations([...parsed, ...INITIAL_RECOMMENDATIONS]);
                }
            }
        } catch {
            // LocalStorage fallback
        }
    }, []);

    // Filter by active category
    const filteredList = recommendations.filter((item) => {
        if (activeTab === 'all') return true;
        return item.category === activeTab;
    });

    // Counts for tabs
    const getCount = (cat) => {
        if (cat === 'all') return recommendations.length;
        return recommendations.filter((r) => r.category === cat).length;
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setFormError('');

        if (!formName.trim()) {
            setFormError(isRTL ? 'يرجى إدخال اسمك الكامل' : 'Please enter your full name');
            return;
        }
        if (!formRole.trim()) {
            setFormError(isRTL ? 'يرجى إدخال المسمى الوظيفي أو الأكاديمي' : 'Please enter your role or title');
            return;
        }
        if (!formOrg.trim()) {
            setFormError(isRTL ? 'يرجى إدخال اسم المؤسسة أو الجامعة' : 'Please enter your organization or university');
            return;
        }
        if (!formText.trim() || formText.trim().length < 15) {
            setFormError(isRTL ? 'يرجى كتابة نص التوصية (15 حرفاً على الأقل)' : 'Please enter your recommendation (at least 15 characters)');
            return;
        }

        // Generate initials
        const parts = formName.trim().split(/\s+/);
        const initials = parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0].slice(0, 2).toUpperCase();

        const newRec = {
            id: `custom-rec-${Date.now()}`,
            name: formName.trim(),
            roleEn: formRole.trim(),
            roleAr: formRole.trim(),
            org: formOrg.trim(),
            category: formCategory,
            rating: formRating,
            date: isRTL ? 'مؤخراً' : 'Just now',
            verified: true,
            isUserSubmitted: true,
            avatarText: initials,
            avatarBg: 'from-cyan-600 to-blue-600',
            badgeEn: 'Verified Recommendation',
            badgeAr: 'توصية موثقة جديدة',
            textEn: formText.trim(),
            textAr: formText.trim()
        };

        const updated = [newRec, ...recommendations];
        setRecommendations(updated);

        // Save custom items to localStorage
        try {
            const savedCustom = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            localStorage.setItem(STORAGE_KEY, JSON.stringify([newRec, ...savedCustom]));
        } catch {
            // Ignore storage errors
        }

        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setIsModalOpen(false);
            // Reset form
            setFormName('');
            setFormRole('');
            setFormOrg('');
            setFormText('');
            setFormRating(5);
        }, 1800);
    };

    return (
        <motion.section
            id="recommendations"
            className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 scroll-mt-20 relative"
            initial="hidden"
            whileInView="show"
            viewport={viewportOptions}
        >
            <div className="max-w-7xl mx-auto">
                {/* ========================================================= */}
                {/* SECTION HEADER & ADD BUTTON ROW                           */}
                {/* ========================================================= */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
                    <div>
                        <motion.h2 variants={titleVariant} className="section-title text-start mb-2">
                            <span className="text-surface">{isRTL ? 'آراء وتوصيات' : 'Recommendations &'}</span>{' '}
                            <span className="highlight">{isRTL ? 'الشركاء والأساتذة' : 'Endorsements'}</span>
                        </motion.h2>
                        <p className="text-gray-400 text-sm sm:text-base max-w-2xl">
                            {isRTL
                                ? 'توصيات وتقييمات موثقة من المشرفين الأكاديميين وزملاء الفرق الهندسية وعملاء المشاريع.'
                                : 'Verified testimonials from academic supervisors, engineering teammates, and enterprise clients.'}
                        </p>
                    </div>

                    {/* Action Button: Add a Recommendation */}
                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setIsModalOpen(true)}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm shadow-lg transition-all cursor-pointer ${
                            themeColor === 'purple'
                                ? 'bg-purple-500 hover:bg-purple-400 text-slate-950 shadow-purple-500/25'
                                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
                        }`}
                        title={isRTL ? 'شارك توصيتك أو تقييمك' : 'Share your recommendation or review'}
                    >
                        <MessageSquarePlus size={16} />
                        <span>{isRTL ? '+ أضف توصية أو تقييم' : '+ Leave a Recommendation'}</span>
                    </motion.button>
                </div>

                {/* ========================================================= */}
                {/* CATEGORY FILTER TABS                                      */}
                {/* ========================================================= */}
                <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
                    {[
                        { id: 'all', labelEn: 'All', labelAr: 'الكل' },
                        { id: 'professors', labelEn: 'Professors & Supervisors', labelAr: 'الأساتذة والمشرفون', icon: GraduationCap },
                        { id: 'colleagues', labelEn: 'Teammates & Colleagues', labelAr: 'زملاء العمل والفرق', icon: Briefcase },
                        { id: 'clients', labelEn: 'Enterprise Clients', labelAr: 'العملاء والشركاء', icon: Building },
                        { id: 'students', labelEn: 'Students & Mentees', labelAr: 'الطلاب والمتدربون', icon: User }
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const count = getCount(tab.id);
                        const isSelected = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                                    isSelected
                                        ? `${bgAccent} text-slate-950 font-bold shadow-md`
                                        : 'bg-white/[0.04] text-gray-300 hover:bg-white/[0.08] hover:text-white border border-white/5'
                                }`}
                            >
                                {Icon && <Icon size={14} />}
                                <span>{isRTL ? tab.labelAr : tab.labelEn}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                                    isSelected ? 'bg-black/20 text-slate-950 font-bold' : 'bg-white/10 text-gray-400'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ========================================================= */}
                {/* TESTIMONIALS MASONRY GRID                                 */}
                {/* ========================================================= */}
                <motion.div
                    variants={containerVariant}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {filteredList.map((item, index) => (
                        <motion.div
                            key={item.id}
                            variants={getOrbitalItemVariant(index, isMobile)}
                            whileHover={{ scale: 1.02, y: -4 }}
                            className={`ds-card rounded-2xl p-6 sm:p-7 border border-gray-800 ${borderHover} transition-all duration-300 flex flex-col justify-between relative overflow-hidden group shadow-xl bg-gradient-to-br from-[#0c1220]/90 to-[#070b14]/90`}
                        >
                            {/* Decorative Background Quote Icon */}
                            <Quote
                                size={70}
                                className="absolute -top-3 -right-2 text-white/[0.03] pointer-events-none group-hover:text-white/[0.06] transition-colors"
                            />

                            <div>
                                {/* Top: Author Header & Badge */}
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar Initials Circle */}
                                        <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${item.avatarBg || 'from-cyan-600 to-blue-600'} flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}>
                                            {item.avatarText}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <h3 className="font-bold text-white text-sm sm:text-base">{item.name}</h3>
                                                {item.verified && (
                                                    <CheckCircle2 size={14} className={textColor} title="Verified Endorsement" />
                                                )}
                                            </div>
                                            <p className="text-gray-400 text-xs leading-tight mt-0.5 line-clamp-1">
                                                {isRTL ? item.roleAr : item.roleEn}
                                            </p>
                                            <p className="text-gray-500 text-[11px] font-mono mt-0.5 truncate max-w-[210px]">
                                                {item.org}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="flex items-center gap-0.5 text-amber-400 flex-shrink-0 pt-1">
                                        {[...Array(item.rating || 5)].map((_, i) => (
                                            <Star key={i} size={12} fill="currentColor" />
                                        ))}
                                    </div>
                                </div>

                                {/* Highlight Tag */}
                                {(item.badgeEn || item.badgeAr) && (
                                    <div className="mb-3.5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                            themeColor === 'purple'
                                                ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                                                : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                                        }`}>
                                            <Award size={11} />
                                            <span>{isRTL ? item.badgeAr : item.badgeEn}</span>
                                        </span>
                                    </div>
                                )}

                                {/* Recommendation Prose */}
                                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed italic mb-4 font-normal">
                                    "{isRTL ? item.textAr : item.textEn}"
                                </p>
                            </div>

                            {/* Card Footer: Date & Category Tag */}
                            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                                <span>{item.date}</span>
                                <span className="uppercase text-[10px] tracking-wider text-gray-400">
                                    {item.category}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* ============================================================= */}
            {/* INTERACTIVE "+ LEAVE A RECOMMENDATION" MODAL                   */}
            {/* ============================================================= */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg rounded-2xl bg-[#0b1220] border border-slate-700/80 shadow-2xl overflow-hidden p-5 sm:p-7"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>

                            {!isSubmitted ? (
                                <form onSubmit={handleFormSubmit}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles size={18} className={textColor} />
                                        <h3 className="text-lg sm:text-xl font-bold text-white">
                                            {isRTL ? 'مشاركة توصية أو تقييم مهني' : 'Share Your Recommendation'}
                                        </h3>
                                    </div>
                                    <p className="text-gray-400 text-xs sm:text-sm mb-5">
                                        {isRTL
                                            ? 'رأيك وتوصيتك المهنية كأستاذ أو زميل عمل أو عميل موضع تقدير واعتزاز كبير.'
                                            : 'Your endorsement as a professor, engineering teammate, or client is deeply valued.'}
                                    </p>

                                    {formError && (
                                        <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold">
                                            {formError}
                                        </div>
                                    )}

                                    {/* Name Field */}
                                    <div className="mb-3.5">
                                        <label htmlFor={nameInputId} className="block text-xs font-semibold text-gray-300 mb-1">
                                            {isRTL ? 'الاسم الكامل *' : 'Your Full Name *'}
                                        </label>
                                        <input
                                            id={nameInputId}
                                            type="text"
                                            value={formName}
                                            onChange={(e) => setFormName(e.target.value)}
                                            placeholder={isRTL ? 'مثال: د. أحمد خالد / م. كريم حسن' : 'e.g. Dr. Jane Smith / Eng. Alex Taylor'}
                                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                                            required
                                        />
                                    </div>

                                    {/* Role & Org Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
                                        <div>
                                            <label htmlFor={roleInputId} className="block text-xs font-semibold text-gray-300 mb-1">
                                                {isRTL ? 'المسمى الوظيفي أو الأكاديمي *' : 'Role / Title *'}
                                            </label>
                                            <input
                                                id={roleInputId}
                                                type="text"
                                                value={formRole}
                                                onChange={(e) => setFormRole(e.target.value)}
                                                placeholder={isRTL ? 'مثال: أستاذ حاسبات / مهندس DevOps' : 'e.g. Senior Cloud Architect / Professor'}
                                                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor={orgInputId} className="block text-xs font-semibold text-gray-300 mb-1">
                                                {isRTL ? 'الجهة أو الجامعة *' : 'Organization / University *'}
                                            </label>
                                            <input
                                                id={orgInputId}
                                                type="text"
                                                value={formOrg}
                                                onChange={(e) => setFormOrg(e.target.value)}
                                                placeholder={isRTL ? 'مثال: جامعة الإسكندرية / شركة تقنية' : 'e.g. Tech Corp / University'}
                                                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Relationship Category & Rating */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
                                        <div>
                                            <label htmlFor={categorySelectId} className="block text-xs font-semibold text-gray-300 mb-1">
                                                {isRTL ? 'طبيعة العلاقة المهنية' : 'Relationship with Omar'}
                                            </label>
                                            <select
                                                id={categorySelectId}
                                                value={formCategory}
                                                onChange={(e) => setFormCategory(e.target.value)}
                                                className="w-full px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500 cursor-pointer"
                                            >
                                                <option value="professors">{isRTL ? 'أستاذ / مشرف أكاديمي' : 'Professor / Academic Advisor'}</option>
                                                <option value="colleagues">{isRTL ? 'زميل عمل / عضو فريق' : 'Teammate / Engineering Colleague'}</option>
                                                <option value="clients">{isRTL ? 'عميل / شريك مشروع' : 'Enterprise Client / Partner'}</option>
                                                <option value="students">{isRTL ? 'طالب / متدرب' : 'Student / Mentee'}</option>
                                            </select>
                                        </div>

                                        <div>
                                            <span className="block text-xs font-semibold text-gray-300 mb-1">
                                                {isRTL ? 'التقييم' : 'Rating'}
                                            </span>
                                            <div className="flex items-center gap-1 py-1.5">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setFormRating(star)}
                                                        className="text-amber-400 hover:scale-125 transition-transform cursor-pointer"
                                                    >
                                                        <Star
                                                            size={20}
                                                            fill={star <= formRating ? 'currentColor' : 'none'}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recommendation Text */}
                                    <div className="mb-5">
                                        <label htmlFor={textInputId} className="block text-xs font-semibold text-gray-300 mb-1">
                                            {isRTL ? 'نص التوصية أو التقييم *' : 'Your Recommendation or Review *'}
                                        </label>
                                        <textarea
                                            id={textInputId}
                                            rows={4}
                                            value={formText}
                                            onChange={(e) => setFormText(e.target.value)}
                                            placeholder={isRTL ? 'اكتب رأيك وتجربتك المهنية أو الأكاديمية مع المهندس عمر...' : 'Share your professional experience working, researching, or collaborating with Omar...'}
                                            className="w-full px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                                            required
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className={`w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg transition-all cursor-pointer ${
                                            themeColor === 'purple'
                                                ? 'bg-purple-500 hover:bg-purple-400 text-slate-950 shadow-purple-500/25'
                                                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
                                        }`}
                                    >
                                        {isRTL ? 'إرسال ونشر التوصية' : 'Submit Recommendation'}
                                    </button>
                                </form>
                            ) : (
                                /* Success Feedback */
                                <div className="py-8 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3 shadow-lg animate-bounce">
                                        <CheckCircle2 size={36} />
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-1">
                                        {isRTL ? 'تمت إضافة توصيتك بنجاح!' : 'Recommendation Added!'}
                                    </h4>
                                    <p className="text-gray-300 text-xs sm:text-sm max-w-xs">
                                        {isRTL
                                            ? 'شكراً جزيلاً لدعمك وشهادتك المهنية القيمة التي تعني الكثير.'
                                            : 'Thank you for your valuable endorsement. It is now featured in the recommendations section.'}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.section>
    );
}
