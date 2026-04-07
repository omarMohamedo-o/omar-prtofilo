import React from 'react';
import { createPortal } from 'react-dom';
import { ExternalLink } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
    if (!project) return null;

    const content = (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/60" onClick={onClose} />
            <div className="relative max-w-3xl w-full mx-4 bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className="flex items-start justify-between p-4 border-b">
                    <h3 className="text-xl font-bold">{project.title}</h3>
                    <div className="flex items-center gap-2">
                        {project.link && project.link !== '#' && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline flex items-center gap-1">
                                <ExternalLink size={16} /> <span className="text-sm">Open repo</span>
                            </a>
                        )}
                        <button onClick={onClose} aria-label="Close" className="text-gray-600 hover:text-gray-900">✕</button>
                    </div>
                </div>

                {project.image ? (
                    <div className="w-full bg-gray-100">
                        <img src={project.image} alt={project.title} className="w-full h-56 object-cover" />
                    </div>
                ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-gradient-to-r from-sky-500 to-cyan-500 text-white">
                        <div className="text-2xl font-semibold">{project.title}</div>
                    </div>
                )}

                <div className="p-6">
                    <div className="text-gray-800 mb-4">
                        {project.description}
                    </div>

                    <div className="mb-4">
                        <div className="text-sm font-semibold text-gray-600 mb-2">Tech & Tools</div>
                        <div className="flex flex-wrap gap-2">
                            {(project.tech || []).map((t, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-gray-100 text-sm text-gray-800">{t}</span>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );

    if (typeof document !== 'undefined' && document.body) {
        return createPortal(content, document.body);
    }

    return content;
}
