import React, { Component, PropTypes } from 'react'

import Header from './Header'
import Footer from './Footer'
import MobileNav from '../mobile/Nav'

export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  static childContextTypes = {
    toggleMobileNav: PropTypes.func
  }

  state = {
    mobileNavIsVisible: false
  }

  getChildContext() {
    const { state } = this

    return {
      toggleMobileNav: () => {
        this.setState({
          mobileNavIsVisible: !state.mobileNavIsVisible
        })
      }
    }
  }

  render() {
    const { props, state } = this

    return (
      <div id="app-container" className={props.className}>
        <MobileNav isVisible={state.mobileNavIsVisible} />
        <Header />
        <div className="page-content">
          {props.children}
        </div>
        <Footer />
      </div>
    )
  }
}
