import { motion, useReducedMotion } from 'framer-motion'
import { school, whatsappEnquireUrl } from '../lib/school'
import { fadeUp, staggerFast, viewportOnce } from '../lib/motion'

const steps = [
  {
    step: '01',
    title: 'Enquire',
    body: 'Call, WhatsApp, or send a short message with your child’s age and the class you are interested in.',
  },
  {
    step: '02',
    title: 'Visit & guidance',
    body: 'We share what you need to know about school life, placement, and next steps for your family.',
  },
  {
    step: '03',
    title: 'Submit details',
    body: 'Provide the learner’s information and any documents our admissions team requests.',
  },
  {
    step: '04',
    title: 'Confirm enrolment',
    body: 'Once placement is confirmed, we welcome your child into the Victoria Crest community.',
  },
]

export function Admissions() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="admissions" className="section-pad bg-[var(--cream)]">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <motion.div
            initial={reduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={viewportOnce}
            variants={reduceMotion ? undefined : fadeUp}
          >
            <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-[var(--orange)] uppercase">
              Admissions
            </p>
            <h2 className="font-display heading-display font-semibold text-[var(--navy)]">
              Begin your child’s journey with us.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--muted)] md:text-lg">
              Admissions at {school.shortName} starts with a conversation. Tell us about your child,
              and we will guide you through availability, placement, and enrolment for the current
              academic year.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
              For fees, opening dates, and document checklists, please contact the school directly —
              we will send you the accurate details for your enquiry.
            </p>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
              <motion.a
                href={whatsappEnquireUrl(
                  `Hello ${school.shortName}, I would like to begin an admissions enquiry.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-sm bg-[#EF5B04] px-6 py-3.5 text-center text-sm font-semibold tracking-wide text-white no-underline sm:w-auto"
                whileHover={reduceMotion ? undefined : { scale: 1.03, backgroundColor: '#ff8533' }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              >
                Start on WhatsApp
              </motion.a>
              <a
                href={`tel:${school.phoneTel}`}
                className="w-full rounded-sm border border-[var(--navy)] px-6 py-3.5 text-center text-sm font-semibold tracking-wide text-[var(--navy)] no-underline transition hover:bg-[var(--navy)] hover:text-white sm:w-auto"
              >
                Call {school.phoneDisplay}
              </a>
            </div>
          </motion.div>

          <motion.ol
            className="space-y-4"
            initial={reduceMotion ? false : 'hidden'}
            whileInView="show"
            viewport={viewportOnce}
            variants={reduceMotion ? undefined : staggerFast}
          >
            {steps.map((item) => (
              <motion.li
                key={item.step}
                className="flex gap-3 border border-[var(--cream-muted)] bg-white/80 p-4 sm:gap-4 sm:p-5"
                variants={reduceMotion ? undefined : fadeUp}
              >
                <span className="font-display shrink-0 text-xl font-semibold text-[var(--orange)] sm:text-2xl">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-[var(--navy)]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{item.body}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  )
}
