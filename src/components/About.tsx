import { motion, useReducedMotion } from 'framer-motion'
import { school } from '../lib/school'
import { fadeUp, staggerFast, viewportOnce } from '../lib/motion'

const highlights = [
  { label: 'Established', value: school.established },
  { label: 'Location', value: school.location },
  { label: 'Motto', value: school.motto },
  { label: 'Community', value: `${school.facebookFollowers} followers` },
]

const values = [
  {
    title: 'Knowledge',
    blurb: 'Curiosity lit by learning — an open book and a flame for every learner.',
    accent: 'Book & flame',
  },
  {
    title: 'Achievement',
    blurb: 'Academic excellence pursued with discipline, pride, and purpose.',
    accent: 'Graduation cap',
  },
  {
    title: 'Global outlook',
    blurb: 'An international mindset that prepares students for a connected world.',
    accent: 'Globe',
  },
  {
    title: 'Growth',
    blurb: 'Character and confidence that take root and flourish over time.',
    accent: 'Tree',
  },
]

export function About() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="about" className="section-pad bg-[var(--cream)]">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="max-w-3xl"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-[var(--orange)] uppercase">
            About the school
          </p>
          <h2 className="font-display heading-display font-semibold text-[var(--navy)]">
            Victoria Crest International School
          </h2>
          <p className="mt-6 text-base leading-relaxed text-[var(--muted)] md:text-lg">
            {school.name} is a school community in {school.location}, serving families since{' '}
            {school.established}. Guided by our motto —{' '}
            <span className="font-medium text-[var(--navy)]">{school.motto}</span> — we raise young
            people of character who learn with purpose and lead with integrity.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
            Our crest carries four promises: knowledge, achievement, a global outlook, and lasting
            growth. Those symbols shape daily school life — from the classroom to the wider
            community that gathers around every learner.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : staggerFast}
        >
          {highlights.map((item) => (
            <motion.div
              key={item.label}
              className="border border-[var(--cream-muted)] bg-white/80 px-5 py-4"
              variants={reduceMotion ? undefined : fadeUp}
            >
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[var(--orange)] uppercase">
                {item.label}
              </p>
              <p className="font-display mt-2 text-xl font-semibold text-[var(--navy)]">
                {item.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 grid gap-4 sm:grid-cols-2"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : staggerFast}
        >
          {values.map((value) => (
            <motion.article
              key={value.title}
              className="border border-[var(--cream-muted)] bg-white/70 p-5 transition-shadow duration-300 hover:shadow-[0_12px_32px_rgba(0,33,71,0.08)]"
              variants={reduceMotion ? undefined : fadeUp}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            >
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[var(--orange)] uppercase">
                {value.accent}
              </p>
              <h3 className="font-display mt-2 text-2xl font-semibold text-[var(--navy)]">
                {value.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{value.blurb}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
