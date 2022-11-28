import { IAsset } from '../interfaces'
import { getEthAbi } from '../contracts/abi/assets/polygon/eth'
import { getATokenAbi } from '../contracts/abi/assets/polygon/a-token'
import { getLinkAbi } from '../contracts/abi/assets/polygon/link'
import { gerDaiAbi } from '../contracts/abi/assets/polygon/dai'
import { getEursAbi } from '../contracts/abi/assets/polygon/eurs'
import { getUsdcAbi } from '../contracts/abi/assets/polygon/usdc'
import { getUsdtAbi } from '../contracts/abi/assets/polygon/usdt'
import { getWBtcAbi } from '../contracts/abi/assets/polygon/wbtc'
import { getVariableDebtTokenAbi } from '../contracts/abi/aave/variable-debt-token'

export const assets: IAsset[] = [
  {
    name: 'ETH',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    aToken: '0x27B4692C93959048833f40702b22FE3578E77759',
    variableDebtToken: '0x2b848bA14583fA79519Ee71E7038D0d1061cd0F1',
    stableDebtToken: '0xCAF956bD3B3113Db89C0584Ef3B562153faB87D5',
    underlyingAsset: '0x2e3A2fb8473316A02b8A297B982498E661E1f6f5',
    decimals: 18,
    abi: getEthAbi(),
    aTokenAbi: getATokenAbi(),
    variableDebtTokenAbi: getVariableDebtTokenAbi(),
    icon: '/img/icons/assets/eth.svg',
    isNative: true
  },
  {
    name: 'DAI',
    address: '0xDF1742fE5b0bFc12331D8EAec6b478DfDbD31464',
    aToken: '0x310839bE20Fc6a8A89f33A59C7D5fC651365068f',
    variableDebtToken: '0xEa5A7CB3BDF6b2A8541bd50aFF270453F1505A72',
    stableDebtToken: '0xbaBd1C3912713d598CA2E6DE3303fC59b19d0B0F',
    underlyingAsset: '0xDF1742fE5b0bFc12331D8EAec6b478DfDbD31464',
    decimals: 18,
    abi: gerDaiAbi(),
    aTokenAbi: getATokenAbi(),
    icon: '/img/icons/assets/dai.svg'
  },
  {
    name: 'EURS',
    address: '0xaA63E0C86b531E2eDFE9F91F6436dF20C301963D',
    aToken: '0xc31E63CB07209DFD2c7Edb3FB385331be2a17209',
    variableDebtToken: '0x257b4a23b3026E04790c39fD3Edd7101E5F31192',
    stableDebtToken: '0x512ad2D2fb3Bef82ca0A15d4dE6544246e2D32c7',
    underlyingAsset: '0xaA63E0C86b531E2eDFE9F91F6436dF20C301963D',
    decimals: 2,
    abi: getEursAbi(),
    aTokenAbi: getATokenAbi(),
    icon: '/img/icons/assets/eurs.svg'
  },
  {
    name: 'USDC',
    address: '0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43',
    aToken: '0x1Ee669290939f8a8864497Af3BC83728715265FF',
    variableDebtToken: '0x3e491EB1A98cD42F9BBa388076Fd7a74B3470CA0',
    stableDebtToken: '0x512ad2D2fb3Bef82ca0A15d4dE6544246e2D32c7',
    underlyingAsset: '0xA2025B15a1757311bfD68cb14eaeFCc237AF5b43',
    decimals: 6,
    abi: getUsdcAbi(),
    aTokenAbi: getATokenAbi(),
    icon: '/img/icons/assets/usdc.svg'
  },
  {
    name: 'USDT',
    address: '0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49',
    aToken: '0x73258E6fb96ecAc8a979826d503B45803a382d68',
    variableDebtToken: '0x45c3965f6FAbf2fB04e3FE019853813B2B7cC3A3',
    stableDebtToken: '0x7720C270Fa5d8234f0DFfd2523C64FdeB333Fa50',
    underlyingAsset: '0xC2C527C0CACF457746Bd31B2a698Fe89de2b6d49',
    decimals: 6,
    abi: getUsdtAbi(),
    aTokenAbi: getATokenAbi(),
    icon: '/img/icons/assets/usdt.svg'
  },
  {
    name: 'LINK',
    address: '0x07C725d58437504CA5f814AE406e70E21C5e8e9e',
    aToken: '0x6A639d29454287B3cBB632Aa9f93bfB89E3fd18f',
    variableDebtToken: '0x593D1bB0b6052FB6c3423C42FA62275b3D95a943',
    stableDebtToken: '0x4f094AB301C8787F0d06753CA3238bfA9CFB9c91',
    underlyingAsset: '0x07C725d58437504CA5f814AE406e70E21C5e8e9e',
    decimals: 18,
    abi: getLinkAbi(),
    aTokenAbi: getATokenAbi(),
    icon: '/img/icons/assets/link.svg'
  },
  {
    name: 'WBTC',
    address: '0x8869DFd060c682675c2A8aE5B21F2cF738A0E3CE',
    aToken: '0xc0ac343EA11A8D05AAC3c5186850A659dD40B81B',
    variableDebtToken: '0x480B8b39d1465b8049fbf03b8E0a072Ab7C9A422',
    stableDebtToken: '0x15FF4188463c69FD18Ea39F68A0C9B730E23dE81',
    underlyingAsset: '0x8869DFd060c682675c2A8aE5B21F2cF738A0E3CE',
    decimals: 8,
    abi: getWBtcAbi(),
    aTokenAbi: getATokenAbi(),
    icon: '/img/icons/assets/wbtc.svg'
  }
]
