import { Link } from 'react-router'
import React, { Component } from 'react'

import Logo from './Logo'
import Search from './Search'
import AdminNav from '../user/AdminNav'
import CurrentUserNav from '../user/CurrentUserNav'
import AddProductButton from './AddProductButton'

import fullReload from '../../utils/fullReload'

export default class Header extends Component {
  renderNav() {
    return (
      <nav className="header-nav">
        <a href="/" className="header-link">
          <Logo width={35} height={35} />
        </a>
        <Link
          to={{ pathname: '/' }}
          onClick={fullReload}
          className="header-link"
          activeClassName="is-active"
        >
          Trending
        </Link>
        <Link
          to={{ pathname: '/spaces/' }}
          onClick={fullReload}
          className="header-link"
          activeClassName="is-active"
        >
          Spaces
        </Link>
        <Link
          to={{ pathname: '/products/' }}
          onClick={fullReload}
          className="header-link"
          activeClassName="is-active"
        >
          Products
        </Link>
        <div className="header-link-divider" />
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
            <AddProductButton />
            <AdminNav />
            <CurrentUserNav />
          </div>
        </div>
      </header>
    )
  }
}
