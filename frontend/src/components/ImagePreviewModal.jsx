import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reusable Image Preview Modal Component
 *
 * Features:
 * - Portal rendering to avoid z-index issues
 * - Animated entrance/exit with Framer Motion
 * - Multiple image support with navigation
 * - Keyboard navigation (Escape, Arrow keys)
 * - Scroll lock without layout shift
 * - Click outside to close
 *
 * @param {boolean} open - Whether the modal is open
 * @param {string[]} images - Array of image URLs to display
 * @param {number} initialIndex - Starting index for multiple images
 * @param {function} onClose - Callback when modal is closed
 * @param {string} alt - Alt text for images
 */
export default function ImagePreviewModal({
  open,
  images = [],
  initialIndex = 0,
  onClose,
  alt = 'Image Preview'
}) {
  const scrollYRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when images change
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, images]);

  // Handle keyboard navigation and scroll lock
  useEffect(() => {
    if (!open) return;

    // Capture current scroll position
    scrollYRef.current = window.scrollY || document.documentElement.scrollTop || 0;

    // Lock scroll by fixing body at current position
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          setCurrentIndex((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restore scroll
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      window.scrollTo(0, scrollYRef.current);
    };
  }, [open, images.length, onClose]);

  // Handle navigation
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(images.length - 1, prev + 1));
  }, [images.length]);

  // Don't render if closed or no images
  if (!open || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const hasMultipleImages = images.length > 1;

  const modalContent = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center p-4 sm:p-8"
          style={{ zIndex: 999999 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/95 cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal content */}
          <motion.div
            className="relative flex items-center justify-center"
            style={{ zIndex: 1000000 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Close button */}
            <button
              type="button"
              className="absolute -top-12 right-0 sm:top-2 sm:right-2 text-white bg-black/60 hover:bg-black/80 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              onClick={onClose}
              aria-label="Close image preview"
            >
              ×
            </button>

            {/* Previous button */}
            {hasMultipleImages && (
              <button
                type="button"
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className={`absolute left-2 text-white bg-black/40 hover:bg-black/60 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 ${currentIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                aria-label="Previous image"
              >
                ‹
              </button>
            )}

            {/* Image */}
            <motion.img
              key={currentImage}
              src={currentImage}
              alt={alt}
              className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />

            {/* Next button */}
            {hasMultipleImages && (
              <button
                type="button"
                onClick={goToNext}
                disabled={currentIndex === images.length - 1}
                className={`absolute right-2 text-white bg-black/40 hover:bg-black/60 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 ${currentIndex === images.length - 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
                aria-label="Next image"
              >
                ›
              </button>
            )}

            {/* Image counter */}
            {hasMultipleImages && (
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-white/70 text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Render modal at body level to avoid z-index conflicts
  return createPortal(modalContent, document.body);
}

/**
 * Custom hook for managing image preview modal state
 *
 * Usage:
 * const { isOpen, images, openModal, closeModal } = useImagePreview();
 *
 * <img onClick={() => openModal(['/path/to/image.jpg'])} />
 * <ImagePreviewModal open={isOpen} images={images} onClose={closeModal} />
 */
export function useImagePreview() {
  const [modalState, setModalState] = useState({
    isOpen: false,
    images: [],
    initialIndex: 0
  });

  const openModal = useCallback((images, initialIndex = 0) => {
    const imageArray = Array.isArray(images) ? images : [images];
    setModalState({
      isOpen: true,
      images: imageArray,
      initialIndex
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  return {
    isOpen: modalState.isOpen,
    images: modalState.images,
    initialIndex: modalState.initialIndex,
    openModal,
    closeModal
  };
}
