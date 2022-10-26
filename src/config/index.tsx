import { IAuthGuard } from '../interfaces/component'

export const authConfig = {
  domain: process.env.APP_DOMAIN,
  statement: 'Please sign this message to confirm your identity.',
  uri: process.env.NEXTAUTH_URL,
  timeout: 60
}

export const authGuard: IAuthGuard = {
  publicPaths: ['/', '/projects'],
  dynamicPaths: ['/projects']
}
