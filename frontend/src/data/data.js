/**
 * Main Portfolio Data Aggregator
 * ================================
 * Combines shared data with mode-specific data
 */

import * as shared from './shareddata';
import * as arabic from './arabicData';

// Import DevOps-specific data
import {
    devopsPersonalInfo,
    devopsSkills,
    devopsSoftSkills,
    devopsProjects,
    devopsCertifications,
    devopsCourses,
    devopsAboutMe
} from './devopsdata';

// Import ML/NLP-specific data
import {
    mlnlpPersonalInfo,
    mlnlpSkills,
    mlnlpSoftSkills,
    mlnlpProjects,
    mlnlpCertifications,
    mlnlpCourses,
    mlnlpAboutMe
} from './ml&nlpdata';

// Re-export MODES from shared data
export const MODES = shared.MODES;

// Mode information for UI
export const modeInfo = {
    [MODES.DEVOPS]: {
        label: 'DevOps & MLOps',
        description: 'MLOps & Cloud DevOps Engineer',
        labelAr: 'DevOps و MLOps',
        descriptionAr: 'مهندس MLOps والسحابة'
    },
    [MODES.MLNLP]: {
        label: 'AI & ML',
        description: 'AI & Machine Learning Engineer',
        labelAr: 'الذكاء الاصطناعي وتعلم الآلة',
        descriptionAr: 'مهندس ذكاء اصطناعي وتعلم آلة'
    }
};

/**
 * Get portfolio data based on selected mode and language
 * @param {string} mode - Portfolio mode (MODES.DEVOPS or MODES.MLNLP)
 * @param {string} language - UI Language ('en' or 'ar')
 * @returns {object} Complete portfolio data
 */
export function getPortfolioData(mode = MODES.DEVOPS, language = 'en') {
    const isAr = language === 'ar';

    const baseData = {
        personalInfo: isAr ? { ...shared.personalInfo, ...arabic.arabicPersonalInfo } : { ...shared.personalInfo },
        experiences: isAr ? [...arabic.arabicExperiences] : [...shared.Experiences],
        volunteering: [...shared.Volunteering],
        internships: isAr ? [...arabic.arabicInternships] : [...shared.Intern],
        education: isAr ? [...arabic.arabicEducation] : [...shared.education],
        languages: isAr ? [...arabic.arabicLanguages] : [...shared.languages]
    };

    switch (mode) {
        case MODES.MLNLP:
            return {
                ...baseData,
                personalInfo: {
                    ...baseData.personalInfo,
                    ...(isAr ? arabic.arabicMlnlpData.personalInfo : mlnlpPersonalInfo)
                },
                // All experiences are relevant to AI/ML & Engineering
                experiences: baseData.experiences,
                internships: baseData.internships.filter(i => 
                    i.title !== 'System Administration Intern' && 
                    i.title !== 'متدرب إدارة أنظمة وشبكات'
                ),
                aboutMe: isAr ? arabic.arabicMlnlpData.aboutMe : mlnlpAboutMe,
                skills: isAr ? arabic.arabicMlnlpData.skills : mlnlpSkills,
                softSkills: isAr ? arabic.arabicMlnlpData.softSkills : mlnlpSoftSkills,
                projects: mlnlpProjects,
                certifications: mlnlpCertifications,
                courses: mlnlpCourses,
                themeColor: mlnlpPersonalInfo.themeColor
            };

        case MODES.DEVOPS:
        default:
            return {
                ...baseData,
                personalInfo: {
                    ...baseData.personalInfo,
                    ...(isAr ? arabic.arabicDevopsData.personalInfo : devopsPersonalInfo)
                },
                experiences: baseData.experiences,
                internships: baseData.internships.filter(i => 
                    i.title !== 'Artificial Intelligence Engineer Intern' && 
                    i.title !== 'متدرب ذكاء اصطناعي ومعالجة لغات طبيعية'
                ),
                aboutMe: isAr ? arabic.arabicDevopsData.aboutMe : devopsAboutMe,
                skills: isAr ? arabic.arabicDevopsData.skills : devopsSkills,
                softSkills: isAr ? arabic.arabicDevopsData.softSkills : devopsSoftSkills,
                projects: devopsProjects,
                certifications: devopsCertifications,
                courses: devopsCourses,
                themeColor: devopsPersonalInfo.themeColor
            };
    }
}
