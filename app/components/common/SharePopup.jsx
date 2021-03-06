import result from 'lodash/result'
import React, { Component, PropTypes } from 'react'

import Popup from '../common/Popup'
import PopupTitle from '../common/PopupTitle'
import SocialIcon from '../common/SocialIcon'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import {
  getEmailUrl,
  getTwitterUrl,
  getFacebookUrl,
  getPinterestUrl,
  getFlipboardUrl
} from '../../utils/getShareUrl'

export default class SharePopup extends Component {
  static propTypes = {
    url: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    title: PropTypes.string,
    isOpen: PropTypes.bool,
    shareUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    className: PropTypes.string,
    shareText: PropTypes.string,
    shareImage: PropTypes.string,
    onClickClose: PropTypes.func
  }

  static defaultProps = {
    className: '',
    onClickClose: (() => {})
  }

  onShareLinkClick = () => {
    this.urlInput.select()
  }

  urlInput = null;

  renderUrl() {
    const { props } = this

    return (
      <div className="popup-item card-share-link">
        <MaterialDesignIcon name="link" className="popup-item-icon" />
        <input
          ref={input => { this.urlInput = input }}
          type="url"
          value={result(props, 'url', '')}
          onClick={this.onShareLinkClick}
          readOnly
          className="textfield card-share-link-input"
        />
      </div>
    )
  }

  renderFacebook() {
    const { props } = this

    return (
      <a
        rel="noopener noreferrer"
        href={getFacebookUrl(result(props, 'shareUrl', '#'))}
        target="_blank"
        className="popup-item popup-item--clickable"
      >
        <SocialIcon
          name="facebook"
          className="popup-item-icon"
        />
        <span className="popup-item-text">Share via Facebook</span>
      </a>
    )
  }

  renderTwitter() {
    const { props } = this
    const url = result(props, 'shareUrl', '#')

    return (
      <a
        rel="noopener noreferrer"
        href={getTwitterUrl(url, props.shareText)}
        target="_blank"
        className="popup-item popup-item--clickable"
      >
        <SocialIcon
          name="twitter"
          className="popup-item-icon"
        />
        <span className="popup-item-text">Share via Twitter</span>
      </a>
    )
  }

  renderPinterest() {
    const { props } = this
    const url = result(props, 'shareUrl', '#')

    return (
      <a
        rel="noopener noreferrer"
        href={getPinterestUrl(url, props.shareImage, props.shareText)}
        target="_blank"
        className="popup-item popup-item--clickable"
      >
        <SocialIcon
          name="pinterest"
          className="popup-item-icon"
        />
        <span className="popup-item-text">Share via Pinterest</span>
      </a>
    )
  }

  renderFlipboard() {
    const { props } = this
    const url = result(props, 'shareUrl', '#')

    return (
      <a
        rel="noopener noreferrer"
        href={getFlipboardUrl(url, props.shareText)}
        target="_blank"
        className="popup-item popup-item--clickable"
      >
        <SocialIcon
          name="flipboard"
          className="popup-item-icon"
        />
        <span className="popup-item-text">Share via Flipboard</span>
      </a>
    )
  }

  renderEmail() {
    const { props } = this
    const url = result(props, 'url', '#')

    return (
      <a
        href={getEmailUrl(url, props.shareText)}
        className="popup-item popup-item--clickable"
      >
        <SocialIcon
          name="email"
          className="popup-item-icon"
        />
        <span className="popup-item-text">Share via Email</span>
      </a>
    )
  }

  render() {
    const { props } = this

    return (
      <Popup
        isOpen={props.isOpen}
        className={props.className}
        onClickClose={props.onClickClose}
      >
        <PopupTitle onClickClose={props.onClickClose}>
          {props.title}
        </PopupTitle>
        <div className="popup-content">
          <div className="popup-list popup-list--is-last">
            {this.renderUrl()}
            {this.renderFacebook()}
            {this.renderTwitter()}
            {this.renderPinterest()}
            {this.renderFlipboard()}
            {this.renderEmail()}
          </div>
        </div>
      </Popup>
    )
  }
}
