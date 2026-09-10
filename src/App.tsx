import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './layouts/SiteLayout'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { ProgrammesPage } from './pages/ProgrammesPage'
import { ProgrammeDetailPage } from './pages/ProgrammeDetailPage'
import { AdmissionsPage } from './pages/AdmissionsPage'
import { GalleryPage } from './pages/GalleryPage'
import { ContactPage } from './pages/ContactPage'
import { CommunityPostPage } from './pages/CommunityPostPage'
import { AnnouncementsPage } from './pages/AnnouncementsPage'
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
          <Route path="programmes/:slug" element={<ProgrammeDetailPage />} />
          <Route path="admissions" element={<AdmissionsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="community/:slug" element={<CommunityPostPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
