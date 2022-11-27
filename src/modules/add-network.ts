import { ethers } from 'ethers'
import { tokenOptions } from '../config'

export const addNetwork = (): Promise<boolean> => {
  return new Promise<boolean>(resolve => {
    window.ethereum
      .request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: ethers.utils.hexlify(tokenOptions.chainId),
            chainName: tokenOptions.chain,
            nativeCurrency: {
              name: tokenOptions.name,
              symbol: tokenOptions.name,
              decimals: tokenOptions.decimals
            },
            rpcUrls: tokenOptions.rpcUrls,
            blockExplorerUrls: tokenOptions.blockExplorerUrls
          }
        ]
      })
      .then(() => resolve(true))
      .catch(() => {
        resolve(false)
      })
  })
}
