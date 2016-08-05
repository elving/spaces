import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import hasParent from '../../utils/dom/hasParent'
import { default as $ } from '../../utils/dom/selector'

export default class Popup extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    onClickClose: PropTypes.func
  }

  static defaultProps = {
    isOpen: false,
    className: '',
    onClickClose: (() => {})
  }

  componentDidMount() {
    const $body = $('body')

    if (this.props.isOpen) {
      $body.addEventListener('click', this.onBodyClick)
    } else {
      $body.removeEventListener('click', this.onBodyClick)
    }
  }

  componentWillReceiveProps(newProps) {
    const $body = $('body')

    if (newProps.isOpen) {
      $body.addEventListener('click', this.onBodyClick)
    } else {
      $body.removeEventListener('click', this.onBodyClick)
    }
  }

  onBodyClick = (event) => {
    const { props } = this

    if (!hasParent(event, 'popup')) {
      props.onClickClose()
    }
  }

  render() {
    const { props } = this

    return (
      <div
        className={classNames({
          popup: true,
          'popup--is-open': props.isOpen,
          [props.className]: !isEmpty(props.className)
        })}
      >
        {props.children}
      </div>
    )
  }
}
