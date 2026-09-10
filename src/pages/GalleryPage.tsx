import { PageHero } from '../components/PageHero'
import { Gallery } from '../components/Gallery'
import { Community } from '../components/Community'

export function GalleryPage() {
  return (
    <>
      <PageHero
        kicker="Gallery"
        title="Moments from school life in Kumasi."
        description="Learning, play, culture, and community — browse campus life and follow more updates on Facebook."
        image="/gallery/students-pair-girls.jpg"
        imagePosition="center 25%"
        cta={{ to: '/contact', label: 'Book a visit' }}
      />
      <Gallery />
      <Community />
    </>
  )
}
