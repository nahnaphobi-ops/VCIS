import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useQuery } from 'convex/react'
import { school } from '../lib/school'
import { fadeUp, staggerFast, viewportLoose, viewportOnce } from '../lib/motion'
import { api } from '../lib/convexApi'

const galleryItems = [
  {
    id: 'early-years-1',
    src: '/gallery/early-years-1.png',
    alt: 'Victoria Crest early years learners in class',
    label: 'Early learning',
    position: 'center center',
  },
  {
    id: 'uniform-pair',
    src: '/gallery/students-pair-girls.jpg',
    alt: 'Two Victoria Crest girls in uniform sharing a smile',
    label: 'Little friends',
    position: 'center 25%',
  },
  {
    id: 'culture-1',
    src: '/gallery/culture-day-girls-1.png',
    alt: 'Victoria Crest students celebrating Culture Day in traditional attire',
    label: 'Culture Day',
    position: 'center center',
  },
  {
    id: 'group-candid',
    src: '/gallery/students-group-candid.jpg',
    alt: 'Victoria Crest learners in uniform sharing a moment together',
    label: 'Together on campus',
    position: 'center 30%',
  },
  {
    id: 'beach',
    src: '/gallery/beach-trip.png',
    alt: 'Victoria Crest learners on a beach trip',
    label: 'Beach trip',
    position: 'center center',
  },
  {
    id: 'pair-uniform',
    src: '/gallery/students-pair-boy-girl.jpg',
    alt: 'Two Victoria Crest students in uniform',
    label: 'Friends in uniform',
    position: 'center 30%',
  },
  {
    id: 'playground',
    src: '/gallery/play-swings.png',
    alt: 'Victoria Crest learners playing on the playground',
    label: 'Playtime',
    position: 'center center',
  },
  {
    id: 'group-formal',
    src: '/gallery/students-group-formal.jpg',
    alt: 'Victoria Crest learners in school uniform',
    label: 'Friends on campus',
    position: 'center 30%',
  },
  {
    id: 'culture-2',
    src: '/gallery/culture-day-girls-2.png',
    alt: 'Victoria Crest students in traditional dress for Culture Day',
    label: 'Heritage pride',
    position: 'center center',
  },
  {
    id: 'group-studio',
    src: '/gallery/students-group-studio.jpg',
    alt: 'Victoria Crest learners gathered for a portrait',
    label: 'Proud learners',
    position: 'center center',
  },
  {
    id: 'lunch',
    src: '/gallery/lunch-tables.png',
    alt: 'Victoria Crest learners enjoying lunch together',
    label: 'Lunch together',
    position: 'center center',
  },
  {
    id: 'arms-crossed',
    src: '/gallery/students-group-arms-crossed.jpg',
    alt: 'Victoria Crest group of learners in uniform',
    label: 'Standing together',
    position: 'center 30%',
  },
  {
    id: 'early-years-2',
    src: '/gallery/early-years-2.png',
    alt: 'Victoria Crest early years learners exploring',
    label: 'Curious minds',
    position: 'center center',
  },
  {
    id: 'group-portrait',
    src: '/gallery/students-group-portrait.jpg',
    alt: 'Victoria Crest learners posed together for a portrait',
    label: 'Together as one',
    position: 'center 30%',
  },
  {
    id: 'picnic',
    src: '/gallery/students-picnic-girls.png',
    alt: 'Victoria Crest girls enjoying a picnic on campus',
    label: 'Picnic time',
    position: 'center center',
  },
  {
    id: 'early-years-3',
    src: '/gallery/early-years-3.png',
    alt: 'Victoria Crest early years learners at play',
    label: 'Growing together',
    position: 'center center',
  },
]

export function Gallery() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState<(typeof galleryItems)[number] | null>(null)
  const [hasManagedPhotos, setHasManagedPhotos] = useState(false)
  const [filter, setFilter] = useState<'all' | 'learning' | 'community'>('all')
  const visibleItems = galleryItems.filter((item) => {
    if (filter === 'all') return true
    const learningIds = ['early-years-1', 'early-years-2', 'early-years-3', 'playground', 'lunch']
    return filter === 'learning' ? learningIds.includes(item.id) : !learningIds.includes(item.id)
  })

  return (
    <section id="gallery" className="section-pad bg-[var(--cream)]">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <div className="max-w-2xl">
            <p className="kicker">Gallery</p>
            <h2 className="heading-display text-[var(--navy)]">Life at Victoria Crest.</h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
              Learning, play, culture, and community — moments from school life in Kumasi.
            </p>
          </div>
          <a
            href={school.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-[var(--orange)] no-underline hover:text-[var(--navy)]"
          >
            See more on Facebook →
          </a>
        </motion.div>

        {!hasManagedPhotos && <div>
        <div className="mt-8 flex flex-wrap gap-2" aria-label="Gallery filters">
          {(['all', 'learning', 'community'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              className={`rounded-[10px] border px-4 py-2 text-xs font-bold tracking-wide uppercase transition ${
                filter === item
                  ? 'border-[var(--navy)] bg-[var(--navy)] text-white'
                  : 'border-[var(--cream-muted)] bg-white text-[var(--navy)] hover:border-[var(--orange)] hover:text-[var(--orange)]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <motion.div
          className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportLoose}
          variants={reduceMotion ? undefined : staggerFast}
        >
          {visibleItems.map((item) => (
            <motion.button
              key={item.id}
              type="button"
              className="group relative min-h-[16rem] overflow-hidden rounded-[12px] text-left shadow-[var(--shadow)]"
              variants={reduceMotion ? undefined : fadeUp}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              onClick={() => setActive(item)}
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                style={{ objectPosition: item.position }}
              />
              <div className="absolute inset-0 bg-[var(--navy)]/0 transition duration-300 group-hover:bg-[var(--orange)]/55" />
              <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgba(12,27,53,0.88))] px-4 py-4">
                <span className="text-sm font-bold tracking-wide text-white">{item.label}</span>
              </div>
            </motion.button>
          ))}
        </motion.div>
        </div>}

        {import.meta.env.VITE_CONVEX_URL ? <ManagedPhotos onHasPhotos={setHasManagedPhotos} /> : null}
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
              className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[12px] bg-[var(--navy)]"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={active.src} alt={active.alt} className="mx-auto max-h-[75vh] w-full object-contain" />
              <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
                <p className="text-sm font-medium text-white/90">{active.label}</p>
                <button
                  type="button"
                  className="min-h-11 rounded-[10px] border border-white/25 px-4 py-2 text-sm font-semibold text-white"
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

function ManagedPhotos({ onHasPhotos }: { onHasPhotos: (hasPhotos: boolean) => void }) {
  const photos = useQuery(api.content.listPublicPhotos, {}) as Array<{
    _id: string
    url: string | null
    title: string
    alt: string
  }> | undefined

  useEffect(() => {
    onHasPhotos(Boolean(photos?.length))
  }, [onHasPhotos, photos?.length])

  if (!photos?.length) return null

  return (
    <div className="mt-12 border-t border-[var(--cream-muted)] pt-10">
      <p className="kicker">Recently added</p>
      <h3 className="text-2xl font-extrabold text-[var(--navy)]">Fresh moments from campus.</h3>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {photos.slice(0, 8).map((photo) => (
          <figure key={photo._id} className="overflow-hidden rounded-[12px] bg-white shadow-[var(--shadow)]">
            <img src={photo.url ?? ''} alt={photo.alt} className="aspect-square w-full object-cover" loading="lazy" />
            <figcaption className="p-3 text-xs font-bold text-[var(--navy)]">{photo.title}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
