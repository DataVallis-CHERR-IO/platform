export interface IAuthGuard {
  publicPaths: string[]
  dynamicPaths: string[]
}

export interface IDropZoneConfig {
  maxFileSize: number
}
