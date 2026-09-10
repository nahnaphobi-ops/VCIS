import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { school } from '../lib/school'
import { transitionFast } from '../lib/motion'
import { IconFacebook, IconPhone, IconPin } from './icons'

const links = [
  { to: '/about', label: 'About' },
  { to: '/programmes', label: 'Programmes' },
  { to: '/admissions', label: 'Admissions' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export function Nav() {
  const reduceMotion = useReducedMotion()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative text-sm font-semibold text-[var(--navy)] no-underline ${isActive ? 'is-active' : ''}`

  return (
    <>
      <div className="bg-[var(--navy)] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 text-xs sm:px-5 md:px-8 sm:text-sm">
          <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1 text-white/85">
            <a href={`tel:${school.phoneTel}`} className="inline-flex items-center gap-2 text-white/90 no-underline hover:text-white">
              <IconPhone className="h-3.5 w-3.5 text-[var(--orange)]" />
              {school.phoneDisplay}
            </a>
            <span className="hidden text-white/40 sm:inline" aria-hidden="true">
              /
            </span>
            <a
              href={`tel:${school.phoneSecondaryTel}`}
              className="hidden items-center text-white/65 no-underline hover:text-white sm:inline-flex"
            >
              {school.phoneSecondaryDisplay}
            </a>
            <span className="hidden items-center gap-2 sm:inline-flex">
              <IconPin className="h-3.5 w-3.5 text-[var(--teal)]" />
              {school.location}
            </span>
          </div>
          <a
            href={school.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[var(--orange)]"
            aria-label="Victoria Crest on Facebook"
          >
            <IconFacebook className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-[var(--cream-muted)] bg-white shadow-[0_8px_24px_rgba(12,27,53,0.06)]">
        <div id="site-nav-bar" className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5 md:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-2.5 text-[var(--navy)] no-underline">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-[var(--cream-muted)] bg-white p-1 shadow-sm sm:h-16 sm:w-16">
              <img src="/crest.png" alt="Victoria Crest International School crest" className="h-full w-full object-contain" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-extrabold tracking-tight text-[var(--navy)] sm:text-lg">
                Victoria Crest
              </span>
              <span className="block text-[10px] font-semibold tracking-[0.16em] text-[var(--orange)] uppercase">
                International School
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={linkClass}>
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute inset-x-0 -bottom-1 h-0.5 origin-left rounded-full bg-[var(--orange)] transition-transform duration-300 ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
            <Link to="/contact" className="btn btn-primary">
              Enquire Now
            </Link>
          </nav>

          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-[var(--cream-muted)] text-[var(--navy)] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="flex flex-col gap-1.5">
              <span className={`block h-0.5 w-5 bg-[var(--navy)] transition duration-300 ${open ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 bg-[var(--navy)] transition duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-[var(--navy)] transition duration-300 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
            </span>
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-nav"
              aria-label="Primary"
              className="overflow-hidden border-t border-[var(--cream-muted)] bg-white px-5 lg:hidden"
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={transitionFast}
            >
              <div className="flex flex-col gap-1 py-4">
                {links.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.3 }}
                  >
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `block rounded-[10px] px-2 py-3 text-base font-semibold text-[var(--navy)] no-underline ${
                          isActive ? 'bg-[var(--cream)]' : 'hover:bg-[var(--cream)]'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
                <Link to="/contact" className="btn btn-primary mt-2">
                  Enquire Now
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[var(--navy)]/25 lg:hidden"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </>
  )
}
