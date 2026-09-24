import type { ProgrammeSlug } from './programmes'
import { programmePath } from './programmes'

export type UniformCategory = {
  id: string
  title: string
  subtitle: string
  image: string
  alt: string
  programme: ProgrammeSlug
}

export const uniformCategories: UniformCategory[] = [
  {
    id: 'creche-kg-boys',
    title: 'Crèche Boys',
    subtitle: 'Early Years Wear',
    image: '/gallery/uniforms/creche-kg-boys.jpg',
    alt: 'Victoria Crest Crèche and KG boy in early years uniform',
    programme: 'early-years',
  },
  {
    id: 'creche-kg-girls',
    title: 'Crèche Girls',
    subtitle: 'Early Years Wear',
    image: '/gallery/uniforms/creche-kg-girls.jpg',
    alt: 'Victoria Crest Crèche and KG girl in early years uniform',
    programme: 'early-years',
  },
  {
    id: 'primary-boys',
    title: 'Primary Boys',
    subtitle: 'Classic Tie & Shorts',
    image: '/gallery/uniforms/primary-boys.jpg',
    alt: 'Victoria Crest Primary boy in tie and checkered shorts',
    programme: 'primary',
  },
  {
    id: 'primary-girls',
    title: 'Primary Girls',
    subtitle: 'Pinafore & Bow',
    image: '/gallery/uniforms/primary-girls.jpg',
    alt: 'Victoria Crest Primary girl in pinafore and bow',
    programme: 'primary',
  },
  {
    id: 'jhs-boys',
    title: 'JHS Boys',
    subtitle: 'Trousers & Tie',
    image: '/gallery/uniforms/jhs-boys.jpg',
    alt: 'Victoria Crest JHS boy in trousers and tie',
    programme: 'junior-high',
  },
  {
    id: 'jhs-girls',
    title: 'JHS Girls',
    subtitle: 'Pinafore & Bow',
    image: '/gallery/uniforms/jhs-girls.jpg',
    alt: 'Victoria Crest JHS girl in pinafore and bow',
    programme: 'junior-high',
  },
]

export function uniformCategoryPath(category: UniformCategory) {
  return programmePath(category.programme)
}
