import { addNetwork } from './add-network'
import { ethers } from 'ethers'
import { tokenOptions } from '../config'

export const changeNetwork = (): Promise<boolean> => {
  return new Promise<boolean>(resolve => {
    window.ethereum
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.utils.hexlify(tokenOptions.chainId) }]
      })
      .then(() => resolve(true))
      .catch(async error => {
        if (error.message.includes(`Unrecognized chain ID "${ethers.utils.hexlify(tokenOptions.chainId)}".`)) {
          return resolve(await addNetwork())
        }

        resolve(false)
      })
  })
}
