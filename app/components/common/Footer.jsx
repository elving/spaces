import ga from 'react-ga'
import { Link } from 'react-router'
import React, { Component } from 'react'

import Icon from './Icon'
import metadata from '../../constants/metadata'
import redirect from '../../utils/redirect'
import fullReload from '../../utils/fullReload'

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
      <div className="footer-nav">
        <Link
          to={{pathname: '/'}}
          onClick={(event) => {
            ga.event({
              label: 'Home',
              action: 'Clicked Home Link',
              category: 'Footer'
            })

            fullReload(event)
          }}
          className="footer-link"
          activeClassName="is-active">
          Home
        </Link>
        <Link
          to={{pathname: '/about/'}}
          onClick={(event) => {
            ga.event({
              label: 'About',
              action: 'Clicked About Link',
              category: 'Footer'
            })

            fullReload(event)
          }}
          className="footer-link"
          activeClassName="is-active">
          About
        </Link>
        <Link
          to={{pathname: '/contact/'}}
          onClick={(event) => {
            ga.event({
              label: 'Contact',
              action: 'Clicked Contact Link',
              category: 'Footer'
            })

            fullReload(event)
          }}
          className="footer-link"
          activeClassName="is-active">
          Contact
        </Link>
        <Link
          to={{pathname: '/press/'}}
          onClick={(event) => {
            ga.event({
              label: 'Press',
              action: 'Clicked Press Link',
              category: 'Footer'
            })

            fullReload(event)
          }}
          className="footer-link"
          activeClassName="is-active">
          Press
        </Link>
        <Link
          to={{pathname: '/partner/'}}
          onClick={(event) => {
            ga.event({
              label: 'Partner',
              action: 'Clicked Partner Link',
              category: 'Footer'
            })

            fullReload(event)
          }}
          className="footer-link"
          activeClassName="is-active">
          Partner
        </Link>
        <Link
          to={{pathname: '/copyright/'}}
          onClick={(event) => {
            ga.event({
              label: 'Copyright',
              action: 'Clicked Copyright Link',
              category: 'Footer'
            })

            fullReload(event)
          }}
          className="footer-link"
          activeClassName="is-active">
          Copyright
        </Link>
        <Link
          to={{pathname: '/privacy/'}}
          onClick={(event) => {
            ga.event({
              label: 'Privacy',
              action: 'Clicked Privacy Link',
              category: 'Footer'
            })

            fullReload(event)
          }}
          className="footer-link"
          activeClassName="is-active">
          Privacy
        </Link>
        <Link
          to={{pathname: '/terms/'}}
          onClick={(event) => {
            ga.event({
              label: 'Terms',
              action: 'Clicked Terms Link',
              category: 'Footer'
            })

            fullReload(event)
          }}
          className="footer-link"
          activeClassName="is-active">
          Terms
        </Link>
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
