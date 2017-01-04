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

import fullReload from '../../utils/fullReload'

export default class Header extends Component {
  static contextTypes = {
    userLoggedIn: PropTypes.func,
    toggleMobileNav: PropTypes.func
  }

  renderNav() {
    const { context } = this

    return (
      <nav className="header-nav">
        <a href="/" className="header-link header-link-logo">
          <Logo width={35} height={35} />
        </a>
        <Dropdown className="header-main-navigation">
          <DropdownTrigger
            className="dropdown-trigger dropdown-trigger--no-caret"
          >
            <MaterialDesignIcon name="menu" size={28} />
          </DropdownTrigger>
          <DropdownContent
            className="dropdown-content dropdown-content--left"
          >
            <Link
              to={{ pathname: '/' }}
              onClick={fullReload}
              className="dropdown-link"
              activeClassName="dropdown-link--active"
            >
              Trending
            </Link>
            <Link
              to={{ pathname: '/spaces/' }}
              onClick={fullReload}
              className="dropdown-link"
              activeClassName="dropdown-link--active"
            >
              Spaces
            </Link>
            <Link
              to={{ pathname: '/products/' }}
              onClick={fullReload}
              className="dropdown-link"
              activeClassName="dropdown-link--active"
            >
              Products
            </Link>
            <Link
              to={{ pathname: '/rooms/' }}
              onClick={fullReload}
              className="dropdown-link"
              activeClassName="dropdown-link--active"
            >
              Rooms
            </Link>
            <Link
              to={{ pathname: '/categories/' }}
              onClick={fullReload}
              className="dropdown-link"
              activeClassName="dropdown-link--active"
            >
              Categories
            </Link>
            <Link
              to={{ pathname: '/designers/' }}
              onClick={fullReload}
              className="dropdown-link"
              activeClassName="dropdown-link--active"
            >
              Designers
            </Link>
          </DropdownContent>
        </Dropdown>

        {context.userLoggedIn() ? (
          <div className="header-nav">
            <div className="header-link-divider" />
            <Link
              to={{ pathname: '/guides/' }}
              onClick={fullReload}
              className="header-link"
              activeClassName="is-active"
            >
              Guides
            </Link>
            <Link
              to={{ pathname: '/feed/' }}
              onClick={fullReload}
              className="header-link"
              activeClassName="is-active"
            >
              Your Feed
            </Link>
            <Link
              to={{ pathname: '/suggestions/' }}
              onClick={fullReload}
              className="header-link"
              activeClassName="is-active"
            >
              Your Suggestions
            </Link>
          </div>
        ) : null}
      </nav>
    )
  }

  render() {
    const { context } = this

    return (
      <header className="header">
        <div className="header-container">
          <div className="header-container-left">
            {this.renderNav()}
          </div>
          <div className="header-container-right">
            <Search />
            <button
              onClick={context.toggleMobileNav}
              className="button button--icon button--outline"
              data-action="toggleMobileNav"
            >
              <MaterialDesignIcon name="menu" size={26} />
            </button>
            <AddProductButton />
            <AdminNav />
            {context.userLoggedIn() ? (
              <GlobalNotifications />
            ) : null}
            <CurrentUserNav />
          </div>
        </div>
      </header>
    )
  }
}
