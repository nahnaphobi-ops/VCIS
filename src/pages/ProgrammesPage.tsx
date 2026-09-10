import { PageHero } from '../components/PageHero'
import { Programmes } from '../components/Programmes'
import { SchoolUpdates } from '../components/SchoolUpdates'
import { Faq } from '../components/Faq'

export function ProgrammesPage() {
  return (
    <>
      <PageHero
        kicker="Programmes"
        title="Early Years, Primary, and Junior High pathways."
        description="Each stage builds on the one before it — with clear age bands, learning focus, and guidance through every transition."
        image="/gallery/students-pair-girls.jpg"
        imagePosition="center 20%"
        cta={{ to: '/contact', label: 'Ask about placement' }}
      />
      <Programmes />
      <SchoolUpdates />
      <Faq />
    </>
  )
}
