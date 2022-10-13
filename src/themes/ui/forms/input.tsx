import React, { Component, Dispatch, SetStateAction } from 'react'
import withTranslation from 'next-translate/withTranslation'
import { Input as InputWeb3UI, InputProps } from '@web3uikit/core'
import { I18n } from 'next-translate'
import * as _ from 'lodash'

interface IInputProps extends InputProps {
  i18n: I18n
  setValue?: Dispatch<SetStateAction<string | number>>
  ignoreStates?: boolean
}

class Input extends Component<IInputProps, InputProps> {
  constructor(props) {
    super(props)

    this.state = {
      state: this.props.state,
      value: this.props.value
    }
  }

  handleOnChange = (value: string) => {
    if (!_.get(this.props, 'ignoreStates', false)) {
      if (_.get(this.props, 'validation.required', false) && value.length === 0) {
        this.setState({ state: 'error' })
      } else if (!_.get(this.props, 'validation.required', false) && value.length === 0) {
        this.setState({ state: 'initial' })
      } else if (value.length > 0) {
        this.setState({ state: 'confirmed' })
      }
    }

    this.setState({ value })
    !this.props.setValue || this.props.setValue(value)
  }

  render() {
    const { t } = this.props.i18n

    return (
      <InputWeb3UI
        {...this.props}
        label={t(this.props.label)}
        onChange={event => this.handleOnChange(event.target.value)}
        validation={this.props.validation}
        errorMessage={t(this.props.errorMessage)}
        state={this.state.state}
        value={this.state.value}
        width={this.props.width}
      />
    )
  }

  static defaultProps = { state: 'initial', errorMessage: 'input.required', width: '100%' }
}

export default withTranslation(Input, 'common')
