import head from 'lodash/head'
import split from 'lodash/split'
import compact from 'lodash/compact'
import React, { Component, PropTypes } from 'react'

import Header from './Header'
import Footer from './Footer'
import Welcome from './Welcome'
import MobileNav from '../mobile/Nav'

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
    welcomeIsVisible: false,
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
    const welcomeWasClosed = sessionStorage.getItem('show-welcome') === 'false'

    this.setState({
      welcomeIsVisible: isLoggedOut && !welcomeWasClosed && !isAuthRoute
    })
  }

  persistWelcomeState = () => {
    this.setState({
      welcomeIsVisible: false
    }, () => {
      sessionStorage.setItem('show-welcome', 'false')
    })
  }

  render() {
    const { props, state } = this

    return (
      <div id="app-container" className={props.className}>
        <MobileNav isVisible={state.mobileNavIsVisible} />

        <Header />

        {state.welcomeIsVisible ? (
          <Welcome onClose={this.persistWelcomeState} />
        ) : null}

        <div className="page-content">
          {props.children}
        </div>
        <Footer />
      </div>
    )
  }
}
