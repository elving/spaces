import { Link } from 'react-router'
import React, { Component, PropTypes } from 'react'

import Dropdown, {
  DropdownTrigger,
  DropdownContent
} from 'react-simple-dropdown'

import Logo from './Logo'
import Search from './Search'
import AdminNav from '../user/AdminNav'
import CurrentUserNav from '../user/CurrentUserNav'
import AddProductButton from './AddProductButton'
import MaterialDesignIcon from '../common/MaterialDesignIcon'
import GlobalNotifications from '../notification/GlobalNotifications'
import RecommendProductButton from './RecommendProductButton'

import fullReload from '../../utils/fullReload'

export default class Header extends Component {
  static contextTypes = {
    userLoggedIn: PropTypes.func,
    toggleMobileNav: PropTypes.func
  }

  renderNav() {
    return (
      <nav className="header-nav">
        <a href="/" className="header-link header-link-logo">
          <Logo width={35} height={35} />
        </a>
        <Dropdown className="header-link header-link--dropdown">
          <DropdownTrigger className="dropdown-trigger">
            Explore
          </DropdownTrigger>
          <DropdownContent
            className="dropdown-content dropdown-content--left"
          >
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
          </DropdownContent>
        </Dropdown>
        <Link
          to={{ pathname: '/finder/' }}
          onClick={fullReload}
          className="header-link"
          activeClassName="is-active"
        >
          Product Finder
        </Link>
        {this.context.userLoggedIn() ? (
          <Link
            to={{ pathname: '/feed/' }}
            onClick={fullReload}
            className="header-link"
            activeClassName="is-active"
          >
            Your Feed
          </Link>
        ) : null}
        {this.context.userLoggedIn() ? (
          <Link
            to={{ pathname: '/suggestions/' }}
            onClick={fullReload}
            className="header-link"
            activeClassName="is-active"
          >
            Your Suggestions
          </Link>
        ) : null}
      </nav>
    )
  }

  render() {
    return (
      <header className="header">
        <div className="header-container">
          <div className="header-container-left">
            {this.renderNav()}
          </div>
          <div className="header-container-right">
            <Search />
            <button
              onClick={this.context.toggleMobileNav}
              className="button button--icon button--outline"
              data-action="toggleMobileNav"
            >
              <MaterialDesignIcon name="menu" size={26} />
            </button>
            <AddProductButton />
            <RecommendProductButton />
            <AdminNav />
            {this.context.userLoggedIn() ? (
              <GlobalNotifications />
            ) : null}
            <CurrentUserNav />
          </div>
        </div>
      </header>
    )
  }
}
