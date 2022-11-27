import { useMemo } from 'react'
import { useBlockNumber } from 'wagmi'
import { useQuery } from 'react-query'
import { getCherrioProjectAbi } from '../contracts/abi/cherrio-project'
import { getEther } from '../utils'
import { Contract, ethers } from 'ethers'
import { tokenOptions } from '../config'

interface IUseContractsDataProps {
  contractAddresses: string[]
  data?: any
  initialData?: any
}

const useContractsData = ({ contractAddresses }: IUseContractsDataProps) => {
  const { data: blockNumber } = useBlockNumber({ watch: true })

  const provider = useMemo(() => new ethers.providers.Web3Provider(window.ethereum), [tokenOptions.httpsProvider])
  const contracts: any[] = useMemo(() => {
    const instances = []

    for (const [index, contractAddress] of contractAddresses.entries()) {
      instances[index] = async () => await new ethers.Contract(contractAddress, getCherrioProjectAbi(), provider)
    }

    return instances
  }, [contractAddresses])

  const queryKey = useMemo(
    () => ({
      blockNumber,
      contractAddresses,
      contracts
    }),
    [blockNumber, contractAddresses, contracts]
  )

  return useQuery(
    [queryKey],
    async () => {
      const dataRes: any[] = []

      for (const index of contracts.keys()) {
        const contract: Contract = await contracts[index]()
        dataRes[index] = {}

        const contractProjectData = await contract.getData()

        dataRes[index].stage = contractProjectData._stage
        dataRes[index].raisedAmount = getEther(contractProjectData._raisedAmount.toString())
      }

      return dataRes
    },
    {
      onError: error => {
        console.log('❌ useContractData hook error: ', error)
      },
      initialData: [],
      keepPreviousData: true,
      enabled: !!blockNumber && !!contractAddresses
    }
  )
}

export default useContractsData
