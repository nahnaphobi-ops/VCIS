export const school = {
  name: 'Victoria Crest International School',
  shortName: 'Victoria Crest',
  motto: 'Excellence.Integrity.Purpose',
  established: '2014',
  location: 'Kumasi, Ghana',
  phoneDisplay: '059 977 2383',
  phoneTel: '+233599772383',
  phoneSecondaryDisplay: '024 201 9659',
  phoneSecondaryTel: '+233242019659',
  whatsapp: '233599772383',
  website: 'vcis.edu.gh',
  facebookUrl: 'https://www.facebook.com/newdestinschool',
  facebookFollowers: '9.3K',
  accreditations: [
    {
      id: 'ges',
      name: 'Ghana Education Service',
      shortName: 'GES',
      src: '/accreditations/ges.png',
    },
    {
      id: 'nasia',
      name: 'National Schools Inspectorate Authority',
      shortName: 'NaSIA',
      src: '/accreditations/nasia.png',
    },
  ],
} as const

export function whatsappEnquireUrl(message: string) {
  return `https://wa.me/${school.whatsapp}?text=${encodeURIComponent(message)}`
}
