import { motion, useReducedMotion } from 'framer-motion'
import { school } from '../lib/school'
import { fadeUp, viewportOnce } from '../lib/motion'
import { scrollToSection } from '../lib/scrollToSection'
import { IconArrow, IconCheck } from './icons'

const points = [
  'Character-led classrooms guided by Integrity and Excellence',
  'Pathways from Early Years through Junior High',
  'A warm Kumasi community around every learner',
  'Curiosity, achievement, and a global outlook in daily school life',
]

export function About() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="about" className="section-pad bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <p className="kicker">About Us</p>
          <h2 className="heading-display text-[var(--navy)]">
            We’ll keep your child’s learning safe, purposeful, and proud.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--muted)] md:text-lg">
            {school.name} has served families in {school.location} since {school.established}. Guided
            by <span className="font-semibold text-[var(--navy)]">{school.motto}</span>, we raise
            young people who learn with purpose and lead with integrity.
          </p>
          <ul className="mt-6 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--navy)] md:text-base">
                <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--teal)]" />
                {point}
              </li>
            ))}
          </ul>
          <a
            href="#programmes"
            className="btn btn-primary mt-8"
            onClick={(event) => {
              event.preventDefault()
              scrollToSection('#programmes')
            }}
          >
            Read More
            <IconArrow />
          </a>
        </motion.div>

        <motion.div
          className="relative mx-auto aspect-[1.05/1] w-full max-w-lg"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <div className="absolute top-0 left-0 h-[58%] w-[58%] overflow-hidden rounded-[1.25rem] shadow-[var(--shadow)]">
            <img src="/gallery/school-building.png" alt="Victoria Crest campus building" className="h-full w-full object-cover" />
          </div>
          <div className="absolute top-6 right-0 h-[42%] w-[48%] overflow-hidden rounded-[1.25rem] border-4 border-[var(--orange)] shadow-[var(--shadow)]">
            <img
              src="/gallery/lunch-boys.png"
              alt="Students sharing lunch outdoors"
              className="h-full w-full object-cover object-[center_35%]"
            />
          </div>
          <div className="absolute bottom-0 left-8 h-[38%] w-[55%] overflow-hidden rounded-[1.25rem] border-4 border-[var(--teal)] shadow-[var(--shadow)]">
            <img
              src="/gallery/culture-day-girls-2.png"
              alt="Learners celebrating culture day"
              className="h-full w-full object-cover object-[center_30%]"
            />
          </div>
          <div className="absolute right-6 bottom-8 h-20 w-20 overflow-hidden rounded-full bg-white shadow-lg ring-4 ring-[var(--navy)]">
            <img src="/crest.png" alt="" className="h-full w-full object-contain" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
