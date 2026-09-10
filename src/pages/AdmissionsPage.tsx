import { PageHero } from '../components/PageHero'
import { Admissions } from '../components/Admissions'
import { AdmissionsForm } from '../components/AdmissionsForm'
import { SchoolUpdates } from '../components/SchoolUpdates'
import { Contact } from '../components/Contact'
import { school } from '../lib/school'

export function AdmissionsPage() {
  return (
    <>
      <PageHero
        kicker="Admissions"
        title="A clear path from first enquiry to enrolment."
        description={`Call ${school.phoneDisplay}, WhatsApp, or submit the online form. Applications go straight to the school’s EduTrack admissions dashboard.`}
        image="/gallery/students-group-formal.jpg"
        imagePosition="center 30%"
        cta={{ to: '/admissions#apply', label: 'Apply online' }}
      />
      <Admissions />
      <AdmissionsForm />
      <SchoolUpdates />
      <Contact />
    </>
  )
}
