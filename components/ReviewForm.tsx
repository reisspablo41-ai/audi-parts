'use client'

import { useState } from 'react'
import { submitReview } from '@/app/actions/reviews'

interface ReviewFormProps {
  sku: string
  productName: string
}

export default function ReviewForm({ sku, productName }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    message: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitReview({
        sku,
        authorName: formData.name,
        rating,
        title: formData.title,
        body: formData.message,
      })

      if (result.success) {
        setSuccess(true)
        setFormData({ name: '', title: '', message: '' })
        setRating(5)
        setTimeout(() => {
          setSuccess(false)
          setIsOpen(false)
        }, 3000)
      } else {
        setError(result.error || 'Something went wrong')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto px-8 py-4 bg-audi-anthracite text-white rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-audi-red transition-all shadow-xl shadow-audi-fog active:scale-[0.98]"
      >
        Write a Review
      </button>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 sm:p-8 border-2 border-audi-fog shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-audi-anthracite">Write a Review</h3>
          <p className="text-sm text-audi-steel mt-1">Share your experience with {productName}</p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-audi-fog rounded-full transition-colors"
        >
          <svg className="w-6 h-6 text-audi-titanium" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {success ? (
        <div className="bg-audi-success-soft border border-audi-success/20 rounded-lg p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-audi-success-soft rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-audi-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-xl font-bold text-audi-success mb-2">Review Submitted!</h4>
          <p className="text-audi-success font-medium">Thank you for sharing your feedback. It has been published.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-audi-titanium uppercase tracking-widest ml-1">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform active:scale-90"
                >
                  <svg
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating) ? 'text-amber-500 fill-amber-400' : 'text-audi-fog fill-audi-fog'
                    } transition-colors`}
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-audi-titanium uppercase tracking-widest ml-1">Your Name</label>
              <input
                required
                type="text"
                placeholder="e.g. John Doe"
                className="w-full px-5 py-4 bg-audi-mist border-2 border-transparent focus:border-audi-red focus:bg-white rounded-lg outline-none transition-all font-medium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-audi-titanium uppercase tracking-widest ml-1">Review Title</label>
              <input
                required
                type="text"
                placeholder="Summarize your review"
                className="w-full px-5 py-4 bg-audi-mist border-2 border-transparent focus:border-audi-red focus:bg-white rounded-lg outline-none transition-all font-medium"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-audi-titanium uppercase tracking-widest ml-1">Review Message</label>
            <textarea
              required
              rows={4}
              placeholder="What did you think of this part?"
              className="w-full px-5 py-4 bg-audi-mist border-2 border-transparent focus:border-audi-red focus:bg-white rounded-lg outline-none transition-all font-medium resize-none"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex-1 bg-audi-red text-white py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-red-100 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Post Review'
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-8 py-4 bg-audi-fog text-audi-steel rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-audi-fog transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
