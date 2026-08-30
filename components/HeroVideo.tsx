'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Background video layer for the homepage hero.
 *
 * Behaviour worth knowing:
 * - The poster paints immediately and the video cross-fades in once it can
 *   play through, so there is never a black flash behind the headline.
 * - Visitors who ask for reduced motion get the poster only; the video files
 *   are never requested at all, which also saves them ~1.5 MB.
 * - The video is muted and `playsInline`, the two conditions iOS and every
 *   modern browser require before they will autoplay anything.
 */
export default function HeroVideo() {
  const reduceMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  // Some browsers restore a paused element on bfcache navigation.
  useEffect(() => {
    const node = videoRef.current
    if (!node || reduceMotion) return
    const resume = () => {
      if (node.paused) node.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', resume)
    return () => document.removeEventListener('visibilitychange', resume)
  }, [reduceMotion])

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* Poster: the first paint, and the whole story under reduced motion. */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
        style={{
          backgroundImage: 'url(/video/hero-a3-poster.jpg)',
          opacity: ready ? 0 : 1,
        }}
      />

      {!reduceMotion && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/hero-a3-poster.jpg"
          onCanPlayThrough={() => setReady(true)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: ready ? 1 : 0 }}
        >
          <source src="/video/hero-a3.webm" type="video/webm" />
          <source src="/video/hero-a3.mp4" type="video/mp4" />
        </video>
      )}

      {/* ── Legibility scrim ──────────────────────────────────────
          Weighted hard to the left, where the headline sits, and released
          to almost nothing on the right so the car and the sunset actually
          read. The fitment card is opaque white, so it needs no protection
          of its own. */}

      {/* Gentle overall darkening — pulls the warm footage toward the
          anthracite palette without burying it */}
      <div className="absolute inset-0 bg-audi-anthracite/35" />

      {/* Horizontal falloff: solid behind the copy, clear over the imagery */}
      <div className="absolute inset-0 bg-gradient-to-r from-audi-anthracite via-audi-anthracite/65 to-transparent" />

      {/* Bottom fade so the section resolves into the band beneath it */}
      <div className="absolute inset-0 bg-gradient-to-b from-audi-anthracite/45 via-transparent to-audi-anthracite/90" />

      {/* Brand technical grid, kept from the original hero */}
      <div className="absolute inset-0 blueprint-grid opacity-15" />
    </div>
  )
}
