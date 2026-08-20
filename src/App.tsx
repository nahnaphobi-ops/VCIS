import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './layouts/SiteLayout'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { ProgrammesPage } from './pages/ProgrammesPage'
import { AdmissionsPage } from './pages/AdmissionsPage'
import { GalleryPage } from './pages/GalleryPage'
import { ContactPage } from './pages/ContactPage'
import { AdminPage, AdminUnavailable } from './components/AdminPage'

const adminConfigured = Boolean(
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY && import.meta.env.VITE_CONVEX_URL,
)

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="admin" element={adminConfigured ? <AdminPage /> : <AdminUnavailable />} />
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="programmes" element={<ProgrammesPage />} />
          <Route path="admissions" element={<AdmissionsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
