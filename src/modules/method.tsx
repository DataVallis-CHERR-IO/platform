import { ethers } from 'ethers'
import { getCherrioProjectAbi } from '../contracts/abi/cherrio-project'
import { getCherrioProjectActivatorAbi } from '../contracts/abi/cherrio-project-activator'

export const method = async (method: string, args?: any[], value?: string, address?: string): Promise<boolean> => {
  try {
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    const contract = await new ethers.Contract(
      address || process.env.CONTRACT_CHERRIO_PROJECT_ACTIVATOR_ADDRESS,
      address ? getCherrioProjectAbi() : getCherrioProjectActivatorAbi(),
      signer
    )
    await contract[method](...args, value ? { value } : {})

    return true
  } catch (error) {
    return false
  }
}
