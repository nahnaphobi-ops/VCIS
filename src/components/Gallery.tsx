import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { school } from '../lib/school'
import { fadeUp, staggerFast, viewportLoose, viewportOnce } from '../lib/motion'

const galleryItems = [
  {
    id: 'picnic-girls',
    src: '/gallery/students-picnic-girls.png',
    alt: 'Victoria Crest girls in orange uniforms smiling together at a picnic table',
    label: 'Friends on campus',
    position: 'center 35%',
  },
  {
    id: 'building',
    src: '/gallery/school-building.png',
    alt: 'Victoria Crest International School campus building',
    label: 'Our campus',
    position: 'center center',
  },
  {
    id: 'lunch-boys',
    src: '/gallery/lunch-boys.png',
    alt: 'Boys in uniform sharing lunch at an outdoor picnic table',
    label: 'Lunch outdoors',
    position: 'center 40%',
  },
  {
    id: 'beach',
    src: '/gallery/beach-trip.png',
    alt: 'Victoria Crest learners standing together on a beach outing',
    label: 'Beach outing',
    position: 'center 40%',
  },
  {
    id: 'group-steps',
    src: '/gallery/group-steps.png',
    alt: 'Large group of Victoria Crest students seated on outdoor steps',
    label: 'Together as one',
    position: 'center 30%',
  },
  {
    id: 'lunch-tables',
    src: '/gallery/lunch-tables.png',
    alt: 'Students eating together at outdoor lunch tables',
    label: 'Shared meals',
    position: 'center 45%',
  },
  {
    id: 'culture-1',
    src: '/gallery/culture-day-girls-1.png',
    alt: 'Girls in traditional Ghanaian attire with the Ghana flag',
    label: 'Culture day',
    position: 'center 25%',
  },
  {
    id: 'swings',
    src: '/gallery/play-swings.png',
    alt: 'Boys in uniform playing on swings during recess',
    label: 'Playtime',
    position: 'center 40%',
  },
  {
    id: 'culture-2',
    src: '/gallery/culture-day-girls-2.png',
    alt: 'Three girls in colourful traditional dress before the Ghana flag',
    label: 'Heritage pride',
    position: 'center 30%',
  },
  {
    id: 'culture-young',
    src: '/gallery/culture-day-young.png',
    alt: 'Young learners in traditional Ghanaian clothing for culture day',
    label: 'Little ones celebrate',
    position: 'center 35%',
  },
  {
    id: 'culture-boys',
    src: '/gallery/culture-day-boys.png',
    alt: 'Boys in traditional attire standing before the Ghana flag',
    label: 'Proud traditions',
    position: 'center 30%',
  },
  {
    id: 'culture-children',
    src: '/gallery/culture-day-children.png',
    alt: 'Children celebrating Ghanaian culture at school',
    label: 'Ghana at heart',
    position: 'center 35%',
  },
  {
    id: 'culture-boy',
    src: '/gallery/culture-day-boy.png',
    alt: 'A smiling boy in traditional Kente attire with the Ghana flag',
    label: 'Celebration smile',
    position: 'center 25%',
  },
]

export function Gallery() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState<(typeof galleryItems)[number] | null>(null)

  return (
    <section id="gallery" className="section-pad bg-[var(--navy-deep)] text-white">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-[var(--orange-bright)] uppercase">
              Gallery
            </p>
            <h2 className="font-display heading-display font-semibold">
              Life at Victoria Crest.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/80 md:text-lg">
              Learning, play, culture, and community — moments from school life in Kumasi.
            </p>
          </div>
          <a
            href={school.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold tracking-wide text-[#ff8533] no-underline transition hover:text-white"
          >
            See more on Facebook →
          </a>
        </motion.div>

        <motion.div
          className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportLoose}
          variants={reduceMotion ? undefined : staggerFast}
        >
          {galleryItems.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              className={`group relative min-h-[14rem] overflow-hidden border border-white/10 bg-white/5 text-left sm:min-h-[15rem] ${
                index === 0 ? 'sm:col-span-2 sm:min-h-[18rem] lg:min-h-[20rem]' : ''
              } ${index === 4 ? 'lg:col-span-2' : ''}`}
              variants={reduceMotion ? undefined : fadeUp}
              whileHover={reduceMotion ? undefined : { scale: 1.01 }}
              onClick={() => setActive(item)}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                style={{ objectPosition: item.position }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03152D]/90 via-[#03152D]/15 to-transparent" />
              <span className="absolute bottom-4 left-4 right-4 text-sm font-semibold tracking-wide">
                {item.label}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.alt}
          >
            <motion.div
              className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden bg-[#03152D]"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={active.src}
                alt={active.alt}
                className="mx-auto max-h-[75vh] w-full object-contain"
              />
              <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
                <p className="text-sm font-medium text-white/90">{active.label}</p>
                <button
                  type="button"
                  className="min-h-11 rounded-sm border border-white/25 px-4 py-2 text-sm font-semibold text-white"
                  onClick={() => setActive(null)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
