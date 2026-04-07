import React from 'react';
import { useImagePreviewContext } from '../context/ImagePreviewContext';

/**
 * PreviewableImage - Reusable clickable image component
 *
 * Wraps any image with click-to-preview functionality.
 * Uses the global ImagePreviewContext for state management.
 *
 * @param {string} src - Primary image source URL
 * @param {string[]} images - Optional array of image URLs for gallery mode
 * @param {number} initialIndex - Starting index when images array is provided
 * @param {string} alt - Alt text for the image
 * @param {string} className - Additional CSS classes for the image
 * @param {string} wrapperClassName - CSS classes for the button wrapper
 * @param {function} onError - Optional error handler for broken images
 * @param {string} ariaLabel - Custom aria-label (defaults to "View {alt}")
 */
export default function PreviewableImage({
  src,
  images,
  initialIndex = 0,
  alt = 'Preview',
  className = '',
  wrapperClassName = '',
  onError,
  ariaLabel,
  ...imgProps
}) {
  const { openPreview } = useImagePreviewContext();

  // Determine images array: use provided images or wrap src in array
  const imageArray = images || [src];

  const handleClick = () => {
    openPreview(imageArray, initialIndex, alt);
  };

  // Create WebP variant of the image
  const webpSrc = src ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp') : null;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-md overflow-hidden border border-white/5 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-transform hover:scale-105 ${wrapperClassName}`}
      aria-label={ariaLabel || `View ${alt}`}
    >
      {webpSrc ? (
        <picture>
          <source srcSet={webpSrc} type="image/webp" />
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className={`cursor-pointer ${className}`}
            onError={onError}
            {...imgProps}
          />
        </picture>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`cursor-pointer ${className}`}
          onError={onError}
          {...imgProps}
        />
      )}
    </button>
  );
}
