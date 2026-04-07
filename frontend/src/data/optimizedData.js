/**
 * Data wrapper with automatic image optimization
 * Applies image path transformations to all data on import
 */

import * as rawData from './shareddata.js';
import * as mlNlpData from './ml&nlpdata.js';

// NOTE:
// Previously this module rewrote `/images/...` paths to `/images-optimized/...`.
// That caused missing image references when `images-optimized` files were
// not present in `public/`. To ensure images load reliably from the public
// folder, export the original paths unchanged. Optimization plugins or
// a separate build step can generate `images-optimized` files if needed.

export const personalInfo = rawData.personalInfo;
export const Intern = rawData.Intern;
export const Experiences = rawData.Experiences;
export const education = rawData.education;
export const skillsData = rawData.skillsData;
export const DEdata = rawData.DEdata;
export const MLdata = mlNlpData.MLdata;
export const NLPdata = mlNlpData.NLPdata;
