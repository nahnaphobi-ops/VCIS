import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, viewportOnce } from '../lib/motion'
import { school } from '../lib/school'

export function DirectorMessage() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="director-message" className="section-pad bg-white">
      <div className="mx-auto max-w-6xl">
        <div className="grid overflow-hidden rounded-[1.25rem] bg-[var(--navy)] lg:grid-cols-[0.82fr_1.18fr]">
          <motion.div
            className="relative min-h-[28rem] overflow-hidden sm:min-h-[34rem] lg:min-h-full"
            initial={reduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={viewportOnce}
            variants={reduceMotion ? undefined : fadeUp}
          >
            <img
              src="/photo_2026-08-23_20-36-01.jpg"
              alt="Director of Victoria Crest International School"
              className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--navy)]/70 via-transparent to-transparent" />
            <p className="absolute bottom-6 left-6 text-xs font-bold tracking-[0.18em] text-white/80 uppercase">
              Leadership &amp; Vision
            </p>
          </motion.div>

          <motion.div
            className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16"
            initial={reduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={viewportOnce}
            variants={reduceMotion ? undefined : fadeUp}
          >
            <span
              aria-hidden="true"
              className="absolute top-5 right-7 font-serif text-[7rem] leading-none text-white/10 sm:right-10"
            >
              “
            </span>
            <p className="kicker">A Message From The Director</p>
            <h2 className="max-w-xl text-3xl font-extrabold leading-tight tracking-[-0.035em] text-white sm:text-4xl">
              Every child deserves the opportunity to discover what they can become.
            </h2>

            <div className="mt-7 max-w-2xl space-y-4 text-sm leading-relaxed text-white/75 sm:text-base">
              <p>
                At {school.name}, we believe education is a partnership built on trust, high
                expectations, and genuine care. Our responsibility is not only to help learners
                achieve academically, but also to nurture the character, confidence, and sense of
                purpose they will carry into the wider world.
              </p>
              <p>
                Every day, our dedicated staff work to create an environment where children feel
                known, supported, and inspired to do their best. We value curiosity, integrity,
                discipline, and compassion because lasting success is measured by more than results;
                it is reflected in the person each learner is becoming.
              </p>
              <p>
                I warmly invite you to discover our school community and see how we partner with
                families to give every learner a strong foundation for the future.
              </p>
            </div>

            <div className="mt-8 border-t border-white/15 pt-6">
              <p className="font-semibold text-white">The Director</p>
              <p className="mt-1 text-xs tracking-[0.14em] text-[var(--orange-bright)] uppercase">
                {school.name}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
