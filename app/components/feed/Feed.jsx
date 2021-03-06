import get from 'lodash/get'
import size from 'lodash/size'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Spaces from '../space/Spaces'
import Products from '../product/Products'
import OnboardingTips from '../onboarding/Tips'

export default class Feed extends Component {
  static propTypes = {
    feed: PropTypes.object,
    location: PropTypes.object
  }

  static defaultProps = {
    feed: {},
    location: {}
  }

  state = {
    showSpaces: false,
    showProducts: true
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
          onClick={this.showProducts}
          className={classNames({
            'navpills-link': true,
            'navpills-link--active': state.showProducts
          })}
        >
          Products
        </button>
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
    const { props } = this

    return (
      !isEmpty(get(props.feed, 'results', [])) ? (
        <Layout>
          <OnboardingTips />

          <h1 className="page-title">
            Here are some interesting things we found for you
          </h1>

          <div className="feed-content">
            {this.renderNavigation()}
            {this.renderContent()}
          </div>
        </Layout>
      ) : (
        <Layout>
          <div className="feed-empty">
            <h2 className="feed-empty-title">
              It looks like you don&apos;t follow enough interests to generate
              your personal feed.
            </h2>
            <a
              href="/onboarding/"
              className="feed-empty-btn button button--primary-alt"
            >
              <span className="button-text">
                Follow More Interests
              </span>
            </a>
          </div>
        </Layout>
      )
    )
  }
}
