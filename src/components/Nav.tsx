import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { school } from '../lib/school'
import { transitionFast } from '../lib/motion'

const links = [
  { href: '#about', label: 'About' },
  { href: '#programmes', label: 'Programmes' },
  { href: '#admissions', label: 'Admissions' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  const reduceMotion = useReducedMotion()
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 ${
        solid ? 'shadow-lg shadow-black/20' : ''
      }`}
      initial={reduceMotion ? false : { y: -24, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        backgroundColor: solid ? 'rgba(0, 33, 71, 0.95)' : 'rgba(0, 21, 46, 0.72)',
      }}
      transition={{
        y: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.55 },
        backgroundColor: { duration: 0.35 },
      }}
      style={{ backdropFilter: 'blur(10px)' }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-5 md:px-8">
        <a href="#top" className="flex min-w-0 items-center gap-2.5 text-white no-underline sm:gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5 sm:h-11 sm:w-11 md:h-12 md:w-12">
            <img src="/crest.png" alt="" className="h-full w-full object-contain" />
          </span>
          <span className="font-display min-w-0 text-base leading-tight font-semibold tracking-wide text-white sm:text-lg md:text-xl">
            Victoria Crest
            <span className="mt-0.5 block font-[var(--font-body)] text-[9px] font-medium tracking-[0.14em] text-[#ff8533] uppercase sm:text-[10px] sm:tracking-[0.18em]">
              International School
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative text-sm font-medium tracking-wide text-white no-underline"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[#ff8533] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </a>
          ))}
          <motion.a
            href="#contact"
            className="rounded-sm bg-[#ff6600] px-4 py-2 text-sm font-semibold tracking-wide text-white no-underline"
            whileHover={reduceMotion ? undefined : { scale: 1.04, backgroundColor: '#ff8533' }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          >
            Enquire
          </motion.a>
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-white/25 text-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex flex-col gap-1.5">
            <span
              className={`block h-0.5 w-5 bg-white transition duration-300 ${open ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition duration-300 ${open ? 'opacity-0' : ''}`}
            />
            <span
              className={`block h-0.5 w-5 bg-white transition duration-300 ${open ? '-translate-y-2 -rotate-45' : ''}`}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            className="overflow-hidden border-t border-white/10 bg-[#002147] px-5 md:hidden"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={transitionFast}
          >
            <div className="flex flex-col gap-3 py-4">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className="py-3 text-base font-medium text-white no-underline"
                  initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.3 }}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href="#contact"
                className="mt-1 rounded-sm bg-[#ff6600] px-4 py-3 text-center text-sm font-semibold text-white no-underline"
                onClick={() => setOpen(false)}
              >
                Enquire
              </a>
              <p className="pt-2 text-xs tracking-wide text-white/50">{school.location}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
