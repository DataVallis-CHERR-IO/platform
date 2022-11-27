import { IAuthGuardOptions, IContractOptions, IDataTableOptions, IDropZoneOptions, IGraphqlOptions, ITokenOptions } from '../interfaces'

export const authGuardOptions: IAuthGuardOptions = {
  publicPaths: ['/', '/projects'],
  dynamicPaths: ['/projects']
}

export const contractOptions: IContractOptions = {
  projectActivator: {
    owner: '0xaae3b0b628e1b8918a0f0c648f5fac3cdfe61c9e',
    address: '0x2A8A0532aAe8D55FC07AF723d5b0693ffB06Ea15'
  }
}

export const dataTableOptions: IDataTableOptions = {
  rowsPerPageOptions: [10, 25, 50, 100],
  rowsPerPage: 10
}

export const dropZoneOptions: IDropZoneOptions = {
  maxFileSize: 5242880
}

export const graphqlOptions: IGraphqlOptions = {
  httpsUrl: 'http://localhost:7778/graphql',
  wssUrl: 'ws://localhost:7778/graphql'
}

export const tokenOptions: ITokenOptions = {
  chainId: 5,
  chain: 'Goerli',
  wagmiChain: 'goerli',
  name: 'GoerliETH',
  decimals: 18,
  rpcUrls: ['https://goerli.infura.io/v3/'],
  blockExplorerUrls: ['https://goerli.etherscan.io/'],
  httpsProvider: 'https://goerli.infura.io/v3/9e4165a8806947a08e67ec27c5039607',
  wssProvider: 'wss://goerli.infura.io/ws/v3/9e4165a8806947a08e67ec27c5039607',
  contract: {
    walletBalanceProvider: '0x75CC0f0E3764be7594772D08EEBc322970CbB3a9',
    poolAddress: '0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6',
    poolDataProvider: '0x9BE876c6DC42215B00d7efe892E2691C3bc35d10',
    poolAddressesProvider: '0x5343b5bA672Ae99d627A1C87866b8E53F47Db2E6',
    wethGateway: '0xd5B55D3Ed89FDa19124ceB5baB620328287b915d'
  }
}
