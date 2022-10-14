import React, { Component, Dispatch, SetStateAction } from 'react'
import withTranslation from 'next-translate/withTranslation'
import { Input as InputWeb3UI, InputProps } from '@web3uikit/core'
import { I18n } from 'next-translate'
import * as _ from 'lodash'

interface IInputProps extends InputProps {
  i18n: I18n
  setValue?: Dispatch<SetStateAction<string | number>>[]
  ignoreStates?: boolean
}

class Input extends Component<IInputProps, InputProps> {
  handleOnChange = event => {
    if (!_.get(this.props, 'ignoreStates', false)) {
      event.target.value.length === 0 || this.props.setValue[1]('confirmed')
      !_.get(this.props, 'validation.required', false) || event.target.value.length > 0 || this.props.setValue[1]('error')
      _.get(this.props, 'validation.required', false) || event.target.value.length > 0 || this.props.setValue[1]('initial')
    }

    !this.props.setValue || this.props.setValue[0](event.target.value)
  }

  render() {
    const { t } = this.props.i18n

    return (
      <InputWeb3UI
        {...this.props}
        label={t(this.props.label)}
        onChange={this.handleOnChange}
        validation={this.props.validation}
        errorMessage={t(this.props.errorMessage)}
        state={this.props.state}
        value={this.props.value}
        width={this.props.width}
      />
    )
  }

  static defaultProps = { state: 'initial', errorMessage: 'input.required', width: '100%' }
}

export default withTranslation(Input, 'common')
