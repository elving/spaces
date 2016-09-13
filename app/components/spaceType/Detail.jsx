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

class SpaceTypeDetail extends Component {
  static propTypes = {
    spaceType: PropTypes.object
  }

  static defaultProps = {
    spaceType: {}
  }

  static contextTypes = {
    currentUserIsOnboarding: PropTypes.func
  }

  constructor(props) {
    super(props)

    this.state = {
      showSpaces: true,
      showProducts: false,
      followersCount: get(props.spaceType, 'followersCount', 0),
    }
  }

  getShortUrl = () => {
    const { props } = this
    const spaceTypeShortUrl = get(props.spaceType, 'shortUrl')
    return `${window.location.origin}/${spaceTypeShortUrl}/`
  }

  getDetailUrl = () => {
    const { props } = this
    const spaceTypeDetailUrl = get(props.spaceType, 'detailUrl')
    return `${window.location.origin}/${spaceTypeDetailUrl}/`
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
      <div className="spaceType-detail-header">
        <h1 className="spaceType-detail-header-title">
          {get(props, 'spaceType.name', '')}
        </h1>
      </div>
    )
  }

  renderCounters() {
    const { props, state } = this
    const spacesCount = get(props, 'spaceType.spacesCount', 0)
    const productsCount = get(props, 'spaceType.productsCount', 0)

    return (
      <div className="spaceType-detail-counters">
        {spacesCount ? (
          <div className="spaceType-detail-counter">
            <div className="spaceType-detail-counter-number">
              {spacesCount}
            </div>
            <div className="spaceType-detail-counter-text">
              {inflect(spacesCount, 'Space')}
            </div>
          </div>
        ) : null}
        {productsCount ? (
          <div className="spaceType-detail-counter">
            <div className="spaceType-detail-counter-number">
              {productsCount}
            </div>
            <div className="spaceType-detail-counter-text">
              {inflect(productsCount, 'Product')}
            </div>
          </div>
        ) : null}
        {state.followersCount ? (
          <div
            className="spaceType-detail-counter"
            data-action="followers"
          >
            <div className="spaceType-detail-counter-number">
              {state.followersCount}
            </div>
            <div className="spaceType-detail-counter-text">
              {inflect(state.followersCount, 'Follower')}
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  renderActions() {
    const { props } = this
    const spaceTypeName = get(props.spaceType, 'name')
    const spaceTypeImage = get(props.spaceType, 'image')
    const spaceTypeProductsCount = get(props.spaceType, 'productsCount')

    return (
      <div className="spaceType-detail-actions">
        <FollowButton
          parent={toStringId(props.spaceType)}
          className="spaceType-detail-follow-button"
          parentType="spaceType"
        />
        <div className="spaceType-detail-action">
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
              title="Share this spaceType"
              isOpen={props.sharePopupIsOpen}
              shareUrl={this.getDetailUrl}
              className="share-popup"
              shareText={(
                `${spaceTypeName} — ` +
                `Featuring ${spaceTypeProductsCount} ` +
                `${inflect(spaceTypeProductsCount, 'product')}.`
              )}
              shareImage={spaceTypeImage}
              onClickClose={props.closeSharePopup}
            />
            ) : null}
        </div>
      </div>
    )
  }

  renderSubHeader() {
    return (
      <div className="spaceType-detail-subheader-container">
        <div className="spaceType-detail-subheader">
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
    const room = get(props.spaceType, 'name')

    if (state.showSpaces) {
      return (
        <Spaces
          params={{ spaceType: toStringId(props.spaceType) }}
          emptyMessage={`No ${room} related spaces designed yet...`}
        />
      )
    } else if (state.showProducts) {
      return (
        <Products
          params={{ spaceTypes: toStringId(props.spaceType) }}
          emptyMessage={`No ${room} related products added yet...`}
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

        <div className="spaceType-detail">
          {this.renderHeader()}
          {this.renderSubHeader()}

          <div className="spaceType-detail-content">
            {this.renderNavigation()}
            {this.renderContent()}
          </div>
        </div>
      </Layout>
    )
  }
}

export default sharePopupContainer(SpaceTypeDetail)
