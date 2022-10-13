import React, { useContext } from 'react'
import ProjectsContext from './context'
import { IProject } from '../../interfaces/api'

export const useProjectsContext = () => useContext(ProjectsContext)

interface IProjectProviderProps {
  children: React.ReactNode
  projects?: IProject[]
}

const ProjectsProvider: React.FC<IProjectProviderProps> = ({ children, projects }) => {
  return <ProjectsContext.Provider value={{ projects }}>{children}</ProjectsContext.Provider>
}

export default ProjectsProvider
