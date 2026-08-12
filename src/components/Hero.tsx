import { motion, useReducedMotion } from 'framer-motion'
import { school, whatsappEnquireUrl } from '../lib/school'
import { easeOutExpo, fadeUp, staggerContainer } from '../lib/motion'

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden bg-[#03152D] px-4 pb-16 pt-24 text-center text-white sm:px-5 sm:pb-14 sm:pt-24 md:px-8 md:pt-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <motion.img
          src="/hero-campus.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_22%] brightness-[1.35] sm:object-[center_30%]"
          initial={reduceMotion ? false : { scale: 1.14, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 10, ease: easeOutExpo }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-[#03152D]/20 via-[#03152D]/45 to-[#03152D]/95"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: easeOutExpo }}
        />
      </div>

      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center"
        variants={reduceMotion ? undefined : staggerContainer}
        initial={reduceMotion ? false : 'hidden'}
        animate="show"
      >
        <h1 className="sr-only">{school.name}</h1>

        <motion.div
          className="relative z-20 mb-[-2.25rem] flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.45)] sm:mb-[-3rem] sm:h-36 sm:w-36 sm:p-3 md:h-40 md:w-40"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.78, y: 18 }}
          animate={
            reduceMotion
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 1, scale: 1, y: [0, -7, 0] }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  opacity: { duration: 0.8, ease: easeOutExpo },
                  scale: { duration: 0.8, ease: easeOutExpo },
                  y: {
                    delay: 1,
                    duration: 5.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }
          }
        >
          <img src="/crest.png" alt="" className="h-full w-full object-contain" />
        </motion.div>

        <motion.div
          className="relative z-10 w-full max-w-xl rounded-sm bg-[#03152D]/88 px-4 pb-6 pt-12 shadow-[0_12px_48px_rgba(0,0,0,0.45)] backdrop-blur-md sm:px-10 sm:pb-8 sm:pt-[4.5rem]"
          variants={reduceMotion ? undefined : fadeUp}
        >
          <motion.p
            className="font-display text-[clamp(1.55rem,7vw,2.5rem)] font-semibold tracking-wide text-white"
            variants={reduceMotion ? undefined : fadeUp}
          >
            {school.motto}
          </motion.p>

          <motion.p
            className="mx-auto mt-3 max-w-md text-sm font-medium leading-relaxed text-white sm:text-base"
            variants={reduceMotion ? undefined : fadeUp}
          >
            Raising young people of character in {school.location} since {school.established}.
          </motion.p>

          <motion.div
            className="mt-6 flex w-full flex-col items-stretch gap-3 sm:mt-7 sm:items-center"
            variants={reduceMotion ? undefined : fadeUp}
          >
            <motion.a
              href="#contact"
              className="w-full rounded-[4px] bg-[#EF5B04] px-7 py-3.5 text-center text-sm font-semibold tracking-wide text-white no-underline sm:w-auto"
              whileHover={reduceMotion ? undefined : { scale: 1.03, backgroundColor: '#ff8533' }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
            >
              Enquire Now
            </motion.a>
            <div className="flex flex-col items-center gap-1 text-sm font-medium tracking-wide text-[#e8b18a] sm:flex-row sm:gap-0 sm:text-sm">
              <a
                href={`tel:${school.phoneTel}`}
                className="inline-flex min-h-11 items-center px-3 py-2 transition-colors duration-300 hover:text-white"
              >
                Call {school.phoneDisplay}
              </a>
              <span aria-hidden="true" className="hidden text-white/35 sm:inline">
                |
              </span>
              <a
                href={whatsappEnquireUrl(
                  `Hello ${school.shortName}, I would like to enquire about admissions.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center px-3 py-2 transition-colors duration-300 hover:text-white"
              >
                WhatsApp Us
              </a>
            </div>
          </motion.div>

          <motion.p
            className="mt-5 text-[11px] font-semibold tracking-[0.18em] text-white uppercase sm:mt-6 sm:text-xs sm:tracking-[0.2em]"
            variants={reduceMotion ? undefined : fadeUp}
          >
            Est. {school.established} · {school.location}
          </motion.p>
        </motion.div>
      </motion.div>

      {!reduceMotion && (
        <motion.a
          href="#about"
          className="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold tracking-[0.22em] text-white/70 uppercase no-underline sm:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 6, 0] }}
          transition={{
            opacity: { delay: 1.4, duration: 0.6 },
            y: { delay: 1.6, duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          Scroll
          <span className="block h-8 w-px bg-gradient-to-b from-white/70 to-transparent" aria-hidden />
        </motion.a>
      )}
    </section>
  )
}
