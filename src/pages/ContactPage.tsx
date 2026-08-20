import { PageHero } from '../components/PageHero'
import { Contact } from '../components/Contact'
import { Faq } from '../components/Faq'
import { school } from '../lib/school'

export function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Talk with the Victoria Crest team."
        description={`Official line ${school.phoneDisplay} / ${school.phoneSecondaryDisplay}. Or send a WhatsApp enquiry and we will reply.`}
        image="/gallery/lunch-tables.png"
        imagePosition="center 45%"
      />
      <Contact />
      <Faq />
    </>
  )
}
