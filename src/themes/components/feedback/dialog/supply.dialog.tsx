import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import TextField from '../../inputs/text-field.input'
import useTranslation from 'next-translate/useTranslation'
import LoadingButton from '@mui/lab/LoadingButton'
import AddTaskIcon from '@mui/icons-material/AddTask'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { method } from '../../../../modules/method'
import { getEther, getWei } from '../../../../utils'
import { useSessionContext } from '../../../../contexts/session/provider'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, InputAdornment } from '@mui/material'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
import { tokenOptions } from '../../../../config'
import { IAsset } from '../../../../interfaces'

interface ISupplyDialogProps {
  asset: IAsset
  supply: number
  open: boolean
  onClose: any
}

const SupplyDialog = ({ asset, supply, open, onClose }: ISupplyDialogProps) => {
  const { t } = useTranslation('common')
  const { account } = useSessionContext()
  const [value, setValue] = useState<string>('')
  const [balance, setBalance] = useState<number>(0)
  const [displayApproveBtn, setDisplayApproveBtn] = useState<boolean>(false)
  const [displaySupplyBtn, setDisplaySupplyBtn] = useState<boolean>(false)
  const [loadingApprove, setLoadingApprove] = useState<boolean>(false)
  const [loadingSupply, setLoadingSupply] = useState<boolean>(false)
  const [supplyIcon, setSupplyIcon] = useState<any>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleDefaultStates = (resetValue: boolean = true) => {
    !resetValue || setValue('')
    setDisplayApproveBtn(false)
    setDisplaySupplyBtn(false)
    setLoadingApprove(false)
    setLoadingSupply(false)
  }

  const handleCloseOnClick = () => {
    handleDefaultStates()
    onClose(false)
  }

  const handleAllowanceOnChange = useCallback(
    async event => {
      const amount = Number(event?.target?.value || value)
      setValue(event?.target?.value || value)

      if (!formRef.current.checkValidity()) {
        formRef.current.reportValidity()
        handleDefaultStates()
        return
      }

      if (amount > 0) {
        if (asset?.isNative) {
          setDisplaySupplyBtn(true)
        } else {
          const allowance = getEther(
            (await method('allowance', [account, tokenOptions.contract.pool], null, asset.underlyingAsset, asset.abi)).toString(),
            asset.decimals
          )

          setDisplayApproveBtn(!allowance || allowance < amount)
          setDisplaySupplyBtn(allowance >= amount)
        }
      }
    },
    [asset, value]
  )

  const handleApproveOnClick = useCallback(async () => {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return
    }

    setLoadingApprove(true)

    const approve = await method('approve', [tokenOptions.contract.pool, getWei(value, asset.decimals)], null, asset.underlyingAsset, asset.abi)

    if (approve) {
      await approve.wait()

      setDisplayApproveBtn(false)
      setDisplaySupplyBtn(true)
    }

    setLoadingApprove(false)
  }, [asset, value])

  const handleSupplyOnClick = useCallback(async () => {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return
    }

    setLoadingSupply(true)
    let deposit

    if (asset?.isNative) {
      deposit = await method(
        'depositETH',
        [tokenOptions.contract.pool, account, 0],
        { value: getWei(value, asset.decimals) },
        tokenOptions.contract.wethGateway,
        tokenOptions.contract.wethGatewayAbi
      )
    } else {
      deposit = await method(
        'supply',
        [asset.underlyingAsset, getWei(value, asset.decimals), account, 0],
        null,
        tokenOptions.contract.pool,
        tokenOptions.contract.poolAbi
      )
    }

    if (deposit) {
      await deposit.wait()

      setBalance(Number(+(balance - Number(value)).toFixed(7)))
      handleDefaultStates()
    }

    setLoadingSupply(false)
  }, [value])

  useEffect(() => {
    !supply || setBalance(supply)
    supplyIcon ||
      !asset ||
      setSupplyIcon(
        <Icon>
          <img alt={asset.name} src={asset.icon} className='w-18 mb-18' />
        </Icon>
      )
  }, [asset, supply])

  return (
    <Dialog open={open} onClose={handleCloseOnClick} className='market-dialog-wrapper'>
      <DialogTitle className='justify-content-between'>
        <div className='row'>
          <div className='col-md-6 font-weight-bold'>{t('asset.supply')}</div>
          <div className='col-md-6'>
            <div className='flex-container'>
              <div style={{ width: '24px' }} className='align-self-center'>
                <Image
                  loader={() => asset?.icon}
                  src={asset?.icon}
                  alt={asset?.name}
                  width='100%'
                  height='100%'
                  layout='responsive'
                  objectFit='contain'
                  unoptimized={true}
                />
              </div>
              <div className='align-self-center pl-2'>{asset?.name}</div>
            </div>
          </div>
        </div>
      </DialogTitle>
      <DialogContent>
        <>
          <div>
            {t('balance')}: <FontAwesomeIcon icon={faEthereum} /> {balance}
          </div>
          <form ref={formRef}>
            <TextField
              id='amount'
              label={t('amount')}
              type='number'
              value={value}
              onChange={handleAllowanceOnChange}
              autoFocus
              margin='dense'
              inputProps={{ min: 0, max: balance || 0, step: 'any' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end' onClick={() => setValue(balance.toString())} className='text-lowercase cursor-pointer'>
                    {t('max')}
                  </InputAdornment>
                )
              }}
            />
          </form>
        </>
      </DialogContent>
      <DialogActions className='justify-content-between'>
        <Button onClick={handleCloseOnClick} className='color-danger text-capitalize'>
          {t('close')}
        </Button>
        {displaySupplyBtn && (
          <LoadingButton
            loading={loadingSupply}
            loadingPosition='end'
            endIcon={supplyIcon}
            variant='contained'
            onClick={handleSupplyOnClick}
            className='bg-color-danger text-capitalize'
          >
            {t('asset.supply')}
          </LoadingButton>
        )}
        {displayApproveBtn && (
          <LoadingButton
            loading={loadingApprove}
            loadingPosition='end'
            endIcon={<AddTaskIcon />}
            variant='contained'
            onClick={handleApproveOnClick}
            className='bg-color-info text-capitalize'
          >
            {t('asset.approve')}
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default SupplyDialog
