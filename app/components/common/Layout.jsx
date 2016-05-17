import React, { Component } from 'react'

import Header from './Header'
import Footer from './Footer'

export default class Layout extends Component {
  render() {
    return (
      <div id="app-container">
        <Header/>
        <div className="page-content">
          {this.props.children}
        </div>
        <Footer/>
      </div>
    )
  }
}
