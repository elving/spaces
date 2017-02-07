import { Link } from 'react-router'
import React, { Component } from 'react'

import Logo from './Logo'
import SocialIcon from './SocialIcon'

import metadata from '../../constants/metadata'
import fullReload from '../../utils/fullReload'

export default class Footer extends Component {
  renderAbout = () => (
    <div className="footer-about-container">
      <a href="/" className="footer-logo">
        <Logo width={35} height={35} />
      </a>
      <p className="footer-about">
        Spaces features the best products for your home from all over
        the web, curated and maintained by our community.
      </p>
      {this.renderSocial()}
      <p className="footer-copyright">
        © 2016 Spaces. All rights reserved.
      </p>
    </div>
  )

  renderSocial = () => (
    <div className="footer-social">
      <a
        rel="noopener noreferrer"
        href={metadata.facebookUrl}
        target="_blank"
        className="footer-social-link"
        data-network="facebook"
      >
        <SocialIcon name="facebook" fill="#666666" />
      </a>
      <a
        rel="noopener noreferrer"
        href={metadata.twitterUrl}
        target="_blank"
        className="footer-social-link"
        data-network="twitter"
      >
        <SocialIcon name="twitter" fill="#666666" />
      </a>
      <a
        rel="noopener noreferrer"
        href={metadata.pinterestUrl}
        target="_blank"
        className="footer-social-link"
        data-network="pinterest"
      >
        <SocialIcon name="pinterest" fill="#666666" />
      </a>
      <a
        rel="noopener noreferrer"
        href={metadata.instagramUrl}
        target="_blank"
        className="footer-social-link"
        data-network="instagram"
      >
        <SocialIcon name="instagram" fill="#666666" />
      </a>
      <a
        rel="noopener noreferrer"
        href={metadata.flipboardUrl}
        target="_blank"
        className="footer-social-link"
        data-network="flipboard"
      >
        <SocialIcon name="flipboard" fill="#666666" />
      </a>
    </div>
  )

  renderCompanyLinks = () => (
    <div className="footer-links-column">
      <p className="footer-links-column-title">
        Company
      </p>
      <Link
        to={{ pathname: '/about/' }}
        onClick={fullReload}
        className="footer-link"
        activeClassName="footer-link--active"
      >
        About
      </Link>
      <a className="footer-link" href="mailto:hello@joinspaces.co">
        Contact Us
      </a>
      <Link
        to={{ pathname: '/join/' }}
        onClick={fullReload}
        className="footer-link"
        activeClassName="footer-link--active"
      >
        Join
      </Link>
    </div>
  )

  renderLegalLinks = () => (
    <div className="footer-links-column">
      <p className="footer-links-column-title">
        Legal
      </p>
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

  renderNavigateLinks = () => (
    <div className="footer-links-column">
      <p className="footer-links-column-title">
        Navigate
      </p>
      <Link
        to={{ pathname: '/finder/' }}
        onClick={fullReload}
        className="footer-link"
        activeClassName="footer-link--active"
      >
        Product Finder
      </Link>
      <Link
        to={{ pathname: '/products/' }}
        onClick={fullReload}
        className="footer-link"
        activeClassName="footer-link--active"
      >
        Products
      </Link>
      <Link
        to={{ pathname: '/spaces/' }}
        onClick={fullReload}
        className="footer-link"
        activeClassName="footer-link--active"
      >
        Spaces
      </Link>
      <Link
        to={{ pathname: '/guides/' }}
        onClick={fullReload}
        className="footer-link"
        activeClassName="footer-link--active"
      >
        Guides
      </Link>
      <Link
        to={{ pathname: '/rooms/' }}
        onClick={fullReload}
        className="footer-link"
        activeClassName="footer-link--active"
      >
        Rooms
      </Link>
      <Link
        to={{ pathname: '/categories/' }}
        onClick={fullReload}
        className="footer-link"
        activeClassName="footer-link--active"
      >
        Categories
      </Link>
      <Link
        to={{ pathname: '/community/' }}
        onClick={fullReload}
        className="footer-link"
        activeClassName="footer-link--active"
      >
        Community
      </Link>
    </div>
  )

  render() {
    return (
      <footer className="footer">
        {this.renderAbout()}
        <div className="footer-links">
          {this.renderCompanyLinks()}
          {this.renderLegalLinks()}
          {this.renderNavigateLinks()}
        </div>
      </footer>
    )
  }
}
