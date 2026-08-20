import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'
import { Chatbot } from '../components/Chatbot'
import { SchoolProvider } from '../lib/SchoolContext'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
      return () => window.clearTimeout(timer)
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])
  return null
}

export function SiteLayout() {
  return (
    <SchoolProvider>
      <ScrollToTop />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </SchoolProvider>
  )
}

