import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'

const schoolContext = `You are the admissions assistant for Victoria Crest International School in Kumasi, Ghana.
Known facts:
- School: Victoria Crest International School
- Positioning: Excellence.Integrity.Purpose
- Established: 2014
- Official phone: 059 977 2383
- Secondary phone: 024 201 9659
- Website: vcis.edu.gh
- WhatsApp: +233 59 977 2383

Be warm, concise, and helpful to parents. Answer only from the known facts or say that the school team can confirm details. Never invent fees, curriculum details, opening hours, admissions requirements, or policies. For specific admissions questions, invite the visitor to call 059 977 2383 or use WhatsApp.`

const http = httpRouter()

http.route({
  path: '/chat',
  method: 'OPTIONS',
  handler: httpAction(async () => new Response(null, { status: 204, headers: corsHeaders })),
})

http.route({
  path: '/chat',
  method: 'POST',
  handler: httpAction(async (_ctx, request) => {
    const respond = (body: unknown, status: number) =>
      new Response(JSON.stringify(body), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return respond({ error: 'Please provide a valid conversation.' }, 400)
    }

    const messages = (body as { messages?: unknown })?.messages
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 12) {
      return respond({ error: 'Please provide a valid conversation.' }, 400)
    }

    const safeMessages = messages.filter(isSafeMessage)
    if (safeMessages.length === 0) {
      return respond({ error: 'Please provide a valid message.' }, 400)
    }

    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) return respond({ error: 'Chat is not configured yet.' }, 500)

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          temperature: 0.3,
          max_tokens: 300,
          messages: [{ role: 'system', content: schoolContext }, ...safeMessages],
        }),
      })

      if (!response.ok) return respond({ error: 'The chat service is temporarily unavailable.' }, 502)

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>
      }
      const answer = data.choices?.[0]?.message?.content?.trim()
      return answer
        ? respond({ answer }, 200)
        : respond({ error: 'The chat service returned no answer.' }, 502)
    } catch {
      return respond({ error: 'Unable to reach the chat service.' }, 500)
    }
  }),
})

export default http

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
}

function isSafeMessage(
  message: unknown,
): message is { role: 'user' | 'assistant'; content: string } {
  if (!message || typeof message !== 'object') return false
  const candidate = message as { role?: unknown; content?: unknown }
  return (
    (candidate.role === 'user' || candidate.role === 'assistant') &&
    typeof candidate.content === 'string' &&
    candidate.content.trim().length > 0 &&
    candidate.content.length <= 1000
  )
}
