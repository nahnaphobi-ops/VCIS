import { motion, useReducedMotion } from 'framer-motion'
import { school } from '../lib/school'
import { fadeUp, viewportOnce } from '../lib/motion'

export function Community() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="community"
      className="section-pad relative overflow-hidden bg-[var(--cream)]"
    >
      <motion.div
        className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[var(--orange)]/10 blur-3xl"
        aria-hidden
        animate={
          reduceMotion
            ? undefined
            : { scale: [1, 1.15, 1], opacity: [0.55, 0.85, 0.55] }
        }
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center"
        initial={reduceMotion ? false : 'hidden'}
        whileInView="show"
        viewport={viewportOnce}
        variants={reduceMotion ? undefined : fadeUp}
      >
        <div className="max-w-xl">
          <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-[var(--orange)] uppercase">
            Community
          </p>
          <h2 className="font-display heading-display font-semibold text-[var(--navy)]">
            Part of a growing family in Kumasi.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--muted)] md:text-lg">
            Follow school life, updates, and celebrations on Facebook — where{' '}
            <span className="font-semibold text-[var(--navy)]">
              {school.facebookFollowers} followers
            </span>{' '}
            stay connected with Victoria Crest.
          </p>
        </div>
        <motion.a
          href={school.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-3 rounded-sm bg-[var(--navy)] px-6 py-3.5 text-sm font-semibold tracking-wide text-white no-underline sm:w-auto"
          whileHover={reduceMotion ? undefined : { scale: 1.03, backgroundColor: '#0a3358' }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
            <path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H6v4h3v8h4v-8h3.2l.8-4H13V9c0-.6.4-1 1-1z" />
          </svg>
          Visit our Facebook page
        </motion.a>
      </motion.div>
    </section>
  )
}
