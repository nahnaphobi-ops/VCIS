import type { Transition, Variants } from 'framer-motion'

/** Soft academic easing — confident, not bouncy */
export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1]
export const easeOutQuart: [number, number, number, number] = [0.25, 1, 0.5, 1]

export const transitionBase: Transition = {
  duration: 0.7,
  ease: easeOutExpo,
}

export const transitionFast: Transition = {
  duration: 0.35,
  ease: easeOutQuart,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: transitionBase,
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.6, ease: easeOutQuart },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.82 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.85, ease: easeOutExpo },
  },
}

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
}

export const staggerFast: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
}

export const viewportOnce = { once: true, amount: 0.25 } as const
export const viewportLoose = { once: true, amount: 0.15 } as const
