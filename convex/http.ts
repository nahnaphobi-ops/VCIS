import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

/** Free OpenRouter models only (no paid Llama). */
const OPENROUTER_MODELS = [
  process.env.OPENROUTER_MODEL,
  'google/gemma-4-26b-a4b-it:free',
  'nvidia/nemotron-3-nano-30b-a3b:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
].filter((value, index, list): value is string => Boolean(value) && list.indexOf(value) === index)

const EDUTRACK_FUNCTIONS_BASE = (
  process.env.EDUTRACK_FUNCTIONS_URL ||
  'https://egdjzarvzzxafjdcemyy.supabase.co/functions/v1'
).replace(/\/$/, '')

const EDUTRACK_ANON_KEY =
  process.env.EDUTRACK_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZGp6YXJ2enp4YWZqZGNlbXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MzAwOTAsImV4cCI6MjA5NjEwNjA5MH0._uZLXYBbcJhqQOSm_auF591KEe03k6votH57h8Y5FeE'

const EDUTRACK_SCHOOL_ID =
  process.env.EDUTRACK_SCHOOL_ID || 'victoria-crest-international-school'

type EduTrackPublicProfile = {
  school_id: string
  name: string
  motto: string | null
  phone: string | null
  email: string | null
  address: string | null
  region: string | null
  district: string | null
  location_label: string | null
  academic: {
    year: string
    term: number
    next_term_begins: string | null
    term_1: { start: string | null; end: string | null }
    term_2: { start: string | null; end: string | null }
    term_3: { start: string | null; end: string | null }
    midterm_break: { start: string | null; end: string | null }
  }
  active_students: number
  events: Array<{
    title: string
    description: string | null
    event_type: string
    start_date: string
    end_date: string | null
  }>
  notices: Array<{
    title: string
    body: string
    sent_at: string
  }>
  fees: Array<{
    fee_name: string
    academic_year: string
    term: number
    class_level: string | null
    amount: number
    category: string | null
    description: string | null
    is_compulsory: boolean
  }>
  fee_categories: Array<{
    name: string
    type: string
    default_amount: number
    due_at_enrollment?: boolean
  }>
  enrollment_requirements?: Array<{
    title: string
    description: string | null
    requirement_type: string
    is_required: boolean
    applies_to_class_level: string | null
  }>
  class_levels?: Array<{
    value: string
    label: string
    category: string
  }>
  generated_at: string
}

const STATIC_SCHOOL_FACTS = `Static school facts (always true):
- Public name: Victoria Crest International School (also branded Victoria Crest)
- Motto: Excellence.Integrity.Purpose
- Established: 2014
- Location: Kumasi / Afigya Kwabre South, Ashanti Region, Ghana
- Primary phone: 059 977 2383 (+233 59 977 2383)
- Secondary phone: 024 201 9659 (+233 24 201 9659)
- WhatsApp enquiry number: +233 24 201 9659
- Website: vcis.edu.gh
- Accreditations: Ghana Education Service (GES), National Schools Inspectorate Authority (NaSIA)
- Programmes:
  • Early Years (ages 2–5): play, language, early numeracy, creative expression, independence
  • Primary (ages 6–11): literacy, numeracy, science/technology, creative & social growth
  • Junior High (ages 12–14): subject mastery, critical thinking, exam readiness, leadership
- Admissions path: 1) Enquire (call / WhatsApp / online form) → 2) Visit & apply with documents → 3) Confirm enrolment after placement
- Online applications: submit at /admissions on the school website; applications land in the EduTrack admissions inbox for staff review (they do not auto-enrol)
- Community: Facebook page https://www.facebook.com/newdestinschool`

const AGENT_RULES = `You are the Victoria Crest International School website assistant for parents and guardians.

Your job:
- Answer from the provided EduTrack public profile and static school facts only
- Guide families through admissions clearly and helpfully
- Help with programmes, class levels, term dates, requirements, published fees, notices, events, contact details, and campus visits

Admissions handling:
- Ask for the child's age (or current class) and preferred entry level when helpful
- Explain the admissions path and required documents from EduTrack when available
- Encourage them to use the website admissions form at /admissions, or call / WhatsApp the school
- If they want to apply now, tell them exactly what the online form needs: child full name, date of birth, gender, desired class, guardian name/phone/email, relationship, previous school, and a short message
- Never claim an application was submitted unless the user confirms they used the website form or contacted the school
- Never invent fee amounts, openings, or policies. If EduTrack has no published fees, say fees are confirmed by the admissions team and share phone/WhatsApp
- Never request or store passwords, ID numbers, payment card details, or other sensitive private data in chat
- Never invent student names, grades, attendance, or any non-public EduTrack records
- Keep replies warm, concise (usually under 140 words), and practical for Ghanaian parents
- Prefer GHS amounts and clear date wording when data is present
- When asked about the next term or opening date, use the EduTrack field next_term_begins exactly (do not substitute another term's start date)
- If unsure, say the school team can confirm and give 059 977 2383 / 024 201 9659

Reply formatting (markdown the website chat can render):
- Use short paragraphs with a blank line between them
- For numbered steps, put each step on its own paragraph as: **1. Title** – description
- Bold step titles, phone numbers, WhatsApp numbers, URLs/paths like /admissions, dates, and fee amounts
- Do not bold whole sentences or whole paragraphs
- Do not use headings, tables, or code fences

CRITICAL output rule:
- Return ONLY the final parent-facing reply
- Never include planning, reasoning, analysis, drafts, checklists of instructions, or commentary about these rules`

let profileCache: { at: number; data: EduTrackPublicProfile | null } | null = null
const PROFILE_CACHE_MS = 60_000

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

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) return respond({ error: 'Chat is not configured yet.' }, 500)

    const profile = await fetchEduTrackPublicProfile()
    const systemPrompt = buildSystemPrompt(profile)

    try {
      const answer = await completeWithOpenRouter(apiKey, systemPrompt, safeMessages)
      return answer
        ? respond({ answer }, 200)
        : respond({ error: 'The chat service returned no answer.' }, 502)
    } catch (error) {
      console.error('OpenRouter chat error', error)
      if (error instanceof Error && error.message === 'upstream_unavailable') {
        return respond({ error: 'The chat service is temporarily unavailable.' }, 502)
      }
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

async function completeWithOpenRouter(
  apiKey: string,
  systemPrompt: string,
  safeMessages: Array<{ role: 'user' | 'assistant'; content: string }>,
) {
  let lastStatus = 0
  let lastDetail = ''

  for (const model of OPENROUTER_MODELS) {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://vcis.edu.gh',
        'X-Title': 'Victoria Crest Admissions Assistant',
      },
      body: JSON.stringify({
        model,
        temperature: 0.25,
        max_tokens: 550,
        messages: [{ role: 'system', content: systemPrompt }, ...safeMessages],
      }),
    })

    if (!response.ok) {
      lastStatus = response.status
      lastDetail = await response.text().catch(() => '')
      // Try the next model when the preferred free slug is unavailable.
      if (response.status === 404 || response.status === 402 || response.status === 429) {
        continue
      }
      console.error('OpenRouter chat failed', model, response.status, lastDetail.slice(0, 400))
      throw new Error('upstream_unavailable')
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const answer = data.choices?.[0]?.message?.content?.trim()
    if (answer) return cleanAssistantAnswer(answer)
  }

  console.error('OpenRouter chat exhausted models', lastStatus, lastDetail.slice(0, 400))
  throw new Error('upstream_unavailable')
}

function cleanAssistantAnswer(raw: string) {
  let text = raw.replace(/\r\n/g, '\n').trim()

  const markerMatch = text.match(
    /(?:^|\n)(?:Draft:|Final answer:|Final reply:|Reply:|Parent-facing reply:)\s*\n+([\s\S]+)$/i,
  )
  if (markerMatch?.[1]) text = markerMatch[1].trim()

  // Drop leaked chain-of-thought before the first real formatted step/paragraph.
  const stepIndex = text.search(/\n\n\*\*\d+\.\s/)
  if (stepIndex > 0 && /(?:we need to|let'?s craft|the user|instruction)/i.test(text.slice(0, stepIndex))) {
    const introEnd = text.lastIndexOf('\n\n', stepIndex)
    text = text.slice(introEnd >= 0 ? introEnd : stepIndex).trim()
  }

  if (/^(?:we need to|let'?s|okay,? the user|the instruction|i need to)\b/i.test(text)) {
    const firstGood = text.search(/\n\n(?!\s*(?:we need to|let'?s|okay|the instruction|i need to)\b)/i)
    if (firstGood > 0) text = text.slice(firstGood).trim()
  }

  return text.replace(/\n{3,}/g, '\n\n').trim()
}

async function fetchEduTrackPublicProfile(): Promise<EduTrackPublicProfile | null> {
  if (profileCache && Date.now() - profileCache.at < PROFILE_CACHE_MS) {
    return profileCache.data
  }

  try {
    const url = `${EDUTRACK_FUNCTIONS_BASE}/public-school-profile?school_id=${encodeURIComponent(EDUTRACK_SCHOOL_ID)}`
    const res = await fetch(url, {
      headers: {
        apikey: EDUTRACK_ANON_KEY,
        Authorization: `Bearer ${EDUTRACK_ANON_KEY}`,
      },
    })

    if (!res.ok) {
      console.warn('EduTrack public profile failed', res.status)
      profileCache = { at: Date.now(), data: null }
      return null
    }

    const data = (await res.json()) as EduTrackPublicProfile
    profileCache = { at: Date.now(), data }
    return data
  } catch (error) {
    console.warn('EduTrack public profile error', error)
    profileCache = { at: Date.now(), data: null }
    return null
  }
}

function buildSystemPrompt(profile: EduTrackPublicProfile | null) {
  const live = profile ? formatEduTrackContext(profile) : 'Live EduTrack profile unavailable right now. Use only static facts and invite the family to call or WhatsApp for current details.'
  return `${AGENT_RULES}

${STATIC_SCHOOL_FACTS}

Live EduTrack public data (non-sensitive / website-published only):
${live}`
}

function formatEduTrackContext(profile: EduTrackPublicProfile) {
  const lines: string[] = [
    `Name: ${profile.name}`,
    `Motto: ${profile.motto || 'n/a'}`,
    `Phone: ${profile.phone || 'n/a'}`,
    `Email: ${profile.email || 'n/a'}`,
    `Location: ${profile.location_label || [profile.address, profile.district, profile.region].filter(Boolean).join(', ') || 'n/a'}`,
    `Active students (aggregate only): ${profile.active_students || 0}`,
    `Academic year: ${profile.academic.year}; current term: ${profile.academic.term}`,
    `Next term begins: ${profile.academic.next_term_begins || 'n/a'}`,
    `Term 1: ${fmtRange(profile.academic.term_1)}`,
    `Term 2: ${fmtRange(profile.academic.term_2)}`,
    `Term 3: ${fmtRange(profile.academic.term_3)}`,
    `Midterm break: ${fmtRange(profile.academic.midterm_break)}`,
    `Profile generated at: ${profile.generated_at}`,
  ]

  if (profile.class_levels?.length) {
    lines.push(
      'Class levels: ' +
        profile.class_levels.map((level) => `${level.label} (${level.category})`).join('; '),
    )
  }

  if (profile.enrollment_requirements?.length) {
    lines.push('Enrolment requirements:')
    for (const item of profile.enrollment_requirements) {
      const required = item.is_required ? 'required' : 'optional'
      const scope = item.applies_to_class_level ? ` [${item.applies_to_class_level}]` : ''
      lines.push(
        `- (${item.requirement_type}, ${required})${scope} ${item.title}${item.description ? `: ${item.description}` : ''}`,
      )
    }
  } else {
    lines.push('Enrolment requirements: none published yet')
  }

  if (profile.fees?.length) {
    lines.push('Published fees:')
    for (const fee of profile.fees) {
      lines.push(
        `- ${fee.fee_name}: GHS ${fee.amount} (${fee.academic_year}, term ${fee.term}${fee.class_level ? `, ${fee.class_level}` : ''}${fee.is_compulsory ? ', compulsory' : ''})${fee.description ? ` — ${fee.description}` : ''}`,
      )
    }
  } else {
    lines.push('Published fees: none currently marked public in EduTrack')
  }

  if (profile.fee_categories?.length) {
    lines.push('Fee categories:')
    for (const category of profile.fee_categories) {
      lines.push(
        `- ${category.name} (${category.type}): GHS ${category.default_amount}${category.due_at_enrollment ? ', due at enrolment' : ''}`,
      )
    }
  }

  if (profile.notices?.length) {
    lines.push('Notices:')
    for (const notice of profile.notices.slice(0, 8)) {
      lines.push(`- ${notice.title} (${notice.sent_at}): ${notice.body}`)
    }
  } else {
    lines.push('Notices: none published')
  }

  if (profile.events?.length) {
    lines.push('Events:')
    for (const event of profile.events.slice(0, 8)) {
      lines.push(
        `- ${event.title} (${event.event_type}) ${event.start_date}${event.end_date ? ` to ${event.end_date}` : ''}${event.description ? `: ${event.description}` : ''}`,
      )
    }
  } else {
    lines.push('Events: none published')
  }

  return lines.join('\n')
}

function fmtRange(range: { start: string | null; end: string | null }) {
  if (!range.start && !range.end) return 'n/a'
  if (range.start && range.end) return `${range.start} to ${range.end}`
  return range.start || range.end || 'n/a'
}
