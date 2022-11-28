import { ethers } from 'ethers'
import { contractOptions } from '../config'
import { getCherrioProjectActivatorAbi } from '../contracts/abi/cherrio-project-activator'
import * as _ from 'lodash'

export const method = async (method: string, args?: any[], options?: any, address?: string, abi?: any[]): Promise<any> => {
  try {
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    const contract = await new ethers.Contract(address || contractOptions.projectActivator.address, abi || getCherrioProjectActivatorAbi(), signer)

    let estimateGas
    _.get(options, 'gasLimit') || (estimateGas = await contract.estimateGas[method](...args, options ? options : {}))

    return await contract[method](...args, options ? options : { gasLimit: estimateGas.toString() })
  } catch (error) {
    return null
  }
}
