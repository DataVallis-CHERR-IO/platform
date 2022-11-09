import React, { useContext } from 'react'
import TronWeb from 'tronweb'
import TronWebContext from './context'

export const useTronWebContext = () => useContext(TronWebContext)

interface ITronWebProvider {
  children: React.ReactNode
}

const TronWebProvider: React.FC<ITronWebProvider> = ({ children }) => {
  const HttpProvider = TronWeb.providers.HttpProvider
  const tronWeb = new TronWeb(
    new HttpProvider(process.env.TRONLINK_NETWORK_PROVIDER),
    new HttpProvider(process.env.TRONLINK_NETWORK_PROVIDER),
    new HttpProvider(process.env.TRONLINK_NETWORK_PROVIDER)
  )
  tronWeb.setAddress(process.env.CONTRACT_OWNER)

  return <TronWebContext.Provider value={{ tronWeb }}>{children}</TronWebContext.Provider>
}

export default TronWebProvider
