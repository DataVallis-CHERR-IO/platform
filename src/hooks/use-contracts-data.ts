import { useMemo } from 'react'
import { useBlockNumber } from 'wagmi'
import { useQuery } from 'react-query'
import { Contract, ethers } from 'ethers'
import { tokenOptions } from '../config'

interface IContract {
  key: string
  address: string
  abi: string[]
  funcName: string
  funcArgs?: any[]
}

interface IUseContractsDataProps {
  contracts: IContract[]
  initialData?: any
}

const useContractsData = ({ contracts }: IUseContractsDataProps) => {
  const { data: blockNumber } = useBlockNumber({ watch: true })

  const provider = useMemo(() => new ethers.providers.Web3Provider(window.ethereum), [tokenOptions.httpsProvider])
  const contractInstances: any[] = useMemo(() => {
    const instances: any[] = []
    const keys: string[] = []

    for (const contract of contracts) {
      if (!keys.includes(contract.key)) {
        instances[contract.key] = async () => await new ethers.Contract(contract.address, contract.abi, provider)
        keys.push(contract.key)
      }
    }

    return instances
  }, [contracts])

  const queryKey = useMemo(
    () => ({
      blockNumber,
      contracts,
      contractInstances
    }),
    [blockNumber, contracts, contractInstances]
  )

  return useQuery(
    [queryKey],
    async () => {
      const dataRes: any[] = []

      for (const [index, contractInstance] of contracts.entries()) {
        const contract: Contract = await contractInstances[contractInstance.key]()
        dataRes[index] = {}

        dataRes[index][contractInstance.funcName] = await contract[contractInstance.funcName](...(contractInstance?.funcArgs || []))
      }

      return dataRes
    },
    {
      onError: error => {
        console.log('❌ useContractData hook error: ', error)
      },
      initialData: [],
      keepPreviousData: true,
      enabled: !!blockNumber && !!contracts
    }
  )
}

export default useContractsData
