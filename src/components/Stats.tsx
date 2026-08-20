import { motion, useReducedMotion } from 'framer-motion'
import { useSchool } from '../lib/useSchool'
import { formatStudentCount } from '../lib/edutrack'
import { fadeUp, staggerFast, viewportOnce } from '../lib/motion'
import { IconAward, IconBook, IconCalendar, IconUsers } from './icons'

export function Stats() {
  const reduceMotion = useReducedMotion()
  const { school, live } = useSchool()
  const studentLabel = formatStudentCount(live?.active_students ?? 0)

  const stats = [
    { icon: IconCalendar, value: school.established, label: 'Established' },
    {
      icon: IconUsers,
      value: studentLabel || school.facebookFollowers,
      label: studentLabel ? 'Active learners' : 'Community followers',
    },
    { icon: IconBook, value: '3', label: 'Learning pathways' },
    { icon: IconAward, value: 'Excellence', label: 'Integrity · Purpose' },
  ]

  return (
    <section className="bg-[var(--navy)] text-white">
      <motion.div
        className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-5 md:px-8 lg:grid-cols-4 lg:py-14"
        initial={reduceMotion ? false : 'hidden'}
        whileInView="show"
        viewport={viewportOnce}
        variants={reduceMotion ? undefined : staggerFast}
      >
        {stats.map((item) => (
          <motion.div key={item.label} className="flex items-start gap-4" variants={reduceMotion ? undefined : fadeUp}>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--orange)] text-white">
              <item.icon className="h-7 w-7" />
            </span>
            <div>
              <p className="text-2xl font-extrabold tracking-tight">{item.value}</p>
              <p className="mt-1 text-sm text-white/70">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
