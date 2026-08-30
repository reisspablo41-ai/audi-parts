'use client'

/**
 * Shared motion vocabulary for the storefront.
 *
 * Everything here is deliberately restrained: short durations, a single
 * expo-out easing curve, and small travel distances. The goal is the
 * "engineered precision" feel of the brand, not decoration.
 *
 * Reduced motion is honoured globally by <MotionProvider reducedMotion="user">
 * in the root layout, so individual components don't need to branch on it.
 */

import {
  motion,
  AnimatePresence,
  MotionConfig,
  useInView,
  useMotionValue,
  useSpring,
  type Variants,
  type Transition,
} from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'

/** Expo-out — decisive start, long settle. Used for every entrance. */
export const EASE = [0.16, 1, 0.3, 1] as const

export const ENTER: Transition = { duration: 0.55, ease: EASE }
export const QUICK: Transition = { duration: 0.25, ease: EASE }

/** Root <MotionConfig> wrapper. Client boundary for the server root layout. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={ENTER}>
      {children}
    </MotionConfig>
  )
}

/* ── Entrances ─────────────────────────────────────────────── */

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

function offsetFor(direction: Direction, distance: number) {
  switch (direction) {
    case 'up':
      return { y: distance }
    case 'down':
      return { y: -distance }
    case 'left':
      return { x: distance }
    case 'right':
      return { x: -distance }
    default:
      return {}
  }
}

interface RevealProps {
  children: ReactNode
  className?: string
  /** Direction the element travels *from*. */
  direction?: Direction
  distance?: number
  delay?: number
  /** Replay each time the element scrolls back into view. */
  repeat?: boolean
  as?: 'div' | 'section' | 'span' | 'li'
}

/** Fades and rises an element the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  direction = 'up',
  distance = 24,
  delay = 0,
  repeat = false,
  as = 'div',
}: RevealProps) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, ...offsetFor(direction, distance) }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: !repeat, amount: 0.2, margin: '0px 0px -80px 0px' }}
      transition={{ ...ENTER, delay }}
    >
      {children}
    </Tag>
  )
}

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: ENTER },
}

interface StaggerProps {
  children: ReactNode
  className?: string
  delay?: number
  /** Seconds between each child. */
  gap?: number
  as?: 'div' | 'ul' | 'section'
}

/** Parent for a grid or list whose children animate in one after another. */
export function Stagger({ children, className, delay = 0, gap = 0.07, as = 'div' }: StaggerProps) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: '0px 0px -60px 0px' }}
    >
      {children}
    </Tag>
  )
}

/** A single child of <Stagger>. */
export function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'article'
}) {
  const Tag = motion[as]
  return (
    <Tag className={className} variants={staggerChild}>
      {children}
    </Tag>
  )
}

/* ── Interaction ───────────────────────────────────────────── */

/** Lifts a card on hover and presses it on tap. */
export function HoverLift({
  children,
  className,
  lift = 4,
}: {
  children: ReactNode
  className?: string
  lift?: number
}) {
  return (
    <motion.div
      className={className}
      whileHover={{ y: -lift }}
      whileTap={{ y: 0, scale: 0.99 }}
      transition={QUICK}
    >
      {children}
    </motion.div>
  )
}

/* ── Numbers ───────────────────────────────────────────────── */

interface CountUpProps {
  value: number
  /** Rendered after the number, e.g. "+" or "%". */
  suffix?: string
  prefix?: string
  decimals?: number
  className?: string
}

/** Counts a statistic up from zero once it scrolls into view. */
export function CountUp({ value, suffix = '', prefix = '', decimals = 0, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const raw = useMotionValue(0)
  const spring = useSpring(raw, { duration: 1400, bounce: 0 })

  useEffect(() => {
    if (inView) raw.set(value)
  }, [inView, value, raw])

  useEffect(() => {
    return spring.on('change', (latest) => {
      const node = ref.current
      if (!node) return
      node.textContent =
        prefix +
        latest.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }) +
        suffix
    })
  }, [spring, prefix, suffix, decimals])

  return (
    <span ref={ref} className={className}>
      {/* Server/first paint shows the final value so the number is never
          missing for users with JS disabled or reduced motion. */}
      {prefix}
      {value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

export { motion, AnimatePresence, useInView }
