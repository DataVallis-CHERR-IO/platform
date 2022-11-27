export interface IAuthGuardOptions {
  publicPaths: string[]
  dynamicPaths: string[]
}

export interface IContractOptions {
  projectActivator: {
    owner: string
    address: string
  }
}

export interface IDataTableOptions {
  rowsPerPageOptions: number[]
  rowsPerPage: number
}

export interface IDropZoneOptions {
  maxFileSize: number
}

export interface IGraphqlOptions {
  httpsUrl: string
  wssUrl: string
}

export interface ITokenContract {
  walletBalanceProvider: string
  poolAddress: string
  poolDataProvider: string
  poolAddressesProvider: string
  wethGateway: string
}

export interface IAsset {
  name: string
  address: string
  aToken: string
  variableDebtToken: string
  stableDebtToken: string
  decimals: number
  abi: string[]
  icon: string
}

export interface ITokenOptions {
  chainId: number
  chain: string
  wagmiChain: string
  name: string
  decimals: number
  rpcUrls: string[]
  blockExplorerUrls: string[]
  httpsProvider: string
  wssProvider: string
  contract: ITokenContract
}
