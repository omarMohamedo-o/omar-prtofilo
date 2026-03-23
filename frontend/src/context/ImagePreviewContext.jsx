import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Global Image Preview Context
 *
 * Provides a single, centralized state for image preview modals
 * that can be used across any component in the application.
 *
 * Usage:
 * 1. Wrap your app with <ImagePreviewProvider>
 * 2. Use useImagePreviewContext() hook in any component
 * 3. Call openPreview(images, index, alt) to open the modal
 */

const ImagePreviewContext = createContext(null);

export function ImagePreviewProvider({ children }) {
  const [state, setState] = useState({
    isOpen: false,
    images: [],
    initialIndex: 0,
    alt: 'Image Preview'
  });

  const openPreview = useCallback((images, initialIndex = 0, alt = 'Image Preview') => {
    const imageArray = Array.isArray(images) ? images : [images];
    setState({
      isOpen: true,
      images: imageArray,
      initialIndex,
      alt
    });
  }, []);

  const closePreview = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: false
    }));
  }, []);

  const value = {
    ...state,
    openPreview,
    closePreview
  };

  return (
    <ImagePreviewContext.Provider value={value}>
      {children}
    </ImagePreviewContext.Provider>
  );
}

/**
 * Hook to access global image preview state and actions
 *
 * @returns {{
 *   isOpen: boolean,
 *   images: string[],
 *   initialIndex: number,
 *   alt: string,
 *   openPreview: (images: string | string[], initialIndex?: number, alt?: string) => void,
 *   closePreview: () => void
 * }}
 */
export function useImagePreviewContext() {
  const context = useContext(ImagePreviewContext);
  if (!context) {
    throw new Error('useImagePreviewContext must be used within an ImagePreviewProvider');
  }
  return context;
}

export default ImagePreviewContext;
