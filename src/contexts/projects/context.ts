import { createContext } from 'react'
import { IProject } from '../../interfaces/api'

interface IProjectsContext {
  projects: IProject[]
}

const ProjectsContext = createContext<IProjectsContext>({
  projects: []
})

export default ProjectsContext
