import React, { useContext } from 'react'
import SessionContext from './context'
import { useSession } from 'next-auth/react'

export const useSessionContext = () => useContext(SessionContext)

interface ISessionProviderProps {
  children: React.ReactNode
}

const SessionProvider: React.FC<ISessionProviderProps> = ({ children }) => {
  const { data: session } = useSession()

  return (
    <SessionContext.Provider
      value={{
        account: session?.user?.name
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export default SessionProvider
