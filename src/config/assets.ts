import { IAsset } from '../interfaces'
import { getLinkAbi } from '../contracts/abi/assets/polygon/link'
import { getMaticAbi } from '../contracts/abi/assets/polygon/matic'
import { getWethAbi } from '../contracts/abi/assets/polygon/weth'

export const assets: IAsset[] = [
  {
    name: 'MATIC',
    address: '0x0000000000000000000000000000000000001010',
    aToken: '0x89a6AE840b3F8f489418933A220315eeA36d11fF',
    variableDebtToken: '0x02a5680AE3b7383854Bf446b1B3Be170E67E689C',
    stableDebtToken: '0xEC59F2FB4EF0C46278857Bf2eC5764485974D17B',
    decimals: 18,
    abi: getMaticAbi(),
    icon: '/img/icons/assets/matic.svg'
  },
  {
    name: 'LINK',
    address: '0xD9E7e5dd6e122dDE11244e14A60f38AbA93097f2',
    aToken: '0x3e1608F4Db4b37DDf86536ef441890fE3AA9F2Ea',
    variableDebtToken: '0x292f1Cc1BcedCd22E860c7C92D21877774B44C16',
    stableDebtToken: '0x27908f7216Efe649706B68b6a443623D9aaF16D0',
    decimals: 18,
    abi: getLinkAbi(),
    icon: '/img/icons/assets/link.svg'
  },
  {
    name: 'WETH',
    address: '0xd575d4047f8c667E064a4ad433D04E25187F40BB',
    aToken: '0x685bF4eab23993E94b4CFb9383599c926B66cF57',
    variableDebtToken: '0xb0c924f61B27cf3C114CBD70def08c62843ebb3F',
    stableDebtToken: '0xC9Ac53b6ae1C653A54ab0E9D44693E807429aF1F',
    decimals: 18,
    abi: getWethAbi(),
    icon: '/img/icons/assets/weth.svg'
  }
]
