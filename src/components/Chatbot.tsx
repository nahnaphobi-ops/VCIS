import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { cleanChatAnswer } from '../lib/cleanChatAnswer'
import { school, whatsappEnquireUrl } from '../lib/school'

function chatHttpBase() {
  const site = import.meta.env.VITE_CONVEX_SITE_URL as string | undefined
  if (site) return site.replace(/\/$/, '')

  const cloud = import.meta.env.VITE_CONVEX_URL as string | undefined
  if (cloud) {
    // HTTP actions are served on *.convex.site, not *.convex.cloud
    return cloud.replace(/\/$/, '').replace(/\.convex\.cloud\b/, '.convex.site')
  }

  return 'https://loyal-woodpecker-470.eu-west-1.convex.site'
}

const chatEndpoint = `${chatHttpBase()}/chat`

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const welcomeMessage: Message = {
  role: 'assistant',
  content: `Hello. I’m the Victoria Crest assistant. I can help with admissions, programmes, term dates, enrolment documents, and other school information from EduTrack. How can I help your family today?`,
}

const suggestions = [
  'How do admissions work?',
  'What documents do we need?',
  'Which class for a 7-year-old?',
  'When does the next term begin?',
]

/** Render light markdown from the assistant: paragraphs, bullets, and **bold**. */
function ChatRichText({ content }: { content: string }) {
  const normalized = content
    .replace(/\r\n/g, '\n')
    // Keep numbered steps and bullets as separate blocks even with single newlines.
    .replace(/\n(?=(?:\*\*)?\d+\.\s)/g, '\n\n')
    .replace(/\n(?=-\s+)/g, '\n')

  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)

  return (
    <div className="space-y-2">
      {paragraphs.map((paragraph, paragraphIndex) => {
        const lines = paragraph.split('\n')
        const isBulletBlock = lines.every((line) => /^\s*-\s+/.test(line))

        if (isBulletBlock) {
          return (
            <ul key={paragraphIndex} className="list-disc space-y-1 pl-4">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>
                  <InlineMarkdown text={line.replace(/^\s*-\s+/, '')} />
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={paragraphIndex} className="whitespace-pre-wrap">
            <InlineMarkdown text={paragraph} />
          </p>
        )
      })}
    </div>
  )
}

function InlineMarkdown({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((chunk, chunkIndex) => {
        if (chunk.startsWith('**') && chunk.endsWith('**') && chunk.length > 4) {
          return <strong key={chunkIndex}>{chunk.slice(2, -2)}</strong>
        }
        return <span key={chunkIndex}>{chunk}</span>
      })}
    </>
  )
}

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([welcomeMessage])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  async function sendContent(content: string) {
    const trimmed = content.trim()
    if (!trimmed || loading) return

    const nextMessages = [...messages, { role: 'user' as const, content: trimmed }]
    setMessages(nextMessages)
    setInput('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch(chatEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-12) }),
      })
      const data = (await response.json()) as { answer?: string; error?: string }
      if (!response.ok || !data.answer) throw new Error(data.error || 'Unable to get a response.')
      setMessages((current) => [
        ...current,
        { role: 'assistant', content: cleanChatAnswer(data.answer!) },
      ])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function sendMessage(event: FormEvent) {
    event.preventDefault()
    await sendContent(input)
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {open && (
        <section
          id="school-chat"
          className="mb-3 flex h-[min(32rem,calc(100svh-7rem))] w-[min(21rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[12px] border border-white/15 bg-[var(--navy)] text-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:w-[22rem]"
          aria-label="Victoria Crest chat assistant"
        >
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Victoria Crest Assistant</p>
              <p className="mt-0.5 text-[11px] text-white/55">Admissions · programmes · EduTrack info</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-1 text-lg leading-none text-white/60 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-4" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[88%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                  message.role === 'user'
                    ? 'ml-auto bg-[var(--orange)] text-white'
                    : 'bg-white/10 text-white/90'
                }`}
              >
                {message.role === 'assistant' ? (
                  <ChatRichText content={message.content} />
                ) : (
                  message.content
                )}
              </div>
            ))}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendContent(suggestion)}
                    className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-left text-[11px] text-white/80 transition hover:border-white/40 hover:bg-white/10 hover:text-white"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            {loading && <div className="max-w-[88%] rounded-lg bg-white/10 px-3 py-2 text-sm text-white/60">Thinking…</div>}
            {error && (
              <p className="text-xs text-[#e9d8ff]" role="alert">
                {error} Try WhatsApp or call {school.phoneDisplay}.
              </p>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-white/10 p-3">
            <form className="flex gap-2" onSubmit={sendMessage}>
              <label className="sr-only" htmlFor="chat-message">Message</label>
              <input
                ref={inputRef}
                id="chat-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about admissions, fees, terms…"
                maxLength={1000}
                className="min-w-0 flex-1 rounded-[10px] border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-[var(--orange)]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-[10px] bg-[var(--orange)] px-3 text-sm font-semibold text-white transition hover:bg-[var(--orange-deep)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-white"
              >
                Send
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
              <Link to="/admissions" className="text-[#e9d8ff] transition hover:text-white">
                Apply online
              </Link>
              <a
                href={whatsappEnquireUrl(`Hello ${school.shortName}, I would like to enquire about admissions.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e9d8ff] transition hover:text-white"
              >
                WhatsApp the school
              </a>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="ml-auto flex items-center gap-2 rounded-full bg-[var(--orange)] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:bg-[var(--orange-deep)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-expanded={open}
        aria-controls="school-chat"
      >
        <span aria-hidden="true" className="text-base">?</span>
        {open ? 'Close chat' : 'Ask us anything'}
      </button>
    </div>
  )
}
