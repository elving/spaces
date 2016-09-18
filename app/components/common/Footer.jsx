import { Link } from 'react-router'
import React, { Component } from 'react'

import Logo from './Logo'
import SocialIcon from './SocialIcon'

import metadata from '../../constants/metadata'
import fullReload from '../../utils/fullReload'

export default class Footer extends Component {
  renderLinks() {
    return (
      <div className="footer-nav">
        <a href="/" className="footer-link">
          <Logo width={35} height={35} />
        </a>
        <Link
          to={{ pathname: '/about/' }}
          onClick={fullReload}
          className="footer-link"
          activeClassName="footer-link--active"
        >
          About
        </Link>
        <a className="footer-link" href="mailto:hello@joinspaces.co">
          Contact
        </a>
        <Link
          to={{ pathname: '/copyright/' }}
          onClick={fullReload}
          className="footer-link"
          activeClassName="footer-link--active"
        >
          Copyright
        </Link>
        <Link
          to={{ pathname: '/privacy/' }}
          onClick={fullReload}
          className="footer-link"
          activeClassName="footer-link--active"
        >
          Privacy
        </Link>
        <Link
          to={{ pathname: '/terms/' }}
          onClick={fullReload}
          className="footer-link"
          activeClassName="footer-link--active"
        >
          Terms
        </Link>
      </div>
    )
  }

  renderSocial() {
    return (
      <div className="footer-social">
        <a
          rel="noopener noreferrer"
          href={metadata.facebookUrl}
          target="_blank"
          className="footer-social-link"
          data-network="facebook"
        >
          <SocialIcon name="facebook" />
        </a>
        <a
          rel="noopener noreferrer"
          href={metadata.twitterUrl}
          target="_blank"
          className="footer-social-link"
          data-network="twitter"
        >
          <SocialIcon name="twitter" />
        </a>
        <a
          rel="noopener noreferrer"
          href={metadata.pinterestUrl}
          target="_blank"
          className="footer-social-link"
          data-network="pinterest"
        >
          <SocialIcon name="pinterest" />
        </a>
        <a
          rel="noopener noreferrer"
          href={metadata.instagramUrl}
          target="_blank"
          className="footer-social-link"
          data-network="instagram"
        >
          <SocialIcon name="instagram" viewBox="0 0 128 128" />
        </a>
        <p className="footer-copyright">
          ©2016 Spaces. All rights reserved.
        </p>
      </div>
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
