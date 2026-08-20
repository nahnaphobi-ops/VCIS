import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { programmes, programmePath } from '../lib/programmes'
import { fadeUp, staggerFast, viewportLoose, viewportOnce } from '../lib/motion'
import { IconArrow } from './icons'

export function Programmes() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="programmes" className="section-pad bg-[var(--cream)]">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <p className="kicker">Our Programmes</p>
          <h2 className="heading-display text-[var(--navy)]">Wide variety of learning pathways.</h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
            We welcome learners across early years, primary, and junior high. Class groups and year
            placements are confirmed with families during admissions.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid gap-6 md:grid-cols-3"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportLoose}
          variants={reduceMotion ? undefined : staggerFast}
        >
          {programmes.map((programme) => (
            <motion.article
              key={programme.slug}
              className="card overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
              variants={reduceMotion ? undefined : fadeUp}
            >
              <div className="relative h-52 overflow-hidden">
                {programme.images.length > 1 ? (
                  <div className="grid h-full grid-cols-2 grid-rows-2 gap-0.5">
                    <img
                      src={programme.images[0].src}
                      alt=""
                      className="col-span-1 row-span-2 h-full w-full object-cover"
                      style={{ objectPosition: programme.images[0].position }}
                    />
                    <img
                      src={programme.images[1].src}
                      alt=""
                      className="h-full w-full object-cover"
                      style={{ objectPosition: programme.images[1].position }}
                    />
                    <img
                      src={programme.images[2].src}
                      alt=""
                      className="h-full w-full object-cover"
                      style={{ objectPosition: programme.images[2].position }}
                    />
                  </div>
                ) : (
                  <img
                    src={programme.images[0].src}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{ objectPosition: programme.images[0].position }}
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--navy)]/45 to-transparent" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-extrabold text-[var(--navy)]">{programme.title}</h3>
                  <span className="shrink-0 rounded-full bg-[var(--cream)] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[var(--orange)] uppercase">
                    {programme.age}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{programme.summary}</p>
                <p className="mt-4 border-t border-[var(--cream-muted)] pt-4 text-xs leading-relaxed text-[var(--muted)]">
                  <span className="font-bold text-[var(--navy)]">Learning focus: </span>
                  {programme.focus}
                </p>
                <Link
                  to={programmePath(programme.slug)}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--orange)] no-underline"
                >
                  Read More <IconArrow className="h-3.5 w-3.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-12 grid gap-4 rounded-[12px] bg-[var(--navy)] p-6 text-white sm:grid-cols-3 sm:p-8">
          <div className="sm:col-span-2">
            <p className="text-xs font-bold tracking-[0.18em] text-[var(--orange-bright)] uppercase">
              One connected journey
            </p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight">
              A consistent standard from first steps to the next stage.
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
              Each programme is designed to build on the one before it, with regular communication between school and
              home so learners can transition with confidence.
            </p>
          </div>
          <Link to="/contact" className="btn btn-primary self-end sm:justify-self-end">
            Ask about placement
          </Link>
        </div>
      </div>
    </section>
  )
}
