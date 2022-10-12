import Web3 from 'web3'

export const addNetwork = () => {
  return new Promise<boolean>(resolve => {
    window.ethereum
      .request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: Web3.utils.toHex(process.env.CHAIN_ID),
            chainName: process.env.CHAIN,
            nativeCurrency: {
              name: process.env.TOKEN_NAME,
              symbol: process.env.TOKEN_NAME,
              decimals: Number(process.env.TOKEN_DECIMALS)
            },
            rpcUrls: [process.env.TOKEN_RPC_URL],
            blockExplorerUrls: [process.env.TOKEN_BLOCK_EXPLORER_URL]
          }
        ]
      })
      .then(() => resolve(true))
      .catch(() => {
        resolve(false)
      })
  })
}
