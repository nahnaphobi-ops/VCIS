import { motion, useReducedMotion } from 'framer-motion'
import { useSchool } from '../lib/useSchool'
import { formatStudentCount } from '../lib/edutrack'
import { fadeUp, staggerFast, viewportLoose } from '../lib/motion'
import { IconAward, IconBook, IconCalendar, IconUsers } from './icons'

export function Stats() {
  const reduceMotion = useReducedMotion()
  const { school, live, loading } = useSchool()
  const studentLabel = formatStudentCount(live?.active_students ?? 0)

  const stats = [
    {
      id: 'established',
      icon: IconCalendar,
      value: school.established,
      label: 'Established',
    },
    {
      id: 'learners',
      icon: IconUsers,
      value: loading && !studentLabel ? '…' : studentLabel || '270+',
      label: 'Active learners',
    },
    {
      id: 'pathways',
      icon: IconBook,
      value: '3',
      label: 'Learning pathways',
    },
    {
      id: 'values',
      icon: IconAward,
      value: 'Excellence',
      label: 'Integrity · Purpose',
    },
  ]

  return (
    <section className="bg-[var(--navy)] text-white">
      <motion.div
        className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-12 sm:gap-8 sm:px-5 md:px-8 lg:grid-cols-4 lg:py-14"
        initial={reduceMotion ? false : 'hidden'}
        whileInView="show"
        viewport={viewportLoose}
        variants={reduceMotion ? undefined : staggerFast}
      >
        {stats.map((item) => (
          <motion.div
            key={item.id}
            className="flex items-start gap-3 sm:gap-4"
            variants={reduceMotion ? undefined : fadeUp}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--orange)] text-white sm:h-14 sm:w-14">
              <item.icon className="h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <div className="min-w-0">
              <p className="text-xl font-extrabold tracking-tight sm:text-2xl">{item.value}</p>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
