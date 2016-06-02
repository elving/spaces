import React, { Component, PropTypes as Type } from 'react'

import Popup from '../common/Popup'
import PopupTitle from '../common/PopupTitle'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class SharePopup extends Component {
  static propTypes = {
    title: Type.string,
    isOpen: Type.bool,
    className: Type.string,
    onClickClose: Type.func
  };

  static defaultProps = {
    title: '',
    isOpen: false,
    className: '',
    onClickClose: (() => {})
  };

  render() {
    const { title, isOpen, className, onClickClose } = this.props

    return (
      <Popup isOpen={isOpen} className={className} onClickClose={onClickClose}>
        <PopupTitle onClickClose={onClickClose}>
          {title}
        </PopupTitle>
        <div className="popup-content">
          <div className="popup-list popup-list--is-last">
            <div className="popup-item card-share-link">
              <MaterialDesignIcon name="link" className="popup-item-icon"/>
              <input
                type="url"
                value="https://joinspaces.co/"
                readOnly
                className="textfield card-share-link-input"/>
            </div>
            <a href="#" className="popup-item popup-item--clickable">
              <MaterialDesignIcon
                name="facebook"
                color="#3A579D"
                className="popup-item-icon"/>
              <span className="popup-item-text">Share via Facebook</span>
            </a>
            <a href="#" className="popup-item popup-item--clickable">
              <MaterialDesignIcon
                name="twitter"
                color="#50ABF1"
                className="popup-item-icon"/>
              <span className="popup-item-text">Share via Twitter</span>
            </a>
            <a href="#" className="popup-item popup-item--clickable">
              <MaterialDesignIcon
                name="pinterest"
                color="#CD1B1F"
                className="popup-item-icon"/>
              <span className="popup-item-text">Share via Pinterest</span>
            </a>
            <a href="#" className="popup-item popup-item--clickable">
              <MaterialDesignIcon
                name="email"
                className="popup-item-icon"/>
              <span className="popup-item-text">Share via Email</span>
            </a>
          </div>
        </div>
      </Popup>
    )
  }
}
