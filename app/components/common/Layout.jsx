import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Header from './Header'
import Footer from './Footer'
import CreateSpaceBanner from '../onboarding/CreateSpaceBanner'

export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.node
  }

  static contextTypes = {
    currentUserIsOnboarding: PropTypes.func
  }

  render() {
    const { props, context } = this
    const currentUserIsOnboarding = context.currentUserIsOnboarding()

    return (
      <div
        id="app-container"
        className={classNames({
          'user-is-onboarding': currentUserIsOnboarding
        })}
      >
        {currentUserIsOnboarding ? (
          <CreateSpaceBanner />
        ) : null}
        <Header />
        <div className="page-content">
          {props.children}
        </div>
        <Footer />
      </div>
    )
  }
}
