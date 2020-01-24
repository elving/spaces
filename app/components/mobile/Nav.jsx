import { Link } from 'react-router'
import React, { Component, PropTypes } from 'react'

import Logo from '../common/Logo'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import fullReload from '../../utils/fullReload'

export default class MobileNav extends Component {
  static contextTypes = {
    userLoggedIn: PropTypes.func,
    toggleMobileNav: PropTypes.func
  }

  static propTypes = {
    isVisible: PropTypes.bool
  }

  static defaultProps = {
    isVisible: false
  }

  render() {
    return this.props.isVisible ? (
      <nav className="mobile-nav header-link--dropdown">
        <div className="mobile-nav-top">
          <a href="/" style={{ height: 35 }}>
            <Logo width={35} height={35} />
          </a>
          <button
            onClick={this.context.toggleMobileNav}
            className="button button--icon button--outline"
            data-action="toggleMobileNav"
          >
            <MaterialDesignIcon name="close" size={26} />
          </button>
        </div>
        <Link
          to={{ pathname: '/finder/' }}
          onClick={fullReload}
          className="dropdown-link"
          activeClassName="dropdown-link--active"
        >
          Product Finder
          <small className="header-link--description">
            Find products curated for your home.
          </small>
        </Link>
        {this.context.userLoggedIn() ? (
          <Link
            to={{ pathname: '/feed/' }}
            onClick={fullReload}
            className="dropdown-link"
            activeClassName="dropdown-link--active"
          >
            Your Feed
            <small className="header-link--description">
              Discover products based on your interests.
            </small>
          </Link>
        ) : null}
        {this.context.userLoggedIn() ? (
          <Link
            to={{ pathname: '/suggestions/' }}
            onClick={fullReload}
            className="dropdown-link"
            activeClassName="dropdown-link--active"
          >
            Your Suggestions
            <small className="header-link--description">
              Discover products for the spaces you&apos;ve designed.
            </small>
          </Link>
        ) : null}
        <Link
          to={{ pathname: '/products/' }}
          onClick={fullReload}
          className="dropdown-link"
          activeClassName="dropdown-link--active"
        >
          Products
          <small className="header-link--description">
            Discover products hand-picked by
            our curators and community.
          </small>
        </Link>
        <Link
          to={{ pathname: '/spaces/' }}
          onClick={fullReload}
          className="dropdown-link"
          activeClassName="dropdown-link--active"
        >
          Spaces
          <small className="header-link--description">
            Discover spaces designed by the community.
          </small>
        </Link>
        <Link
          to={{ pathname: '/guides/' }}
          onClick={fullReload}
          className="dropdown-link"
          activeClassName="dropdown-link--active"
        >
          Guides
          <small className="header-link--description">
            Our shopping guides showcase the best
            spaces and products curated by the community
          </small>
        </Link>
        <Link
          to={{ pathname: '/rooms/' }}
          onClick={fullReload}
          className="dropdown-link"
          activeClassName="dropdown-link--active"
        >
          Rooms
          <small className="header-link--description">
            Discover products and spaces by rooms.
          </small>
        </Link>
        <Link
          to={{ pathname: '/categories/' }}
          onClick={fullReload}
          className="dropdown-link"
          activeClassName="dropdown-link--active"
        >
          Categories
          <small className="header-link--description">
            Discover products and spaces by categories.
          </small>
        </Link>
        <Link
          to={{ pathname: '/community/' }}
          onClick={fullReload}
          className="dropdown-link"
          activeClassName="dropdown-link--active"
        >
          Community
          <small className="header-link--description">
            Discover people with your same interests and taste.
          </small>
        </Link>
      </nav>
    ) : null
  }
}
