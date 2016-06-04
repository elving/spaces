import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import head from 'lodash/head'
import React, { Component, PropTypes as Type } from 'react'

import Layout from '../common/Layout'
import Product from '../product/Card'
import SharePopup from '../common/SharePopup'
import LikeButton from '../common/LikeButton'
import MiniProfile from '../user/MiniProfile'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import inflect from '../../utils/inflect'
import canModify from '../../utils/user/canMondify'

export default class SpaceDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      likesCount: get(props, 'space.likesCount', 0),
      commentsCount: get(props, 'space.commentsCount', 0),
      redesignsCount: get(props, 'space.redesignsCount', 0),
      sharePopupIsOpen: false,
      sharePopupIsCreated: false
    }
  }

  static contextTypes = {
    user: Type.object
  };

  static propTypes = {
    space: Type.object
  };

  static defaultProps = {
    space: {}
  };

  openSharePopup() {
    this.setState({
      sharePopupIsOpen: true,
      sharePopupIsCreated: true
    })
  }

  closeSharePopup() {
    console.log('closeSharePopup')

    this.setState({
      sharePopupIsOpen: false
    })
  }

  renderHeader() {
    const name = get(this.props, 'space.name', '')

    return (
      <div className="space-detail-header">
        <h1 className="space-detail-header-title">{name}</h1>
        {this.renderCounters()}
      </div>
    )
  }

  renderCounters() {
    const products = size(get(this.props, 'space.products', []))
    const { likesCount, commentsCount, redesignsCount } = this.state

    return (
      <div className="space-detail-counters">
        {products ? (
          <a
            href="#products"
            className="space-detail-counter"
            data-action="products">
            <div className="space-detail-counter-number">
              {products}
            </div>
            <div className="space-detail-counter-text">
              {inflect(products, 'Product')}
            </div>
          </a>
        ) : null}
        {redesignsCount ? (
          <div
            className="space-detail-counter"
            data-action="redesigns">
            <div className="space-detail-counter-number">
              {redesignsCount}
            </div>
            <div className="space-detail-counter-text">
              {inflect(redesignsCount, 'Redesign')}
            </div>
          </div>
        ) : null}
        {likesCount ? (
          <div
            className="space-detail-counter"
            data-action="likes">
            <div className="space-detail-counter-number">
              {likesCount}
            </div>
            <div className="space-detail-counter-text">
              {inflect(likesCount, 'Like')}
            </div>
          </div>
        ) : null}
        {commentsCount ? (
          <div
            className="space-detail-counter"
            data-action="comments">
            <div className="space-detail-counter-number">
              {commentsCount}
            </div>
            <div className="space-detail-counter-text">
              {inflect(commentsCount, 'Comment')}
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  renderSubHeader() {
    return (
      <div className="space-detail-subheader-container">
        <div className="space-detail-subheader">
          {this.renderDesigner()}
          {this.renderActions()}
        </div>
      </div>
    )
  }

  renderDesigner() {
    const createdBy = get(this.props, 'space.createdBy', '')

    return (
      <MiniProfile user={createdBy}/>
    )
  }

  renderSharePopup() {
    const { sharePopupIsOpen, sharePopupIsCreated } = this.state
    const { name, shortUrl, products, detailUrl, createdBy } = this.props.space

    return sharePopupIsCreated ? (
      <SharePopup
        url={() => `${window.location.origin}/${shortUrl}/`}
        title="Share this space"
        isOpen={sharePopupIsOpen}
        shareUrl={() => `${window.location.origin}/${detailUrl}/`}
        className="share-popup"
        shareText={(
          `${name} — Designed by ${get(createdBy, 'username', '')}, ` +
          `featuring ${size(products)} products.`
        )}
        shareImage={get(head(products), 'image', '')}
        onClickClose={::this.closeSharePopup}/>
    ) : null
  }


  renderActions() {
    const { user } = this.context
    const { likesCount } = this.state

    return (
      <div className="space-detail-actions">
        <button
          type="button"
          className="button button--primary button--small space-detail-action">
          <MaterialDesignIcon name="redesign"/> Redesign
        </button>
        <LikeButton
          parent={get(this.props, 'space.id', '')}
          onLike={() => this.setState({ likesCount: likesCount + 1 })}
          onUnlike={() => this.setState({ likesCount: likesCount - 1 })}
          className="space-detail-action"
          parentType="space"/>
        <div className="space-detail-action">
          <button
            type="button"
            onClick={::this.openSharePopup}
            className={(
              "button button--icon button--small tooltip"
            )}
            data-tooltip="Share this space">
            <MaterialDesignIcon name="send"/>
          </button>
          {this.renderSharePopup()}
        </div>
        {canModify(user, get(this.props, 'space')) ? (
          <button
            type="button"
            className="button button--icon button--small space-detail-action">
            <MaterialDesignIcon name="settings"/>
          </button>
        ) : null}
      </div>
    )
  }

  renderDescription() {
    const description = get(this.props, 'space.description', [])

    return (
      <div className="space-detail-description-container">
        <p className="space-detail-description">{description}</p>
      </div>
    )
  }

  renderProducts() {
    const products = get(this.props, 'space.products', [])

    return (
      <div className="grid">
        <div id="products" className="grid-items">
          {map(products, (product) => (
            <Product
              key={get(product, 'id', '')}
              {...product}/>
          ))}
        </div>
      </div>
    )
  }

  render() {
    return (
      <Layout>
        <div className="space-detail">
          {this.renderHeader()}
          {this.renderSubHeader()}
          {this.renderDescription()}
          {this.renderProducts()}
        </div>
      </Layout>
    )
  }
}
