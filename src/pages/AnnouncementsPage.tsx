import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { PageHero } from '../components/PageHero'
import { Contact } from '../components/Contact'
import { fadeUp, staggerFast, viewportOnce } from '../lib/motion'
import { useQuery } from 'convex/react'
import { api } from '../lib/convexApi'
import { IconArrow } from '../components/icons'

type Announcement = {
  _id: string
  title: string
  body: string
  category: string
  imageUrl: string | null
  attachmentType?: string
}

export function AnnouncementsPage() {
  const reduceMotion = useReducedMotion() ?? false
  const [active, setActive] = useState<Announcement | null>(null)

  if (!import.meta.env.VITE_CONVEX_URL) {
    return (
      <>
        <PageHero
          kicker="Announcements"
          title="Latest from the school office."
          description="Important updates, events, and reminders for Victoria Crest families."
          image="/gallery/students-group-formal.jpg"
          cta={{ to: '/contact', label: 'Get in touch' }}
        />
        <section className="section-pad bg-white">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-lg text-[var(--muted)]">Announcements are managed through the school office.</p>
            <p className="mt-2 text-sm text-[var(--muted)]">Check back soon or contact us for the latest updates.</p>
          </div>
        </section>
        <Contact />
      </>
    )
  }

  return (
    <>
      <PageHero
        kicker="Announcements"
        title="Latest from the school office."
        description="Important updates, events, and reminders for Victoria Crest families."
        image="/gallery/students-group-formal.jpg"
        cta={{ to: '/contact', label: 'Get in touch' }}
      />
      <LiveAnnouncementsPage reduceMotion={reduceMotion} setActive={setActive} />
      <Contact />

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
            aria-label={active.title}
          >
            <motion.div
              className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[14px] bg-white shadow-2xl"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
            >
              {active.imageUrl && active.attachmentType?.startsWith('image/') ? (
                <div className="overflow-hidden bg-[var(--cream)]">
                  <img
                    src={active.imageUrl}
                    alt={active.title}
                    className="w-full object-contain"
                    style={{ maxHeight: '60vh' }}
                  />
                </div>
              ) : null}
              <div className="p-6 sm:p-8">
                <p className="text-xs font-bold tracking-[0.16em] text-[var(--orange)] uppercase">
                  {active.category}
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-[var(--navy)]">{active.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] md:text-base whitespace-pre-line">
                  {active.body}
                </p>
                {active.imageUrl && !active.attachmentType?.startsWith('image/') ? (
                  <a
                    href={active.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--orange)] hover:text-[var(--navy)]"
                  >
                    View attached flyer <IconArrow className="h-3.5 w-3.5" />
                  </a>
                ) : null}
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setActive(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function LiveAnnouncementsPage({
  reduceMotion,
  setActive,
}: {
  reduceMotion: boolean
  setActive: (a: Announcement | null) => void
}) {
  const announcements = useQuery(api.content.listPublicAnnouncements, {}) as
    | Announcement[]
    | undefined

  if (!announcements?.length) return null

  return (
    <section className="section-pad bg-[var(--cream)]">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : staggerFast}
        >
          {announcements.map((item) => (
            <motion.article
              key={item._id}
              className="card overflow-hidden transition hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
              variants={reduceMotion ? undefined : fadeUp}
            >
              {item.imageUrl && item.attachmentType?.startsWith('image/') ? (
                <button
                  type="button"
                  className="block aspect-[16/10] w-full overflow-hidden bg-[var(--cream)]"
                  onClick={() => setActive(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </button>
              ) : null}
              <div className="p-5 sm:p-6">
                <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--orange)] uppercase">
                  {item.category}
                </p>
                <h3 className="mt-1.5 text-lg font-extrabold text-[var(--navy)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)] line-clamp-3">
                  {item.body}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  {item.imageUrl ? (
                    <a
                      href={item.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[var(--orange)] hover:text-[var(--navy)]"
                    >
                      {item.attachmentType?.startsWith('image/') ? 'View flyer' : 'Open attachment'} →
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setActive(item)}
                    className="text-xs font-bold text-[var(--navy)] hover:text-[var(--orange)]"
                  >
                    Read more →
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
