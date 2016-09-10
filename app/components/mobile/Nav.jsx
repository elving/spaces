import { Link } from 'react-router'
import React, { Component, PropTypes } from 'react'

import Logo from '../common/Logo'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import fullReload from '../../utils/fullReload'

export default class MobileNav extends Component {
  static contextTypes = {
    toggleMobileNav: PropTypes.func
  }

  static propTypes = {
    isVisible: PropTypes.bool
  }

  static defaultProps = {
    isVisible: false
  }

  render() {
    const { props, context } = this

    return props.isVisible ? (
      <nav className="mobile-nav">
        <div className="mobile-nav-top">
          <a href="/">
            <Logo width={35} height={35} />
          </a>
          <button
            onClick={context.toggleMobileNav}
            className="button button--icon button--outline"
            data-action="toggleMobileNav"
          >
            <MaterialDesignIcon name="close" size={26} />
          </button>
        </div>
        <Link
          to={{ pathname: '/' }}
          onClick={fullReload}
          className="mobile-nav-link"
          activeClassName="mobile-nav-link--active"
        >
          Trending
        </Link>
        <Link
          to={{ pathname: '/spaces/' }}
          onClick={fullReload}
          className="mobile-nav-link"
          activeClassName="mobile-nav-link--active"
        >
          Spaces
        </Link>
        <Link
          to={{ pathname: '/products/' }}
          onClick={fullReload}
          className="mobile-nav-link"
          activeClassName="mobile-nav-link--active"
        >
          Products
        </Link>
        <Link
          to={{ pathname: '/feed/' }}
          onClick={fullReload}
          className="mobile-nav-link"
          activeClassName="mobile-nav-link--active"
        >
          Your Feed
        </Link>
        <Link
          to={{ pathname: '/suggestions/' }}
          onClick={fullReload}
          className="mobile-nav-link"
          activeClassName="mobile-nav-link--active"
        >
          Your Suggestions
        </Link>
      </nav>
    ) : null
  }
}
