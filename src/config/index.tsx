import { IAuthGuard } from '../interfaces/component'

export const authGuard: IAuthGuard = {
  publicPaths: ['/', '/projects', 'btfs-demo'],
  dynamicPaths: ['/projects']
}
