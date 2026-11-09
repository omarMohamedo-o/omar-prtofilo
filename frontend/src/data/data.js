/**
 * Main Portfolio Data Aggregator
 * ================================
 * Combines shared data with mode-specific data
 */

import * as shared from './shareddata';

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
        description: 'MLOps & Cloud DevOps Engineer'
    },
    [MODES.MLNLP]: {
        label: 'AI & ML',
        description: 'AI & Machine Learning Engineer'
    }
};

/**
 * Get portfolio data based on selected mode
 * @param {string} mode - Portfolio mode (MODES.DEVOPS or MODES.MLNLP)
 * @returns {object} Complete portfolio data
 */
export function getPortfolioData(mode = MODES.DEVOPS) {
    const baseData = {
        personalInfo: { ...shared.personalInfo },
        experiences: [...shared.Experiences],
        internships: [...shared.Intern],
        education: [...shared.education],
        languages: [...shared.languages]
    };

    switch (mode) {
        case MODES.MLNLP:
            return {
                ...baseData,
                personalInfo: {
                    ...baseData.personalInfo,
                    ...mlnlpPersonalInfo
                },
                // All experiences are relevant to AI/ML & Engineering
                experiences: baseData.experiences,
                internships: baseData.internships.filter(i => i.title !== 'System Administration Intern'),
                aboutMe: mlnlpAboutMe,
                skills: mlnlpSkills,
                softSkills: mlnlpSoftSkills,
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
                    ...devopsPersonalInfo
                },
                experiences: baseData.experiences,
                internships: baseData.internships.filter(i => i.title !== 'Artificial Intelligence Engineer Intern'),
                aboutMe: devopsAboutMe,
                skills: devopsSkills,
                softSkills: devopsSoftSkills,
                projects: devopsProjects,
                certifications: devopsCertifications,
                courses: devopsCourses,
                themeColor: devopsPersonalInfo.themeColor
            };
    }
}
