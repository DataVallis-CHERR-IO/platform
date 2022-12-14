import { contractProjectActivatorOptions } from '../config'

export const method = async (method: string, args?: any[], value?: string, address?: string): Promise<boolean> => {
  try {
    const contract = await (window as any).tronWeb.contract().at(address || contractProjectActivatorOptions.address)
    await contract[method](...args).send({
      feeLimit: 1e9,
      callValue: value
    })

    return true
  } catch (error) {
    return false
  }
}
