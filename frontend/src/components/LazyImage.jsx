import React from 'react';

// LazyImage tries a WebP source first and falls back to the original
// image. Pass `src` as a path under `/images/...` (same as public path).
export default function LazyImage({ src, alt = '', width, height, className = '', ...props }) {
    if (!src) return null;

    const isSvg = src.toLowerCase().endsWith('.svg');

    // strip leading slash if present
    const clean = src.startsWith('/') ? src.slice(1) : src;

    // optimized path maps images/... -> images-optimized/ and uses .webp
    const optimizedWebp = '/' + clean.replace(/^images\//, 'images-optimized/').replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const optimizedFallback = '/' + clean.replace(/^images\//, 'images-optimized/').replace(/\.(jpg|jpeg|png)$/i, '.jpg');

    if (isSvg) {
        return <img src={src} alt={alt} loading="lazy" width={width} height={height} className={className} {...props} />;
    }

    return (
        <picture>
            <source srcSet={optimizedWebp} type="image/webp" />
            <img src={optimizedFallback} alt={alt} loading="lazy" width={width} height={height} className={className} {...props} />
        </picture>
    );
}
