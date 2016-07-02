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
  getPinterestUrl
} from '../../utils/getShareUrl'

export default class SharePopup extends Component {
  constructor(props) {
    super(props)
    this.urlInput = null
  }

  static propTypes = {
    url: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    title: PropTypes.string,
    isOpen: PropTypes.bool,
    shareUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    className: PropTypes.string,
    shareText: PropTypes.string,
    shareImage: PropTypes.string,
    onClickClose: PropTypes.func
  };

  static defaultProps = {
    className: '',
    onClickClose: (() => {})
  };

  renderUrl() {
    const { props } = this

    return (
      <div className="popup-item card-share-link">
        <MaterialDesignIcon name="link" className="popup-item-icon"/>
        <input
          ref={(input) => this.urlInput = input}
          type="url"
          value={result(props, 'url', '')}
          onClick={() => this.urlInput.select()}
          readOnly
          className="textfield card-share-link-input"/>
      </div>
    )
  }

  renderFacebook() {
    const { props } = this

    return (
      <a
        href={getFacebookUrl(result(props, 'shareUrl', '#'))}
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
    const { props } = this
    const url = result(props, 'shareUrl', '#')

    return (
      <a
        href={getTwitterUrl(url, props.shareText)}
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
    const { props } = this
    const url = result(props, 'shareUrl', '#')

    return (
      <a
        href={getPinterestUrl(url, props.shareImage, props.shareText)}
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
    const { props } = this
    const url = result(props, 'url', '#')

    return (
      <a
        href={getEmailUrl(url, props.shareText)}
        className="popup-item popup-item--clickable">
        <MaterialDesignIcon
          name="email"
          className="popup-item-icon"/>
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
        onClickClose={props.onClickClose}>
        <PopupTitle onClickClose={props.onClickClose}>
          {props.title}
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
