import { createContext } from 'react'

interface ITronWebContext {
  tronWeb: any
}

const TronWebContext = createContext<ITronWebContext>({
  tronWeb: null
})

export default TronWebContext
