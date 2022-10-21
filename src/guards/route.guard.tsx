import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { authGuard } from '../config'
import { useAccount } from 'wagmi'

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
  }, [])

  const authCheck = url => {
    let path = url.split('?')[0]

    for (const dynamicPath of authGuard.dynamicPaths) {
      if (path.includes(dynamicPath) && path.startsWith(dynamicPath)) {
        path = dynamicPath

        break
      }
    }

    if (!isConnected && !authGuard.publicPaths.includes(path)) {
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
