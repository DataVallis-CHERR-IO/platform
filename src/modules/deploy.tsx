import TronWeb from 'tronweb'
import { getCherrioProjectAbi } from '../contracts/abi/cherrio-project'
import { getCherrioProjectBytecode } from '../contracts/bytecode/cherrio-project'

interface IDeployRes {
  address: string
  txId: string
}

export const deploy = async (parameters: any[]): Promise<IDeployRes> => {
  try {
    console.log(parameters)
    const contract = await (window as any).tronWeb.trx.sendRawTransaction(
      await (window as any).tronWeb.trx.sign(
        await (window as any).tronWeb.transactionBuilder.createSmartContract(
          {
            abi: getCherrioProjectAbi(),
            bytecode: getCherrioProjectBytecode(),
            feeLimit: 1e9,
            callValue: 0,
            userFeePercentage: 0,
            originEnergyLimit: 1e7,
            parameters
          },
          (window as any).tronWeb.defaultAddress.base58
        )
      )
    )

    console.log(contract)

    return {
      address: TronWeb.address.fromHex(contract.transaction.contract_address),
      txId: contract.transaction.txID
    }
  } catch (error) {
    console.log(error)
    return null
  }
}
