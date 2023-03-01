import * as React from 'react'
import Image from 'next/image'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import DataTable from '../../components/data/data.table'
import RepayDialog from '../feedback/dialog/repay.dialog'
import useTranslation from 'next-translate/useTranslation'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Address, useAccount, useContractRead } from 'wagmi'
import { BeatLoader } from 'react-spinners'
import { getEther } from '../../../utils'
import { tokenOptions } from '../../../config'
import { assets } from '../../../config/assets'
import { Button, Chip } from '@mui/material'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { IAsset } from '../../../interfaces'
import { IUserReservesData } from '../../../interfaces/contracts'
import * as _ from 'lodash'

interface IAssetList {
  asset: any
  debt: any
  rateMode: any
  action: any
}

const YourBorrowsAccordion = () => {
  const { t } = useTranslation('common')
  const { address } = useAccount()
  const [asset, setAsset] = useState<IAsset>(null)
  const [assetsList, setAssetsList] = useState<IAssetList[]>(null)
  const [balance, setBalance] = useState<number>(0)
  const [open, setOpen] = useState<boolean>(false)
  const columns = useMemo(
    () => [
      { id: 'asset', label: t('asset.text') },
      { id: 'debt', label: t('debt') },
      { id: 'rateMode', label: t('asset.rateMode') },
      { id: 'action', label: '', align: 'right' }
    ],
    []
  )

  const uiPoolDataProvider = useMemo(
    () => ({
      address: tokenOptions.contract.uiPoolDataProvider as Address,
      abi: tokenOptions.contract.uiPoolDataProviderAbi
    }),
    [tokenOptions.contract.uiPoolDataProvider]
  )

  const { data: contractData } = useContractRead({
    ...uiPoolDataProvider,
    functionName: 'getUserReservesData',
    args: [tokenOptions.contract.poolAddressesProvider, address],
    watch: true
  })

  const handleRepayOnClick = async (assetToRepay: IAsset, debt: number) => {
    setAsset(assetToRepay)
    setBalance(debt)
    setOpen(true)
  }

  const getAsset = (assetData: IAsset, debt: number) => ({
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
    debt: (
      <>
        <FontAwesomeIcon icon={faEthereum} /> {debt}
      </>
    ),
    rateMode: <Chip label={t(assetData.stableBorrowRateEnabled ? 'asset.stable' : 'asset.variable')} />,
    action: (
      <Button variant='contained' className='dark-btn text-capitalize' onClick={() => handleRepayOnClick(assetData, debt)}>
        {t('asset.repay')}
      </Button>
    )
  })

  const handleBorrowedAssets = useCallback(async () => {
    const assetLists: IAssetList[] = []

    for (const assetData of _.cloneDeep(assets)) {
      const userReservesData: IUserReservesData = _.get(contractData, '[0]', []).find(
        (obj: IUserReservesData) => obj?.underlyingAsset?.toLowerCase() === assetData?.underlyingAsset?.toLowerCase()
      )

      if (userReservesData) {
        if (getEther(userReservesData.scaledVariableDebt.toString(), assetData.decimals) > 0) {
          const debt = +(((getEther(userReservesData.scaledVariableDebt.toString(), assetData.decimals) + Number.EPSILON) * 100) / 100).toFixed(7)

          assetLists.push(getAsset(assetData, debt))
        }

        if (getEther(userReservesData.principalStableDebt.toString(), assetData.decimals) > 0) {
          const debt = +(((getEther(userReservesData.principalStableDebt.toString(), assetData.decimals) + Number.EPSILON) * 100) / 100).toFixed(7)

          assetData.stableBorrowRateEnabled = true
          assetLists.push(getAsset(assetData, debt))
        }
      }
    }

    JSON.stringify(assetsList) === JSON.stringify(assetLists) || setAssetsList(assetLists)
  }, [contractData])

  useEffect(() => {
    !contractData || handleBorrowedAssets()
  }, [contractData])

  return (
    <>
      <Accordion expanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
          <Typography className='font-weight-bold'>{t('asset.yourBorrows')}</Typography>
        </AccordionSummary>
        <AccordionDetails className='p-0'>
          {contractData === undefined ? (
            <BeatLoader color='#d21242' loading={true} size={5} className='p-3' />
          ) : assetsList?.length ? (
            <DataTable columns={columns} rows={assetsList} />
          ) : (
            <div className='p-3'>{t('asset.nothingBorrowedYet')}</div>
          )}
        </AccordionDetails>
      </Accordion>
      <RepayDialog asset={asset} debt={balance} open={open} onClose={setOpen} />
    </>
  )
}

export default YourBorrowsAccordion
