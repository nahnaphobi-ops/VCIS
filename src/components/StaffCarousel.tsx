import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { fadeUp, viewportOnce } from '../lib/motion'

type StaffMember = {
  name: string
  role: string
  file: string
}

/** Leadership first, then early years up through JHS, then support staff. */
const staff: StaffMember[] = [
  { name: 'Gideon Ahiabli', role: 'Managing Director', file: 'gideon-ahiabli' },
  { name: 'Prince Mahunu', role: 'Administrator', file: 'prince-mahunu' },
  { name: 'Franklina Boateng', role: 'HOD & Early Child Facilitator', file: 'franklina-boateng' },
  { name: 'Susan Morgan', role: 'Early Child Facilitator', file: 'susan-morgan' },
  { name: 'Rukaya Arimeyaw', role: 'Early Child Facilitator', file: 'rukaya-arimeyaw' },
  { name: 'Theresah Afriyie', role: 'Nursery Facilitator', file: 'theresah-afriyie' },
  { name: 'Cecilia Opong', role: 'Nursery Facilitator', file: 'cecilia-opong' },
  { name: 'Bismark Tonja', role: 'KG Facilitator', file: 'bismark-tonja' },
  { name: 'Belinda Owusuwaa', role: 'KG1 Facilitator', file: 'belinda-owusuwaa' },
  { name: 'Benjamin Boakye', role: 'Primary Level Facilitator', file: 'benjamin-boakye' },
  { name: 'Kelvin Krah', role: 'Primary Level Facilitator', file: 'kelvin-krah' },
  { name: 'Priscilla Obeng', role: 'Primary Level Facilitator', file: 'priscilla-obeng' },
  { name: 'Konadu Casandra', role: 'Basic Level Facilitator', file: 'konadu-casandra' },
  { name: 'Daniel Kissi', role: 'HOD & Basic 5 Facilitator', file: 'daniel-kissi' },
  { name: 'Bernard Appiah', role: 'HOD & JHS Facilitator', file: 'bernard-appiah' },
  { name: 'Priscilla Opoku', role: 'JHS Facilitator', file: 'priscilla-opoku' },
  { name: 'Patricia Dela', role: 'French Language Facilitator', file: 'patricia-dela' },
  { name: 'Prince Appiah', role: 'Admin Assistant', file: 'prince-appiah' },
  { name: 'Priscilla Agyekum', role: 'Admin Assistant', file: 'priscilla-agyekum' },
  { name: 'Gladys Boateng', role: 'Catering Coordinator', file: 'gladys-boateng' },
]

const AUTOPLAY_MS = 3500
const AUTOPLAY_HOLD_MS = 8000

const src = (member: StaffMember) => `/staff/${member.file}.jpg`
const altText = (member: StaffMember) => `${member.name}, ${member.role} at Victoria Crest International School`

export function StaffCarousel() {
  const reduceMotion = useReducedMotion() ?? false
  const trackRef = useRef<HTMLUListElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [active, setActive] = useState<StaffMember | null>(null)
  const [playing, setPlaying] = useState(true)
  const lastFocus = useRef<HTMLElement | null>(null)
  const hovering = useRef(false)
  const focusInside = useRef(false)
  const inView = useRef(false)
  const holdUntil = useRef(0)

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setAtStart(el.scrollLeft <= 4)
    setAtEnd(el.scrollLeft >= max - 4)
    if (barRef.current) {
      const visible = el.scrollWidth > 0 ? el.clientWidth / el.scrollWidth : 1
      const travel = max > 0 ? el.scrollLeft / max : 0
      barRef.current.style.width = `${visible * 100}%`
      barRef.current.style.transform = `translateX(${travel * (1 / visible - 1) * 100}%)`
    }
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    update()
    el.addEventListener('scroll', onScroll, { passive: true })
    const observer = new ResizeObserver(onScroll)
    observer.observe(el)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [update])

  useEffect(() => {
    if (!active) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active])

  const scrollByCards = useCallback((direction: 1 | -1, cards?: number) => {
    const el = trackRef.current
    const card = el?.querySelector('li')
    if (!el || !card) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    const cardWidth = card.getBoundingClientRect().width + gap
    const perView = Math.max(1, Math.floor((el.clientWidth + gap) / cardWidth))
    el.scrollBy({ left: direction * (cards ?? perView) * cardWidth, behavior: reduceMotion ? 'auto' : 'smooth' })
  }, [reduceMotion])

  /** Manual use wins: hold autoplay for a while after the visitor takes control. */
  function holdAutoplay() {
    holdUntil.current = Date.now() + AUTOPLAY_HOLD_MS
  }

  function manualScroll(direction: 1 | -1) {
    holdAutoplay()
    scrollByCards(direction)
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!playing || reduceMotion || active) return
    const id = window.setInterval(() => {
      const el = trackRef.current
      if (!el || document.hidden || !inView.current) return
      if (hovering.current || focusInside.current || Date.now() < holdUntil.current) return
      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 4) {
        el.scrollTo({ left: 0, behavior: 'auto' })
      } else {
        scrollByCards(1, 1)
      }
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [playing, reduceMotion, active, scrollByCards])

  function openLightbox(member: StaffMember) {
    lastFocus.current = document.activeElement as HTMLElement | null
    setActive(member)
  }

  function closeLightbox() {
    setActive(null)
    lastFocus.current?.focus()
  }

  return (
    <section id="staff" className="section-pad bg-[var(--cream)]" aria-labelledby="staff-heading">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <div className="max-w-2xl">
            <p className="kicker">Our team</p>
            <h2 id="staff-heading" className="heading-display text-[var(--navy)]">
              Meet the people behind Victoria Crest.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
              The facilitators, leaders and support team who welcome our learners each day.
            </p>
          </div>
          <div className="flex gap-3" role="group" aria-label="Staff carousel controls">
            {!reduceMotion && (
              <button
                type="button"
                aria-label={playing ? 'Pause automatic scrolling' : 'Start automatic scrolling'}
                aria-pressed={!playing}
                onClick={() => setPlaying((value) => !value)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--navy)] bg-white text-[var(--navy)] transition hover:bg-[var(--navy)] hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  {playing ? (
                    <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
                  ) : (
                    <path d="M8 5.5v13l11-6.5z" />
                  )}
                </svg>
              </button>
            )}
            <ArrowButton label="Previous staff" direction="prev" disabled={atStart} onClick={() => manualScroll(-1)} />
            <ArrowButton label="Next staff" direction="next" disabled={atEnd} onClick={() => manualScroll(1)} />
          </div>
        </motion.div>

        <motion.div
          className="mt-10"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
          onMouseEnter={() => (hovering.current = true)}
          onMouseLeave={() => (hovering.current = false)}
          onFocusCapture={(event) => (focusInside.current = (event.target as HTMLElement).matches(':focus-visible'))}
          onBlurCapture={() => (focusInside.current = false)}
          onPointerDown={holdAutoplay}
          onWheel={holdAutoplay}
        >
          <ul
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 motion-safe:scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {staff.map((member, index) => (
              <li
                key={member.file}
                className="shrink-0 basis-[78%] snap-start sm:basis-[calc((100%-1rem)/2)] lg:basis-[calc((100%-2rem)/3)]"
              >
                <button
                  type="button"
                  onClick={() => openLightbox(member)}
                  aria-label={`View ${member.name}, ${member.role}`}
                  className="group block w-full overflow-hidden rounded-[14px] bg-white text-left shadow-[var(--shadow)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
                >
                  <img
                    src={src(member)}
                    alt={altText(member)}
                    width={1080}
                    height={1350}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="aspect-[4/5] h-auto w-full object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--cream-muted)]" aria-hidden="true">
            <div ref={barRef} className="h-full w-1/3 rounded-full bg-[var(--orange)]" />
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label={`${active.name}, ${active.role}`}
          >
            <motion.div
              className="flex max-h-full flex-col items-center gap-3"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={src(active)}
                alt={altText(active)}
                className="max-h-[82vh] w-auto max-w-full rounded-[12px] object-contain"
              />
              <button
                type="button"
                autoFocus
                className="min-h-11 rounded-[10px] border border-white/25 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
                onClick={closeLightbox}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function ArrowButton({
  label,
  direction,
  disabled,
  onClick,
}: {
  label: string
  direction: 'prev' | 'next'
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--navy)] bg-white text-[var(--navy)] transition hover:bg-[var(--navy)] hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-[var(--navy)]"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={direction === 'prev' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
      </svg>
    </button>
  )
}
