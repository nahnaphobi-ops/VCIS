import { motion, useReducedMotion } from 'framer-motion'
import { school, whatsappEnquireUrl } from '../lib/school'
import { easeOutExpo, fadeUp, staggerContainer } from '../lib/motion'
import { IconArrow } from './icons'

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="top" className="relative isolate overflow-hidden bg-[var(--navy)] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.img
          src="/hero-campus.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_28%] opacity-55"
          initial={reduceMotion ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: easeOutExpo }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,47,54,0.94)_0%,rgba(11,47,54,0.82)_48%,rgba(11,47,54,0.55)_100%)]" />
      </div>

      <div className="relative mx-auto grid min-h-[34rem] max-w-6xl items-center gap-10 px-4 py-16 sm:min-h-[38rem] sm:px-5 md:px-8 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:min-h-[42rem]">
        <motion.div
          className="max-w-xl"
          variants={reduceMotion ? undefined : staggerContainer}
          initial={reduceMotion ? false : 'hidden'}
          animate="show"
        >
          <motion.p className="kicker text-[var(--teal-bright)]" variants={reduceMotion ? undefined : fadeUp}>
            Est. {school.established} · {school.location}
          </motion.p>
          <motion.h1
            className="text-[clamp(2.1rem,6vw,3.6rem)] font-extrabold leading-[1.08] tracking-tight"
            variants={reduceMotion ? undefined : fadeUp}
          >
            Welcome To Victoria Crest International School
          </motion.h1>
          <motion.p
            className="mt-5 max-w-md text-base leading-relaxed text-white/85 md:text-lg"
            variants={reduceMotion ? undefined : fadeUp}
          >
            {school.motto}. Raising young people of character through purposeful learning, warm
            community, and a global outlook.
          </motion.p>
          <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center" variants={reduceMotion ? undefined : fadeUp}>
            <a href="#programmes" className="btn btn-primary">
              Our Programmes
              <IconArrow />
            </a>
            <a
              href={whatsappEnquireUrl(`Hello ${school.shortName}, I would like to enquire about admissions.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-white"
            >
              Enquire Now
            </a>
          </motion.div>
        </motion.div>

        <div className="relative mx-auto hidden h-[28rem] w-full max-w-lg lg:block">
          <div className="absolute top-6 right-0 h-64 w-72 overflow-hidden rounded-[1.25rem] border-4 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.28)]">
            <img src="/gallery/school-building.png" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="absolute bottom-8 left-0 h-52 w-52 overflow-hidden rounded-[1.25rem] border-4 border-[var(--orange)] shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
            <img
              src="/gallery/students-picnic-girls.png"
              alt=""
              className="h-full w-full object-cover object-[center_30%]"
            />
          </div>
          <div className="absolute top-0 left-10 h-28 w-28 overflow-hidden rounded-full border-4 border-[var(--teal)] shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
            <img src="/gallery/culture-day-girls-1.png" alt="" className="h-full w-full object-cover object-[center_25%]" />
          </div>
          <div className="absolute right-10 bottom-0 h-16 w-16 overflow-hidden rounded-full bg-white shadow-lg">
            <img src="/crest.png" alt="" className="h-full w-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  )
}
