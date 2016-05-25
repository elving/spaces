import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import { hasParent } from '../../utils/dom'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class CardShare extends Component {
  constructor(props) {
    super(props)

    this.onBodyClick = (event) => {
      console.log('onBodyClick')

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
          [className]: !isEmpty(className),
          'card-share-container': true
        })}>
        <div className="popup-title-container">
          <div className="popup-title">
            Share this product
          </div>
          <button
            type="button"
            onClick={this.props.onClickClose}
            className={classNames({
              'button': true,
              'button--icon': true,
              'button--transparent': true,
              'popup-close-button': true
            })}>
            <MaterialDesignIcon name="cancel"/>
          </button>
        </div>
        <div className="popup-content">
          <div className="popup-list popup-list--is-last">
            <div className="popup-list-item card-share-link">
              <MaterialDesignIcon name="link" className="popup-list-item-icon"/>
              <input
                type="url"
                value="https://joinspaces.co/"
                readOnly
                className="textfield card-share-link-input"/>
            </div>
            <a href="#" className="popup-list-item popup-list-item--clickable">
              <MaterialDesignIcon
                name="facebook"
                color="#3A579D"
                className="popup-list-item-icon"/>
              <span className="popup-list-item-text">Share via Facebook</span>
            </a>
            <a href="#" className="popup-list-item popup-list-item--clickable">
              <MaterialDesignIcon
                name="twitter"
                color="#50ABF1"
                className="popup-list-item-icon"/>
              <span className="popup-list-item-text">Share via Twitter</span>
            </a>
            <a href="#" className="popup-list-item popup-list-item--clickable">
              <MaterialDesignIcon
                name="pinterest"
                color="#CD1B1F"
                className="popup-list-item-icon"/>
              <span className="popup-list-item-text">Share via Pinterest</span>
            </a>
            <a href="#" className="popup-list-item popup-list-item--clickable">
              <MaterialDesignIcon
                name="email"
                className="popup-list-item-icon"/>
              <span className="popup-list-item-text">Share via Email</span>
            </a>
          </div>
        </div>
      </div>
    )
  }
}
