export const school = {
  name: 'Victoria Crest International School',
  shortName: 'Victoria Crest',
  motto: 'Integrity · Excellence',
  established: '2014',
  location: 'Kumasi, Ghana',
  phoneDisplay: '024 201 9659',
  phoneTel: '+233242019659',
  whatsapp: '233242019659',
  website: 'vcis.edu.gh',
  facebookUrl: 'https://www.facebook.com/newdestinschool',
  facebookFollowers: '9.3K',
} as const

export function whatsappEnquireUrl(message: string) {
  return `https://wa.me/${school.whatsapp}?text=${encodeURIComponent(message)}`
}
