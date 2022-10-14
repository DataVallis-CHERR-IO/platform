import { addNetwork } from './add-network'
import { ethers } from 'ethers'

export const changeNetwork = () => {
  return new Promise<boolean>(resolve => {
    window.ethereum
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ethers.utils.hexlify(process.env.CHAIN_ID) }]
      })
      .then(() => resolve(true))
      .catch(async error => {
        if (error.message.includes(`Unrecognized chain ID "${ethers.utils.hexlify(process.env.CHAIN_ID)}".`)) {
          return resolve(await addNetwork())
        }

        resolve(false)
      })
  })
}
