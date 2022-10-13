import React, { Component, Dispatch, SetStateAction } from 'react'
import withTranslation from 'next-translate/withTranslation'
import { ISelectProps, Select as SelectWeb3UI } from '@web3uikit/core'
import { I18n } from 'next-translate'
import * as _ from 'lodash'

interface ISelectOptionProps extends ISelectProps {
  i18n: I18n
  setValue?: Dispatch<SetStateAction<string | number>>
}

class Select extends Component<ISelectOptionProps, ISelectProps> {
  constructor(props) {
    super(props)

    this.state = {
      name: this.props.name,
      state: this.props.state,
      value: this.props.value
    }
  }

  handleOnChange = value => {
    if (!_.get(this.props, 'ignoreStates', false)) {
      value.length === 0 || this.setState({ state: 'confirmed' })
      !_.get(this.props, 'validation.required', false) || value.length > 0 || this.setState({ state: 'error' })
      _.get(this.props, 'validation.required', false) || value.length > 0 || this.setState({ state: null })
    }

    this.setState({ value })
    !this.props.setValue || this.props.setValue(value)
  }

  render() {
    const { t } = this.props.i18n

    return (
      <SelectWeb3UI
        {...this.props}
        label={t(this.props.label)}
        onChange={event => this.handleOnChange(event)}
        validation={this.props.validation}
        errorMessage={t(this.props.errorMessage)}
        placeholder={t(this.props.placeholder)}
        state={this.state.state}
        value={this.state.value}
        width={this.props.width}
      />
    )
  }

  static defaultProps = { errorMessage: 'input.required', width: '100%' }
}

export default withTranslation(Select, 'common')
