import { createContext } from 'react'

interface ISessionContext {
  account: string
}

const SessionContext = createContext<ISessionContext>({
  account: null
})

export default SessionContext
