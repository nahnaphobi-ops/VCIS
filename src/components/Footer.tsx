import { school } from '../lib/school'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-[var(--navy)] px-4 py-10 text-white sm:px-5 md:px-8 md:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5 sm:h-14 sm:w-14">
            <img src="/crest.png" alt="" className="h-full w-full object-contain" />
          </span>
          <div className="min-w-0">
            <p className="font-display text-lg font-semibold sm:text-xl">{school.shortName}</p>
            <p className="text-[10px] tracking-[0.16em] text-[var(--orange-bright)] uppercase sm:text-xs sm:tracking-[0.2em]">
              {school.motto}
            </p>
          </div>
        </div>

        <div className="text-sm text-white/65 md:text-right">
          <a
            href={`tel:${school.phoneTel}`}
            className="inline-flex min-h-11 items-center text-white no-underline hover:text-[var(--orange-bright)] md:min-h-0"
          >
            {school.phoneDisplay}
          </a>
          <p className="mt-1">{school.location}</p>
          <p className="mt-4 text-xs leading-relaxed text-white/40">
            © {year} {school.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
