import React, { Component, PropTypes } from 'react'

import Header from './Header'
import Footer from './Footer'
import JoinCTA from '../cta/JoinCTA'
import MobileNav from '../mobile/Nav'
import AdBlockModal from '../modal/AdBlock'

export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    contentClassName: PropTypes.string
  }

  static defaultProps = {
    className: '',
    contentClassName: ''
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
        <AdBlockModal />
        <MobileNav isVisible={state.mobileNavIsVisible} />
        <Header />
        <JoinCTA />
        <div className={`page-content ${props.contentClassName}`}>
          {props.children}
        </div>
        <Footer />
      </div>
    )
  }
}
