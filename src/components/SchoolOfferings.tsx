import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useSchool } from '../lib/useSchool'
import { uniqueSubjectNames } from '../lib/edutrack'
import { fadeUp, staggerFast, viewportLoose, viewportOnce } from '../lib/motion'
import { IconBook, IconUsers } from './icons'

export function SchoolOfferings() {
  const reduceMotion = useReducedMotion()
  const { live, loading } = useSchool()

  const rooms = live?.classes ?? []
  const subjects = uniqueSubjectNames(live?.subjects)

  if (loading || (rooms.length === 0 && subjects.length === 0)) {
    return null
  }

  return (
    <section id="offerings" className="section-pad bg-white">
      <div className="mx-auto max-w-6xl">
        {rooms.length > 0 && (
          <div>
            <motion.div
              className="mx-auto max-w-2xl text-center"
              initial={reduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={viewportOnce}
              variants={reduceMotion ? undefined : fadeUp}
            >
              <p className="kicker">Class rooms</p>
              <h2 className="heading-display text-[var(--navy)]">Active classes in our school.</h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
                These are the class rooms currently set up in EduTrack — the same levels families
                choose during admissions.
              </p>
            </motion.div>

            <motion.div
              className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              initial={reduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={viewportLoose}
              variants={reduceMotion ? undefined : staggerFast}
            >
              {rooms.map((room) => (
                <motion.article
                  key={room.id}
                  className="card flex items-start gap-4 p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]"
                  variants={reduceMotion ? undefined : fadeUp}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] bg-[var(--cream)] text-[var(--orange)]">
                    <IconUsers className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-extrabold text-[var(--navy)]">{room.class_name}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {room.label}
                      {room.category ? ` · ${room.category}` : ''}
                    </p>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        )}

        {subjects.length > 0 && (
          <div className={rooms.length > 0 ? 'mt-16 md:mt-20' : undefined}>
            <motion.div
              className="mx-auto max-w-2xl text-center"
              initial={reduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={viewportOnce}
              variants={reduceMotion ? undefined : fadeUp}
            >
              <p className="kicker">Subjects</p>
              <h2 className="heading-display text-[var(--navy)]">What learners study.</h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
                Subjects created for our active class rooms — each listed once, drawn from EduTrack.
              </p>
            </motion.div>

            <motion.div
              className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              initial={reduceMotion ? false : 'hidden'}
              whileInView="show"
              viewport={viewportLoose}
              variants={reduceMotion ? undefined : staggerFast}
            >
              {subjects.map((name) => (
                <motion.article
                  key={name}
                  className="card flex items-center gap-3 px-4 py-3.5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]"
                  variants={reduceMotion ? undefined : fadeUp}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--navy)] text-white">
                    <IconBook className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm font-bold leading-snug text-[var(--navy)]">{name}</h3>
                </motion.article>
              ))}
            </motion.div>
          </div>
        )}

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-[12px] bg-[var(--cream)] px-6 py-6 sm:flex-row sm:px-8">
          <p className="max-w-xl text-sm leading-relaxed text-[var(--muted)]">
            Looking for a place for your child? Admissions can advise on the right class room and
            what to bring.
          </p>
          <Link to="/admissions" className="btn btn-primary shrink-0">
            Start admissions
          </Link>
        </div>
      </div>
    </section>
  )
}
