import ga from 'react-ga'
import React, { Component } from 'react'

import Logo from './Logo'
import Search from './Search'
import AdminNav from '../user/AdminNav'
import CurrentUserNav from '../user/CurrentUserNav'

export default class Header extends Component {
  renderNav() {
    return (
      <nav className="header-nav">
        <a
          href="/"
          onClick={() => {
            ga.event({
              label: 'Logo',
              action: 'Clicked Home Link',
              category: 'Main Header'
            })
          }}
          className="header-link">
          <Logo width={35} height={35}/>
        </a>
        <a href="#" className="header-link">Discover</a>
        <a href="#" className="header-link">Create</a>
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
            <Search/>
            <AdminNav/>
            <CurrentUserNav/>
          </div>
        </div>
      </header>
    )
  }
}
