import { Hero } from '../components/Hero'
import { Stats } from '../components/Stats'
import { Programmes } from '../components/Programmes'
import { DirectorMessage } from '../components/DirectorMessage'
import { SchoolUpdates } from '../components/SchoolUpdates'
import { Announcements } from '../components/Announcements'
import { WhyUs } from '../components/WhyUs'
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
      <Announcements />
      <WhyUs />
      <Faq />
      <Community />
    </>
  )
}
