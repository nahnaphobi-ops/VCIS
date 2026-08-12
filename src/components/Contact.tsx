import { useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { school, whatsappEnquireUrl } from '../lib/school'
import { fadeUp, viewportOnce } from '../lib/motion'

export function Contact() {
  const reduceMotion = useReducedMotion()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const parts = [
      `Hello ${school.shortName},`,
      name.trim() ? `My name is ${name.trim()}.` : '',
      phone.trim() ? `My phone number is ${phone.trim()}.` : '',
      message.trim() || 'I would like to enquire about the school.',
    ].filter(Boolean)
    window.open(whatsappEnquireUrl(parts.join(' ')), '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="contact" className="section-pad bg-[var(--navy-deep)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-[var(--orange-bright)] uppercase">
            Contact
          </p>
          <h2 className="font-display heading-display font-semibold">
            Speak with us today.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/90">
            Call, message on WhatsApp, or send a short enquiry — we will follow up with you.
          </p>

          <ul className="mt-10 space-y-5 text-sm">
            <li>
              <p className="text-xs tracking-[0.18em] text-[#ff8533] uppercase">Phone</p>
              <a
                href={`tel:${school.phoneTel}`}
                className="mt-1 inline-block text-lg font-medium text-white no-underline transition-colors duration-300 hover:text-[var(--orange-bright)]"
              >
                {school.phoneDisplay}
              </a>
            </li>
            <li>
              <p className="text-xs tracking-[0.18em] text-[#ff8533] uppercase">WhatsApp</p>
              <a
                href={whatsappEnquireUrl(`Hello ${school.shortName}, I would like to enquire.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-lg font-medium text-white no-underline transition-colors duration-300 hover:text-[var(--orange-bright)]"
              >
                +233 24 201 9659
              </a>
            </li>
            <li>
              <p className="text-xs tracking-[0.18em] text-[#ff8533] uppercase">Location</p>
              <p className="mt-1 text-lg font-medium">{school.location}</p>
              <p className="text-white/80">{school.name}</p>
            </li>
            <li>
              <p className="text-xs tracking-[0.18em] text-[#ff8533] uppercase">Website</p>
              <p className="mt-1 text-lg font-medium">{school.website}</p>
            </li>
          </ul>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          className="border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:p-6 md:p-8"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <h3 className="font-display text-2xl font-semibold">Enquire via WhatsApp</h3>
          <p className="mt-2 text-sm text-white/70">
            Submitting opens WhatsApp with your message ready to send.
          </p>

          <label className="mt-6 block text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border border-white/15 bg-[var(--navy)]/60 px-4 py-3 text-sm font-normal tracking-normal text-white outline-none transition-colors duration-300 focus:border-[var(--orange)]"
              placeholder="Your name"
              autoComplete="name"
            />
          </label>

          <label className="mt-4 block text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">
            Phone
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full border border-white/15 bg-[var(--navy)]/60 px-4 py-3 text-sm font-normal tracking-normal text-white outline-none transition-colors duration-300 focus:border-[var(--orange)]"
              placeholder="Your phone number"
              autoComplete="tel"
            />
          </label>

          <label className="mt-4 block text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">
            Message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-2 w-full resize-y border border-white/15 bg-[var(--navy)]/60 px-4 py-3 text-sm font-normal tracking-normal text-white outline-none transition-colors duration-300 focus:border-[var(--orange)]"
              placeholder="I would like to know more about admissions…"
            />
          </label>

          <motion.button
            type="submit"
            className="mt-6 w-full rounded-sm bg-[var(--orange)] px-6 py-3.5 text-sm font-semibold tracking-wide text-white"
            whileHover={reduceMotion ? undefined : { scale: 1.015, backgroundColor: '#ff8533' }}
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
          >
            Send on WhatsApp
          </motion.button>
        </motion.form>
      </div>
    </section>
  )
}
