import { ethers } from 'ethers'

export const truncateAddress = (address: string): string => (address ? `${address.slice(0, 5)}...${address.slice(-5)}` : '')
export const isAddress = (address: string): boolean => (address ? ethers.utils.isAddress(address) : false)
export const getEther = (value: any): number => (value ? Number(ethers.utils.formatUnits(value.toString(), process.env.TOKEN_DECIMALS)) : null)
export const getWei = (value: any): string => (value ? ethers.utils.parseEther(value.toString()).toString() : null)
export const getBase64 = (file: File): Promise<string> => {
  const reader = new FileReader()
  reader.readAsDataURL(file as Blob)

  return new Promise<string>(resolve => {
    reader.onload = () => resolve(reader.result as any)
    reader.onerror = () => resolve(null)
  })
}
