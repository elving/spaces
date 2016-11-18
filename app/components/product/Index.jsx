import get from 'lodash/get'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Products from './Products'
import CreateSpaceBanner from '../onboarding/Banner'

export default class ProductsIndex extends Component {
  static propTypes = {
    location: PropTypes.object
  }

  static defaultProps = {
    location: {}
  }

  static contextTypes = {
    currentUserIsOnboarding: PropTypes.func
  }

  render() {
    const { props, context } = this

    return (
      <Layout
        className={classNames({
          'user-is-onboarding': context.currentUserIsOnboarding()
        })}
        contentClassName="page-content--padding-top"
      >
        {context.currentUserIsOnboarding() ? (
          <CreateSpaceBanner />
        ) : null}

        <Products sorting={get(props.location, 'query.sorting')} />
      </Layout>
    )
  }
}
