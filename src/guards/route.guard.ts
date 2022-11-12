import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { authGuardOptions } from '../config'
import { useSession } from 'next-auth/react'

const RouteGuard = ({ children }) => {
  const router = useRouter()
  const { data: session } = useSession()
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

    for (const dynamicPath of authGuardOptions.dynamicPaths) {
      if (path.includes(dynamicPath) && path.startsWith(dynamicPath)) {
        path = dynamicPath

        break
      }
    }

    if (!session && !authGuardOptions.publicPaths.includes(path)) {
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
