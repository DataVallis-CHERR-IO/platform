import React, { Component, Dispatch, SetStateAction } from 'react'
import withTranslation from 'next-translate/withTranslation'
import { Select as SelectWeb3UI, ISelectProps } from '@web3uikit/core'
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
    console.log(value, 'value')
    if (!_.get(this.props, 'ignoreStates', false)) {
      if (_.get(this.props, 'validation.required', false) && value.length === 0) {
        this.setState({ state: 'error' })
      } else if (!_.get(this.props, 'validation.required', false) && value.length === 0) {
        this.setState({ state: null })
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
      <SelectWeb3UI
        {...this.props}
        label={t(this.props.label)}
        onChange={event => this.handleOnChange(event)}
        validation={this.props.validation}
        placeholder={t(this.props.placeholder)}
        state={this.state.state}
        value={this.state.value}
        width={this.props.width}
      />
    )
  }

  static defaultProps = { width: '100%' }
}

export default withTranslation(Select, 'common')
