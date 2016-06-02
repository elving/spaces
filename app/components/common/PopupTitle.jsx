import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class PopupTitle extends Component {
  static propTypes = {
    onClickClose: Type.func
  };

  static defaultProps = {
    onClickClose: (() => {})
  };

  render() {
    const { onClickClose } = this.props

    return (
      <div className="popup-title-container">
        <div className="popup-title">
          {this.props.children}
        </div>
        <button
          type="button"
          onClick={onClickClose}
          className={classNames({
            'button': true,
            'button--icon': true,
            'button--transparent': true,
            'popup-close-button': true
          })}>
          <MaterialDesignIcon name="cancel"/>
        </button>
      </div>
    )
  }
}
