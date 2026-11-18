import React, { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

export function ImageModal({ src, alt, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden bg-white/10 p-2 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md shadow-lg transition-transform hover:scale-105 active:scale-95 focus:outline-none"
          aria-label="ปิดรูปภาพ"
        >
          <X className="w-5 h-5" />
        </button>

        <img
          src={src}
          alt={alt || "รูปภาพรีวิว"}
          className="max-h-[82vh] max-w-full object-contain rounded-2xl mx-auto"
        />
      </div>
    </div>
  );
}
