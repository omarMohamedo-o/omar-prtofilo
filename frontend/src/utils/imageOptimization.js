/**
 * Image optimization utilities
 * Handles path transformation with WebP support
 * Images are already optimized and stored in /images/ with WebP variants
 */

/**
 * Get the optimized image path
 * Returns the original path as images are already optimized
 * Supports WebP format detection
 */
export function getOptimizedImagePath(path, format = 'jpg') {
  if (!path) return path;

  // Replace file extension for the specified format
  if (format === 'webp') {
    return path.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
  }

  // Normalize to jpg for consistency
  return path.replace(/\.(png|gif)$/i, '.jpg');
}

/**
 * Get image path with WebP fallback
 * Returns object with webp and fallback paths
 */
export function getImagePathWithFallback(path) {
  if (!path) return { src: '', webp: '' };

  return {
    webp: getOptimizedImagePath(path, 'webp'),
    src: getOptimizedImagePath(path, 'jpg')
  };
}

/**
 * Get multiple image paths with optimization
 * Useful for image galleries
 */
export function getOptimizedImagePaths(paths = []) {
  if (!Array.isArray(paths)) return [];
  return paths.map(path => getOptimizedImagePath(path));
}

/**
 * Transform batch of images with metadata
 * Preserves original structure while optimizing paths
 */
export function optimizeImageBatch(items = [], imageKeyPath = 'image') {
  return items.map(item => {
    const updated = { ...item };

    // Handle single image
    if (item[imageKeyPath]) {
      updated[imageKeyPath] = getOptimizedImagePath(item[imageKeyPath]);
    }

    // Handle array of images
    if (Array.isArray(item.images)) {
      updated.images = item.images.map(img => getOptimizedImagePath(img));
    }

    return updated;
  });
}
