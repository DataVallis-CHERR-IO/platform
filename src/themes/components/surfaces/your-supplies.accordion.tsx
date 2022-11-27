import * as React from 'react'
import Image from 'next/image'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import WithdrawDialog from '../feedback/dialog/withdraw.dialog'
import DataTable from '../../components/data/data.table'
import useTranslation from 'next-translate/useTranslation'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { getAavePoolAbi } from '../../../contracts/abi/aave/pool'
import { useContractReads } from 'wagmi'
import { BeatLoader } from 'react-spinners'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAaveWalletBalanceProviderAbi } from '../../../contracts/abi/aave/wallet-balance-provider'
import { getEther } from '../../../utils'
import { tokenOptions } from '../../../config'
import { assets } from '../../../config/assets'
import { Button } from '@mui/material'
import { IAsset } from '../../../interfaces'
import * as _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'

interface IAssetList {
  asset: any
  balance: any
  action: any
}

interface IYourSuppliesAccordionProps {
  account?: string
}

const YourSuppliesAccordion = ({ account }: IYourSuppliesAccordionProps) => {
  const { t } = useTranslation('common')
  const [asset, setAsset] = useState<IAsset>(null)
  const [assetsList, setAssetsList] = useState<IAssetList[]>(null)
  const [balance, setBalance] = useState<number>(0)
  const [open, setOpen] = useState<boolean>(false)
  const columns = useMemo(
    () => [
      { id: 'asset', label: t('asset.text') },
      { id: 'balance', label: t('balance') },
      { id: 'action', label: '', align: 'right' }
    ],
    []
  )

  const walletBalanceProvider = useMemo(
    () => ({
      addressOrName: tokenOptions.contract.walletBalanceProvider,
      contractInterface: getAaveWalletBalanceProviderAbi()
    }),
    [tokenOptions.contract.walletBalanceProvider]
  )

  const poolAddress = useMemo(
    () => ({
      addressOrName: tokenOptions.contract.poolAddress,
      contractInterface: getAavePoolAbi()
    }),
    [tokenOptions.contract.walletBalanceProvider]
  )

  const { data: contractsData } = useContractReads({
    contracts: [
      {
        ...walletBalanceProvider,
        functionName: 'batchBalanceOf',
        args: [[account], assets.map(value => value.aToken)]
      },
      {
        ...poolAddress,
        functionName: 'getUserAccountData',
        args: [account]
      }
    ],
    watch: true
  })

  const handleWithdrawOnClick = async (assetToWithdraw: IAsset, walletBalance: number) => {
    setAsset(assetToWithdraw)
    setBalance(walletBalance)
    setOpen(true)
  }

  const getSupplied = useCallback(async () => {
    const assetLists: IAssetList[] = []

    for (const [index, assetData] of assets.entries()) {
      const walletBalance = Number(getEther(_.get(contractsData, `[0][${index}]`, '').toString()).toFixed(7))

      assetLists.push({
        asset: (
          <div className='flex-container'>
            <div style={{ width: '32px' }}>
              <Image
                loader={() => assetData.icon}
                src={assetData.icon}
                alt={assetData.name}
                width='100%'
                height='100%'
                layout='responsive'
                objectFit='contain'
                unoptimized={true}
              />
            </div>
            <div className='align-self-center pl-2'>{assetData.name}</div>
          </div>
        ),
        balance: (
          <>
            <FontAwesomeIcon icon={faEthereum} /> {walletBalance}
          </>
        ),
        action: (
          <Button
            variant='contained'
            className='dark-btn text-capitalize'
            disabled={walletBalance === 0}
            onClick={() => handleWithdrawOnClick(assetData, walletBalance)}
          >
            {t('asset.withdraw')}
          </Button>
        )
      })
    }

    JSON.stringify(assetsList) === JSON.stringify(assetLists) || setAssetsList(assetLists)
  }, [contractsData])

  useEffect(() => {
    !contractsData?.length || getSupplied()
  }, [contractsData])

  return (
    <>
      <Accordion expanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
          <Typography className='font-weight-bold'>{t('asset.yourSupplies')}</Typography>
        </AccordionSummary>
        <AccordionDetails className='p-0'>
          {contractsData === undefined ? (
            <BeatLoader color='#d21242' loading={true} size={5} className='p-3' />
          ) : !!getEther(_.get(contractsData, '[1].totalCollateralBase', '').toString()) ? (
            <DataTable columns={columns} rows={assetsList || []} />
          ) : (
            <div className='p-3'>{t('asset.nothingSuppliedYet')}</div>
          )}
        </AccordionDetails>
      </Accordion>
      <WithdrawDialog account={account} asset={asset} balance={balance} open={open} onClose={setOpen} />
    </>
  )
}

export default YourSuppliesAccordion
