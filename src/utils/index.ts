import { ethers } from 'ethers'
import { tokenOptions } from '../config'

export const truncateAddress = (address: string): string => (address ? `${address.slice(0, 5)}...${address.slice(-5)}` : '')
export const isAddress = (address: string): boolean => (address ? ethers.utils.isAddress(address) : false)
export const getEther = (value: any): number => (value ? Number(ethers.utils.formatUnits(value.toString(), tokenOptions.decimals)) : null)
export const getWei = (value: any): string => (value ? ethers.utils.parseEther(value.toString()).toString() : null)
export const getBase64 = (file: File): Promise<string> => {
  const reader = new FileReader()
  reader.readAsDataURL(file as Blob)

  return new Promise<string>(resolve => {
    reader.onload = () => resolve(reader.result as any)
    reader.onerror = () => resolve(null)
  })
}
export const formatBytes = (bytes: number, decimals: number = 2): string => {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`
}
