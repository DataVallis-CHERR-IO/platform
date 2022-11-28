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
  pool: string
  poolAbi: string[]
  poolAddressesProvider: string
  poolAddressesProviderAbi: string[]
  uiPoolDataProvider: string
  uiPoolDataProviderAbi: string[]
  walletBalanceProvider: string
  walletBalanceProviderAbi: string[]
  wethGateway: string
  wethGatewayAbi: string[]
}

export interface IAsset {
  name: string
  address: string
  aToken: string
  variableDebtToken: string
  stableDebtToken: string
  underlyingAsset: string
  decimals: number
  abi: string[]
  aTokenAbi: string[]
  variableDebtTokenAbi?: string[]
  stableDebtTokenAbi?: string[]
  icon: string
  stableBorrowRateEnabled?: boolean
  isNative?: boolean
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
  gasLimit: number
  contract: ITokenContract
}
