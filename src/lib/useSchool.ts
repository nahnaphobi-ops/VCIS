import { useContext } from 'react'
import { SchoolContext } from './SchoolContext'

export function useSchool() {
  return useContext(SchoolContext)
}
