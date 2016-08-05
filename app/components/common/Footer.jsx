import React, { Component } from 'react'

import MaterialDesignIcon from './MaterialDesignIcon'

import metadata from '../../constants/metadata'
import redirect from '../../utils/redirect'

export default class Footer extends Component {
  renderSocial() {
    return (
      <div className="footer-social">
        <a
          rel="noopener noreferrer"
          href={metadata.facebookUrl}
          target="_blank"
          onClick={redirect}
          className="footer-social-link"
          data-network="facebook"
        >
          <MaterialDesignIcon name="facebook" />
        </a>
        <a
          rel="noopener noreferrer"
          href={metadata.twitterUrl}
          target="_blank"
          onClick={redirect}
          className="footer-social-link"
          data-network="twitter"
        >
          <MaterialDesignIcon name="twitter" />
        </a>
        <a
          rel="noopener noreferrer"
          href={metadata.pinterestUrl}
          target="_blank"
          onClick={redirect}
          className="footer-social-link"
          data-network="pinterest"
        >
          <MaterialDesignIcon name="pinterest" />
        </a>
        <a
          rel="noopener noreferrer"
          href={metadata.instagramUrl}
          target="_blank"
          onClick={redirect}
          className="footer-social-link"
          data-network="instagram"
        >
          <MaterialDesignIcon name="instagram" />
        </a>
        <p className="footer-copyright">
          ©2016 Spaces. All rights reserved.
        </p>
      </div>
    )
  }

  renderLinks() {
    return (
      <div className="footer-nav" />
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
