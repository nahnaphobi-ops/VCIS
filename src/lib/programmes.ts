export type ProgrammeSlug = 'early-years' | 'primary' | 'junior-high'

export type ProgrammeContent = {
  slug: ProgrammeSlug
  title: string
  age: string
  summary: string
  focus: string
  heroImage: string
  heroPosition: string
  images: Array<{ src: string; position: string }>
  intro: string
  approach: string
  learningAreas: Array<{ title: string; body: string }>
  experience: Array<string>
  familyNotes: Array<string>
  nextStep: string
}

export const programmes: ProgrammeContent[] = [
  {
    slug: 'early-years',
    title: 'Early Years',
    age: 'Ages 2–5',
    summary: 'A warm start to school life — play, language, and the habits that make learning feel safe.',
    focus: 'Language, early numeracy, discovery, creative play, and independence.',
    heroImage: '/gallery/early-years-1.png',
    heroPosition: 'center 20%',
    images: [
      { src: '/gallery/early-years-1.png', position: 'center 20%' },
      { src: '/gallery/early-years-2.png', position: 'center 40%' },
      { src: '/gallery/early-years-3.png', position: 'center 30%' },
    ],
    intro:
      'Early Years at Victoria Crest is where children first feel that school can be joyful, safe, and full of purpose. We welcome toddlers and young learners into classrooms designed for curiosity, language growth, and confident independence — never rushed, never overlooked.',
    approach:
      'Our teachers blend structured play with gentle routines. Children practise listening, sharing, early counting, and storytelling while building the social habits that make later learning easier. Every child is known by name, encouraged daily, and guided with the same motto that shapes the whole school: Excellence. Integrity. Purpose.',
    learningAreas: [
      {
        title: 'Language & communication',
        body: 'Songs, stories, conversation, and early literacy activities help children find their voice and understand others with confidence.',
      },
      {
        title: 'Early numeracy & discovery',
        body: 'Counting, sorting, patterns, and hands-on exploration introduce mathematical thinking through play rather than pressure.',
      },
      {
        title: 'Creative expression',
        body: 'Art, music, movement, and role-play give young learners healthy ways to express feelings and imagination.',
      },
      {
        title: 'Independence & care',
        body: 'Self-help skills, classroom routines, and kind friendships prepare children for Primary with steadiness and joy.',
      },
    ],
    experience: [
      'Small, attentive groups with teachers who notice each child’s pace and personality',
      'A calm daily rhythm: arrival, circle time, play-based learning, outdoor moments, and rest',
      'Safe outdoor play and campus spaces that invite movement and friendship',
      'Regular communication with families so home and school support the same child',
    ],
    familyNotes: [
      'Placement conversations help us match your child to the right Early Years group.',
      'We share settling-in guidance so the first weeks feel familiar rather than overwhelming.',
      'Parents are partners — updates, visits, and open questions are always welcome.',
    ],
    nextStep:
      'If your child is between ages 2 and 5, start with an enquiry or campus visit. We will explain current openings, what to bring, and how the first days typically unfold.',
  },
  {
    slug: 'primary',
    title: 'Primary',
    age: 'Ages 6–11',
    summary:
      'Strong core subjects with character formation — learners who can think, write, and work well with others.',
    focus: 'Literacy, numeracy, science, technology, creative expression, and collaboration.',
    heroImage: '/gallery/play-swings.png',
    heroPosition: 'center 40%',
    images: [{ src: '/gallery/play-swings.png', position: 'center 40%' }],
    intro:
      'Primary at Victoria Crest builds the academic foundation and character habits families trust for the long term. Learners move from guided discovery into clearer subject learning while staying curious, respectful, and proud of careful work.',
    approach:
      'We expect strong literacy and numeracy, but never at the expense of wellbeing. Teachers combine clear instruction with projects, reading culture, and collaborative tasks so children practise thinking aloud, writing with purpose, and solving problems together. Integrity is taught in daily choices — honesty in work, kindness to peers, and responsibility for shared spaces.',
    learningAreas: [
      {
        title: 'Literacy & communication',
        body: 'Reading fluency, writing craft, listening, and spoken presentation help every learner explain ideas with clarity.',
      },
      {
        title: 'Numeracy & reasoning',
        body: 'Number sense, problem-solving, and mathematical language grow through practice that values understanding over shortcuts.',
      },
      {
        title: 'Science & technology',
        body: 'Observation, enquiry, and practical tasks connect classroom ideas to the world children already notice around them.',
      },
      {
        title: 'Creative & social growth',
        body: 'Arts, physical activity, and teamwork strengthen confidence, empathy, and a healthy school identity.',
      },
    ],
    experience: [
      'Age-appropriate challenge with teachers who track progress and intervene early when support is needed',
      'A culture of neat work, respectful behaviour, and pride in improvement',
      'Opportunities for leadership in class roles, assemblies, and peer support',
      'Family updates that make term goals and next steps easy to understand at home',
    ],
    familyNotes: [
      'Transferring learners may share recent report cards or school letters during admissions.',
      'We discuss class placement carefully so each child enters a group where they can thrive.',
      'Homework and reading habits are designed to reinforce school learning without overwhelming family life.',
    ],
    nextStep:
      'Tell us your child’s age and current class. Our admissions team will advise on placement, documents, and how Primary builds toward Junior High.',
  },
  {
    slug: 'junior-high',
    title: 'Junior High',
    age: 'Ages 12–14',
    summary:
      'Deeper academic challenge and guidance as students prepare for the next stage of their education.',
    focus: 'Subject mastery, critical thinking, leadership, examination readiness, and life skills.',
    heroImage: '/gallery/students-picnic-girls.png',
    heroPosition: 'center 30%',
    images: [{ src: '/gallery/students-picnic-girls.png', position: 'center 30%' }],
    intro:
      'Junior High at Victoria Crest stretches learners academically while keeping character and purpose at the centre. Students deepen subject mastery, practise independent study habits, and prepare for the next stage of schooling with confidence rather than anxiety.',
    approach:
      'Teaching becomes more specialised and demanding, with clear expectations for reading, writing, analysis, and revision. Mentoring and pastoral care remain close: we want teenagers who can think carefully, lead kindly, and make decisions they can stand by. The crest’s global outlook shows up in wider reading, current affairs conversations, and readiness for opportunities beyond Kumasi.',
    learningAreas: [
      {
        title: 'Subject mastery',
        body: 'Core academic subjects are taught with depth so students can explain concepts, apply them, and revise with discipline.',
      },
      {
        title: 'Critical thinking',
        body: 'Debate, research tasks, and problem-based work help learners weigh evidence and communicate reasoned views.',
      },
      {
        title: 'Examination readiness',
        body: 'Study skills, timed practice, and feedback cycles prepare students for assessments without reducing education to test drilling alone.',
      },
      {
        title: 'Leadership & life skills',
        body: 'Responsibility, collaboration, digital judgement, and personal organisation support success in school and after it.',
      },
    ],
    experience: [
      'Teachers who challenge strong students and support those who need a steadier climb',
      'Clear academic routines: notes, revision plans, reading expectations, and constructive feedback',
      'Leadership chances through peer mentoring, clubs, and school responsibilities',
      'Guidance conversations with families about pathways after Junior High',
    ],
    familyNotes: [
      'We review previous school records carefully for transferring students.',
      'Parents receive honest updates on effort, behaviour, and academic trajectory.',
      'Admissions can explain current class openings and any placement assessments required.',
    ],
    nextStep:
      'If your child is ready for deeper secondary preparation, enquire with their age and recent school background. We will outline placement options and enrolment steps.',
  },
]

export function getProgramme(slug: string | undefined) {
  return programmes.find((item) => item.slug === slug) ?? null
}

export function programmePath(slug: ProgrammeSlug) {
  return `/programmes/${slug}`
}
