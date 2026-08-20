import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { school } from '../lib/school'
import { fadeUp, viewportOnce } from '../lib/motion'
import { IconMinus, IconPlus } from './icons'

const faqs = [
  {
    q: 'Which programmes do you offer?',
    a: 'Victoria Crest welcomes learners across Early Years, Primary, and Junior High. Class groups and year placements are confirmed with families during admissions.',
  },
  {
    q: 'How do I start admissions?',
    a: `Call, WhatsApp, or send a short enquiry with your child’s age and the class you are interested in. Our team will guide you through availability, a visit, and enrolment.`,
  },
  {
    q: 'Where is the school located?',
    a: `${school.name} is in ${school.location}. Contact us and we will help you find the campus for a visit.`,
  },
  {
    q: 'How can I get fee information?',
    a: 'For fees, opening dates, and document checklists, please contact the school directly. We will send you the accurate details for your enquiry.',
  },
  {
    q: 'Can I visit the campus?',
    a: 'Yes. After your first enquiry, we can arrange a visit so your family can see school life and talk through next steps.',
  },
]

export function Faq() {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(0)

  return (
    <section className="section-pad bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <p className="kicker">FAQ</p>
          <h2 className="heading-display text-[var(--navy)]">Do you have any questions?</h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
            If you do not see your question here, call {school.phoneDisplay} /{' '}
            {school.phoneSecondaryDisplay} or send us a WhatsApp message and we will help.
          </p>
        </motion.div>

        <div className="divide-y divide-[var(--cream-muted)] rounded-[12px] border border-[var(--cream-muted)] bg-[var(--cream)]">
          {faqs.map((item, index) => {
            const isOpen = open === index
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                >
                  <span className="font-bold text-[var(--navy)]">{item.q}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--orange)] text-white">
                    {isOpen ? <IconMinus /> : <IconPlus />}
                  </span>
                </button>
                {isOpen && (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-[var(--muted)]">{item.a}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
