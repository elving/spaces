import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from './MaterialDesignIcon'

export default class Notification extends Component {
  static propTypes = {
    type: PropTypes.string,
    style: PropTypes.object,
    timeout: PropTypes.number,
    onClose: PropTypes.func,
    children: PropTypes.node,
    isVisible: PropTypes.bool
  }

  static defaultProps = {
    type: 'default',
    style: {},
    timeout: 0,
    onClose: (() => {}),
    isVisible: false
  }

  constructor(props) {
    super(props)
    this.setTimeout(props)
  }

  componentWillReceiveProps(nextProps) {
    this.setTimeout(nextProps)
  }

  onClick = () => {
    const { props } = this
    clearTimeout(this.timeoutId)
    props.onClose()
  }

  setTimeout = (props) => {
    if (props.isVisible) {
      this.timeoutId = props.timeout > 0
        ? setTimeout(() => {
          this.timeoutId = null
          props.onClose()
        }, props.timeout)
        : null
    }
  }

  render() {
    const { props } = this

    return props.isVisible ? (
      <div
        style={props.style}
        className={`notification notification--${props.type}`}
      >
        <span className="notification-content">
          {props.children}
        </span>
        <button
          onClick={this.onClick}
          className="notification-close button button--transparent button--icon"
        >
          <MaterialDesignIcon name="close" />
        </button>
      </div>
    ) : null
  }
}
