import { BigNumber } from 'ethers'

export interface IUserReservesData {
  principalStableDebt: BigNumber
  scaledATokenBalance: BigNumber
  scaledVariableDebt: BigNumber
  stableBorrowLastUpdateTimestamp: BigNumber
  stableBorrowRate: BigNumber
  underlyingAsset: string
  usageAsCollateralEnabledOnUser: boolean
}

export interface IReservesData {
  underlyingAsset: string
  stableBorrowRateEnabled: boolean
}
