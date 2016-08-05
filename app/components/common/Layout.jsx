import React, { Component, PropTypes } from 'react'

import Header from './Header'
import Footer from './Footer'

export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  render() {
    const { props } = this

    return (
      <div id="app-container">
        <Header />
        <div className="page-content">
          {props.children}
        </div>
        <Footer />
      </div>
    )
  }
}
