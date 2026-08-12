import { motion, useReducedMotion } from 'framer-motion'
import { school, whatsappEnquireUrl } from '../lib/school'
import { fadeUp, staggerFast, viewportLoose, viewportOnce } from '../lib/motion'

const programmes = [
  {
    title: 'Early Years',
    summary: 'A warm start to school life — play, language, and the habits that make learning feel safe.',
    focus: ['Foundational literacy & numeracy', 'Social confidence', 'Curiosity through play'],
  },
  {
    title: 'Primary',
    summary: 'Strong core subjects with character formation — learners who can think, write, and work well with others.',
    focus: ['English & Mathematics', 'Science & discovery', 'Values & responsibility'],
  },
  {
    title: 'Junior High',
    summary: 'Deeper academic challenge and guidance as students prepare for the next stage of their education.',
    focus: ['Subject depth', 'Exam readiness support', 'Leadership & integrity'],
  },
]

export function Programmes() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="programmes" className="section-pad bg-[var(--navy)] text-white">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="max-w-2xl"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-[var(--orange-bright)] uppercase">
            Programmes / Classes
          </p>
          <h2 className="font-display heading-display font-semibold">
            Learning pathways for every stage.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/85 md:text-lg">
            We welcome learners across early years, primary, and junior high. Class groups and
            year placements are confirmed with families during admissions — contact us for the
            current openings.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 lg:grid-cols-3"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportLoose}
          variants={reduceMotion ? undefined : staggerFast}
        >
          {programmes.map((programme) => (
            <motion.article
              key={programme.title}
              className="flex flex-col border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6"
              variants={reduceMotion ? undefined : fadeUp}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -6,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderColor: 'rgba(255,133,51,0.45)',
                    }
              }
              transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            >
              <h3 className="font-display text-3xl font-semibold">{programme.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/80">{programme.summary}</p>
              <ul className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm text-white/90">
                {programme.focus.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff8533]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          className="mt-10 flex w-full flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <p className="max-w-xl text-sm text-white/70">
            Need the current class list or age requirements? Our team will walk you through the
            options for your child.
          </p>
          <motion.a
            href={whatsappEnquireUrl(
              `Hello ${school.shortName}, I would like information about your programmes and classes.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full shrink-0 rounded-sm bg-[#EF5B04] px-6 py-3.5 text-center text-sm font-semibold tracking-wide text-white no-underline sm:w-auto"
            whileHover={reduceMotion ? undefined : { scale: 1.03, backgroundColor: '#ff8533' }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            Ask about classes
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
