import React, { useContext } from 'react'
import { IDefaultProps } from '../../interfaces/components'
import ProjectsContext from './context'

export const useProjectsContext = () => useContext(ProjectsContext)

const ProjectsProvider: React.FC<IDefaultProps> = ({ children, projects }) => {
  return <ProjectsContext.Provider value={{ projects }}>{children}</ProjectsContext.Provider>
}

export default ProjectsProvider
