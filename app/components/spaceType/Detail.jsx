import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Spaces from '../space/Spaces'
import Products from '../product/Products'
import SharePopup from '../common/SharePopup'
import FollowButton from '../common/FollowButton'
import FollowersModal from '../modal/Followers'
import MaterialDesignIcon from '../common/MaterialDesignIcon'
import sharePopupContainer from '../container/SharePopup'

import inflect from '../../utils/inflect'
import toStringId from '../../api/utils/toStringId'

class SpaceTypeDetail extends Component {
  static propTypes = {
    location: PropTypes.object,
    spaceType: PropTypes.object
  }

  static defaultProps = {
    location: {},
    spaceType: {}
  }

  constructor(props) {
    super(props)

    const spacesCount = get(props.spaceType, 'spacesCount', 0)
    const defaultView = get(props.location, 'query.show')

    this.state = {
      followersCount: get(props.spaceType, 'followersCount', 0),
      followersModalIsOpen: false,
      createFollowersModal: false
    }

    if (!isEmpty(defaultView)) {
      if (defaultView !== 'spaces' && defaultView !== 'products') {
        this.state.showSpaces = spacesCount > 0
        this.state.showProducts = spacesCount === 0
      } else {
        this.state.showSpaces = defaultView === 'spaces'
        this.state.showProducts = defaultView === 'products'
      }
    } else {
      this.state.showSpaces = spacesCount > 0
      this.state.showProducts = spacesCount === 0
    }
  }

  onFollow = () => {
    const { state } = this

    this.setState({
      followersCount: state.followersCount + 1
    })
  }

  onUnfollow = () => {
    const { state } = this

    this.setState({
      followersCount: state.followersCount - 1
    })
  }

  onFollowersCounterClick = (event) => {
    event.preventDefault()
    this.openFollowersModal()
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

  openFollowersModal = () => {
    this.setState({
      followersModalIsOpen: true,
      createFollowersModal: true
    })
  }

  closeFollowersModal = () => {
    this.setState({
      followersModalIsOpen: false
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
          <button
            type="button"
            onClick={this.onFollowersCounterClick}
            className="spaceType-detail-counter"
            data-action="followers"
          >
            <div className="spaceType-detail-counter-number">
              {state.followersCount}
            </div>
            <div className="spaceType-detail-counter-text">
              {inflect(state.followersCount, 'Follower')}
            </div>
          </button>
        ) : null}
      </div>
    )
  }

  renderFollowersModal() {
    const { props, state } = this

    return state.createFollowersModal ? (
      <FollowersModal
        parent={toStringId(props.spaceType)}
        onClose={this.closeFollowersModal}
        isVisible={state.followersModalIsOpen}
        parentType="room"
      />
    ) : null
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
          onFollow={this.onFollow}
          className="spaceType-detail-follow-button"
          onUnfollow={this.onUnfollow}
          parentType="spaceType"
        />
        <div className="spaceType-detail-action">
          <button
            type="button"
            onClick={props.openSharePopup}
            className="button button--icon button--small button--outline"
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
    return (
      <Layout>
        <div className="spaceType-detail">
          {this.renderHeader()}
          {this.renderSubHeader()}
          {this.renderFollowersModal()}

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
