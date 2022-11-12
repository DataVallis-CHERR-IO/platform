export interface IAuthGuardOptions {
  publicPaths: string[]
  dynamicPaths: string[]
}

export interface IDropZoneOptions {
  maxFileSize: number
}

export interface IContractProjectActivatorOptions {
  owner: string
  address: string
}

export interface ITronNetworkOptions {
  name: string
  provider: string
  event: string
}
