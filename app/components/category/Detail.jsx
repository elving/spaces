import get from 'lodash/get'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Spaces from '../space/Spaces'
import Products from '../product/Products'
import SharePopup from '../common/SharePopup'
import FollowButton from '../common/FollowButton'
import CreateSpaceBanner from '../onboarding/CreateSpaceBanner'
import MaterialDesignIcon from '../common/MaterialDesignIcon'
import sharePopupContainer from '../container/SharePopup'

import inflect from '../../utils/inflect'
import toStringId from '../../api/utils/toStringId'

class CategoryDetail extends Component {
  static propTypes = {
    category: PropTypes.object
  }

  static defaultProps = {
    category: {}
  }

  static contextTypes = {
    currentUserIsOnboarding: PropTypes.func
  }

  constructor(props) {
    super(props)

    const spacesCount = get(props.category, 'spacesCount', 0)

    this.state = {
      showSpaces: spacesCount > 0,
      showProducts: spacesCount === 0,
      followersCount: get(props.category, 'followersCount', 0),
    }
  }

  getShortUrl = () => {
    const { props } = this
    const categoryShortUrl = get(props.category, 'shortUrl')
    return `${window.location.origin}/${categoryShortUrl}/`
  }

  getDetailUrl = () => {
    const { props } = this
    const categoryDetailUrl = get(props.category, 'detailUrl')
    return `${window.location.origin}/${categoryDetailUrl}/`
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

  renderHeader() {
    const { props } = this

    return (
      <div className="category-detail-header">
        <h1 className="category-detail-header-title">
          {get(props, 'category.name', '')}
        </h1>
      </div>
    )
  }

  renderCounters() {
    const { props, state } = this
    const spacesCount = get(props, 'category.spacesCount', 0)
    const productsCount = get(props, 'category.productsCount', 0)

    return (
      <div className="category-detail-counters">
        {spacesCount ? (
          <div className="category-detail-counter">
            <div className="category-detail-counter-number">
              {spacesCount}
            </div>
            <div className="category-detail-counter-text">
              {inflect(spacesCount, 'Space')}
            </div>
          </div>
        ) : null}
        {productsCount ? (
          <div className="category-detail-counter">
            <div className="category-detail-counter-number">
              {productsCount}
            </div>
            <div className="category-detail-counter-text">
              {inflect(productsCount, 'Product')}
            </div>
          </div>
        ) : null}
        {state.followersCount ? (
          <div
            className="category-detail-counter"
            data-action="followers"
          >
            <div className="category-detail-counter-number">
              {state.followersCount}
            </div>
            <div className="category-detail-counter-text">
              {inflect(state.followersCount, 'Follower')}
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  renderActions() {
    const { props } = this
    const categoryName = get(props.category, 'name')
    const categoryImage = get(props.category, 'image')
    const categoryProductsCount = get(props.category, 'productsCount')

    return (
      <div className="category-detail-actions">
        <FollowButton
          parent={toStringId(props.category)}
          className="category-detail-follow-button"
          parentType="category"
        />
        <div className="category-detail-action">
          <button
            type="button"
            onClick={props.openSharePopup}
            className={(
              "button button--icon button--small button--outline"
            )}
            data-action="share"
          >
            <MaterialDesignIcon name="send" fill="#439fe0" />
          </button>
          {props.sharePopupIsCreated ? (
            <SharePopup
              url={this.getShortUrl}
              title="Share this category"
              isOpen={props.sharePopupIsOpen}
              shareUrl={this.getDetailUrl}
              className="share-popup"
              shareText={(
                `${categoryName} — ` +
                `Featuring ${categoryProductsCount} ` +
                `${inflect(categoryProductsCount, 'product')}.`
              )}
              shareImage={categoryImage}
              onClickClose={props.closeSharePopup}
            />
            ) : null}
        </div>
      </div>
    )
  }

  renderSubHeader() {
    return (
      <div className="category-detail-subheader-container">
        <div className="category-detail-subheader">
          {this.renderCounters()}
          {this.renderActions()}
        </div>
      </div>
    )
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
    const category = get(props.category, 'name')

    if (state.showSpaces) {
      return (
        <Spaces
          params={{ categories: toStringId(props.category) }}
          emptyMessage={`No ${category} related spaces designed yet...`}
        />
      )
    } else if (state.showProducts) {
      return (
        <Products
          params={{ categories: toStringId(props.category) }}
          emptyMessage={`No ${category} related products added yet...`}
        />
      )
    }

    return null
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

        <div className="category-detail">
          {this.renderHeader()}
          {this.renderSubHeader()}

          <div className="category-detail-content">
            {this.renderNavigation()}
            {this.renderContent()}
          </div>
        </div>
      </Layout>
    )
  }
}

export default sharePopupContainer(CategoryDetail)
