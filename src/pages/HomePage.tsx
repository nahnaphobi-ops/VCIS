import { Hero } from '../components/Hero'
import { Stats } from '../components/Stats'
import { Programmes } from '../components/Programmes'
import { DirectorMessage } from '../components/DirectorMessage'
import { WhyUs } from '../components/WhyUs'
import { SchoolUpdates } from '../components/SchoolUpdates'
import { Faq } from '../components/Faq'
import { Community } from '../components/Community'

export function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Programmes />
      <DirectorMessage />
      <SchoolUpdates />
      <WhyUs />
      <Faq />
      <Community />
    </>
  )
}
