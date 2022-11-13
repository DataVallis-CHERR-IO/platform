import { IAuthGuardOptions, IContractProjectActivatorOptions, IDropZoneOptions, ITronNetworkOptions } from '../interfaces/options'

export const authGuardOptions: IAuthGuardOptions = {
  publicPaths: ['/', '/projects'],
  dynamicPaths: ['/projects']
}

export const dropZoneOptions: IDropZoneOptions = {
  maxFileSize: 5242880
}

export const contractProjectActivatorOptions: IContractProjectActivatorOptions = {
  owner: 'TDagn9CdgAdJJNbpqTSjCqt39wpvUsHLwN',
  address: 'TAoNHeBQMWU8pxqhbdNT59hAkjDnSoxVPV'
}

export const tronNetworkOptions: ITronNetworkOptions = {
  name: 'TRON Nile Testnet',
  provider: 'https://nile.trongrid.io',
  event: 'https://event.nileex.io'
}
