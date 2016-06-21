import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import slice from 'lodash/slice'
import reverse from 'lodash/reverse'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

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

import isRedesign from '../../utils/space/isRedesign'
import preloadImages from '../../utils/preloadImages'
import getTagsFromProducts from '../../utils/getTagsFromProducts'

export default class SpaceCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      images: [],
      likesCount: get(props, 'likesCount', 0),
      redesignsCount: get(props, 'redesignsCount', 0),
      imagesAreLoaded: false,
      imagesAreLoading: false,
      sharePopupIsOpen: false,
      sharePopupIsCreated: false,
      redesignPopupIsOpen: false
    }
  }

  static contextTypes = {
    csrf: Type.string,
    userLoggedIn: Type.func
  };

  static propTypes = {
    sid: Type.string,
    name: Type.string,
    shortUrl: Type.string,
    products: Type.array,
    createdBy: Type.object,
    spaceType: Type.object,
    detailUrl: Type.string,
    likesCount: Type.number,
    description: Type.string,
    isRedesigned: Type.bool,
    commentsCount: Type.number,
    originalSpace: Type.object,
    redesignsCount: Type.number
  };

  componentDidMount() {
    const { products } = this.props
    const lastProducts = slice(reverse(products), 0, 4)

    const images = map(lastProducts, (product) => (
      get(product, 'image', '')
    ))

    this.setState({ images, imagesAreLoading: true }, () => {
      preloadImages(images).then(() => {
        this.setState({
          imagesAreLoaded: true,
          imagesAreLoading: false
        })
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
    const { detailUrl } = this.props
    const { images, imagesAreLoaded, imagesAreLoading } = this.state

    return (
      <div
        className={classNames({
          'space-card-images-container': true,
          'space-card-images-container--loading': imagesAreLoading
        })}
        data-images={size(images)}>
        <a href={`/${detailUrl}/`} className="card-actions-overlay"></a>

        {this.renderActions()}
        {this.renderRedesignBadge()}

        {imagesAreLoading ? (
          <Loader size={50}/>
        ) : null}

        {imagesAreLoaded ? (
          map(images, (src) => (
            <div
              key={`space-image-${src}`}
              style={{ backgroundImage: `url(${src})` }}
              className="space-card-image"/>
          ))
        ) : null}
      </div>
    )
  }

  renderRedesignBadge() {
    return isRedesign(this.props) ? (
      <RedesignBadge space={this.props}/>
    ) : null
  }

  renderActions() {
    const { id } = this.props
    const { likesCount } = this.state
    const { sharePopupIsOpen, redesignPopupIsOpen } = this.state

    return (
      <div className="space-card-actions card-actions-container">
        <div className="card-actions card-actions--left">
          <button
            type="button"
            onClick={::this.openRedesignPopup}
            className={classNames({
              'button': true,
              'tooltip': true,
              'card-action': true,
              'button--icon': true,
              'button--active': redesignPopupIsOpen
            })}
            data-action="redesign"
            data-tooltip="Redesign this space">
            <MaterialDesignIcon name="redesign" fill="#2ECC71"/>
          </button>
          <LikeButton
            parent={id}
            isWhite={true}
            onLike={() => this.setState({ likesCount: likesCount + 1 })}
            onUnlike={() => this.setState({ likesCount: likesCount - 1 })}
            className="card-action"
            parentType="space"/>
        </div>

        <div className="card-actions card-actions--right">
          <button
            type="button"
            onClick={::this.openSharePopup}
            className={classNames({
              'button': true,
              'tooltip': true,
              'card-action': true,
              'button--icon': true,
              'button--active': sharePopupIsOpen
            })}
            data-action="share"
            data-tooltip="Share this space">
            <MaterialDesignIcon name="send"/>
          </button>
        </div>
      </div>
    )
  }

  renderTitle() {
    const { name, spaceType, detailUrl } = this.props

    return (
      <CardTitle
        url={`/${detailUrl}/`}
        title={name}
        subTitle={get(spaceType, 'name')}
        className="space-title">
      {this.renderActivity()}
      </CardTitle>
    )
  }

  renderActivity() {
    const { likesCount } = this.state
    const { commentsCount } = this.props

    return (
      <CardActivity
        likes={likesCount}
        comments={commentsCount}/>
    )
  }

  renderTags() {
    const { products } = this.props
    const tags = getTagsFromProducts(products)
    const colors = get(tags, 'colors', [])
    const categories = get(tags, 'categories', [])

    return (
      <CardTags
        tags={[categories, colors]}
        className="space-tags"/>
    )
  }

  renderDesigner() {
    const { createdBy } = this.props

    return (
      <div className="space-card-designer">
        <Avatar
          width={26}
          height={26}
          imageUrl={get(createdBy, 'avatar', '')}
          initials={get(createdBy, 'initials', '')}
          className="space-card-designer-avatar"/>
        <span className="space-card-designer-name">
          {isRedesign(this.props) ? 'Redesigned' : 'Designed'} by <a
            href={`/${get(createdBy, 'detailUrl', '#')}/`}
            className="space-card-designer-link">
            {get(createdBy, 'name')}
          </a>
        </span>
      </div>
    )
  }

  renderSharePopup() {
    const { sharePopupIsOpen, sharePopupIsCreated } = this.state
    const { name, image, shortUrl, products, detailUrl, createdBy } = this.props

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
        shareImage={image}
        onClickClose={::this.closeSharePopup}/>
    ) : null
  }

  renderRedesignPopup() {
    const { id, spaceType } = this.props
    const { redesignPopupIsOpen } = this.state

    return (
      <RedesignPopup
        isOpen={redesignPopupIsOpen}
        spaceId={id}
        spaceType={get(spaceType, 'id', spaceType)}
        className="redesign-popup"
        onClickClose={::this.closeRedesignPopup}/>
    )
  }

  render() {
    const { sharePopupIsOpen, redesignPopupIsOpen } = this.state

    return (
      <div
        className={classNames({
          'product': true,
          'space-card card': true,
          'space-card--redesign': isRedesign(this.props),
          'space-card--popup-open': (
            sharePopupIsOpen ||
            redesignPopupIsOpen
          )
        })}>
        <div className="space-card-overlay"/>

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
