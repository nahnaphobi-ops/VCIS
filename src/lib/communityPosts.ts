import { school } from './school'

export type CommunityPostSlug = 'culture-day' | 'campus-moments' | 'growing-family'

export type CommunityPost = {
  slug: CommunityPostSlug
  title: string
  kicker: string
  image: string
  position?: string
  excerpt: string
  body: string[]
  highlights: Array<{ title: string; body: string }>
  closing: string
}

export const communityPosts: CommunityPost[] = [
  {
    slug: 'culture-day',
    title: 'Excellence in every learner',
    kicker: 'Our Students',
    image: '/gallery/students-group-studio.jpg',
    excerpt:
      'Victoria Crest students stand tall in their uniforms — confident, prepared, and ready to purpose.',
    body: [
      'Culture Day is one of the moments families remember most. Learners arrive in traditional attire, classrooms open into song and story, and the school grounds become a living gallery of Ghanaian heritage — from Kente patterns to regional songs and proud family histories.',
      'Teachers use the day to connect identity with learning. Younger children practise greetings, colours, and stories from home. Older learners discuss respect, belonging, and how cultural confidence supports academic courage. The crest\'s call to Purpose is visible here: education that helps children know who they are as they grow into who they can become.',
      'Parents and guardians are part of the celebration. Photos, conversations at the gate, and shared meals turn a school event into a community memory. For many children, Culture Day is the first time they see classmates\' home traditions side by side — and realise difference can be a reason for friendship rather than distance.',
      'We also treat Culture Day as formation, not only festivity. Students practise courtesy with visitors, care for shared spaces, and represent Victoria Crest with integrity. Excellence shows up in preparation: rehearsed performances, tidy presentations, and pride in doing small things well.',
    ],
    highlights: [
      {
        title: 'Heritage with heart',
        body: 'Traditional dress, music, and storytelling help learners honour family roots while building school belonging.',
      },
      {
        title: 'Learning beyond the textbook',
        body: 'Culture Day links identity, language, and civic respect to the values we teach all year.',
      },
      {
        title: 'Families welcome',
        body: 'Parents see school life up close and leave with shared photos, conversations, and community pride.',
      },
    ],
    closing:
      'Follow Victoria Crest on Facebook for Culture Day galleries and upcoming celebration dates — then visit campus to feel the same energy in person.',
  },
  {
    slug: 'campus-moments',
    title: 'Friendship built on integrity',
    kicker: 'Campus Life',
    image: '/gallery/students-pair-boy-girl.jpg',
    position: 'center 40%',
    excerpt:
      'At Victoria Crest, friendships grow through kindness, respect, and shared purpose in and out of the classroom.',
    body: [
      'A strong school is measured in classrooms — and also in the quieter minutes between them. At Victoria Crest, outdoor lunch tables, play areas, and open campus corners are part of how children learn to share, wait their turn, solve small disagreements, and look after one another.',
      'Teachers and staff keep a watchful presence without turning break into another formal lesson. Children practise independence: packing lunch, choosing friends wisely, including someone who is sitting alone, and returning ready to learn. These habits are Integrity in everyday form.',
      'Play also protects wellbeing. Movement after focused work helps attention return. Laughter lowers the temperature after a hard task. For Early Years and Primary especially, outdoor moments are where language grows through conversation and where confidence grows through belonging.',
      'Families often tell us they chose Victoria Crest after seeing how children interact on campus — not staged for a tour, but naturally kind and busy with school life. That is the atmosphere we work to protect: warm, orderly, and genuinely child-centred.',
    ],
    highlights: [
      {
        title: 'Safe outdoor rhythm',
        body: 'Break and lunch are supervised spaces where friendship and self-management can grow.',
      },
      {
        title: 'Character in practice',
        body: 'Sharing tables, inviting peers in, and caring for the grounds are taught as seriously as academic work.',
      },
      {
        title: 'Ready to learn again',
        body: 'Fresh air and movement help learners return to class with renewed focus.',
      },
    ],
    closing:
      'Come for a campus visit if you want to see a normal school day — lessons, play, and the community around every learner.',
  },
  {
    slug: 'growing-family',
    title: 'Purpose-driven learning',
    kicker: 'Academic Excellence',
    image: '/gallery/students-group-formal.jpg',
    excerpt:
      'Every Victoria Crest learner is guided by purpose — to grow, to contribute, to lead with integrity.',
    body: [
      `Victoria Crest began serving families in ${school.location} in ${school.established}. Since then, the school community has grown through word of mouth, campus visits, and a Facebook family that now numbers ${school.facebookFollowers} followers staying close to school life.`,
      'That growth matters because education is never only a timetable. Parents want to know their child is known, challenged, and celebrated. Our updates — assemblies, Culture Day, sports, and quiet classroom wins — help families feel present even when they cannot be on campus every hour.',
      'Online community does not replace in-person partnership. It extends it. Notices, photo moments, and encouragement travel quickly. Questions find answers. New families researching schools can see real learners, real staff, and a consistent visual language of navy, orange, and crest pride.',
      'We invite every family to join both sides of community life: follow the Facebook page for public moments, and speak with admissions when you are ready for a personal conversation about placement. Excellence. Integrity. Purpose. is not only our motto — it is the standard we ask the whole community to carry.',
    ],
    highlights: [
      {
        title: 'Connected families',
        body: `${school.facebookFollowers} followers keep up with celebrations, reminders, and campus pride.`,
      },
      {
        title: 'Real school life',
        body: 'Photos and updates show ordinary excellence — not a brochure fantasy.',
      },
      {
        title: 'Open door next',
        body: 'When online curiosity becomes a serious enquiry, our admissions team is ready to guide you.',
      },
    ],
    closing: `Follow ${school.facebookUrl.replace('https://www.', '')} and call ${school.phoneDisplay} when you are ready to begin.`,
  },
]

export function getCommunityPost(slug: string | undefined) {
  return communityPosts.find((item) => item.slug === slug) ?? null
}

export function communityPostPath(slug: CommunityPostSlug) {
  return `/community/${slug}`
}
