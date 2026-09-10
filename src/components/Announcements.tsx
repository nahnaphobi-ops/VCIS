import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp, staggerFast, viewportOnce } from '../lib/motion'
import { useQuery } from 'convex/react'
import { api } from '../lib/convexApi'
import { IconArrow } from './icons'

type Announcement = {
  _id: string
  title: string
  body: string
  category: string
  imageUrl: string | null
  attachmentType?: string
}

export function Announcements() {
  const reduceMotion = useReducedMotion() ?? false

  if (!import.meta.env.VITE_CONVEX_URL) return null

  return <LiveAnnouncementsInner reduceMotion={reduceMotion} />
}

function LiveAnnouncementsInner({ reduceMotion }: { reduceMotion: boolean }) {
  const announcements = useQuery(api.content.listPublicAnnouncements, {}) as
    | Announcement[]
    | undefined

  if (!announcements?.length) return null

  const featured = announcements[0]
  const rest = announcements.slice(1, 5)

  return (
    <section id="announcements" className="section-pad bg-white">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <div className="max-w-2xl">
            <p className="kicker">Announcements</p>
            <h2 className="heading-display text-[var(--navy)]">Latest from the school office.</h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
              Important updates, events, and reminders for Victoria Crest families.
            </p>
          </div>
          <Link
            to="/announcements"
            className="text-sm font-bold text-[var(--orange)] no-underline hover:text-[var(--navy)]"
          >
            View all announcements <IconArrow className="inline h-3.5 w-3.5" />
          </Link>
        </motion.div>

        <motion.div
          className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : staggerFast}
        >
          <motion.article
            className="card overflow-hidden"
            variants={reduceMotion ? undefined : fadeUp}
          >
            {featured.imageUrl && featured.attachmentType?.startsWith('image/') ? (
              <div className="aspect-[16/10] overflow-hidden bg-[var(--cream)]">
                <img
                  src={featured.imageUrl}
                  alt={featured.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}
            <div className="p-6 sm:p-8">
              <p className="text-xs font-bold tracking-[0.16em] text-[var(--orange)] uppercase">
                {featured.category}
              </p>
              <h3 className="mt-2 text-xl font-extrabold text-[var(--navy)] sm:text-2xl">
                {featured.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)] md:text-base">
                {featured.body}
              </p>
              {featured.imageUrl && !featured.attachmentType?.startsWith('image/') ? (
                <a
                  href={featured.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--orange)] hover:text-[var(--navy)]"
                >
                  View attached flyer <IconArrow className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </motion.article>

          {rest.length > 0 ? (
            <div className="flex flex-col gap-4">
              {rest.map((item) => (
                <motion.article
                  key={item._id}
                  className="card flex gap-4 overflow-hidden p-4 sm:p-5"
                  variants={reduceMotion ? undefined : fadeUp}
                >
                  {item.imageUrl && item.attachmentType?.startsWith('image/') ? (
                    <div className="h-24 w-28 shrink-0 overflow-hidden rounded-[10px] bg-[var(--cream)] sm:h-28 sm:w-32">
                      <img
                        src={item.imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold tracking-[0.14em] text-[var(--orange)] uppercase">
                      {item.category}
                    </p>
                    <h4 className="mt-1 text-sm font-extrabold text-[var(--navy)] line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--muted)] line-clamp-2">
                      {item.body}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  )
}
