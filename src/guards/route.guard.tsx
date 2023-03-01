import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { authGuardOptions } from '../config'

const RouteGuard = ({ children }) => {
  const router = useRouter()
  const { isConnected } = useAccount()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    authCheck(router.route)

    const hideContent = () => setAuthorized(false)
    router.events.on('routeChangeStart', hideContent)
    router.events.on('routeChangeComplete', authCheck)

    return () => {
      router.events.off('routeChangeStart', hideContent)
      router.events.off('routeChangeComplete', authCheck)
    }
  }, [isConnected])

  const authCheck = url => {
    let path = url.split('?')[0]

    for (const dynamicPath of authGuardOptions.dynamicPaths) {
      if (path.includes(dynamicPath) && path.startsWith(dynamicPath)) {
        path = dynamicPath

        break
      }
    }

    if (!isConnected && !authGuardOptions.publicPaths.includes(path)) {
      setAuthorized(false)
      router.push({
        pathname: '/'
      })
    } else {
      setAuthorized(true)
    }
  }

  return authorized && children
}

export default RouteGuard
