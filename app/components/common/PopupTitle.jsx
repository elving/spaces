import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class PopupTitle extends Component {
  static propTypes = {
    children: PropTypes.node,
    onClickClose: PropTypes.func
  }

  static defaultProps = {
    onClickClose: (() => {})
  }

  render() {
    const { props } = this

    return (
      <div className="popup-title-container">
        <div className="popup-title">
          {props.children}
        </div>
        <button
          type="button"
          onClick={props.onClickClose}
          className={classNames({
            button: true,
            'button--icon': true,
            'button--transparent': true,
            'popup-close-button': true
          })}
        >
          <MaterialDesignIcon name="cancel" />
        </button>
      </div>
    )
  }
}
