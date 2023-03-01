import React, { useEffect, useState } from 'react'
import { TextField as MUITextField } from '@mui/material'
import { OverridableStringUnion } from '@mui/types'
import { TextFieldProps, TextFieldPropsColorOverrides } from '@mui/material/TextField/TextField'
import useTranslation from 'next-translate/useTranslation'

type ColorType = OverridableStringUnion<'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning', TextFieldPropsColorOverrides>
type TextFieldTypes = TextFieldProps & { value: string; minLength?: number; maxLength?: number; enableColors?: boolean; onChange?: any; reset?: boolean }

const TextField = ({
  value,
  onChange,
  minLength,
  maxLength,
  required = true,
  variant = 'standard',
  fullWidth = true,
  enableColors = true,
  ...props
}: TextFieldTypes) => {
  const { t } = useTranslation('common')
  const [init, setInit] = useState<boolean>(true)
  const [color, setColor] = useState<ColorType>('primary')
  const [focused, setFocused] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorText, setErrorText] = useState<string>('')

  const handleOnChange = (data: string) => {
    if (enableColors && required) {
      const errors: string[] = []

      if (data && minLength && data.length < minLength) errors.push(`${t('minLength')}: ${minLength}`)
      if (data && maxLength && data.length > maxLength) errors.push(`${t('maxLength')}: ${maxLength}`)

      setColor(!errors.length && data?.length > 0 ? 'success' : 'primary')
      setFocused(!errors.length && data?.length > 0)
      setError(!!errors.length)
      setErrorText(errors.length ? errors.join(', ') : '')
    }

    onChange(data)
  }

  useEffect(() => {
    init || handleOnChange(value)
    !init || setInit(false)
  }, [value])

  return (
    <MUITextField
      {...props}
      required={required}
      variant={variant}
      fullWidth={fullWidth}
      color={color}
      focused={focused}
      value={value}
      onChange={event => handleOnChange(event.target.value)}
      error={error}
      helperText={errorText}
    />
  )
}

export default TextField
