import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, staggerFast, viewportLoose, viewportOnce } from '../lib/motion'

const pillars = [
  {
    title: 'Learning with purpose',
    body: 'We nurture attentive learners who ask good questions and take pride in careful work.',
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden>
        <rect x="6" y="8" width="22" height="24" rx="2" fill="#002147" />
        <path d="M10 14h14M10 19h12M10 24h10" stroke="#fff" strokeWidth="1.5" />
        <path d="M28 12 L32 16 L28 20" fill="#ff6600" />
      </svg>
    ),
  },
  {
    title: 'Excellence in character',
    body: 'Integrity is not a slogan here — it is how students treat work, peers, and responsibility.',
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden>
        <path d="M8 18 L20 12 L32 18 L20 24 Z" fill="#ff6600" />
        <path
          d="M14 21 V28 C14 30 20 33 20 33 S26 30 26 28 V21"
          stroke="#fff"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    ),
  },
  {
    title: 'International spirit',
    body: 'Our name and crest signal a wide horizon — confidence that travels beyond the classroom.',
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden>
        <circle cx="20" cy="18" r="11" fill="none" stroke="#fff" strokeWidth="2" />
        <ellipse cx="20" cy="18" rx="5" ry="11" fill="none" stroke="#ff6600" strokeWidth="1.5" />
        <path d="M9 18h22" stroke="#fff" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    title: 'Growth that lasts',
    body: 'We look for steady progress — academic, social, and personal — season after season.',
    icon: (
      <svg viewBox="0 0 40 40" className="h-10 w-10" aria-hidden>
        <circle cx="20" cy="14" r="8" fill="#ff6600" />
        <path d="M20 18 V32" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M14 32h12" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function Academics() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="academics" className="bg-[var(--navy)] px-5 py-20 text-white md:px-8 md:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="max-w-2xl"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-[var(--orange-bright)] uppercase">
            Why Victoria Crest
          </p>
          <h2 className="font-display text-4xl leading-tight font-semibold md:text-5xl">
            Four promises drawn from our crest.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/90 md:text-lg">
            These pillars come from the symbols on our school crest — not marketing slogans, but the
            values we ask every learner to carry.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportLoose}
          variants={reduceMotion ? undefined : staggerFast}
        >
          {pillars.map((pillar) => (
            <motion.article
              key={pillar.title}
              className="border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              variants={reduceMotion ? undefined : fadeUp}
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -6, backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,133,51,0.45)' }
              }
              transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            >
              <motion.div
                className="mb-4"
                whileHover={reduceMotion ? undefined : { rotate: [-2, 2, 0], scale: 1.06 }}
                transition={{ duration: 0.45 }}
              >
                {pillar.icon}
              </motion.div>
              <h3 className="font-display text-2xl font-semibold">{pillar.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/85">{pillar.body}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
