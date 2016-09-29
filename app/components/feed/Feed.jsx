import get from 'lodash/get'
import size from 'lodash/size'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Spaces from '../space/Spaces'
import Products from '../product/Products'
import CreateSpaceBanner from '../onboarding/Banner'

export default class Feed extends Component {
  static propTypes = {
    feed: PropTypes.object,
    location: PropTypes.object
  }

  static defaultProps = {
    feed: {},
    location: {}
  }

  static contextTypes = {
    currentUserIsOnboarding: PropTypes.func
  }

  state = {
    showSpaces: true,
    showProducts: false
  }

  showSpaces = () => {
    this.setState({
      showSpaces: true,
      showProducts: false
    })
  }

  showProducts = () => {
    this.setState({
      showSpaces: false,
      showProducts: true
    })
  }

  renderNavigation() {
    const { state } = this

    return (
      <div className="navpills" data-links="2">
        <button
          type="button"
          onClick={this.showSpaces}
          className={classNames({
            'navpills-link': true,
            'navpills-link--active': state.showSpaces
          })}
        >
          Spaces
        </button>
        <button
          type="button"
          onClick={this.showProducts}
          className={classNames({
            'navpills-link': true,
            'navpills-link--active': state.showProducts
          })}
        >
          Products
        </button>
      </div>
    )
  }

  renderContent() {
    const { props, state } = this

    const feed = get(props.feed, 'results', [])
    const spaces = filter(feed, item => get(item, 'type') === 'space')
    const products = filter(feed, item => get(item, 'type') === 'product')

    if (state.showSpaces) {
      return (
        <Spaces
          spaces={{
            count: size(spaces),
            results: spaces
          }}
        />
      )
    } else if (state.showProducts) {
      return (
        <Products
          products={{
            count: size(products),
            results: products
          }}
        />
      )
    }

    return null
  }

  render() {
    const { props, context } = this

    return (
      !isEmpty(get(props.feed, 'results', [])) ? (
        <Layout
          className={classNames({
            'user-is-onboarding': context.currentUserIsOnboarding()
          })}
        >
          {context.currentUserIsOnboarding() ? (
            <CreateSpaceBanner />
          ) : null}

          <h1 className="page-title">Your Feed</h1>

          <div className="feed-content">
            {this.renderNavigation()}
            {this.renderContent()}
          </div>
        </Layout>
      ) : (
        <Layout
          className={classNames({
            'user-is-onboarding': context.currentUserIsOnboarding()
          })}
        >
          {context.currentUserIsOnboarding() ? (
            <CreateSpaceBanner />
          ) : null}

          <h1 className="page-title">Your Feed</h1>

          <div className="feed-empty">
            <h2 className="feed-empty-title">
              It looks like you don't have enough interests to generate
              your personal feed.
            </h2>
            <a
              href="/onboarding/"
              className="feed-empty-btn button button--primary-alt"
            >
              Follow More Interests
            </a>
          </div>
        </Layout>
      )
    )
  }
}
