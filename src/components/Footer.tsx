import { school, whatsappEnquireUrl } from '../lib/school'
import { IconFacebook, IconPhone, IconPin } from './icons'

const usefulLinks = [
  { href: '#about', label: 'About' },
  { href: '#programmes', label: 'Programmes' },
  { href: '#admissions', label: 'Admissions' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
]

const services = [
  { href: '#programmes', label: 'Early Years' },
  { href: '#programmes', label: 'Primary' },
  { href: '#programmes', label: 'Junior High' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="text-white">
      <div className="bg-[var(--cream)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
          <div className="relative z-10 translate-y-8 rounded-[12px] bg-white px-5 py-5 text-[var(--navy)] shadow-[var(--shadow)] sm:px-8">
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <p className="text-lg font-extrabold">Stay in the loop</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Follow school updates, celebrations, and admissions news.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a
                  href={school.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-navy"
                >
                  <IconFacebook className="h-4 w-4" />
                  Facebook
                </a>
                <a
                  href={whatsappEnquireUrl(`Hello ${school.shortName}, I would like to receive school updates.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  WhatsApp updates
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--navy)] pt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-5 md:px-8">
        <div className="grid gap-10 pb-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href="#top" className="flex items-center gap-3 text-white no-underline">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white p-0.5">
                <img src="/crest.png" alt="" className="h-full w-full object-contain" />
              </span>
              <span>
                <span className="block font-extrabold">{school.shortName}</span>
                <span className="block text-[10px] font-semibold tracking-[0.16em] text-[var(--orange-bright)] uppercase">
                  {school.motto}
                </span>
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Raising young people of character in {school.location} since {school.established}.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-extrabold tracking-[0.16em] uppercase">Useful links</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {usefulLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-[var(--orange-bright)]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-extrabold tracking-[0.16em] uppercase">Our programmes</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/75">
              {services.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-[var(--orange-bright)]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-extrabold tracking-[0.16em] uppercase">Contact info</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-2">
                <IconPhone className="mt-0.5 h-4 w-4 text-[var(--orange)]" />
                <a href={`tel:${school.phoneTel}`} className="text-white hover:text-[var(--orange-bright)]">
                  {school.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <IconPin className="mt-0.5 h-4 w-4 text-[var(--teal)]" />
                {school.location}
              </li>
              <li>{school.website}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {school.name}. All rights reserved.</p>
          <a
            href={school.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-white"
          >
            <IconFacebook className="h-3.5 w-3.5" />
            Facebook
          </a>
        </div>
        </div>
      </div>
    </footer>
  )
}
