import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import { hasParent } from '../../utils/dom'

export default class Popup extends Component {
  constructor(props) {
    super(props)

    this.onBodyClick = (event) => {
      if (!hasParent(event, 'popup')) {
        props.onClickClose()
      }
    }
  }

  static propTypes = {
    isOpen: Type.bool,
    className: Type.string,
    onClickClose: Type.func
  };

  static defaultProps = {
    isOpen: false,
    className: '',
    onClickClose: (() => {})
  };

  componentDidMount() {
    const $body = document.querySelector('body')

    if (this.props.isOpen) {
      $body.addEventListener('click', this.onBodyClick)
    } else {
      $body.removeEventListener('click', this.onBodyClick)
    }
  }

  componentWillReceiveProps(newProps) {
    const $body = document.querySelector('body')

    if (newProps.isOpen) {
      $body.addEventListener('click', this.onBodyClick)
    } else {
      $body.removeEventListener('click', this.onBodyClick)
    }
  }

  render() {
    const { isOpen, className } = this.props

    return (
      <div
        className={classNames({
          'popup': true,
          'popup--is-open': isOpen,
          [className]: !isEmpty(className)
        })}>
        {this.props.children}
      </div>
    )
  }
}
