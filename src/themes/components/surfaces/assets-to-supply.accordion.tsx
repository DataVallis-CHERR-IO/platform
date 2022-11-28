import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import Image from 'next/image'
import DataTable from '../../components/data/data.table'
import AccordionDetails from '@mui/material/AccordionDetails'
import useTranslation from 'next-translate/useTranslation'
import SupplyDialog from '../feedback/dialog/supply.dialog'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useContractRead } from 'wagmi'
import { getEther } from '../../../utils'
import { useSessionContext } from '../../../contexts/session/provider'
import { tokenOptions } from '../../../config'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { Button } from '@mui/material'
import { assets } from '../../../config/assets'
import { IAsset } from '../../../interfaces'
import * as _ from 'lodash'

interface IAssetList {
  asset: any
  balance: any
  action: any
}

const AssetsToSupplyAccordion = () => {
  const { t } = useTranslation('common')
  const { account } = useSessionContext()
  const [asset, setAsset] = useState<IAsset>(null)
  const [balance, setBalance] = useState<number>(0)
  const [balances, setBalances] = useState<IAssetList[]>(null)
  const [open, setOpen] = useState<boolean>(false)
  const columns = useMemo(
    () => [
      { id: 'asset', label: t('asset.text') },
      { id: 'balance', label: t('walletBalance') },
      { id: 'action', label: '', align: 'right' }
    ],
    []
  )

  const walletBalanceProvider = useMemo(
    () => ({
      addressOrName: tokenOptions.contract.walletBalanceProvider,
      contractInterface: tokenOptions.contract.walletBalanceProviderAbi
    }),
    [tokenOptions.contract.walletBalanceProvider]
  )

  const { data: contractData } = useContractRead({
    ...walletBalanceProvider,
    functionName: 'batchBalanceOf',
    args: [[account], assets.map(value => value.address)],
    watch: true
  })

  const handleSupplyOnClick = async (assetToSupply: IAsset, walletBalance: number) => {
    setAsset(assetToSupply)
    setBalance(walletBalance)
    setOpen(true)
  }

  const getAssets = useCallback(async () => {
    const assetsArray: IAssetList[] = []

    for (const [index, assetData] of _.cloneDeep(assets).entries()) {
      const walletBalance = +(((getEther(_.get(contractData, `[${index}]`, '').toString(), assetData.decimals) + Number.EPSILON) * 100) / 100).toFixed(7)

      assetsArray.push({
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
            onClick={() => handleSupplyOnClick(assetData, walletBalance)}
          >
            {t('asset.supply')}
          </Button>
        )
      })
    }

    setBalances(assetsArray)
  }, [contractData])

  useEffect(() => {
    !contractData?.length || getAssets()
  }, [contractData])

  return (
    <>
      <Accordion expanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header'>
          <Typography className='font-weight-bold'>{t('asset.assetsToSupply')}</Typography>
        </AccordionSummary>
        <AccordionDetails className='p-0'>
          <DataTable columns={columns} rows={balances || []} />
        </AccordionDetails>
      </Accordion>
      <SupplyDialog asset={asset} supply={balance} open={open} onClose={setOpen} />
    </>
  )
}

export default AssetsToSupplyAccordion
