import React, { useContext } from 'react'
import TronWeb from 'tronweb'
import TronWebContext from './context'
import { contractProjectActivatorOptions, tronNetworkOptions } from '../../config'

export const useTronWebContext = () => useContext(TronWebContext)

interface ITronWebProvider {
  children: React.ReactNode
}

const TronWebProvider: React.FC<ITronWebProvider> = ({ children }) => {
  const HttpProvider = TronWeb.providers.HttpProvider
  const tronWeb = new TronWeb(
    new HttpProvider(tronNetworkOptions.provider),
    new HttpProvider(tronNetworkOptions.provider),
    new HttpProvider(tronNetworkOptions.provider)
  )
  tronWeb.setAddress(contractProjectActivatorOptions.owner)

  return <TronWebContext.Provider value={{ tronWeb }}>{children}</TronWebContext.Provider>
}

export default TronWebProvider
