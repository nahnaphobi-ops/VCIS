const promises = ['Integrity', 'Excellence', 'Knowledge', 'Achievement', 'Global outlook', 'Growth']

export function TrustBar() {
  return (
    <section className="border-b border-[var(--cream-muted)] bg-white" aria-label="School values">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 py-6 sm:px-5 md:justify-between md:px-8">
        {promises.map((item) => (
          <p
            key={item}
            className="text-sm font-extrabold tracking-[0.14em] text-[var(--navy)]/45 uppercase"
          >
            {item}
          </p>
        ))}
      </div>
    </section>
  )
}
