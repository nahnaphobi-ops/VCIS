import { PageHero } from '../components/PageHero'
import { About } from '../components/About'
import { Stats } from '../components/Stats'
import { school } from '../lib/school'

export function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About"
        title={`A Kumasi school guided by ${school.motto}`}
        description={`${school.name} has served families since ${school.established}. We raise young people who learn with purpose and lead with integrity.`}
        image="/gallery/students-group-portrait.jpg"
        cta={{ to: '/admissions', label: 'Start admissions' }}
      />
      <About />
      <Stats />
    </>
  )
}
