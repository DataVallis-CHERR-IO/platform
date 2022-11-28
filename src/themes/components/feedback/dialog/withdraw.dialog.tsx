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

interface IWithdrawDialogProps {
  asset: IAsset
  suppliedBalance: number
  open: boolean
  onClose: any
}

const WithdrawDialog = ({ asset, suppliedBalance, open, onClose }: IWithdrawDialogProps) => {
  const { t } = useTranslation('common')
  const { account } = useSessionContext()
  const [value, setValue] = useState<string>('')
  const [balance, setBalance] = useState<number>(0)
  const [displayApproveBtn, setDisplayApproveBtn] = useState<boolean>(false)
  const [displayWithdrawBtn, setDisplayWithdrawBtn] = useState<boolean>(false)
  const [loadingApprove, setLoadingApprove] = useState<boolean>(false)
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>(false)
  const [withdrawIcon, setWithdrawIcon] = useState<any>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleDefaultStates = (resetValue: boolean = true) => {
    !resetValue || setValue('')
    setDisplayApproveBtn(false)
    setDisplayWithdrawBtn(false)
    setLoadingApprove(false)
    setLoadingWithdraw(false)
  }

  const handleCloseOnClick = () => {
    handleDefaultStates()
    onClose(false)
  }

  const handleAllowanceOnChange = useCallback(
    async data => {
      const amount = Number(data)
      setValue(data)

      if (!formRef.current.checkValidity()) {
        formRef.current.reportValidity()
        handleDefaultStates()
        return
      }

      if (amount > 0) {
        if (asset?.isNative) {
          const allowance = getEther(
            (await method('allowance', [account, tokenOptions.contract.wethGateway], null, asset.aToken, asset.aTokenAbi)).toString(),
            asset.decimals
          )

          setDisplayApproveBtn(!allowance || allowance < amount)
          setDisplayWithdrawBtn(allowance >= amount)
        } else {
          setDisplayWithdrawBtn(true)
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

    const approve = await method('approve', [tokenOptions.contract.wethGateway, getWei(value, asset.decimals)], null, asset.aToken, asset.aTokenAbi)

    if (approve) {
      await approve.wait()

      setDisplayApproveBtn(false)
      setDisplayWithdrawBtn(true)
    }

    setLoadingApprove(false)
  }, [asset, value])

  const handleWithdrawOnClick = useCallback(async () => {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return
    }

    setLoadingWithdraw(true)
    let withdraw

    if (asset?.isNative) {
      withdraw = await method(
        'withdrawETH',
        [tokenOptions.contract.pool, getWei(value, asset.decimals), account],
        { gasLimit: tokenOptions.gasLimit },
        tokenOptions.contract.wethGateway,
        tokenOptions.contract.wethGatewayAbi
      )
    } else {
      withdraw = await method(
        'withdraw',
        [asset.underlyingAsset, getWei(value, asset.decimals), account],
        null,
        tokenOptions.contract.pool,
        tokenOptions.contract.poolAbi
      )
    }

    if (withdraw) {
      await withdraw.wait()

      setBalance(Number(+(balance - Number(value)).toFixed(7)))
      handleDefaultStates()
    }

    setLoadingWithdraw(false)
  }, [asset, value])

  useEffect(() => {
    !suppliedBalance || setBalance(suppliedBalance)
    withdrawIcon ||
      !asset ||
      setWithdrawIcon(
        <Icon>
          <img alt={asset.name} src={asset.icon} className='w-18 mb-18' />
        </Icon>
      )
  }, [asset, suppliedBalance])

  return (
    <Dialog open={open} onClose={handleCloseOnClick} className='market-dialog-wrapper'>
      <DialogTitle className='justify-content-between'>
        <div className='row'>
          <div className='col-md-6 font-weight-bold'>{t('asset.withdraw')}</div>
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
          <p>
            {t('balance')}: <FontAwesomeIcon icon={faEthereum} /> {balance}
          </p>
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
        <Button onClick={handleCloseOnClick} className='color-danger'>
          {t('close')}
        </Button>
        {displayWithdrawBtn && (
          <LoadingButton
            loading={loadingWithdraw}
            loadingPosition='end'
            endIcon={withdrawIcon}
            variant='contained'
            onClick={handleWithdrawOnClick}
            className='bg-color-danger'
          >
            {t('asset.withdraw')}
          </LoadingButton>
        )}
        {displayApproveBtn && (
          <LoadingButton
            loading={loadingApprove}
            loadingPosition='end'
            endIcon={<AddTaskIcon />}
            variant='contained'
            onClick={handleApproveOnClick}
            className='bg-color-info'
          >
            {t('asset.approve')}
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default WithdrawDialog
