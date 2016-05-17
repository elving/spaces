import React, { Component, PropTypes as Type } from 'react'

import Icon from './Icon'

export default class Notification extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isOpen: true
    }

    this.timeout = setTimeout(() => {
      this.timeout = null
      this.setState({ isOpen: false }, props.onClose)
    }, props.delay)
  }

  static propTypes = {
    type: Type.string,
    delay: Type.number,
    onClose: Type.func
  };

  static defaultProps = {
    type: 'default',
    delay: 5000,
    onClose: (() => {})
  };

  componentWillUpdate(nextProps, nextState) {
    if (nextState.isOpen) {
      this.timeout = setTimeout(() => {
        this.timeout = null
        this.setState({ isOpen: false }, nextProps.onClose)
      }, nextProps.delay)
    }
  }

  render() {
    const { isOpen } = this.state
    const { type, onClose } = this.props

    return isOpen ? (
      <div className={`notification notification--${type}`}>
        <span className="notification-content">
          {this.props.children}
        </span>
        <button
          onClick={() => {
            clearTimeout(this.timeout)
            this.setState({ isOpen: false }, onClose)
          }}
          className={(
            'notification-close button button--transparent button--icon'
          )}>
          <Icon name="close"/>
        </button>
      </div>
    ) : null
  }
}
