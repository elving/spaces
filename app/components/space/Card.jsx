import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import slice from 'lodash/slice'
import reverse from 'lodash/reverse'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Loader from '../common/Loader'
import Avatar from '../user/Avatar'
import CardTags from '../card/CardTags'
import CardTitle from '../card/CardTitle'
import SharePopup from '../common/SharePopup'
import LikeButton from '../common/LikeButton'
import CardActivity from '../card/CardActivity'
import CuratorBadge from '../user/CuratorBadge'
import RedesignPopup from './RedesignPopup'
import RedesignBadge from './RedesignBadge'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'
import isRedesign from '../../utils/space/isRedesign'
import preloadImages from '../../utils/preloadImages'

export default class SpaceCard extends Component {
  static contextTypes = {
    csrf: PropTypes.string,
    userLoggedIn: PropTypes.func
  }

  static propTypes = {
    sid: PropTypes.string,
    name: PropTypes.string,
    shortUrl: PropTypes.string,
    products: PropTypes.array,
    createdBy: PropTypes.object,
    spaceType: PropTypes.object,
    detailUrl: PropTypes.string,
    likesCount: PropTypes.number,
    description: PropTypes.string,
    isRedesigned: PropTypes.bool,
    commentsCount: PropTypes.number,
    originalSpace: PropTypes.object,
    redesignsCount: PropTypes.number
  }

  constructor(props) {
    super(props)

    this.state = {
      images: [],
      isHovering: false,
      likesCount: get(props, 'likesCount', 0),
      redesignsCount: get(props, 'redesignsCount', 0),
      imagesAreLoaded: false,
      imagesAreLoading: true,
      sharePopupIsOpen: false,
      sharePopupIsCreated: false,
      redesignPopupIsOpen: false
    }
  }

  componentDidMount() {
    const { props } = this

    const images = map(
      slice(reverse(props.products), 0, 4),
      product => get(product, 'image', '')
    )

    preloadImages(images).then(() => {
      this.setState({
        images,
        imagesAreLoaded: true,
        imagesAreLoading: false
      })
    })
  }

  onMouseEnter = () => {
    this.setState({
      isHovering: true
    })
  }

  onMouseLeave = () => {
    this.setState({
      isHovering: false
    })
  }

  onLike = () => {
    const { state } = this

    this.setState({
      likesCount: state.likesCount + 1
    })
  }

  onUnlike = () => {
    const { state } = this

    this.setState({
      likesCount: state.likesCount - 1
    })
  }

  getShortUrl = () => {
    const { props } = this
    return `${window.location.origin}/${props.shortUrl}/`
  }

  getDetailUrl = () => {
    const { props } = this
    return `${window.location.origin}/${props.detailUrl}/`
  }

  openSharePopup = () => {
    this.setState({
      sharePopupIsOpen: true,
      sharePopupIsCreated: true
    })
  }

  closeSharePopup = () => {
    this.setState({
      sharePopupIsOpen: false
    })
  }

  openRedesignPopup = () => {
    this.setState({
      redesignPopupIsOpen: true
    })
  }

  closeRedesignPopup = () => {
    this.setState({
      redesignPopupIsOpen: false
    })
  }

  renderImages() {
    const { props, state } = this

    return (
      <div
        className={classNames({
          'space-card-images-container': true,
          'space-card-images-container--loading': state.imagesAreLoading
        })}
        data-images={size(state.images)}
      >
        <a href={`/${props.detailUrl}/`} className="card-actions-overlay" />

        {this.renderActions()}
        {this.renderRedesignBadge()}

        {state.imagesAreLoading ? (
          <Loader size={50} />
        ) : null}

        {state.imagesAreLoaded ? (
          map(state.images, src =>
            <div
              key={`space-image-${src}`}
              style={{ backgroundImage: `url(${src})` }}
              className="space-card-image"
            />
          )
        ) : null}
      </div>
    )
  }

  renderRedesignBadge() {
    const { props } = this

    return isRedesign(props)
      ? <RedesignBadge space={props} />
      : null
  }

  renderActions() {
    const { props, state } = this

    return (
      <div className="space-card-actions card-actions-container">
        <div className="card-actions card-actions--left">
          <button
            type="button"
            onClick={this.openRedesignPopup}
            className={classNames({
              button: true,
              'card-action': true,
              'button--icon': true,
              'button--active': state.redesignPopupIsOpen
            })}
            data-action="redesign"
          >
            <MaterialDesignIcon name="redesign" fill="#2ECC71" />
          </button>
          <LikeButton
            parent={toStringId(props)}
            onLike={this.onLike}
            isWhite
            onUnlike={this.onUnlike}
            className="card-action"
            parentType="space"
          />
        </div>

        <div className="card-actions card-actions--right">
          <button
            type="button"
            onClick={this.openSharePopup}
            className={classNames({
              button: true,
              'card-action': true,
              'share-button': true,
              'button--icon': true,
              'button--active': state.sharePopupIsOpen
            })}
            data-action="share"
          >
            <MaterialDesignIcon name="send" />
          </button>
        </div>
      </div>
    )
  }

  renderTitle() {
    const { props } = this

    return (
      <CardTitle
        url={`/${props.detailUrl}/`}
        title={props.name}
        subTitle={get(props.spaceType, 'name')}
        className="space-title"
      >
        {this.renderActivity()}
      </CardTitle>
    )
  }

  renderActivity() {
    const { props, state } = this

    return (
      <CardActivity
        likes={state.likesCount}
        comments={props.commentsCount}
      />
    )
  }

  renderTags() {
    const { props, state } = this

    return (
      <CardTags
        model={props}
        className="space-tags"
        autoScroll={state.isHovering}
      />
    )
  }

  renderDesigner() {
    const { props } = this

    return (
      <div className="space-card-designer">
        <Avatar
          user={props.createdBy}
          width={26}
          height={26}
          className="space-card-designer-avatar"
        />
        <span className="space-card-designer-name">
          {isRedesign(props) ? 'Redesigned by ' : 'Designed by '}
          <a
            href={`/${get(props.createdBy, 'detailUrl')}/`}
            className="space-card-designer-link"
          >
            {get(props.createdBy, 'name')}
            <CuratorBadge user={props.createdBy} size={16} />
          </a>
        </span>
      </div>
    )
  }

  renderSharePopup() {
    const { props, state } = this

    return state.sharePopupIsCreated ? (
      <SharePopup
        url={this.getShortUrl}
        title="Share this space"
        isOpen={state.sharePopupIsOpen}
        shareUrl={this.getDetailUrl}
        className="share-popup"
        shareText={(
          `${props.name} — Designed by ` +
          `${get(props.createdBy, 'username', '')}, ` +
          `featuring ${size(props.products)} products.`
        )}
        shareImage={props.image}
        onClickClose={this.closeSharePopup}
      />
    ) : null
  }

  renderRedesignPopup() {
    const { props, state } = this

    return (
      <RedesignPopup
        isOpen={state.redesignPopupIsOpen}
        spaceId={toStringId(props)}
        spaceType={toStringId(props.spaceType)}
        className="redesign-popup"
        onClickClose={this.closeRedesignPopup}
      />
    )
  }

  render() {
    const { props, state } = this

    return (
      <div
        className={classNames({
          product: true,
          'space-card card': true,
          'space-card--redesign': isRedesign(props),
          'space-card--popup-open': (
            state.sharePopupIsOpen ||
            state.redesignPopupIsOpen
          )
        })}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div className="space-card-overlay" />

        {this.renderSharePopup()}
        {this.renderRedesignPopup()}

        {this.renderImages()}
        {this.renderTitle()}
        {this.renderTags()}
        {this.renderDesigner()}
      </div>
    )
  }
}
