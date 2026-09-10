import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { school } from '../lib/school'
import { fadeUp, viewportOnce } from '../lib/motion'
import { IconArrow, IconCheck } from './icons'

const points = [
  'Character-led classrooms guided by Excellence, Integrity, and Purpose',
  'Pathways from Early Years through Junior High',
  'A warm Kumasi community around every learner',
  'Curiosity, achievement, and a global outlook in daily school life',
]

const values = [
  {
    title: 'Excellence',
    body: 'We help every learner build strong habits, ask better questions, and take pride in their work.',
  },
  {
    title: 'Integrity',
    body: 'We teach children to make honest choices, show respect, and take responsibility for their actions.',
  },
  {
    title: 'Purpose',
    body: 'We connect learning to the wider world so students grow into confident, useful members of their communities.',
  },
]

export function About() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="about" className="section-pad bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
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
              {school.name} has served families in {school.location} since {school.established}. Guided by{' '}
              <span className="font-semibold text-[var(--navy)]">{school.motto}</span>, we raise young people who
              learn with purpose and lead with integrity.
            </p>
            <ul className="mt-6 space-y-3">
              {points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm leading-relaxed text-[var(--navy)] md:text-base"
                >
                  <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--teal)]" />
                  {point}
                </li>
              ))}
            </ul>
            <Link to="/programmes" className="btn btn-primary mt-8">
              Explore programmes
              <IconArrow />
            </Link>
          </motion.div>

          <motion.div
            className="relative mx-auto aspect-[1.05/1] w-full max-w-lg"
            initial={reduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={viewportOnce}
            variants={reduceMotion ? undefined : fadeUp}
          >
            <div className="absolute top-0 left-0 h-[58%] w-[58%] overflow-hidden rounded-[1.25rem] shadow-[var(--shadow)]">
              <img
                src="/gallery/students-group-formal.jpg"
                alt="Victoria Crest learners in uniform"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute top-6 right-0 h-[42%] w-[48%] overflow-hidden rounded-[1.25rem] border-4 border-[var(--orange)] shadow-[var(--shadow)]">
              <img
                src="/gallery/students-pair-boy-girl.jpg"
                alt="Two Victoria Crest students in uniform"
                className="h-full w-full object-cover object-[center_30%]"
              />
            </div>
            <div className="absolute bottom-0 left-8 h-[38%] w-[55%] overflow-hidden rounded-[1.25rem] border-4 border-[var(--teal)] shadow-[var(--shadow)]">
              <img
                src="/gallery/students-group-candid.jpg"
                alt="Victoria Crest learners sharing a moment together"
                className="h-full w-full object-cover object-[center_30%]"
              />
            </div>
            <div className="absolute right-6 bottom-8 h-20 w-20 overflow-hidden rounded-full bg-white shadow-lg ring-4 ring-[var(--navy)]">
              <img src="/crest.png" alt="" className="h-full w-full object-contain" />
            </div>
          </motion.div>
        </div>

        <div className="mt-16 border-t border-[var(--cream-muted)] pt-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="kicker">What We Believe</p>
              <h3 className="text-2xl font-extrabold tracking-tight text-[var(--navy)] md:text-3xl">
                Education is more than what happens in a classroom.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                Our teachers, families, and learners work together to create a school culture where children feel
                known, challenged, and encouraged to contribute.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {values.map((value, index) => (
                <article key={value.title} className="rounded-[12px] bg-[var(--cream)] p-5">
                  <span className="text-2xl font-black text-[var(--orange)]">0{index + 1}</span>
                  <h4 className="mt-4 font-extrabold text-[var(--navy)]">{value.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{value.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
