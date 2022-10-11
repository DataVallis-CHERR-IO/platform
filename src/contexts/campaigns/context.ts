import { createContext } from 'react'
import { IProjectsContext } from '../../interfaces/api'

const CampaignContext = createContext<IProjectsContext>({
  projects: []
})

export default CampaignContext
