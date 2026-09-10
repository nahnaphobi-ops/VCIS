import { motion, useReducedMotion } from 'framer-motion'
import { school, whatsappEnquireUrl } from '../lib/school'
import { fadeUp, staggerFast, viewportOnce } from '../lib/motion'

const steps = [
  {
    step: '01',
    title: 'Enquire',
    body: 'Call, WhatsApp, or send a short message with your child’s age and the class you are interested in.',
    image: '/gallery/students-group-portrait.jpg',
  },
  {
    step: '02',
    title: 'Visit & apply',
    body: 'We share school life, placement, and the documents our admissions team needs for your family.',
    image: '/gallery/students-group-formal.jpg',
  },
  {
    step: '03',
    title: 'Confirm enrolment',
    body: 'Once placement is confirmed, we welcome your child into the Victoria Crest community.',
    image: '/gallery/students-group-candid.jpg',
  },
]

const admissionNotes = [
  ['Placement conversation', 'We learn about your child, answer questions, and recommend the most suitable entry point.'],
  ['School visit', 'See the campus, meet the team, and understand the rhythm of a normal school day.'],
  ['Documents and assessment', 'The admissions team will confirm the documents and any age-appropriate assessment needed.'],
  ['Welcome and orientation', 'Once a place is confirmed, we share the next steps for a smooth start.'],
]

export function Admissions() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="admissions" className="section-pad bg-[var(--cream)]">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <p className="kicker">How It Works</p>
          <h2 className="heading-display text-[var(--navy)]">We always follow a clear admissions path.</h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
            Admissions at {school.shortName} starts with a conversation. For fees, opening dates, and
            document checklists, contact the school directly — we will send accurate details for your enquiry.
          </p>
        </motion.div>

        <motion.ol
          className="relative mt-14 grid gap-8 md:grid-cols-3"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : staggerFast}
        >
          <span
            className="pointer-events-none absolute top-16 right-[16%] left-[16%] hidden border-t-2 border-dashed border-[var(--orange)] md:block"
            aria-hidden
          />
          {steps.map((item) => (
            <motion.li key={item.step} className="relative text-center" variants={reduceMotion ? undefined : fadeUp}>
              <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-[var(--shadow)]">
                <img src={item.image} alt="" className="h-full w-full object-cover" />
              </div>
              <p className="mt-4 text-sm font-extrabold text-[var(--orange)]">{item.step}</p>
              <h3 className="mt-1 text-xl font-extrabold text-[var(--navy)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.body}</p>
            </motion.li>
          ))}
        </motion.ol>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={whatsappEnquireUrl(`Hello ${school.shortName}, I would like to begin an admissions enquiry.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-full sm:w-auto"
          >
            Start on WhatsApp
          </a>
          <a href={`tel:${school.phoneTel}`} className="btn btn-outline w-full sm:w-auto">
            Call {school.phoneDisplay}
          </a>
        </div>

        <div className="mt-16 grid gap-10 border-t border-[var(--cream-muted)] pt-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="kicker">What To Expect</p>
            <h3 className="text-2xl font-extrabold tracking-tight text-[var(--navy)] md:text-3xl">A thoughtful start matters.</h3>
            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] md:text-base">
              We keep the process personal and clear. Contact us early so the team can explain current availability,
              fees, term dates, and the documents relevant to your child.
            </p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-2">
            {admissionNotes.map(([title, body], index) => (
              <li key={title} className="flex gap-4 rounded-[12px] bg-white p-5 shadow-[var(--shadow)]">
                <span className="text-sm font-black text-[var(--orange)]">0{index + 1}</span>
                <div>
                  <h4 className="font-extrabold text-[var(--navy)]">{title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
