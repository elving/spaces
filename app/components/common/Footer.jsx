import React, { Component } from 'react'

import Icon from './Icon'
import metadata from '../../constants/metadata'
import redirect from '../../utils/redirect'

export default class Footer extends Component {
  renderSocial() {
    return (
      <div className="footer-social">
        <a
          href={metadata.facebookUrl}
          target="_blank"
          onClick={redirect}
          className="footer-social-link"
          data-network="facebook">
          <Icon name="facebook"/>
        </a>
        <a
          href={metadata.twitterUrl}
          target="_blank"
          onClick={redirect}
          className="footer-social-link"
          data-network="twitter">
          <Icon name="twitter"/>
        </a>
        <a
          href={metadata.pinterestUrl}
          target="_blank"
          onClick={redirect}
          className="footer-social-link"
          data-network="pinterest">
          <Icon name="pinterest"/>
        </a>
        <a
          href={metadata.instagramUrl}
          target="_blank"
          onClick={redirect}
          className="footer-social-link"
          data-network="instagram">
          <Icon name="instagram"/>
        </a>
        <p className="footer-copyright">
          ©2016 Spaces. All rights reserved.
        </p>
      </div>
    )
  }

  renderLinks() {
    return (
      <div className="footer-nav"></div>
    )
  }

  render() {
    return (
      <footer className="footer">
        <div className="footer-container">
          {this.renderLinks()}
          {this.renderSocial()}
        </div>
      </footer>
    )
  }
}
