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
import { useEffect, useMemo, useState } from 'react'
import { useContractRead } from 'wagmi'
import { getAavePoolAbi } from '../../../contracts/abi/aave/pool'
import { Button } from '@mui/material'
import { assets } from '../../../config/assets'
import { IAsset } from '../../../interfaces'
import { tokenOptions } from '../../../config'
import * as _ from 'lodash'

interface IAssetList {
  asset: any
  action: any
}

interface IAssetsToBorrowAccordionProps {
  account: string
}

const AssetsToBorrowAccordion = ({ account }: IAssetsToBorrowAccordionProps) => {
  const { t } = useTranslation('common')
  const [asset, setAsset] = useState<IAsset>(null)
  const [assetsList, setAssetsList] = useState<IAssetList[]>([])
  const [enableBorrow, setEnableBorrow] = useState<boolean>(false)
  const [displayBorrowNotice, setDisplayBorrowNotice] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const columns = useMemo(
    () => [
      { id: 'asset', label: t('asset.text') },
      { id: 'action', label: '', align: 'right' }
    ],
    []
  )

  const poolAddress = useMemo(
    () => ({
      addressOrName: tokenOptions.contract.poolAddress,
      contractInterface: getAavePoolAbi()
    }),
    [tokenOptions.contract.walletBalanceProvider]
  )

  const { data: contractData } = useContractRead({
    ...poolAddress,
    functionName: 'getUserAccountData',
    args: [account],
    watch: true
  })

  const handleBorrowOnClick = async (assetToBorrow: IAsset) => {
    setAsset(assetToBorrow)
    setOpen(true)
  }

  const handleAssetsList = () => {
    const assetLists: IAssetList[] = []

    for (const assetData of assets) {
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
        action: (
          <Button variant='contained' className='dark-btn text-capitalize' disabled={!enableBorrow} onClick={() => handleBorrowOnClick(assetData)}>
            {t('asset.borrow')}
          </Button>
        )
      })
    }

    setAssetsList(assetLists)
  }

  useEffect(() => {
    console.log(contractData)
    handleAssetsList()

    if (Number(_.get(contractData, 'totalCollateralBase', '').toString()) === 0) {
      setDisplayBorrowNotice(true)
    } else {
      setEnableBorrow(true)
      setDisplayBorrowNotice(false)
    }
  }, [contractData?.totalCollateralBase])

  return (
    <>
      <Accordion expanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
          <Typography className='font-weight-bold'>{t('asset.assetsToBorrow')}</Typography>
        </AccordionSummary>
        <AccordionDetails className='p-0'>
          {displayBorrowNotice && <div className='p-3 color-info'>*{t('asset.borrowNotice')}</div>}
          <DataTable columns={columns} rows={assetsList} />
        </AccordionDetails>
      </Accordion>
      <BorrowDialog account={account} asset={asset} open={open} onClose={setOpen} />
    </>
  )
}

export default AssetsToBorrowAccordion
