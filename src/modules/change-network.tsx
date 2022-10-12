import Web3 from 'web3'
import { addNetwork } from './add-network'

export const changeNetwork = () => {
  return new Promise<boolean>(resolve => {
    window.ethereum
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Web3.utils.toHex(process.env.CHAIN_ID) }]
      })
      .then(() => resolve(true))
      .catch(async error => {
        if (error.message.includes(`Unrecognized chain ID "${Web3.utils.toHex(process.env.CHAIN_ID)}".`)) {
          resolve(await addNetwork())
        }

        resolve(false)
      })
  })
}
