import { Link, Navigate, useParams } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { Contact } from '../components/Contact'
import { getProgramme, programmes, programmePath } from '../lib/programmes'
import { school, whatsappEnquireUrl } from '../lib/school'
import { IconArrow, IconCheck } from '../components/icons'

export function ProgrammeDetailPage() {
  const { slug } = useParams()
  const programme = getProgramme(slug)

  if (!programme) return <Navigate to="/programmes" replace />

  return (
    <>
      <PageHero
        kicker="Programme"
        title={programme.title}
        description={`${programme.age}. ${programme.summary}`}
        image={programme.heroImage}
        imagePosition={programme.heroPosition}
        cta={{ to: '/admissions#apply', label: 'Apply online' }}
      />

      <section className="section-pad bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <p className="kicker">Overview</p>
            <h2 className="heading-display text-[var(--navy)]">What this pathway offers.</h2>
            <p className="mt-5 text-base leading-relaxed text-[var(--muted)] md:text-lg">{programme.intro}</p>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)] md:text-lg">{programme.approach}</p>

            <h3 className="mt-10 text-xl font-extrabold text-[var(--navy)]">Learning areas</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {programme.learningAreas.map((area) => (
                <article key={area.title} className="rounded-[12px] bg-[var(--cream)] p-5">
                  <h4 className="font-extrabold text-[var(--navy)]">{area.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{area.body}</p>
                </article>
              ))}
            </div>

            <h3 className="mt-10 text-xl font-extrabold text-[var(--navy)]">Life in this programme</h3>
            <ul className="mt-5 space-y-3">
              {programme.experience.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--navy)] md:text-base">
                  <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--teal)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="space-y-6">
            <div className="overflow-hidden rounded-[1.25rem] bg-[var(--navy)] text-white">
              <div className="h-48 overflow-hidden">
                <img
                  src={programme.heroImage}
                  alt=""
                  className="h-full w-full object-cover"
                  style={{ objectPosition: programme.heroPosition }}
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-bold tracking-[0.18em] text-[var(--orange-bright)] uppercase">
                  {programme.age}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  <span className="font-bold text-white">Learning focus: </span>
                  {programme.focus}
                </p>
                <a
                  href={whatsappEnquireUrl(
                    `Hello ${school.shortName}, I would like more information about the ${programme.title} programme.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary mt-6 w-full"
                >
                  Ask on WhatsApp
                </a>
                <Link to="/admissions" className="btn btn-white mt-3 w-full">
                  Admissions path
                </Link>
              </div>
            </div>

            <div className="rounded-[1.25rem] bg-[var(--cream)] p-6">
              <h3 className="text-lg font-extrabold text-[var(--navy)]">For families</h3>
              <ul className="mt-4 space-y-3">
                {programme.familyNotes.map((note) => (
                  <li key={note} className="text-sm leading-relaxed text-[var(--muted)]">
                    {note}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-[var(--navy)]">{programme.nextStep}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[var(--cream)] section-pad">
        <div className="mx-auto max-w-6xl">
          <p className="kicker">Other pathways</p>
          <h2 className="heading-display text-[var(--navy)]">Continue exploring.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {programmes
              .filter((item) => item.slug !== programme.slug)
              .map((item) => (
                <Link
                  key={item.slug}
                  to={programmePath(item.slug)}
                  className="rounded-[12px] bg-white p-5 no-underline shadow-[var(--shadow)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
                >
                  <p className="text-xs font-bold tracking-[0.16em] text-[var(--orange)] uppercase">{item.age}</p>
                  <h3 className="mt-2 text-lg font-extrabold text-[var(--navy)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--orange)]">
                    Read more <IconArrow className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            <Link
              to="/programmes"
              className="rounded-[12px] border border-[var(--cream-muted)] bg-transparent p-5 no-underline transition hover:bg-white"
            >
              <p className="text-xs font-bold tracking-[0.16em] text-[var(--orange)] uppercase">Overview</p>
              <h3 className="mt-2 text-lg font-extrabold text-[var(--navy)]">All programmes</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                Compare Early Years, Primary, and Junior High on one page.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--navy)]">
                Back to programmes <IconArrow className="h-3.5 w-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Contact />
    </>
  )
}
