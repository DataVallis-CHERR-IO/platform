import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import Image from 'next/image'
import DataTable from '../../components/data/data.table'
import AccordionDetails from '@mui/material/AccordionDetails'
import useTranslation from 'next-translate/useTranslation'
import BorrowDialog from '../feedback/dialog/borrow.dialog'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useContractReads } from 'wagmi'
import { useSessionContext } from '../../../contexts/session/provider'
import { Button } from '@mui/material'
import { assets } from '../../../config/assets'
import { tokenOptions } from '../../../config'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { IAsset } from '../../../interfaces'
import { IReservesData } from '../../../interfaces/contracts'
import * as _ from 'lodash'

interface IAssetList {
  asset: any
  variable: any
  stable: any
  action: any
}

const AssetsToBorrowAccordion = () => {
  const { t } = useTranslation('common')
  const { account } = useSessionContext()
  const [asset, setAsset] = useState<IAsset>(null)
  const [assetsList, setAssetsList] = useState<IAssetList[]>([])
  const [disableBorrowBtn, setDisableBorrowBtn] = useState<boolean>(true)
  const [displayBorrowNotice, setDisplayBorrowNotice] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const columns = useMemo(
    () => [
      { id: 'asset', label: t('asset.text') },
      { id: 'variable', label: t('asset.variableRate') },
      { id: 'stable', label: t('asset.stableRate') },
      { id: 'action', label: '', align: 'right' }
    ],
    []
  )

  const pool = useMemo(
    () => ({
      addressOrName: tokenOptions.contract.pool,
      contractInterface: tokenOptions.contract.poolAbi
    }),
    [tokenOptions.contract.pool]
  )

  const uiPoolDataProvider = useMemo(
    () => ({
      addressOrName: tokenOptions.contract.uiPoolDataProvider,
      contractInterface: tokenOptions.contract.uiPoolDataProviderAbi
    }),
    [tokenOptions.contract.uiPoolDataProvider]
  )

  const { data: contractsData } = useContractReads({
    contracts: [
      {
        ...pool,
        functionName: 'getUserAccountData',
        args: [account]
      },
      {
        ...uiPoolDataProvider,
        functionName: 'getReservesData',
        args: [tokenOptions.contract.poolAddressesProvider]
      }
    ],
    watch: true
  })

  const handleBorrowOnClick = async (assetToBorrow: IAsset) => {
    setAsset(assetToBorrow)
    setOpen(true)
  }

  const handleAssetsList = useCallback(() => {
    const assetLists: IAssetList[] = []

    for (const assetData of _.cloneDeep(assets)) {
      const reservesData: IReservesData = _.get(contractsData, '[1][0]', []).find(
        (obj: IReservesData) => obj?.underlyingAsset?.toLowerCase() === assetData?.underlyingAsset?.toLowerCase()
      )

      assetData.stableBorrowRateEnabled = reservesData?.stableBorrowRateEnabled || false

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
        variable: <FontAwesomeIcon icon={faCheck} className='color-success' />,
        stable: (
          <FontAwesomeIcon
            icon={reservesData?.stableBorrowRateEnabled ? faCheck : faXmark}
            className={reservesData?.stableBorrowRateEnabled ? 'color-success' : 'color-danger'}
          />
        ),
        action: (
          <Button variant='contained' className='dark-btn text-capitalize' disabled={disableBorrowBtn} onClick={() => handleBorrowOnClick(assetData)}>
            {t('asset.borrow')}
          </Button>
        )
      })
    }

    setAssetsList(assetLists)
  }, [assets, disableBorrowBtn, setDisableBorrowBtn])

  useEffect(() => {
    if (Number(_.get(contractsData, '[0].totalCollateralBase', '').toString()) === 0) {
      setDisplayBorrowNotice(true)
    } else {
      setDisableBorrowBtn(false)
      setDisplayBorrowNotice(false)
    }

    !contractsData?.length || handleAssetsList()
  }, [_.get(contractsData, '[0].totalCollateralBase'), disableBorrowBtn])

  return (
    <>
      <Accordion expanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
          <Typography className='font-weight-bold'>{t('asset.assetsToBorrow')}</Typography>
        </AccordionSummary>
        <AccordionDetails className='p-0'>
          {displayBorrowNotice && <div className='p-3 color-danger'>*{t('asset.borrowNotice')}</div>}
          <DataTable columns={columns} rows={assetsList} />
        </AccordionDetails>
      </Accordion>
      <BorrowDialog asset={asset} open={open} onClose={setOpen} />
    </>
  )
}

export default AssetsToBorrowAccordion
