import { motion, useReducedMotion } from 'framer-motion'
import { school, whatsappEnquireUrl } from '../lib/school'
import { fadeUp, staggerFast, viewportLoose, viewportOnce } from '../lib/motion'
import { IconArrow } from './icons'

const programmes = [
  {
    title: 'Early Years',
    summary: 'A warm start to school life — play, language, and the habits that make learning feel safe.',
    image: '/gallery/play-swings.png',
    position: 'center 40%',
  },
  {
    title: 'Primary',
    summary: 'Strong core subjects with character formation — learners who can think, write, and work well with others.',
    image: '/gallery/students-picnic-girls.png',
    position: 'center 30%',
  },
  {
    title: 'Junior High',
    summary: 'Deeper academic challenge and guidance as students prepare for the next stage of their education.',
    image: '/gallery/group-steps.png',
    position: 'center 28%',
  },
]

export function Programmes() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="programmes" className="section-pad bg-[var(--cream)]">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <p className="kicker">Our Programmes</p>
          <h2 className="heading-display text-[var(--navy)]">Wide variety of learning pathways.</h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
            We welcome learners across early years, primary, and junior high. Class groups and year
            placements are confirmed with families during admissions.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-3"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportLoose}
          variants={reduceMotion ? undefined : staggerFast}
        >
          {programmes.map((programme) => (
            <motion.article
              key={programme.title}
              className="card overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
              variants={reduceMotion ? undefined : fadeUp}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={programme.image}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ objectPosition: programme.position }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/45 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-extrabold text-[var(--navy)]">{programme.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{programme.summary}</p>
                <a
                  href={whatsappEnquireUrl(
                    `Hello ${school.shortName}, I would like information about the ${programme.title} programme.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--orange)]"
                >
                  Read More <IconArrow className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
