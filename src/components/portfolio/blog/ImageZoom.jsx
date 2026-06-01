import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

export default function ImageZoom({ src, alt }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span className="relative block group cursor-zoom-in" onClick={() => setOpen(true)}>
        <img
          src={src}
          alt={alt || ''}
          loading="lazy"
          className="rounded-xl w-full object-cover transition-transform duration-300 group-hover:brightness-90"
        />
        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="bg-black/50 rounded-full p-2">
            <ZoomIn className="w-5 h-5 text-white" />
          </span>
        </span>
        {alt && (
          <span className="block text-center text-xs text-muted-foreground mt-2 italic">{alt}</span>
        )}
      </span>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={src}
            alt={alt || ''}
            className="max-w-full max-h-full rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          {alt && <p className="absolute bottom-4 text-center text-sm text-white/70">{alt}</p>}
        </div>
      )}
    </>
  );
}