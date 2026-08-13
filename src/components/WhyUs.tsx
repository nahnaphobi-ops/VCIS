import { motion, useReducedMotion } from 'framer-motion'
import { school, whatsappEnquireUrl } from '../lib/school'
import { fadeUp, staggerFast, viewportOnce } from '../lib/motion'
import { IconGlobe, IconHeart, IconShield, IconSpark } from './icons'

const reasons = [
  {
    icon: IconShield,
    title: 'Safe, attentive care',
    body: 'A school community that keeps learning damage-free — in character, confidence, and daily care.',
  },
  {
    icon: IconSpark,
    title: 'Purpose-led classrooms',
    body: 'Curiosity, careful work, and pride in progress from the earliest years through junior high.',
  },
  {
    icon: IconGlobe,
    title: 'A global outlook',
    body: 'An international mindset that prepares students for a connected world beyond Kumasi.',
  },
  {
    icon: IconHeart,
    title: 'A growing family',
    body: `${school.facebookFollowers} followers stay connected with school life, celebrations, and updates.`,
  },
]

export function WhyUs() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="bg-white">
      <div className="section-pad pb-0">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-end"
            initial={reduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={viewportOnce}
            variants={reduceMotion ? undefined : fadeUp}
          >
            <div>
              <p className="kicker">Why Choose Us</p>
              <h2 className="heading-display text-[var(--navy)]">
                Why we are considered a trusted choice for families.
              </h2>
            </div>
            <p className="text-base leading-relaxed text-[var(--muted)] md:text-lg">
              Our crest carries four promises: knowledge, achievement, a global outlook, and lasting
              growth. Those symbols shape daily school life — from the classroom to the wider
              community around every learner.
            </p>
          </motion.div>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div className="absolute inset-[12%] overflow-hidden rounded-full border-[10px] border-[var(--cream)] shadow-[var(--shadow)]">
                <img src="/gallery/group-steps.png" alt="" className="h-full w-full object-cover object-[center_28%]" />
              </div>
              <div className="absolute top-2 right-8 h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
                <img src="/gallery/culture-day-young.png" alt="" className="h-full w-full object-cover object-[center_30%]" />
              </div>
              <div className="absolute bottom-6 left-2 h-28 w-28 overflow-hidden rounded-full border-4 border-[var(--orange)] shadow-lg">
                <img src="/gallery/play-swings.png" alt="" className="h-full w-full object-cover object-[center_40%]" />
              </div>
              <div className="absolute right-0 bottom-16 h-20 w-20 overflow-hidden rounded-full border-4 border-[var(--teal)] shadow-lg">
                <img src="/gallery/culture-day-boy.png" alt="" className="h-full w-full object-cover object-[center_25%]" />
              </div>
            </div>

            <motion.ul
              className="grid gap-5 sm:grid-cols-2"
              initial={reduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={viewportOnce}
              variants={reduceMotion ? undefined : staggerFast}
            >
              {reasons.map((reason) => (
                <motion.li
                  key={reason.title}
                  className="rounded-[12px] bg-[var(--cream)] p-5"
                  variants={reduceMotion ? undefined : fadeUp}
                >
                  <span className="inline-flex text-[var(--orange)]">
                    <reason.icon />
                  </span>
                  <h3 className="mt-3 text-lg font-extrabold text-[var(--navy)]">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{reason.body}</p>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>

      <div className="section-pad pt-10">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[1.25rem] bg-[var(--orange)] text-white">
          <div className="grid items-center lg:grid-cols-[1.2fr_0.8fr]">
            <div className="px-6 py-10 sm:px-10 md:px-12 md:py-12">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/80">Start here</p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">
                Begin your child’s journey with Victoria Crest.
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/90 md:text-base">
                Tell us your child’s age and the class you have in mind — we will guide you through
                availability, placement, and enrolment.
              </p>
              <a
                href={whatsappEnquireUrl(`Hello ${school.shortName}, I would like to begin an admissions enquiry.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-navy mt-6"
              >
                Start Admissions
              </a>
            </div>
            <div className="relative hidden min-h-[16rem] lg:block">
              <img
                src="/gallery/lunch-tables.png"
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-[center_45%]"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[var(--orange)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
