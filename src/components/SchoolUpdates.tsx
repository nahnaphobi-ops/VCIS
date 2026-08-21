import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useSchool } from '../lib/useSchool'
import { formatDisplayDate, formatTermLabel } from '../lib/edutrack'
import { fadeUp, viewportOnce } from '../lib/motion'

function money(amount: number) {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function SchoolUpdates() {
  const { live } = useSchool()
  const reduceMotion = useReducedMotion()

  if (!live) return null

  const academic = live.academic
  const termKey = `term_${academic.term}` as 'term_1' | 'term_2' | 'term_3'
  const currentTermDates = academic[termKey]
  const hasCalendar =
    Boolean(currentTermDates?.start || currentTermDates?.end || academic.next_term_begins) ||
    live.events.length > 0
  const hasNotices = live.notices.length > 0
  const hasFees = live.fees.length > 0 || live.fee_categories.length > 0

  if (!hasCalendar && !hasNotices && !hasFees) return null

  const panelCount = [hasCalendar, hasNotices, hasFees].filter(Boolean).length
  const panelsClass =
    panelCount === 1
      ? 'mt-12 mx-auto grid w-full max-w-md gap-6'
      : panelCount === 2
        ? 'mt-12 grid gap-6 md:grid-cols-2'
        : 'mt-12 grid gap-6 lg:grid-cols-3'

  return (
    <section className="section-pad bg-white">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="show"
          viewport={viewportOnce}
          variants={reduceMotion ? undefined : fadeUp}
        >
          <p className="kicker">From EduTrack</p>
          <h2 className="heading-display text-[var(--navy)]">Live school information.</h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">
            Term dates, notices, and published fee details sync from the Victoria Crest EduTrack
            system.
          </p>
        </motion.div>

        <div className={panelsClass}>
          {hasCalendar ? (
            <article className="rounded-[12px] bg-[var(--cream)] p-6">
              <p className="text-xs font-bold tracking-[0.18em] text-[var(--orange)] uppercase">
                Academic calendar
              </p>
              <h3 className="mt-3 text-xl font-extrabold text-[var(--navy)]">
                {formatTermLabel(academic.term)} · {academic.year}
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-[var(--muted)]">
                {currentTermDates?.start || currentTermDates?.end ? (
                  <li>
                    Current term:{' '}
                    <span className="font-semibold text-[var(--navy)]">
                      {[formatDisplayDate(currentTermDates.start), formatDisplayDate(currentTermDates.end)]
                        .filter(Boolean)
                        .join(' – ')}
                    </span>
                  </li>
                ) : null}
                {academic.next_term_begins ? (
                  <li>
                    Next term begins:{' '}
                    <span className="font-semibold text-[var(--navy)]">
                      {formatDisplayDate(academic.next_term_begins)}
                    </span>
                  </li>
                ) : null}
              </ul>
              {live.events.length > 0 ? (
                <ul className="mt-5 space-y-3 border-t border-[var(--cream-muted)] pt-5">
                  {live.events.slice(0, 4).map((event) => (
                    <li key={event.id}>
                      <p className="text-sm font-bold text-[var(--navy)]">{event.title}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {formatDisplayDate(event.start_date)}
                        {event.end_date ? ` – ${formatDisplayDate(event.end_date)}` : ''}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </article>
          ) : null}

          {hasNotices ? (
            <article className="rounded-[12px] bg-[var(--cream)] p-6">
              <p className="text-xs font-bold tracking-[0.18em] text-[var(--orange)] uppercase">
                Notices
              </p>
              <ul className="mt-4 space-y-4">
                {live.notices.slice(0, 4).map((notice) => (
                  <li key={notice.id}>
                    <p className="text-sm font-bold text-[var(--navy)]">{notice.title}</p>
                    <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">
                      {notice.body}
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}

          {hasFees ? (
            <article className="rounded-[12px] bg-[var(--navy)] p-6 text-white">
              <p className="text-xs font-bold tracking-[0.18em] text-[var(--orange-bright)] uppercase">
                Published fees
              </p>
              <h3 className="mt-3 text-xl font-extrabold">{academic.year}</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                {live.fees.slice(0, 6).map((fee) => (
                  <li key={fee.id} className="flex items-start justify-between gap-3">
                    <span>
                      <span className="font-semibold text-white">{fee.fee_name}</span>
                      <span className="mt-0.5 block text-xs text-white/55">
                        {formatTermLabel(fee.term)}
                        {fee.class_level ? ` · ${fee.class_level}` : ''}
                      </span>
                    </span>
                    <span className="shrink-0 font-bold text-[var(--orange-bright)]">
                      {money(Number(fee.amount))}
                    </span>
                  </li>
                ))}
                {live.fees.length === 0
                  ? live.fee_categories.slice(0, 6).map((cat) => (
                      <li key={cat.id} className="flex items-start justify-between gap-3">
                        <span className="font-semibold text-white">{cat.name}</span>
                        <span className="shrink-0 font-bold text-[var(--orange-bright)]">
                          {money(Number(cat.default_amount))}
                        </span>
                      </li>
                    ))
                  : null}
              </ul>
              <Link to="/admissions" className="btn btn-primary mt-6 w-full">
                Ask about fees
              </Link>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  )
}
