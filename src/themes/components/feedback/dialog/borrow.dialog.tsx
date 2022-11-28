import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import TextField from '../../inputs/text-field.input'
import useTranslation from 'next-translate/useTranslation'
import LoadingButton from '@mui/lab/LoadingButton'
import AddTaskIcon from '@mui/icons-material/AddTask'
import { useBalance } from 'wagmi'
import { method } from '../../../../modules/method'
import { getEther, getWei } from '../../../../utils'
import { useSessionContext } from '../../../../contexts/session/provider'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormLabel, Icon, Radio, RadioGroup } from '@mui/material'
import { tokenOptions } from '../../../../config'
import { IAsset } from '../../../../interfaces'
import { InterestRateModeEnum } from '../../../../enums/interest-rate-mode.enum'

interface IBorrowDialogProps {
  asset: IAsset
  open: boolean
  onClose: any
}

const BorrowDialog = ({ asset, open, onClose }: IBorrowDialogProps) => {
  const { t } = useTranslation('common')
  const { account } = useSessionContext()
  const [value, setValue] = useState<string>('')
  const [interestRateMode, setInterestRateMode] = useState<number>(InterestRateModeEnum.VARIABLE)
  const [displayApproveBtn, setDisplayApproveBtn] = useState<boolean>(false)
  const [displayBorrowBtn, setDisplayBorrowBtn] = useState<boolean>(false)
  const [loadingApprove, setLoadingApprove] = useState<boolean>(false)
  const [loadingBorrow, setLoadingBorrow] = useState<boolean>(false)
  const [borrowIcon, setBorrowIcon] = useState<any>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const { data: balance } = useBalance({
    addressOrName: account,
    watch: true
  })

  const handleDefaultStates = (resetValue: boolean = true) => {
    !resetValue || setValue('')
    setDisplayApproveBtn(false)
    setDisplayBorrowBtn(false)
    setLoadingApprove(false)
    setLoadingBorrow(false)
  }

  const handleCloseOnClick = () => {
    handleDefaultStates()
    onClose(false)
  }

  const handleAllowanceOnChange = useCallback(
    async event => {
      const amount = Number(event.target.value)
      setValue(event.target.value)

      if (!formRef.current.checkValidity()) {
        formRef.current.reportValidity()
        handleDefaultStates()
        return
      }

      if (amount > 0) {
        if (asset?.isNative) {
          const allowance = getEther(
            (
              await method('borrowAllowance', [account, tokenOptions.contract.wethGateway], null, asset.variableDebtToken, asset.variableDebtTokenAbi)
            ).toString(),
            asset.decimals
          )

          setDisplayApproveBtn(!allowance || allowance < amount)
          setDisplayBorrowBtn(allowance >= amount)
        } else {
          setDisplayBorrowBtn(true)
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

    const approve = await method(
      'approveDelegation',
      [tokenOptions.contract.wethGateway, getWei(value, asset.decimals)],
      null,
      asset.variableDebtToken,
      asset.variableDebtTokenAbi
    )

    if (approve) {
      await approve.wait()

      setDisplayApproveBtn(false)
      setDisplayBorrowBtn(true)
    }

    setLoadingApprove(false)
  }, [asset, value])

  const handleBorrowOnClick = useCallback(async () => {
    if (!formRef.current.checkValidity()) {
      formRef.current.reportValidity()
      return
    }

    setLoadingBorrow(true)
    let borrow

    if (asset?.isNative) {
      borrow = await method(
        'borrowETH',
        [tokenOptions.contract.pool, getWei(value, asset.decimals), InterestRateModeEnum.VARIABLE, 0],
        { gasLimit: tokenOptions.gasLimit },
        tokenOptions.contract.wethGateway,
        tokenOptions.contract.wethGatewayAbi
      )
    } else {
      borrow = await method(
        'borrow',
        [asset.underlyingAsset, getWei(value, asset.decimals), interestRateMode, 0, account],
        null,
        tokenOptions.contract.pool,
        tokenOptions.contract.poolAbi
      )
    }

    if (borrow) {
      await borrow.wait()

      handleDefaultStates()
    }

    setLoadingBorrow(false)
  }, [asset, value, interestRateMode])

  useEffect(() => {
    borrowIcon ||
      !asset ||
      setBorrowIcon(
        <Icon>
          <img alt={asset.name} src={asset.icon} className='w-18 mb-18' />
        </Icon>
      )
  }, [asset])

  return (
    <Dialog open={open} onClose={handleCloseOnClick} className='market-dialog-wrapper'>
      <DialogTitle className='justify-content-between'>
        <div className='row'>
          <div className='col-md-6 font-weight-bold'>{t('asset.borrow')}</div>
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
          <form ref={formRef}>
            <TextField
              id='amount'
              label={t('amount')}
              type='number'
              value={value}
              onChange={handleAllowanceOnChange}
              inputProps={{ min: 0, max: balance || 0, step: 'any' }}
              autoFocus
              margin='dense'
            />
            {asset?.stableBorrowRateEnabled && (
              <div className='mt-4'>
                <FormLabel id='interest-rate-mode'>{t('asset.rateMode')}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby='interest-rate-mode'
                  name='interestRateMode'
                  value={interestRateMode}
                  onChange={event => setInterestRateMode(Number((event.target as HTMLInputElement).value))}
                >
                  <FormControlLabel value={InterestRateModeEnum.VARIABLE} control={<Radio />} label={t('asset.variable')} />
                  <FormControlLabel value={InterestRateModeEnum.STABLE} control={<Radio />} label={t('asset.stable')} />
                </RadioGroup>
              </div>
            )}
          </form>
        </>
      </DialogContent>
      <DialogActions className='justify-content-between'>
        <Button onClick={handleCloseOnClick} className='color-danger text-capitalize'>
          {t('close')}
        </Button>
        {displayBorrowBtn && (
          <LoadingButton
            loading={loadingBorrow}
            loadingPosition='end'
            endIcon={borrowIcon}
            variant='contained'
            onClick={handleBorrowOnClick}
            className='bg-color-danger text-capitalize'
          >
            {t('asset.borrow')}
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

export default BorrowDialog
