import { useEffect, useRef, useState, type FormEvent } from 'react'
import { school, whatsappEnquireUrl } from '../lib/school'

const chatEndpoint = `${import.meta.env.VITE_CONVEX_URL || 'https://loyal-woodpecker-470.eu-west-1.convex.cloud'}/chat`

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const welcomeMessage: Message = {
  role: 'assistant',
  content: `Hello. I’m the Victoria Crest admissions assistant. How can I help you learn more about the school?`,
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

  async function sendMessage(event: FormEvent) {
    event.preventDefault()
    const content = input.trim()
    if (!content || loading) return

    const nextMessages = [...messages, { role: 'user' as const, content }]
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
      setMessages((current) => [...current, { role: 'assistant', content: data.answer! }])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {open && (
        <section
          id="school-chat"
          className="mb-3 flex h-[min(30rem,calc(100svh-7rem))] w-[min(20rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-white/15 bg-[#03152D] text-white shadow-[0_18px_60px_rgba(0,0,0,0.35)] sm:w-80"
          aria-label="Victoria Crest chat assistant"
        >
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <p className="text-sm font-semibold">Victoria Crest Assistant</p>
              <p className="mt-0.5 text-[11px] text-white/55">Admissions and school information</p>
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
                    ? 'ml-auto bg-[#EF5B04] text-white'
                    : 'bg-white/10 text-white/90'
                }`}
              >
                {message.content}
              </div>
            ))}
            {loading && <div className="max-w-[88%] rounded-lg bg-white/10 px-3 py-2 text-sm text-white/60">Thinking…</div>}
            {error && (
              <p className="text-xs text-[#f4b083]" role="alert">
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
                placeholder="Ask about the school..."
                maxLength={1000}
                className="min-w-0 flex-1 rounded-md border border-white/15 bg-white/10 px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-[#EF5B04]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-md bg-[#EF5B04] px-3 text-sm font-semibold text-white transition hover:bg-[#ff7330] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-white"
              >
                Send
              </button>
            </form>
            <a
              href={whatsappEnquireUrl(`Hello ${school.shortName}, I would like to enquire about admissions.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 block text-center text-xs text-[#f4b083] transition hover:text-white"
            >
              Prefer WhatsApp? Message the school
            </a>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="ml-auto flex items-center gap-2 rounded-full bg-[#EF5B04] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:bg-[#ff7330] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-expanded={open}
        aria-controls="school-chat"
      >
        <span aria-hidden="true" className="text-base">?</span>
        {open ? 'Close chat' : 'Ask us anything'}
      </button>
    </div>
  )
}
