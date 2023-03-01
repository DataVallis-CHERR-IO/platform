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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { BeatLoader } from 'react-spinners'
import { Address, useAccount, useContractReads } from 'wagmi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getEther } from '../../../utils'
import { Button } from '@mui/material'
import { tokenOptions } from '../../../config'
import { assets } from '../../../config/assets'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { IAsset } from '../../../interfaces'
import * as _ from 'lodash'

interface IAssetList {
  asset: any
  balance: any
  action: any
}

const YourSuppliesAccordion = () => {
  const { t } = useTranslation('common')
  const { address } = useAccount()
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
      address: tokenOptions.contract.walletBalanceProvider as Address,
      abi: tokenOptions.contract.walletBalanceProviderAbi
    }),
    [tokenOptions.contract.walletBalanceProvider]
  )

  const pool = useMemo(
    () => ({
      address: tokenOptions.contract.pool as Address,
      abi: tokenOptions.contract.poolAbi
    }),
    [tokenOptions.contract.pool]
  )

  const { data: contractsData } = useContractReads({
    contracts: [
      {
        ...walletBalanceProvider,
        functionName: 'batchBalanceOf',
        args: [[address], assets.map(value => value.aToken)]
      },
      {
        ...pool,
        functionName: 'getUserAccountData',
        args: [address]
      }
    ],
    watch: true
  })

  const handleWithdrawOnClick = async (assetToWithdraw: IAsset, suppliedBalance: number) => {
    setAsset(assetToWithdraw)
    setBalance(suppliedBalance)
    setOpen(true)
  }

  const getSupplied = useCallback(async () => {
    const assetLists: IAssetList[] = []

    for (const [index, assetData] of _.cloneDeep(assets).entries()) {
      const suppliedBalance = +(((getEther(_.get(contractsData, `[0][${index}]`, '').toString(), assetData.decimals) + Number.EPSILON) * 100) / 100).toFixed(7)

      if (suppliedBalance === 0) continue

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
            <FontAwesomeIcon icon={faEthereum} /> {suppliedBalance}
          </>
        ),
        action: (
          <Button
            variant='contained'
            className='dark-btn text-capitalize'
            disabled={suppliedBalance === 0}
            onClick={() => handleWithdrawOnClick(assetData, suppliedBalance)}
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
      <WithdrawDialog asset={asset} suppliedBalance={balance} open={open} onClose={setOpen} />
    </>
  )
}

export default YourSuppliesAccordion
