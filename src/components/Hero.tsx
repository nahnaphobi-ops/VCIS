import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { school as staticSchool, whatsappEnquireUrl } from '../lib/school'
import { useSchool } from '../lib/useSchool'
import { easeOutExpo, fadeUp, staggerContainer, transitionFast } from '../lib/motion'
import {
  uniformCategories,
  uniformCategoryPath,
  type UniformCategory,
} from '../lib/uniformCategories'
import { IconArrow } from './icons'

function UniformCard({
  category,
  active,
  onSelect,
}: {
  category: UniformCategory
  active: boolean
  onSelect: () => void
}) {
  return (
    <Link
      to={uniformCategoryPath(category)}
      onFocus={onSelect}
      onMouseEnter={onSelect}
      className={[
        'group relative flex w-[9.25rem] shrink-0 snap-center flex-col overflow-hidden rounded-[1.15rem] sm:w-[10.5rem] md:w-[11.25rem]',
        'bg-[#8b6a4a] shadow-[0_18px_40px_rgba(0,0,0,0.28)] transition-[box-shadow,transform] duration-300',
        active
          ? 'z-[1] scale-[1.02] ring-2 ring-[var(--orange)] ring-offset-2 ring-offset-[var(--navy)]'
          : 'ring-1 ring-white/10 hover:ring-[var(--orange)]/70',
      ].join(' ')}
      aria-current={active ? 'true' : undefined}
    >
      <div className="relative aspect-[3/5] overflow-hidden">
        <img
          src={category.image}
          alt={category.alt}
          className="h-full w-full object-cover object-[center_12%] transition duration-500 group-hover:scale-[1.04]"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="relative -mt-12 px-2.5 pb-4 pt-2 text-center sm:px-3">
        <p className="text-[0.7rem] font-extrabold tracking-[0.08em] text-white uppercase sm:text-[0.78rem]">
          {category.title}
        </p>
        <p className="mt-1 text-[0.65rem] font-medium text-[#e8c56a] sm:text-[0.72rem]">
          {category.subtitle}
        </p>
      </div>
    </Link>
  )
}

function UniformCarousel() {
  const reduceMotion = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(2)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduceMotion || paused) return
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % uniformCategories.length)
    }, 4200)
    return () => window.clearInterval(id)
  }, [paused, reduceMotion])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const card = track.children[active] as HTMLElement | undefined
    if (!card) return
    card.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [active, reduceMotion])

  const go = (direction: -1 | 1) => {
    setActive((current) => (current + direction + uniformCategories.length) % uniformCategories.length)
  }

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false)
        }
      }}
    >
      <div className="mb-5 flex items-end justify-between gap-3 px-1">
        <div>
          <p className="text-[0.68rem] font-bold tracking-[0.18em] text-[var(--teal-bright)] uppercase">
            Our Uniforms
          </p>
          <p className="mt-1 text-sm text-white/75">From Crèche to JHS — pride in every look.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:border-[var(--orange)] hover:bg-[var(--orange)]"
            aria-label="Previous uniform"
            onClick={() => go(-1)}
          >
            <span className="sr-only">Previous</span>
            <svg viewBox="0 0 20 20" className="mx-auto h-4 w-4" fill="none" aria-hidden>
              <path
                d="M12.5 4.5 7 10l5.5 5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:border-[var(--orange)] hover:bg-[var(--orange)]"
            aria-label="Next uniform"
            onClick={() => go(1)}
          >
            <span className="sr-only">Next</span>
            <svg viewBox="0 0 20 20" className="mx-auto h-4 w-4" fill="none" aria-hidden>
              <path
                d="M7.5 4.5 13 10l-5.5 5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-3.5 md:gap-4 [&::-webkit-scrollbar]:hidden"
        aria-label="School uniform categories"
      >
        {uniformCategories.map((category, index) => (
          <UniformCard
            key={category.id}
            category={category}
            active={index === active}
            onSelect={() => setActive(index)}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {uniformCategories.map((category, index) => (
          <button
            key={category.id}
            type="button"
            className={[
              'h-1.5 rounded-full transition-all duration-300',
              index === active ? 'w-6 bg-[var(--orange)]' : 'w-1.5 bg-white/30 hover:bg-white/55',
            ].join(' ')}
            aria-label={`Show ${category.title}`}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </div>
  )
}

export function Hero() {
  const reduceMotion = useReducedMotion()
  const { school } = useSchool()

  return (
    <section id="top" className="relative isolate overflow-hidden bg-[var(--navy)] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.img
          src="/gallery/students-group-arms-crossed.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_28%] opacity-55"
          initial={reduceMotion ? false : { scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: easeOutExpo }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,27,53,0.88)_0%,rgba(12,27,53,0.72)_42%,rgba(12,27,53,0.9)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(12,27,53,0.15),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(214,226,239,0.55) 1px, transparent 0)',
            backgroundSize: '18px 18px',
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 sm:px-5 md:gap-12 md:px-8 md:py-16 lg:py-20">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={reduceMotion ? undefined : staggerContainer}
          initial={reduceMotion ? false : 'hidden'}
          animate="show"
        >
          <motion.p className="kicker text-[var(--teal-bright)]" variants={reduceMotion ? undefined : fadeUp}>
            Est. {school.established} · {school.location}
          </motion.p>
          <motion.h1
            className="text-[clamp(2.1rem,5.5vw,3.5rem)] font-extrabold leading-[1.08] tracking-tight"
            variants={reduceMotion ? undefined : fadeUp}
          >
            Welcome To {school.name}
          </motion.h1>
          <motion.p
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/85 md:text-lg"
            variants={reduceMotion ? undefined : fadeUp}
          >
            {school.motto}. Raising young people of character through purposeful learning, warm
            community, and a global outlook.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            variants={reduceMotion ? undefined : fadeUp}
          >
            <a
              href={whatsappEnquireUrl(
                `Hello ${staticSchool.shortName}, I would like to enquire about admissions.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Enquire Now
            </a>
            <Link to="/programmes" className="btn btn-white">
              Our Programmes
              <IconArrow />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="min-w-0"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduceMotion
              ? undefined
              : { ...transitionFast, delay: 0.18, duration: 0.75, ease: easeOutExpo }
          }
        >
          <UniformCarousel />
        </motion.div>
      </div>
    </section>
  )
}
