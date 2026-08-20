import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { school as staticSchool } from './school'
import {
  fetchEduTrackPublicProfile,
  type EduTrackPublicProfile,
} from './edutrack'

export type SchoolInfo = {
  name: string
  shortName: string
  motto: string
  established: string
  location: string
  phoneDisplay: string
  phoneTel: string
  phoneSecondaryDisplay: string
  phoneSecondaryTel: string
  whatsapp: string
  website: string
  facebookUrl: string
  facebookFollowers: string
  accreditations: typeof staticSchool.accreditations
}

export type SchoolContextValue = {
  school: SchoolInfo
  live: EduTrackPublicProfile | null
  loading: boolean
}

export const SchoolContext = createContext<SchoolContextValue>({
  school: staticSchool,
  live: null,
  loading: true,
})

export function SchoolProvider({ children }: { children: ReactNode }) {
  const [live, setLive] = useState<EduTrackPublicProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const profile = await fetchEduTrackPublicProfile()
      if (cancelled) return
      setLive(profile)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const school: SchoolInfo = live
    ? {
        ...staticSchool,
        name: live.name || staticSchool.name,
        motto: live.motto?.trim() || staticSchool.motto,
        location: live.location_label || staticSchool.location,
      }
    : staticSchool

  return (
    <SchoolContext.Provider value={{ school, live, loading }}>
      {children}
    </SchoolContext.Provider>
  )
}
