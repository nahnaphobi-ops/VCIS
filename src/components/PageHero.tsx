import { Link } from 'react-router-dom'

type PageHeroProps = {
  kicker: string
  title: string
  description: string
  image?: string
  imagePosition?: string
  cta?: { to: string; label: string }
}

export function PageHero({
  kicker,
  title,
  description,
  image = '/gallery/students-group-portrait.jpg',
  imagePosition = 'center 30%',
  cta,
}: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--navy)] text-white">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          style={{ objectPosition: imagePosition }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(12,27,53,0.94)_0%,rgba(12,27,53,0.78)_55%,rgba(12,27,53,0.55)_100%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-5 md:px-8 md:py-20">
        <p className="kicker text-[var(--orange-bright)]">{kicker}</p>
        <h1 className="mt-3 max-w-3xl text-[clamp(2rem,5vw,3.4rem)] font-extrabold leading-[1.08] tracking-tight">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">{description}</p>
        {cta ? (
          <Link to={cta.to} className="btn btn-primary mt-8">
            {cta.label}
          </Link>
        ) : null}
      </div>
    </section>
  )
}
