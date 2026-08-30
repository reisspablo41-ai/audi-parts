'use client'

import { useState } from 'react'
import CategoryIcon from './CategoryIcon'
import { motion, AnimatePresence, EASE } from './motion'
import type { Part } from '@/lib/types'

interface ProductImageGalleryProps {
  part: Part
}

export default function ProductImageGallery({ part }: ProductImageGalleryProps) {
  const images = part.images && part.images.length > 0 ? part.images : []
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const currentImage = images[selectedIndex]
  
  const discount = part.compareAtPrice
    ? Math.round(((part.compareAtPrice - part.price) / part.compareAtPrice) * 100)
    : 0

  return (
    <div className="flex flex-col gap-4">
      {/* Main image Container */}
      <div className="bg-white rounded-lg aspect-square flex items-center justify-center border border-audi-fog relative overflow-hidden shadow-sm group">
        {currentImage ? (
          <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <motion.img
                key={currentImage}
                src={currentImage}
                alt={part.name}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </AnimatePresence>
            {/* Overlay hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-audi-mist to-audi-fog flex items-center justify-center">
            <div className="text-center">
              <CategoryIcon categoryId={part.categoryId} className="w-20 h-20 mx-auto mb-4 text-audi-silver" />
              <p className="technical text-sm text-audi-titanium uppercase">{part.partNumber}</p>
            </div>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {discount > 0 && (
            <span className="bg-audi-red text-white text-xs font-semibold px-2.5 py-1 rounded technical">
              Save {discount}%
            </span>
          )}
          {part.brand === 'Genuine OEM' && (
            <span className="bg-audi-anthracite text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg shadow-blue-600/20">
              Genuine OEM
            </span>
          )}
        </div>

        {/* Navigation arrows (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button 
              onClick={() => setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-md bg-white/85 backdrop-blur-sm border border-audi-fog flex items-center justify-center text-audi-graphite opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => setSelectedIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-md bg-white/85 backdrop-blur-sm border border-audi-fog flex items-center justify-center text-audi-graphite opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 -mx-1 px-1 no-scrollbar">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`w-20 h-20 rounded-md border flex-shrink-0 flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden relative flex-none ${
                i === selectedIndex 
                  ? 'border-audi-anthracite ring-2 ring-audi-anthracite/10' 
                  : 'border-audi-fog hover:border-audi-titanium opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${part.name} view ${i + 1}`} className="w-full h-full object-cover" />
              {i === selectedIndex && (
                <div className="absolute inset-0 bg-audi-anthracite/5" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
