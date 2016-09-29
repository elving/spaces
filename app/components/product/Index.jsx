import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Products from './Products'
import CreateSpaceBanner from '../onboarding/Banner'

export default class ProductsIndex extends Component {
  static contextTypes = {
    currentUserIsOnboarding: PropTypes.func
  }

  render() {
    const { context } = this

    return (
      <Layout
        className={classNames({
          'user-is-onboarding': context.currentUserIsOnboarding()
        })}
      >
        {context.currentUserIsOnboarding() ? (
          <CreateSpaceBanner />
        ) : null}

        <h1 className="page-title page-title--has-margin">
          Discover Products
        </h1>

        <Products />
      </Layout>
    )
  }
}
