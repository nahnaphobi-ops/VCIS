import { motion, useReducedMotion } from 'framer-motion'
import { school } from '../lib/school'
import { fadeUp, staggerFast, viewportOnce } from '../lib/motion'
import { IconArrow } from './icons'

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
