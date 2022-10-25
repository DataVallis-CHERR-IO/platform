import { ethers } from 'ethers'

export const truncateAddress = (address: string): string => (address ? `${address.slice(0, 5)}...${address.slice(-5)}` : '')
export const getEthers = (value: any): number => Number(ethers.utils.formatUnits(value.toString(), process.env.TOKEN_DECIMALS))
