import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Programmes } from './components/Programmes'
import { Admissions } from './components/Admissions'
import { Gallery } from './components/Gallery'
import { Community } from './components/Community'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Chatbot } from './components/Chatbot'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Programmes />
        <Admissions />
        <Gallery />
        <Community />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </>
  )
}
