import { ethers } from 'ethers'
import { getCherrioProjectAbi } from '../contracts/abi/cherrio-project'
import { getCherrioProjectBytecode } from '../contracts/bytecode/cherrio-project'

export const deploy = async (args: any[]): Promise<ethers.Contract> => {
  try {
    const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner()
    const contract = await new ethers.ContractFactory(getCherrioProjectAbi(), getCherrioProjectBytecode(), signer).connect(signer).deploy(...args)
    await contract.deployed()

    return contract
  } catch (error) {
    return null
  }
}
