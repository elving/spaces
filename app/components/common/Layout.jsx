import head from 'lodash/head'
import split from 'lodash/split'
import compact from 'lodash/compact'
import React, { Component, PropTypes } from 'react'

import Header from './Header'
import Footer from './Footer'
import MobileNav from '../mobile/Nav'
import WelcomeModal from '../modal/Welcome'

import isNotAppRoute from '../../utils/isNotAppRoute'

export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  static contextTypes = {
    userLoggedIn: PropTypes.func
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

  componentDidMount() {
    const { context } = this
    const isLoggedOut = !context.userLoggedIn()
    const isAuthRoute = isNotAppRoute(
      head(compact(split(window.location.pathname, '/')))
    )
    const hasClosedModal = sessionStorage.getItem('show-welcome') === 'false'

    this.modalTimeout = setTimeout(() => {
      if (isLoggedOut && !hasClosedModal && !isAuthRoute) {
        this.setState({
          welcomeModalIsOpen: true
        })
      }
    }, 5000)
  }

  componentWillUnmount() {
    clearTimeout(this.modalTimeout)
  }

  persistWelcomeState = () => {
    this.setState({
      welcomeModalIsOpen: false
    }, () => {
      sessionStorage.setItem('show-welcome', 'false')
    })
  }

  render() {
    const { props, state } = this

    return (
      <div id="app-container" className={props.className}>
        <WelcomeModal
          onClose={this.persistWelcomeState}
          isVisible={state.welcomeModalIsOpen}
        />

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
