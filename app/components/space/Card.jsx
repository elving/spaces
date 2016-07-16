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
  };

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
  };

  constructor(props) {
    super(props)

    this.state = {
      images: [],
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

  openSharePopup() {
    this.setState({
      sharePopupIsOpen: true,
      sharePopupIsCreated: true
    })
  }

  closeSharePopup() {
    this.setState({
      sharePopupIsOpen: false
    })
  }

  openRedesignPopup() {
    this.setState({
      redesignPopupIsOpen: true
    })
  }

  closeRedesignPopup() {
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
        <a href={`/${props.detailUrl}/`} className="card-actions-overlay"></a>

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
            onClick={::this.openRedesignPopup}
            className={classNames({
              button: true,
              tooltip: true,
              'card-action': true,
              'button--icon': true,
              'button--active': state.redesignPopupIsOpen
            })}
            data-action="redesign"
            data-tooltip="Redesign this space"
          >
            <MaterialDesignIcon name="redesign" fill="#2ECC71" />
          </button>
          <LikeButton
            parent={toStringId(props)}
            onLike={() => this.setState({ likesCount: state.likesCount + 1 })}
            isWhite
            onUnlike={() => this.setState({ likesCount: state.likesCount - 1 })}
            className="card-action"
            parentType="space"
          />
        </div>

        <div className="card-actions card-actions--right">
          <button
            type="button"
            onClick={::this.openSharePopup}
            className={classNames({
              button: true,
              tooltip: true,
              'card-action': true,
              'button--icon': true,
              'button--active': state.sharePopupIsOpen
            })}
            data-action="share"
            data-tooltip="Share this space"
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
    const { props } = this

    return (
      <CardTags model={props} className="space-tags" />
    )
  }

  renderDesigner() {
    const { props } = this

    return (
      <div className="space-card-designer">
        <Avatar
          width={26}
          height={26}
          imageUrl={get(props.createdBy, 'avatar', '')}
          initials={get(props.createdBy, 'initials', '')}
          className="space-card-designer-avatar"
        />
        <span className="space-card-designer-name">
          {isRedesign(props) ? 'Redesigned' : 'Designed'} by {' '}
          <a
            href={`/${get(props.createdBy, 'detailUrl')}/`}
            className="space-card-designer-link"
          >
            {get(props.createdBy, 'name')}
          </a>
        </span>
      </div>
    )
  }

  renderSharePopup() {
    const { props, state } = this

    return state.sharePopupIsCreated ? (
      <SharePopup
        url={() => `${window.location.origin}/${props.shortUrl}/`}
        title="Share this space"
        isOpen={state.sharePopupIsOpen}
        shareUrl={() => `${window.location.origin}/${props.detailUrl}/`}
        className="share-popup"
        shareText={(
          `${props.name} — Designed by ` +
          `${get(props.createdBy, 'username', '')}, ` +
          `featuring ${size(props.products)} products.`
        )}
        shareImage={props.image}
        onClickClose={::this.closeSharePopup}
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
        onClickClose={::this.closeRedesignPopup}
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
