import { useState, type FormEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { school, whatsappEnquireUrl } from '../lib/school'
import { useSchool } from '../lib/useSchool'
import { fadeUp, viewportOnce } from '../lib/motion'
import { IconQuote } from './icons'

export function Contact() {
  const reduceMotion = useReducedMotion()
  const { live } = useSchool()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [childAge, setChildAge] = useState('')
  const [message, setMessage] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const parts = [
      `Hello ${school.shortName},`,
      name.trim() ? `My name is ${name.trim()}.` : '',
      phone.trim() ? `My phone number is ${phone.trim()}.` : '',
      childAge.trim() ? `My child is ${childAge.trim()} years old.` : '',
      message.trim() || 'I would like to enquire about the school.',
    ].filter(Boolean)
    window.open(whatsappEnquireUrl(parts.join(' ')), '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="contact" className="section-pad bg-white">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[1.25rem] lg:grid-cols-2">
        <motion.form
          onSubmit={onSubmit}
          className="bg-[var(--orange)] px-6 py-10 text-white sm:px-10 md:px-12 md:py-14"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/80">Contact</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">Request a quick enquiry</h2>
          <p className="mt-3 text-sm text-white/90">
            Submitting opens WhatsApp with your message ready to send.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-bold tracking-[0.14em] uppercase">
              Name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field mt-2"
                placeholder="Your name"
                autoComplete="name"
              />
            </label>
            <label className="block text-xs font-bold tracking-[0.14em] uppercase">
              Phone
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field mt-2"
                placeholder="Your phone number"
                autoComplete="tel"
              />
            </label>
            <label className="block text-xs font-bold tracking-[0.14em] uppercase sm:col-span-2">
              Child’s age
              <input
                type="text"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                className="input-field mt-2"
                placeholder="e.g. 7"
              />
            </label>
            <label className="block text-xs font-bold tracking-[0.14em] uppercase sm:col-span-2">
              Message
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="input-field mt-2 resize-y"
                placeholder="I would like to know more about admissions…"
              />
            </label>
          </div>

          <button type="submit" className="btn btn-navy mt-6 w-full sm:w-auto">
            Send on WhatsApp
          </button>
        </motion.form>

        <motion.div
          className="flex flex-col justify-between bg-[var(--navy)] px-6 py-10 text-white sm:px-10 md:px-12 md:py-14"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--teal-bright)]">Community</p>
            <h3 className="mt-3 text-3xl font-extrabold tracking-tight">What our families find here.</h3>
            <div className="mt-8 rounded-[1.25rem] bg-[var(--teal)] p-6 text-[var(--navy)]">
              <IconQuote className="h-9 w-9 text-white/80" />
              <p className="mt-3 text-lg font-semibold leading-relaxed">
                “{school.motto}. A Kumasi school community raising young people of character since{' '}
                {school.established}.”
              </p>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white p-1">
                  <img src="/crest.png" alt="" className="h-full w-full object-contain" />
                </span>
                <div>
                  <p className="font-extrabold">{school.shortName} family</p>
                  <p className="text-sm text-[var(--navy)]/70">{school.facebookFollowers} Facebook community</p>
                </div>
              </div>
            </div>
          </div>

          <ul className="mt-10 space-y-3 text-sm text-white/80">
            <li>
              Phone:{' '}
              <a href={`tel:${school.phoneTel}`} className="font-semibold text-white hover:text-[var(--orange-bright)]">
                {school.phoneDisplay}
              </a>
              <span className="text-white/45"> / </span>
              <a
                href={`tel:${school.phoneSecondaryTel}`}
                className="font-semibold text-white hover:text-[var(--orange-bright)]"
              >
                {school.phoneSecondaryDisplay}
              </a>
            </li>
            {live?.email ? (
              <li>
                Email:{' '}
                <a
                  href={`mailto:${live.email}`}
                  className="font-semibold text-white hover:text-[var(--orange-bright)]"
                >
                  {live.email}
                </a>
              </li>
            ) : null}
            <li>Location: {school.location}</li>
            <li>Website: {school.website}</li>
          </ul>

          <div className="mt-10 grid gap-3 border-t border-white/15 pt-6 text-sm text-white/75 sm:grid-cols-2">
            <div>
              <p className="font-bold text-white">Admissions enquiries</p>
              <p className="mt-1">Call or WhatsApp for current places and fees.</p>
            </div>
            <div>
              <p className="font-bold text-white">School location</p>
              <p className="mt-1">{school.location}. Visit by appointment.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
