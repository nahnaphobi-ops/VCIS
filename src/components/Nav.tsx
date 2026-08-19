import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState, type MouseEvent } from 'react'
import { school } from '../lib/school'
import { transitionFast } from '../lib/motion'
import { scrollToSection } from '../lib/scrollToSection'
import { IconFacebook, IconPhone, IconPin } from './icons'

const links = [
  { href: '#top', label: 'Home' },
  { href: '#about', label: 'About' },
  { href: '#programmes', label: 'Programmes' },
  { href: '#admissions', label: 'Admissions' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [activeHref, setActiveHref] = useState('#top')

  useEffect(() => {
    if (!window.location.hash) return
    const hash = window.location.hash
    const timer = window.setTimeout(() => {
      scrollToSection(hash, { behavior: 'auto' })
      setActiveHref(hash)
    }, 50)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((section): section is HTMLElement => Boolean(section))

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActiveHref(`#${visible.target.id}`)
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.1, 0.25, 0.5] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  function waitForMenuClose() {
    return new Promise<void>((resolve) => {
      const started = performance.now()
      const tick = () => {
        if (!document.getElementById('mobile-nav') || performance.now() - started > 700) {
          resolve()
          return
        }
        requestAnimationFrame(tick)
      }
      tick()
    })
  }

  function goToSection(event: MouseEvent<HTMLAnchorElement>, href: string) {
    if (!href.startsWith('#')) return
    event.preventDefault()
    const wasOpen = open
    setOpen(false)
    setActiveHref(href)

    const behavior: ScrollBehavior = reduceMotion ? 'auto' : 'smooth'
    void (async () => {
      if (wasOpen) await waitForMenuClose()
      if (!scrollToSection(href, { behavior })) {
        window.location.hash = href
      }
    })()
  }

  return (
    <>
      <div className="bg-[var(--navy)] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 text-xs sm:px-5 md:px-8 sm:text-sm">
          <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1 text-white/85">
            <a href={`tel:${school.phoneTel}`} className="inline-flex items-center gap-2 text-white/90 no-underline hover:text-white">
              <IconPhone className="h-3.5 w-3.5 text-[var(--orange)]" />
              {school.phoneDisplay}
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

      <header className="sticky top-0 z-50 border-b border-[var(--cream-muted)] bg-white shadow-[0_8px_24px_rgba(11,47,54,0.06)]">
        <div id="site-nav-bar" className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5 md:px-8">
          <a
            href="#top"
            onClick={(event) => goToSection(event, '#top')}
            className="flex min-w-0 items-center gap-2.5 text-[var(--navy)] no-underline"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--cream)] p-0.5 sm:h-12 sm:w-12">
              <img src="/crest.png" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-extrabold tracking-tight text-[var(--navy)] sm:text-lg">
                Victoria Crest
              </span>
              <span className="block text-[10px] font-semibold tracking-[0.16em] text-[var(--orange)] uppercase">
                International School
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
            {links.map((link) => {
              const current = activeHref === link.href
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={current ? 'page' : undefined}
                  onClick={(event) => goToSection(event, link.href)}
                  className="group relative text-sm font-semibold text-[var(--navy)] no-underline"
                >
                  {link.label}
                  <span
                    className={`absolute inset-x-0 -bottom-1 h-0.5 origin-left rounded-full bg-[var(--orange)] transition-transform duration-300 ${
                      current ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </a>
              )
            })}
            <a href="#contact" onClick={(event) => goToSection(event, '#contact')} className="btn btn-primary">
              Enquire Now
            </a>
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
                {links.map((link, i) => {
                  const current = activeHref === link.href
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      aria-current={current ? 'page' : undefined}
                      className={`rounded-[10px] px-2 py-3 text-base font-semibold text-[var(--navy)] no-underline ${
                        current ? 'bg-[var(--cream)]' : 'hover:bg-[var(--cream)]'
                      }`}
                      initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, duration: 0.3 }}
                      onClick={(event) => goToSection(event, link.href)}
                    >
                      {link.label}
                    </motion.a>
                  )
                })}
                <a
                  href="#contact"
                  className="btn btn-primary mt-2"
                  onClick={(event) => goToSection(event, '#contact')}
                >
                  Enquire Now
                </a>
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
