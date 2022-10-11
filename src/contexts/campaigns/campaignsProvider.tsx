import React, { useContext } from 'react'
import { IDefaultProps } from '../../interfaces/components'
import CampaignsContext from './context'

export const useCampaignContext = () => useContext(CampaignsContext)

const CampaignsProvider: React.FC<IDefaultProps> = ({ children, campaigns }) => {
  return <CampaignsContext.Provider value={{ projects: campaigns }}>{children}</CampaignsContext.Provider>
}

export default CampaignsProvider
