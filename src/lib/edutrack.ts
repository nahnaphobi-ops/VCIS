import { school as staticSchool } from './school'

export type EduTrackPublicProfile = {
  school_id: string
  subdomain: string
  name: string
  motto: string | null
  phone: string | null
  email: string | null
  logo_url: string | null
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
    id: string
    title: string
    description: string | null
    event_type: string
    start_date: string
    end_date: string | null
    start_time: string | null
    end_time: string | null
  }>
  notices: Array<{
    id: string
    title: string
    body: string
    sent_at: string
  }>
  fees: Array<{
    id: string
    fee_name: string
    academic_year: string
    term: number
    class_level: string | null
    amount: number
    category: string | null
    description: string | null
    is_compulsory: boolean
    sort_order: number
  }>
  fee_categories: Array<{
    id: string
    name: string
    type: string
    default_amount: number
    due_at_enrollment?: boolean
    sort_order: number
  }>
  enrollment_requirements?: Array<{
    id: string
    title: string
    description: string | null
    requirement_type: string
    is_required: boolean
    applies_to_class_level: string | null
    sort_order: number
  }>
  class_levels?: Array<{
    value: string
    label: string
    category: string
    sort_order: number
  }>
  /** Classrooms created in the school's EduTrack room (current year preferred). */
  classes?: Array<{
    id: string
    class_name: string
    class_level: string
    academic_year: string
    label: string
    category: string
  }>
  /** Subjects created in the school's EduTrack room (no teacher PII). */
  subjects?: Array<{
    id: string
    subject_name: string
    subject_code: string
    class_level: string
    label: string
  }>
  generated_at: string
}

const SCHOOL_ID =
  import.meta.env.VITE_EDUTRACK_SCHOOL_ID || 'victoria-crest-international-school'

// Prefer the Convex proxy (rooms/subjects enriched from EduTrack school data).
// Fall back to the EduTrack edge function when Convex URL is unset.
const CONVEX_SITE_BASE = (
  import.meta.env.VITE_CONVEX_SITE_URL ||
  (import.meta.env.VITE_CONVEX_URL
    ? String(import.meta.env.VITE_CONVEX_URL).replace('.convex.cloud', '.convex.site')
    : 'https://loyal-woodpecker-470.eu-west-1.convex.site')
).replace(/\/$/, '')

const FUNCTIONS_BASE = (
  import.meta.env.VITE_EDUTRACK_FUNCTIONS_URL ||
  'https://egdjzarvzzxafjdcemyy.supabase.co/functions/v1'
).replace(/\/$/, '')

const ANON_KEY =
  import.meta.env.VITE_EDUTRACK_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZGp6YXJ2enp4YWZqZGNlbXl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MzAwOTAsImV4cCI6MjA5NjEwNjA5MH0._uZLXYBbcJhqQOSm_auF591KEe03k6votH57h8Y5FeE'

let cached: { at: number; data: EduTrackPublicProfile | null } | null = null
const CACHE_MS = 60_000

export function formatTermLabel(term: number) {
  if (term === 1) return 'Term 1'
  if (term === 2) return 'Term 2'
  if (term === 3) return 'Term 3'
  return `Term ${term}`
}

export function formatDisplayDate(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatStudentCount(count: number) {
  if (count <= 0) return null
  if (count >= 1000) return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}K`
  return String(count)
}

export async function fetchEduTrackPublicProfile(
  force = false,
): Promise<EduTrackPublicProfile | null> {
  if (!force && cached && Date.now() - cached.at < CACHE_MS) {
    return cached.data
  }

  try {
    // Convex proxy first — includes school rooms + subjects only.
    if (CONVEX_SITE_BASE) {
      const convexRes = await fetch(`${CONVEX_SITE_BASE}/public-school-profile`)
      if (convexRes.ok) {
        const data = (await convexRes.json()) as EduTrackPublicProfile
        cached = { at: Date.now(), data }
        return data
      }
      console.warn('Convex school profile failed', convexRes.status)
    }

    if (!FUNCTIONS_BASE || !ANON_KEY) {
      return null
    }

    const url = `${FUNCTIONS_BASE}/public-school-profile?school_id=${encodeURIComponent(SCHOOL_ID)}`
    const res = await fetch(url, {
      headers: {
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
    })

    if (!res.ok) {
      console.warn('EduTrack public profile failed', res.status)
      cached = { at: Date.now(), data: null }
      return null
    }

    const data = (await res.json()) as EduTrackPublicProfile
    cached = { at: Date.now(), data }
    return data
  } catch (error) {
    console.warn('EduTrack public profile error', error)
    cached = { at: Date.now(), data: null }
    return null
  }
}

export async function submitAdmissionsApplication(payload: {
  child_full_name: string
  date_of_birth?: string
  gender?: string
  desired_class_level?: string
  desired_programme?: string
  guardian_full_name: string
  guardian_phone: string
  guardian_email?: string
  relationship?: string
  previous_school?: string
  message?: string
  how_heard?: string
  acknowledged_requirements: boolean
  company?: string
}) {
  if (!FUNCTIONS_BASE || !ANON_KEY) {
    throw new Error('Admissions is not configured yet. Please call or WhatsApp the school.')
  }

  const res = await fetch(`${FUNCTIONS_BASE}/public-admissions-apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      school_id: SCHOOL_ID,
      website_url: '',
      ...payload,
      company: payload.company || '',
    }),
  })

  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean
    id?: string
    message?: string
    error?: string
    duplicate?: boolean
  }

  if (!res.ok || data.error) {
    throw new Error(data.error || 'Could not submit application')
  }

  return data
}

/** Merge live EduTrack fields onto the static school constants used across the site. */
export function mergeSchoolProfile(live: EduTrackPublicProfile | null) {
  if (!live) return staticSchool

  return {
    ...staticSchool,
    name: live.name || staticSchool.name,
    motto: live.motto || staticSchool.motto,
    location: live.location_label || staticSchool.location,
    edutrack: live,
  }
}

/** Unique subject display names (case-insensitive), collapsing near-duplicates like English / English Language. */
export function uniqueSubjectNames(
  subjects: Array<{ subject_name: string }> | null | undefined,
): string[] {
  if (!subjects?.length) return []

  const seen = new Set<string>()
  const names: string[] = []
  for (const subject of subjects) {
    const raw = subject.subject_name?.trim()
    if (!raw) continue
    const key = raw.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    names.push(raw)
  }

  names.sort(
    (a, b) => a.length - b.length || a.localeCompare(b, undefined, { sensitivity: 'base' }),
  )

  const collapsed: string[] = []
  for (const name of names) {
    const lower = name.toLowerCase()
    const coveredByShorter = collapsed.some((kept) => {
      const k = kept.toLowerCase()
      return lower === k || lower.startsWith(`${k} `) || lower.startsWith(`${k}/`)
    })
    if (coveredByShorter) continue
    collapsed.push(name)
  }

  return collapsed.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
}
