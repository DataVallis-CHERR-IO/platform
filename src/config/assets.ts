import { IAsset } from '../interfaces'
import { getMaticAbi } from '../contracts/abi/assets/polygon/matic'

export const assets: IAsset[] = [
  {
    name: 'ETH',
    address: '0x2e3A2fb8473316A02b8A297B982498E661E1f6f5',
    aToken: '0x27B4692C93959048833f40702b22FE3578E77759',
    variableDebtToken: '0x02a5680AE3b7383854Bf446b1B3Be170E67E689C',
    stableDebtToken: '0xEC59F2FB4EF0C46278857Bf2eC5764485974D17B',
    decimals: 18,
    abi: getMaticAbi(),
    icon: '/img/icons/assets/eth.svg'
  }
]
