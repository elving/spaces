import result from 'lodash/result'
import React, { Component, PropTypes as Type } from 'react'

import Popup from '../common/Popup'
import PopupTitle from '../common/PopupTitle'
import SocialIcon from '../common/SocialIcon'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import {
  getEmailUrl,
  getTwitterUrl,
  getFacebookUrl,
  getPinterestUrl
} from '../../utils/getShareUrl'

export default class SharePopup extends Component {
  constructor(props) {
    super(props)
    this.urlInput = null
  }

  static propTypes = {
    url: Type.oneOfType([Type.string, Type.func]),
    title: Type.string,
    isOpen: Type.bool,
    shareUrl: Type.oneOfType([Type.string, Type.func]),
    className: Type.string,
    shareText: Type.string,
    shareImage: Type.string,
    onClickClose: Type.func
  };

  static defaultProps = {
    className: '',
    onClickClose: (() => {})
  };

  renderUrl() {
    return (
      <div className="popup-item card-share-link">
        <MaterialDesignIcon name="link" className="popup-item-icon"/>
        <input
          ref={(input) => this.urlInput = input}
          type="url"
          value={result(this.props, 'url', '')}
          onClick={() => this.urlInput.select()}
          readOnly
          className="textfield card-share-link-input"/>
      </div>
    )
  }

  renderFacebook() {
    return (
      <a
        href={getFacebookUrl(result(this.props, 'shareUrl', '#'))}
        target="_blank"
        className="popup-item popup-item--clickable">
        <SocialIcon
          name="facebook"
          size={16}
          color="#3A579D"
          className="popup-item-icon"/>
        <span className="popup-item-text">Share via Facebook</span>
      </a>
    )
  }

  renderTwitter() {
    const url = result(this.props, 'shareUrl', '#')
    const { shareText } = this.props

    return (
      <a
        href={getTwitterUrl(url, shareText)}
        target="_blank"
        className="popup-item popup-item--clickable">
        <SocialIcon
          name="twitter"
          size={16}
          color="#50ABF1"
          className="popup-item-icon"/>
        <span className="popup-item-text">Share via Twitter</span>
      </a>
    )
  }

  renderPinterest() {
    const url = result(this.props, 'shareUrl', '#')
    const { shareText, shareImage } = this.props

    return (
      <a
        href={getPinterestUrl(url, shareImage, shareText)}
        target="_blank"
        className="popup-item popup-item--clickable">
        <SocialIcon
          name="pinterest"
          size={16}
          color="#CD1B1F"
          className="popup-item-icon"/>
        <span className="popup-item-text">Share via Pinterest</span>
      </a>
    )
  }

  renderEmail() {
    const url = result(this.props, 'url', '#')
    const { shareText } = this.props

    return (
      <a
        href={getEmailUrl(url, shareText)}
        className="popup-item popup-item--clickable">
        <MaterialDesignIcon
          name="email"
          className="popup-item-icon"/>
        <span className="popup-item-text">Share via Email</span>
      </a>
    )
  }

  render() {
    const { title, isOpen, className, onClickClose } = this.props

    return (
      <Popup isOpen={isOpen} className={className} onClickClose={onClickClose}>
        <PopupTitle onClickClose={onClickClose}>
          {title}
        </PopupTitle>
        <div className="popup-content">
          <div className="popup-list popup-list--is-last">
            {this.renderUrl()}
            {this.renderFacebook()}
            {this.renderTwitter()}
            {this.renderPinterest()}
            {this.renderEmail()}
          </div>
        </div>
      </Popup>
    )
  }
}
