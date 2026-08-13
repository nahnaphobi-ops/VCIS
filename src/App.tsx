import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { TrustBar } from './components/TrustBar'
import { About } from './components/About'
import { Stats } from './components/Stats'
import { Programmes } from './components/Programmes'
import { WhyUs } from './components/WhyUs'
import { Admissions } from './components/Admissions'
import { Contact } from './components/Contact'
import { Gallery } from './components/Gallery'
import { Faq } from './components/Faq'
import { Community } from './components/Community'
import { Footer } from './components/Footer'
import { Chatbot } from './components/Chatbot'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <About />
        <Stats />
        <Programmes />
        <WhyUs />
        <Admissions />
        <Contact />
        <Gallery />
        <Faq />
        <Community />
      </main>
      <Footer />
      <Chatbot />
    </>
  )
}
