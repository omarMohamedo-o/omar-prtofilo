import React from 'react'
import Portfolio from '../components/Portfolio'
import { ImagePreviewProvider, useImagePreviewContext } from '../context/ImagePreviewContext'
import ImagePreviewModal from '../components/ImagePreviewModal'

// Global modal that connects to context
function GlobalImagePreviewModal() {
    const { isOpen, images, initialIndex, alt, closePreview } = useImagePreviewContext()
    return (
        <ImagePreviewModal
            open={isOpen}
            images={images}
            initialIndex={initialIndex}
            onClose={closePreview}
            alt={alt}
        />
    )
}

export default function App() {
    return (
        <ImagePreviewProvider>
            <Portfolio />
            <GlobalImagePreviewModal />
        </ImagePreviewProvider>
    )
}
