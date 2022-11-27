import { ethers } from 'ethers'
import { contractOptions } from '../config'
import { getCherrioProjectActivatorAbi } from '../contracts/abi/cherrio-project-activator'

export const method = async (method: string, args?: any[], value?: string, address?: string, abi?: any[]): Promise<any> => {
  try {
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    const contract = await new ethers.Contract(address || contractOptions.projectActivator.address, abi || getCherrioProjectActivatorAbi(), signer)

    console.log(contract)
    console.log(method, 'method')
    console.log(args, 'args')
    console.log(value, 'value')
    // const estimatedGas = await contract.estimateGas[method](...args)
    // console.log(estimatedGas, 'estimatedGas')
    // return contract[method](...args, { gasLimit: 500000 })
    return contract[method](...args, value ? { value } : {})
    // return contract[method](...args)
  } catch (error) {
    console.log(error)
    return null
  }
}
