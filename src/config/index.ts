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
  chainId: 80001,
  chain: 'Mumbai',
  evmChain: 'MUMBAI',
  wagmiChain: 'polygonMumbai',
  name: 'MATIC',
  decimals: 18,
  rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
  blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
  httpsProvider: 'https://snowy-holy-reel.matic-testnet.discover.quiknode.pro/e29148ae456d63b706b51806d8a3c41f5a4609c6/',
  wssProvider: 'wss://snowy-holy-reel.matic-testnet.discover.quiknode.pro/e29148ae456d63b706b51806d8a3c41f5a4609c6/',
  contract: {
    walletBalanceProvider: '0x78baC31Ed73c115EB7067d1AfE75eC7B4e16Df9e',
    poolAddress: '0x6C9fB0D5bD9429eb9Cd96B85B81d872281771E6B',
    poolDataProvider: '0x74E3445f239f9915D57715Efb810f67b2a7E5758',
    poolAddressesProvider: '0x5343b5bA672Ae99d627A1C87866b8E53F47Db2E6',
    wethGateway: '0x2a58E9bbb5434FdA7FF78051a4B82cb0EF669C17'
  }
}
