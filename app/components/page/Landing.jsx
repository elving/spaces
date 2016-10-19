/* eslint-disable max-len */
import React, { Component } from 'react'

import Logo from '../common/Logo'

export default class Landing extends Component {
  render() {
    return (
      <div className="landing-content">
        <Logo width={80} height={80} />
        <h1>We are building a shopping guide for your home, curated by people like you.</h1>
        <a rel="noopener noreferrer" href="https://joinspaces.us13.list-manage.com/subscribe?u=4dca4b4a60cf2feda43c29b55&id=aecb35207a" target="_blank" className="button button--primary-alt">Get Early Access</a>
      </div>
    )
  }
}
