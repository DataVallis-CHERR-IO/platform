import { IAuthGuard, IDropZoneConfig } from '../interfaces/component'

export const authGuard: IAuthGuard = {
  publicPaths: ['/', '/projects'],
  dynamicPaths: ['/projects']
}

export const dropZoneConfig: IDropZoneConfig = {
  maxFileSize: 5242880
}
