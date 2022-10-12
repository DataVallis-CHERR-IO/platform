import { createContext } from 'react'
import { IProjectsContext } from '../../interfaces/api'

const ProjectsContext = createContext<IProjectsContext>({
  projects: []
})

export default ProjectsContext
