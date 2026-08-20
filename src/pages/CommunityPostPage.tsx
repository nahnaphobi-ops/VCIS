import { Link, Navigate, useParams } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { Contact } from '../components/Contact'
import {
  communityPostPath,
  communityPosts,
  getCommunityPost,
} from '../lib/communityPosts'
import { school } from '../lib/school'
import { IconArrow } from '../components/icons'

export function CommunityPostPage() {
  const { slug } = useParams()
  const post = getCommunityPost(slug)

  if (!post) return <Navigate to="/gallery" replace />

  return (
    <>
      <PageHero
        kicker={post.kicker}
        title={post.title}
        description={post.excerpt}
        image={post.image}
        imagePosition={post.position}
        cta={{ to: '/gallery', label: 'View gallery' }}
      />

      <section className="section-pad bg-white">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <article>
            <p className="kicker">Full story</p>
            <h2 className="heading-display text-[var(--navy)]">Read the complete update.</h2>
            <div className="mt-8 space-y-5">
              {post.body.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="text-base leading-relaxed text-[var(--muted)] md:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {post.highlights.map((item) => (
                <div key={item.title} className="rounded-[12px] bg-[var(--cream)] p-5">
                  <h3 className="font-extrabold text-[var(--navy)]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.body}</p>
                </div>
              ))}
            </div>

            <p className="mt-10 text-base leading-relaxed text-[var(--navy)] md:text-lg">{post.closing}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={school.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Follow on Facebook
              </a>
              <Link to="/admissions" className="btn btn-outline">
                Start admissions
              </Link>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="overflow-hidden rounded-[1.25rem] shadow-[var(--shadow)]">
              <img
                src={post.image}
                alt=""
                className="aspect-[4/5] w-full object-cover"
                style={{ objectPosition: post.position }}
              />
            </div>
            <div className="rounded-[1.25rem] bg-[var(--navy)] p-6 text-white">
              <p className="text-xs font-bold tracking-[0.18em] text-[var(--orange-bright)] uppercase">
                School community
              </p>
              <h3 className="mt-3 text-2xl font-extrabold">Stay close to campus life.</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                {school.facebookFollowers} followers follow celebrations, reminders, and everyday pride from{' '}
                {school.shortName}.
              </p>
              <Link to="/gallery" className="btn btn-primary mt-6 w-full">
                Browse gallery
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="section-pad bg-[var(--cream)]">
        <div className="mx-auto max-w-6xl">
          <p className="kicker">More updates</p>
          <h2 className="heading-display text-[var(--navy)]">Keep reading.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {communityPosts
              .filter((item) => item.slug !== post.slug)
              .map((item) => (
                <Link
                  key={item.slug}
                  to={communityPostPath(item.slug)}
                  className="overflow-hidden rounded-[12px] bg-white no-underline shadow-[var(--shadow)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={item.image}
                      alt=""
                      className="h-full w-full object-cover"
                      style={{ objectPosition: item.position }}
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs font-bold tracking-[0.16em] text-[var(--orange)] uppercase">
                      {item.kicker}
                    </p>
                    <h3 className="mt-2 text-lg font-extrabold text-[var(--navy)]">{item.title}</h3>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--orange)]">
                      Read more <IconArrow className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Contact />
    </>
  )
}
