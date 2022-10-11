export const truncateAddress = (address: string): string => (address ? `${address.slice(0, 5)}...${address.slice(-5)}` : '')
