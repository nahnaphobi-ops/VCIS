import { useState, type FormEvent, type ReactNode } from 'react'
import { SignInButton, UserButton, useAuth, useUser } from '@clerk/clerk-react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../lib/convexApi'

type ContentTab = 'overview' | 'announcements' | 'photos'

export function AdminPage() {
  const { isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const [tab, setTab] = useState<ContentTab>('overview')

  if (!isLoaded) return <AdminShell><AdminMessage title="Loading admin area" body="Checking your secure session…" /></AdminShell>
  if (!isSignedIn) {
    return (
      <AdminShell>
        <div className="mx-auto max-w-md rounded-[16px] bg-white p-8 text-center shadow-[var(--shadow)]">
          <p className="kicker">Victoria Crest Admin</p>
          <h1 className="mt-2 text-3xl font-extrabold text-[var(--navy)]">Sign in to continue</h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">Only approved school administrators can manage published content.</p>
          <SignInButton mode="modal">
            <button type="button" className="btn btn-primary mt-7">Sign in securely</button>
          </SignInButton>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-[var(--cream-muted)] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="kicker">Content Studio</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--navy)] md:text-4xl">Manage your website.</h1>
            <p className="mt-2 text-sm text-[var(--muted)]">Publish announcements and keep the school gallery fresh.</p>
          </div>
          <div className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-[var(--shadow)]">
            <UserButton afterSignOutUrl="/" />
            <span className="pr-2 text-xs font-semibold text-[var(--navy)]">{user?.primaryEmailAddress?.emailAddress}</span>
          </div>
        </header>

        <nav className="mt-8 flex gap-2 overflow-x-auto" aria-label="Admin sections">
          {(['overview', 'announcements', 'photos'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold tracking-wide uppercase transition ${tab === item ? 'bg-[var(--navy)] text-white' : 'bg-white text-[var(--navy)] hover:bg-[var(--cream)]'}`}
            >
              {item}
            </button>
          ))}
        </nav>

        {tab === 'overview' && <Overview onNavigate={setTab} />}
        {tab === 'announcements' && <Announcements />}
        {tab === 'photos' && <Photos />}
      </div>
    </AdminShell>
  )
}

export function AdminUnavailable() {
  return (
    <AdminShell>
      <AdminMessage title="Admin is not configured" body="Add the Clerk and Convex environment variables before opening the content studio." />
    </AdminShell>
  )
}

function Overview({ onNavigate }: { onNavigate: (tab: ContentTab) => void }) {
  const data = useQuery(api.content.listAdminContent, {}) as { announcements: Array<{ isPublished: boolean }>; photos: Array<{ isPublished: boolean }> } | undefined
  const announcements = data?.announcements ?? []
  const photos = data?.photos ?? []
  const cards = [
    { label: 'Published announcements', value: announcements.filter((item) => item.isPublished).length, action: 'Manage announcements', tab: 'announcements' as const },
    { label: 'Published photos', value: photos.filter((item) => item.isPublished).length, action: 'Manage gallery', tab: 'photos' as const },
    { label: 'Draft content', value: announcements.filter((item) => !item.isPublished).length + photos.filter((item) => !item.isPublished).length, action: 'Review content', tab: 'announcements' as const },
  ]

  return (
    <section className="mt-8">
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <button key={card.label} type="button" onClick={() => onNavigate(card.tab)} className="rounded-[14px] bg-white p-6 text-left shadow-[var(--shadow)] transition hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]">
            <p className="text-sm font-semibold text-[var(--muted)]">{card.label}</p>
            <p className="mt-3 text-4xl font-black text-[var(--navy)]">{data ? card.value : '—'}</p>
            <span className="mt-5 inline-block text-xs font-bold tracking-wide text-[var(--orange)] uppercase">{card.action} →</span>
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[14px] bg-[var(--navy)] p-7 text-white">
          <p className="text-xs font-bold tracking-[0.18em] text-[var(--orange-bright)] uppercase">Publishing workflow</p>
          <h2 className="mt-3 text-2xl font-extrabold">Keep the public site current.</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">Create a draft, review the copy and image, then publish when it is ready. Changes are stored in Convex and appear on the public site without a code deployment.</p>
        </div>
        <div className="rounded-[14px] bg-white p-7 shadow-[var(--shadow)]">
          <p className="kicker">Quick actions</p>
          <div className="mt-4 grid gap-3">
            <button type="button" className="btn btn-primary" onClick={() => onNavigate('announcements')}>New announcement</button>
            <button type="button" className="btn btn-outline" onClick={() => onNavigate('photos')}>Upload photos</button>
          </div>
        </div>
      </div>
    </section>
  )
}

function Announcements() {
  const data = useQuery(api.content.listAdminContent, {}) as { announcements: Announcement[] } | undefined
  const create = useMutation(api.content.createAnnouncement)
  const remove = useMutation(api.content.deleteAnnouncement)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('School news')
  const [isPublished, setIsPublished] = useState(true)
  const [status, setStatus] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setStatus('Saving…')
    try {
      await create({ title, body, category, isPublished })
      setTitle(''); setBody(''); setStatus('Announcement saved.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to save announcement.')
    }
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={submit} className="rounded-[14px] bg-white p-6 shadow-[var(--shadow)] sm:p-8">
        <p className="kicker">New announcement</p>
        <h2 className="text-2xl font-extrabold text-[var(--navy)]">Share a school update.</h2>
        <label className="mt-6 block text-xs font-bold tracking-wide text-[var(--navy)] uppercase">Title<input required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} className="input-field mt-2 border border-[var(--cream-muted)]" /></label>
        <label className="mt-4 block text-xs font-bold tracking-wide text-[var(--navy)] uppercase">Category<input required maxLength={40} value={category} onChange={(event) => setCategory(event.target.value)} className="input-field mt-2 border border-[var(--cream-muted)]" /></label>
        <label className="mt-4 block text-xs font-bold tracking-wide text-[var(--navy)] uppercase">Message<textarea required maxLength={4000} rows={7} value={body} onChange={(event) => setBody(event.target.value)} className="input-field mt-2 resize-y border border-[var(--cream-muted)]" /></label>
        <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-[var(--navy)]"><input type="checkbox" checked={isPublished} onChange={(event) => setIsPublished(event.target.checked)} /> Publish immediately</label>
        <button type="submit" className="btn btn-primary mt-6">Save announcement</button>
        {status && <p className="mt-3 text-sm text-[var(--muted)]" role="status">{status}</p>}
      </form>
      <ContentList title="Announcements" empty="No announcements yet." items={data?.announcements ?? []} onDelete={(id) => void remove({ id })} />
    </section>
  )
}

function Photos() {
  const data = useQuery(api.content.listAdminContent, {}) as { photos: Photo[] } | undefined
  const getUploadUrl = useMutation(api.content.generatePhotoUploadUrl)
  const create = useMutation(api.content.createPhoto)
  const remove = useMutation(api.content.deletePhoto)
  const [title, setTitle] = useState('')
  const [alt, setAlt] = useState('')
  const [category, setCategory] = useState('School life')
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState('')

  async function upload(event: FormEvent) {
    event.preventDefault()
    if (!file) return setStatus('Choose an image first.')
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) return setStatus('Use a JPG, PNG, or WebP image up to 5MB.')
    setStatus('Uploading…')
    try {
      const uploadUrl = await getUploadUrl({})
      const response = await fetch(uploadUrl, { method: 'POST', headers: { 'Content-Type': file.type }, body: file })
      if (!response.ok) throw new Error('Image upload failed.')
      const { storageId } = await response.json() as { storageId: string }
      await create({ storageId, title, alt, category, isPublished: true })
      setTitle(''); setAlt(''); setFile(null); setStatus('Photo published.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to upload photo.')
    }
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <form onSubmit={upload} className="rounded-[14px] bg-white p-6 shadow-[var(--shadow)] sm:p-8">
        <p className="kicker">Add to gallery</p>
        <h2 className="text-2xl font-extrabold text-[var(--navy)]">Upload a school photo.</h2>
        <label className="mt-6 block text-xs font-bold tracking-wide text-[var(--navy)] uppercase">Photo<input required type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="mt-2 block w-full text-sm text-[var(--muted)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--cream)] file:px-4 file:py-2 file:font-semibold file:text-[var(--navy)]" /></label>
        <label className="mt-4 block text-xs font-bold tracking-wide text-[var(--navy)] uppercase">Title<input required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} className="input-field mt-2 border border-[var(--cream-muted)]" /></label>
        <label className="mt-4 block text-xs font-bold tracking-wide text-[var(--navy)] uppercase">Alt text<input required maxLength={180} value={alt} onChange={(event) => setAlt(event.target.value)} className="input-field mt-2 border border-[var(--cream-muted)]" /></label>
        <label className="mt-4 block text-xs font-bold tracking-wide text-[var(--navy)] uppercase">Category<input required maxLength={40} value={category} onChange={(event) => setCategory(event.target.value)} className="input-field mt-2 border border-[var(--cream-muted)]" /></label>
        <button type="submit" className="btn btn-primary mt-6">Upload photo</button>
        {status && <p className="mt-3 text-sm text-[var(--muted)]" role="status">{status}</p>}
      </form>
      <div className="grid gap-4 sm:grid-cols-2">
        {(data?.photos ?? []).map((photo) => <article key={photo._id} className="overflow-hidden rounded-[14px] bg-white shadow-[var(--shadow)]"><img src={photo.url ?? ''} alt={photo.alt} className="h-44 w-full object-cover" /><div className="flex items-start justify-between gap-3 p-4"><div><h3 className="font-extrabold text-[var(--navy)]">{photo.title}</h3><p className="mt-1 text-xs text-[var(--muted)]">{photo.category}</p></div><button type="button" onClick={() => void remove({ id: photo._id })} className="text-xs font-bold text-[var(--orange)]">Delete</button></div></article>)}
        {!data?.photos.length && <AdminMessage title="No photos yet" body="Upload your first school-life image to populate the gallery." />}
      </div>
    </section>
  )
}

type Announcement = { _id: string; title: string; body: string; category: string; isPublished: boolean }
type Photo = { _id: string; title: string; alt: string; category: string; url: string | null }

function ContentList({ title, empty, items, onDelete }: { title: string; empty: string; items: Announcement[]; onDelete: (id: string) => void }) {
  return <div className="rounded-[14px] bg-white p-6 shadow-[var(--shadow)] sm:p-8"><div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-extrabold text-[var(--navy)]">{title}</h2><span className="rounded-full bg-[var(--cream)] px-3 py-1 text-xs font-bold text-[var(--navy)]">{items.length}</span></div><div className="mt-6 space-y-3">{items.map((item) => <article key={item._id} className="rounded-[12px] border border-[var(--cream-muted)] p-4"><div className="flex items-start justify-between gap-3"><div><span className="text-[10px] font-bold tracking-wide text-[var(--orange)] uppercase">{item.category} · {item.isPublished ? 'Published' : 'Draft'}</span><h3 className="mt-1 font-extrabold text-[var(--navy)]">{item.title}</h3></div><button type="button" onClick={() => onDelete(item._id)} className="text-xs font-bold text-[var(--orange)]">Delete</button></div><p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--muted)]">{item.body}</p></article>)}{items.length === 0 && <p className="text-sm text-[var(--muted)]">{empty}</p>}</div></div>
}

function AdminShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[var(--cream)] px-4 py-6 sm:px-6 lg:px-8"><header className="mx-auto mb-10 flex max-w-7xl items-center justify-between"><a href="/" className="text-sm font-extrabold tracking-tight text-[var(--navy)]">Victoria Crest <span className="font-normal text-[var(--muted)]">/ Admin</span></a><a href="/" className="text-xs font-bold text-[var(--orange)]">View website →</a></header>{children}</div>
}

function AdminMessage({ title, body }: { title: string; body: string }) {
  return <div className="mx-auto max-w-md rounded-[16px] bg-white p-8 text-center shadow-[var(--shadow)]"><h1 className="text-2xl font-extrabold text-[var(--navy)]">{title}</h1><p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{body}</p></div>
}
