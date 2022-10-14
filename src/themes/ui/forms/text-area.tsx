import React, { Component, Dispatch, SetStateAction } from 'react'
import withTranslation from 'next-translate/withTranslation'
import { TextArea as TextAreaWeb3UI, TextAreaProps } from '@web3uikit/core'
import { I18n } from 'next-translate'
import * as _ from 'lodash'

interface ITextAreaProps extends TextAreaProps {
  i18n: I18n
  setValue?: Dispatch<SetStateAction<string | number>>
  ignoreStates?: boolean
}

class TextArea extends Component<ITextAreaProps, TextAreaProps> {
  constructor(props) {
    super(props)

    this.state = {
      state: this.props.state,
      // value: this.props.value
    }
  }

  handleOnChange = (value: string) => {
    if (!_.get(this.props, 'ignoreStates', false)) {
      value.length === 0 || this.setState({ state: 'confirmed' })
      !_.get(this.props, 'validation.required', false) || value.length > 0 || this.setState({ state: 'error' })
      _.get(this.props, 'validation.required', false) || value.length > 0 || this.setState({ state: null })
    }

    // this.setState({ value })
    !this.props.setValue || this.props.setValue(value)
  }

  render() {
    const { t } = this.props.i18n

    return (
      <TextAreaWeb3UI
        {...this.props}
        label={t(this.props.label)}
        placeholder={t(this.props.placeholder)}
        onChange={event => this.handleOnChange(event.target.value)}
        validation={this.props.validation}
        state={this.state.state}
        value={this.props.value}
        width={this.props.width}
      />
    )
  }

  static defaultProps = { width: '100%' }
}

export default withTranslation(TextArea, 'common')
