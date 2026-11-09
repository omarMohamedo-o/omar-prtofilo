import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function DiscoveryForm({ isVisible = () => false, themeColor = 'cyan' }) {
    const { t, currentLocale } = useLanguage();
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
        (async () => {
            setStatus({ loading: true, message: null, error: null });
            try {
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
                    throw new Error(body.error || t('discoveryError'));
                }

                setStatus({ loading: false, message: t('discoverySuccess'), error: null });
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
                setStatus({ loading: false, message: null, error: err.message || t('discoveryError') });
            }
        })();
    };

    const services = currentLocale?.discoveryServices || [];

    return (
        <section id="discovery" className="py-24 px-6 scroll-mt-20">
            <div className="max-w-6xl mx-auto">
                <div className={`ds-card rounded-3xl p-8 md:p-12 ${isVisible('discovery') ? 'animate-fade-in-up' : 'opacity-0'}`}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left side - Text content */}
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center justify-center mb-0">
                                <span className={`${accentColor} text-sm font-semibold tracking-wider uppercase`}>
                                    {t('discoveryBadge')}
                                </span>
                            </div>
                            <h2 className="section-title text-gray-900 mt-1 mb-4 leading-tight">
                                {t('discoveryHeadline')}
                            </h2>
                            <p className="text-gray-700 text-lg leading-relaxed">
                                {t('discoverySubheadline')}
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
                                        placeholder={t('discoveryFirstName')}
                                        required
                                        className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 ${borderFocus} focus:ring-2 focus:outline-none transition-all duration-300`}
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder={t('discoveryLastName')}
                                        className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 ${borderFocus} focus:ring-2 focus:outline-none transition-all duration-300`}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        placeholder={t('discoveryCompanyName')}
                                        className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 ${borderFocus} focus:ring-2 focus:outline-none transition-all duration-300`}
                                    />
                                    <input
                                        type="email"
                                        name="businessEmail"
                                        value={formData.businessEmail}
                                        onChange={handleChange}
                                        placeholder={t('discoveryBusinessEmail')}
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
                                        placeholder={t('discoveryPhoneNumber')}
                                        required
                                        className={`w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 ${borderFocus} focus:ring-2 focus:outline-none transition-all duration-300`}
                                    />
                                    <div>
                                        <label className="block text-gray-700 text-sm mb-1">{t('discoveryServiceLabel')}</label>
                                        <select
                                            name="serviceOfInterest"
                                            value={formData.serviceOfInterest}
                                            onChange={handleChange}
                                            className={`w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 ${borderFocus} focus:ring-2 focus:outline-none transition-all duration-300 appearance-none cursor-pointer`}
                                        >
                                            <option value="" className="bg-white">{t('discoverySelectPlaceholder')}</option>
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
                                        {status.loading ? t('discoverySending') : t('discoverySubmitBtn')}
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
