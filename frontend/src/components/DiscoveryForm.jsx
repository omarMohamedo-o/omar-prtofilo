import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function DiscoveryForm({ isVisible = () => false, themeColor = 'cyan' }) {
    const { t, isRTL } = useLanguage();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        companyName: '',
        businessEmail: '',
        phoneNumber: '',
        serviceOfInterest: '',
        agreeToPrivacy: false
    });

    const accentColor = themeColor === 'purple' ? 'text-purple-400' : 'text-cyan-400';
    const gradientClasses = themeColor === 'purple'
        ? 'from-purple-400 to-pink-400'
        : 'from-blue-400 to-cyan-400';
    const buttonBg = themeColor === 'purple'
        ? 'bg-purple-500 hover:bg-purple-600'
        : 'bg-cyan-500 hover:bg-cyan-600';
    const borderFocus = themeColor === 'purple'
        ? 'focus:border-purple-500 focus:ring-purple-500/20'
        : 'focus:border-cyan-500 focus:ring-cyan-500/20';

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const [status, setStatus] = useState({ loading: false, message: null, error: null });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Send to backend API which will forward via SMTP
        (async () => {
            setStatus({ loading: true, message: null, error: null });
            try {
                // Discovery is served by the nginx-proxied local route in Docker,
                // and by the Vercel serverless function in production.
                const discoveryBase = import.meta.env.VITE_DISCOVERY_API_URL || '';
                const url = discoveryBase
                    ? `${discoveryBase.replace(/\/$/, '')}/discovery`
                    : '/api/discovery';
                console.debug('DiscoveryForm: POST', url);
                const resp = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (!resp.ok) {
                    const body = await resp.json().catch(() => ({}));
                    throw new Error(body.error || 'Server error');
                }

                setStatus({ loading: false, message: 'Thank you — your request was sent.', error: null });
                setFormData({
                    firstName: '',
                    lastName: '',
                    companyName: '',
                    businessEmail: '',
                    phoneNumber: '',
                    serviceOfInterest: '',
                    agreeToPrivacy: false
                });
            } catch (err) {
                console.error('Discovery submit error', err);
                setStatus({ loading: false, message: null, error: err.message || 'Failed to send' });
            }
        })();
    };

    const servicesEn = [
        'DevOps Consulting',
        'MLOps Implementation',
        'Cloud Architecture',
        'CI/CD Pipeline Setup',
        'Infrastructure Automation',
        'AI/ML Solutions',
        'Other'
    ];

    const servicesAr = [
        'استشارات DevOps وهندسة السحابة',
        'تطبيق وبناء أنظمة MLOps',
        'تصميم المعمارية السحابية',
        'إعداد وأتمتة مسارات CI/CD',
        'أتمتة البنية التحتية (IaC)',
        'حلول ونماذج الذكاء الاصطناعي (AI/ML)',
        'استشارة تقنية أخرى'
    ];

    const services = isRTL ? servicesAr : servicesEn;

    return (
        <section id="discovery" className="py-24 px-6 scroll-mt-20">
            <div className="max-w-6xl mx-auto">
                <div className={`ds-card rounded-3xl p-8 md:p-12 ${isVisible('discovery') ? 'animate-fade-in-up' : 'opacity-0'}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left side - Text content */}
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center justify-center mb-0">
                                <span className={`${accentColor} text-sm font-semibold tracking-wider uppercase`}>
                                    {isRTL ? 'حجز استشارة مباشرة' : 'Get in Touch'}
                                </span>
                            </div>
                            <h2 className="section-title text-gray-900 mt-1 mb-4 leading-tight">
                                {isRTL 
                                    ? 'هل تحتاج خطط نموك التقنية إلى استشارات موثوقة، وسرعة في الوصول للإنتاج، وحلول اقتصادية؟'
                                    : 'Do your growth plans need reliable insights, quicker time-to-market, or affordable solutions?'}
                            </h2>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                {isRTL 
                                    ? 'يساعدك التعاون المباشر بين الخبرة الهندسية وتطبيقات الذكاء الاصطناعي على حل التحديات البرمجية وبناء بنية تحتية سحابية مرنة بكفاءة وتكلفة مدروسة.'
                                    : 'My unique Human-AI synergy can help you tackle your business challenges, in a way that is better, faster and more cost effective than any traditional approach.'}
                            </p>
                        </div>

                        {/* Right side - Form */}
                        <div className="flex flex-col justify-center">
                            <form onSubmit={handleSubmit} className="space-y-5 pt-6 pb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder={isRTL ? "الاسم الأول*" : "First Name*"}
                                        required
                                        className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 ${borderFocus} focus:ring-2 focus:outline-none transition-all duration-300`}
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder={isRTL ? "اسم العائلة" : "Last Name"}
                                        className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 ${borderFocus} focus:ring-2 focus:outline-none transition-all duration-300`}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder={isRTL ? "اسم الشركة / المؤسسة" : "Company Name"}
                                        className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 ${borderFocus} focus:ring-2 focus:outline-none transition-all duration-300`}
                                    />
                                    <input
                                        type="email"
                                        name="businessEmail"
                                        value={formData.businessEmail}
                                        onChange={handleChange}
                                        placeholder={isRTL ? "البريد الإلكتروني المهني*" : "Business Email*"}
                                        required
                                        className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 ${borderFocus} focus:ring-2 focus:outline-none transition-all duration-300`}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder={isRTL ? "رقم الهاتف / واتساب*" : "Phone Number*"}
                                        required
                                        className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 ${borderFocus} focus:ring-2 focus:outline-none transition-all duration-300`}
                                    />
                                    <div>
                                        <label className="block text-gray-700 text-sm mb-1">{isRTL ? "الخدمة المطلوبة*" : "Service of interest*"}</label>
                                        <select
                                            name="serviceOfInterest"
                                            value={formData.serviceOfInterest}
                                            onChange={handleChange}
                                            className={`w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 ${borderFocus} focus:ring-2 focus:outline-none transition-all duration-300 appearance-none cursor-pointer`}
                                        >
                                            <option value="" className="bg-white">{isRTL ? "يرجى الاختيار" : "Please Select"}</option>
                                            {services.map((service, index) => (
                                                <option key={index} value={service} className="bg-white text-gray-900">
                                                    {service}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <button
                                        type="submit"
                                        disabled={status.loading}
                                        className={`w-full md:w-auto px-8 py-3 ${buttonBg} text-white font-semibold rounded-lg transition-all duration-300 transform ${status.loading ? 'opacity-60 cursor-wait' : 'hover:scale-105 hover:shadow-lg'} border border-transparent glow-btn`}
                                    >
                                        {status.loading 
                                            ? (isRTL ? 'جاري الإرسال...' : 'Sending…') 
                                            : (isRTL ? 'حجز استشارة تقنية' : 'Book a Discovery Call')}
                                    </button>
                                    <div className="mt-2 sm:mt-0">
                                        {status.message && <div className="text-green-500 font-medium">{status.message}</div>}
                                        {status.error && <div className="text-red-400 font-medium">{status.error}</div>}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
