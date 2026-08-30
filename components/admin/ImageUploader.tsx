'use client'

import { useState, useRef, useCallback } from 'react'

interface UploadedImage {
  id: string
  url: string        // object URL (new upload) or public URL (existing)
  file?: File        // undefined for images already saved in Supabase
  name: string
  sizeKb: number
}

interface ImageUploaderProps {
  value: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  maxImages?: number
}

export type { UploadedImage }

export default function ImageUploader({ value, onChange, maxImages = 8 }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files)
      const images: UploadedImage[] = []

      for (const file of arr) {
        if (!file.type.startsWith('image/')) continue
        if (value.length + images.length >= maxImages) break
        images.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          url: URL.createObjectURL(file),
          file,
          name: file.name,
          sizeKb: Math.round(file.size / 1024),
        })
      }

      if (images.length > 0) onChange([...value, ...images])
    },
    [value, onChange, maxImages],
  )

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }

  function handleRemove(id: string) {
    const img = value.find((i) => i.id === id)
    if (img) URL.revokeObjectURL(img.url)
    onChange(value.filter((i) => i.id !== id))
  }

  function handleMakePrimary(id: string) {
    const idx = value.findIndex((i) => i.id === id)
    if (idx <= 0) return
    const next = [...value]
    const [item] = next.splice(idx, 1)
    next.unshift(item)
    onChange(next)
  }

  const canAdd = value.length < maxImages

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      {canAdd && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragging
              ? 'border-audi-red bg-red-50'
              : 'border-audi-fog hover:border-audi-titanium bg-audi-mist hover:bg-audi-fog'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
          <div className="flex flex-col items-center gap-2">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dragging ? 'bg-audi-red text-white' : 'bg-white border border-audi-fog text-audi-titanium'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-audi-slate">
                {dragging ? 'Drop to upload' : 'Drag & drop images here'}
              </p>
              <p className="text-xs text-audi-titanium mt-0.5">
                or <span className="text-audi-red font-medium">click to browse</span> · PNG, JPG, WebP · Max 5 MB each
              </p>
            </div>
            <p className="text-xs text-audi-silver">
              {value.length}/{maxImages} images uploaded
            </p>
          </div>
        </div>
      )}

      {/* Preview grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {value.map((img, i) => (
            <div key={img.id} className="relative group aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover rounded-lg border border-audi-fog"
              />

              {/* Primary badge */}
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 bg-audi-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  Primary
                </span>
              )}

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleMakePrimary(img.id)}
                    className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-audi-slate hover:bg-audi-red hover:text-white transition-colors"
                    title="Set as primary"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(img.id)}
                  className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-audi-slate hover:bg-red-500 hover:text-white transition-colors"
                  title="Remove"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Size label */}
              <p className="text-[9px] text-audi-titanium text-center mt-0.5 truncate">{img.sizeKb} KB</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
