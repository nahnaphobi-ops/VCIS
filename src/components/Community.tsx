import { motion, useReducedMotion } from 'framer-motion'
import { school } from '../lib/school'
import { fadeUp, staggerFast, viewportOnce } from '../lib/motion'
import { IconArrow } from './icons'
import { useQuery } from 'convex/react'
import { api } from '../lib/convexApi'

const posts = [
  {
    title: 'Culture day celebrations on campus',
    date: 'School life',
    image: '/gallery/culture-day-girls-1.png',
    position: 'center 25%',
  },
  {
    title: 'Friends, play, and lunch outdoors',
    date: 'Campus moments',
    image: '/gallery/lunch-boys.png',
    position: 'center 40%',
  },
  {
    title: 'A growing family in Kumasi',
    date: `${school.facebookFollowers} followers`,
    image: '/gallery/group-steps.png',
    position: 'center 30%',
  },
]

export function Community() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="community" className="section-pad bg-[var(--cream)]">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <p className="kicker">Community</p>
          <h2 className="heading-display text-[var(--navy)]">Read all our school life updates.</h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
            Follow celebrations, campus moments, and family news on Facebook — where{' '}
            <span className="font-semibold text-[var(--navy)]">{school.facebookFollowers} followers</span>{' '}
            stay connected with Victoria Crest.
          </p>
        </motion.div>

        {import.meta.env.VITE_CONVEX_URL ? <LiveAnnouncements /> : null}

        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-3"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : staggerFast}
        >
          {posts.map((post) => (
            <motion.article
              key={post.title}
              className="card overflow-hidden"
              variants={reduceMotion ? undefined : fadeUp}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ objectPosition: post.position }}
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-bold tracking-[0.16em] text-[var(--orange)] uppercase">{post.date}</p>
                <h3 className="mt-2 text-lg font-extrabold text-[var(--navy)]">{post.title}</h3>
                <a
                  href={school.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--navy)] hover:text-[var(--orange)]"
                >
                  Read More <IconArrow className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function LiveAnnouncements() {
  const announcements = useQuery(api.content.listPublicAnnouncements, {}) as Array<{
    _id: string
    title: string
    body: string
    category: string
  }> | undefined

  if (!announcements?.length) return null

  return (
    <div className="mt-10 rounded-[14px] border border-[var(--cream-muted)] bg-white p-6 shadow-[var(--shadow)] sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="kicker">Latest from school</p>
          <h3 className="text-2xl font-extrabold text-[var(--navy)]">Announcements for our families.</h3>
        </div>
        <span className="text-xs font-semibold text-[var(--muted)]">Updated by the school office</span>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {announcements.slice(0, 4).map((announcement) => (
          <article key={announcement._id} className="border-l-2 border-[var(--orange)] pl-4">
            <p className="text-xs font-bold tracking-wide text-[var(--orange)] uppercase">{announcement.category}</p>
            <h4 className="mt-1 font-extrabold text-[var(--navy)]">{announcement.title}</h4>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{announcement.body}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
