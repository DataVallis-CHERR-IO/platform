import { IAuthGuardOptions, IContractOptions, IDataTableOptions, IDropZoneOptions, ITokenOptions } from '../interfaces'
import { getPoolAbi } from '../contracts/abi/aave/pool'
import { getPoolAddressesProviderAbi } from '../contracts/abi/aave/pool-addresses-provider'
import { getUIPoolDataProviderAbi } from '../contracts/abi/aave/ui-pool-data-provider'
import { getWalletBalanceProviderAbi } from '../contracts/abi/aave/wallet-balance-provider'
import { getWETHGatewayAbi } from '../contracts/abi/aave/weth-gateway'

export const authGuardOptions: IAuthGuardOptions = {
  publicPaths: ['/', '/projects'],
  dynamicPaths: ['/projects']
}

export const contractOptions: IContractOptions = {
  projectActivator: {
    owner: '0xaae3b0b628e1b8918a0f0c648f5fac3cdfe61c9e',
    address: '0x8D41ccf877b06BC9EE4C861286C9913176BA7F18'
  }
}

export const dataTableOptions: IDataTableOptions = {
  rowsPerPageOptions: [10, 25, 50, 100],
  rowsPerPage: 10
}

export const dropZoneOptions: IDropZoneOptions = {
  maxFileSize: 5242880
}

export const tokenOptions: ITokenOptions = {
  chainId: 11155111,
  chain: 'Sepolia',
  name: 'SepoliaETH',
  decimals: 18,
  rpcUrls: ['https://sepolia.infura.io/v3/'],
  blockExplorerUrls: ['https://sepolia.etherscan.io/'],
  httpsProvider: 'https://sepolia.infura.io/v3/9e4165a8806947a08e67ec27c5039607',
  wssProvider: 'wss://sepolia.infura.io/ws/v3/9e4165a8806947a08e67ec27c5039607',
  gasLimit: 1000000,
  contract: {
    pool: '0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6',
    poolAbi: getPoolAbi(),
    poolAddressesProvider: '0xc4dCB5126a3AfEd129BC3668Ea19285A9f56D15D',
    poolAddressesProviderAbi: getPoolAddressesProviderAbi(),
    uiPoolDataProvider: '0xC576539371a2f425545B7BF4eb2a14Eee1944a1C',
    uiPoolDataProviderAbi: getUIPoolDataProviderAbi(),
    walletBalanceProvider: '0x75CC0f0E3764be7594772D08EEBc322970CbB3a9',
    walletBalanceProviderAbi: getWalletBalanceProviderAbi(),
    wethGateway: '0xd5B55D3Ed89FDa19124ceB5baB620328287b915d',
    wethGatewayAbi: getWETHGatewayAbi()
  }
}
