import get from 'lodash/get'
import ReactGA from 'react-ga'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Loader from '../common/Loader'
import Avatar from '../user/Avatar'
import CardTitle from '../card/CardTitle'
import SharePopup from '../common/SharePopup'
import LikeButton from '../common/LikeButton'
import CardActivity from '../card/CardActivity'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import isCurator from '../../utils/user/isCurator'

export default class ProductMiniCard extends Component {
  static contextTypes = {
    csrf: PropTypes.string,
    userLoggedIn: PropTypes.func,
    currentUserIsOnboarding: PropTypes.func
  }

  static propTypes = {
    id: PropTypes.string,
    url: PropTypes.string,
    name: PropTypes.string,
    brand: PropTypes.object,
    image: PropTypes.string,
    price: PropTypes.number,
    colors: PropTypes.array,
    createdBy: PropTypes.object,
    categories: PropTypes.array,
    spaceTypes: PropTypes.array,
    mainAction: PropTypes.string,
    likesCount: PropTypes.number,
    forDisplayOnly: PropTypes.bool,
    onAddButtonClick: PropTypes.func,
    onRemoveButtonClick: PropTypes.func
  }

  static defaultProps = {
    id: '',
    url: '',
    name: '',
    brand: {},
    image: '',
    price: 0,
    colors: [],
    createdBy: {},
    categories: [],
    spaceTypes: [],
    mainAction: 'add',
    forDisplayOnly: false,
    onAddButtonClick: (() => {}),
    onRemoveButtonClick: (() => {})
  }

  constructor(props) {
    super(props)

    this.state = {
      likesCount: get(props, 'likesCount', 0),
      imageIsLoaded: false,
      imageIsLoading: true,
      sharePopupIsOpen: false,
      sharePopupIsCreated: false
    }
  }

  componentDidMount() {
    const { props } = this
    const imagePreloader = new Image()

    imagePreloader.onload = this.onImageLoad
    imagePreloader.src = props.image

    if (imagePreloader.complete) {
      this.onImageLoad()
    }
  }

  onImageLoad = () => {
    this.setState({
      imageIsLoaded: true,
      imageIsLoading: false
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

  closeSharePopup = () => {
    this.setState({
      sharePopupIsOpen: false
    })
  }

  openSharePopup = () => {
    this.setState({
      sharePopupIsOpen: true,
      sharePopupIsCreated: true
    })
  }

  renderImage() {
    const { props, state } = this

    return (
      <div
        className={classNames({
          'product-card-image-container': true,
          'product-card-image-container--loading': state.imageIsLoading
        })}
      >
        <a href={`/${props.detailUrl}/`} className="card-actions-overlay" />

        {!props.forDisplayOnly ? (
          this.renderActions()
        ) : null}

        {state.imageIsLoading ? (
          <Loader size={50} />
        ) : null}

        {state.imageIsLoaded ? (
          <div
            title={props.name}
            style={{ backgroundImage: `url(${props.image})` }}
            className="product-card-image"
          />
        ) : null}

        {this.renderDesigner()}
        {this.renderPrice()}
      </div>
    )
  }

  renderActions() {
    const { props, context } = this

    return (
      <div className="product-card-actions card-actions-container">
        <div className="card-actions card-actions--left">
          {props.mainAction === 'add' && context.userLoggedIn() ? (
            <button
              type="button"
              onClick={props.onAddButtonClick}
              className="card-action button button--icon tooltip"
              data-action="add"
              data-tooltip="Add to space"
            >
              <MaterialDesignIcon name="check-simple" fill="#2ECC71" />
            </button>
          ) : null}
          {!context.userLoggedIn() ? (
            <a
              href="/login/"
              className="card-action button button--icon tooltip"
              data-action="add"
              data-tooltip="Add to space"
            >
              <MaterialDesignIcon name="check-simple" fill="#2ECC71" />
            </a>
          ) : null}
          {props.mainAction === 'remove' ? (
            <button
              type="button"
              onClick={props.onRemoveButtonClick}
              className="card-action button button--icon tooltip"
              data-action="remove"
              data-tooltip="Remove from space"
            >
              <MaterialDesignIcon name="remove" fill="#e74c3c" />
            </button>
          ) : null}
          <LikeButton
            parent={props.id}
            onLike={this.onLike}
            isWhite
            onUnlike={this.onUnlike}
            className="card-action"
            parentType="product"
            showTooltip
          />
        </div>

        <div className="card-actions card-actions--right">
          <button
            type="button"
            onClick={this.openSharePopup}
            className="card-action share-button button button--icon tooltip"
            data-action="send"
            data-tooltip="Share this product"
          >
            <MaterialDesignIcon name="send" />
          </button>
        </div>
      </div>
    )
  }

  renderDesigner() {
    const { props } = this

    return (
      <a
        rel="noreferrer noopener"
        href={`/${get(props.createdBy, 'detailUrl')}/`}
        target="_blank"
        className="product-card-designer tooltip"
        data-tooltip={`@${get(props.createdBy, 'username')}`}
      >
        <Avatar
          user={props.createdBy}
          width={18}
          height={18}
          className="product-card-designer-avatar"
        />
        <span className="product-card-designer-name">
          {isCurator(props.createdBy) ? 'Curated' : 'Recommended'}
        </span>
      </a>
    )
  }

  renderPrice() {
    const { props } = this

    return (
      <a
        rel="noopener noreferrer"
        href={props.url}
        target="_blank"
        onClick={() => {
          ReactGA.outboundLink({
            label: `product-card-${props.id}`
          }, () => {})
        }}
        className={classNames({
          button: true,
          'product-card-price': true,
          'button--primary-outline': true
        })}
      >
        <span className="button-text">
          <MaterialDesignIcon name="cart" size={16} color="#2ECC71" />
          {`$${props.price}`}
        </span>
      </a>
    )
  }

  renderTitle() {
    const { props } = this

    return (
      <CardTitle
        url={props.forDisplayOnly ? '' : `/${props.detailUrl}/`}
        title={props.name}
        limit={55}
        subTitle={get(props.brand, 'name')}
        className="product-title"
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

  render() {
    const { props, state } = this

    return (
      <div
        className={classNames({
          card: true,
          product: true,
          'mini-card': true,
          'product-card': true,
          'product-card--can-remove': props.mainAction === 'remove',
          'product-card--popup-open': state.sharePopupIsOpen,
          'product-card--display-only': props.forDisplayOnly
        })}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div className="product-card-overlay" />

        {state.sharePopupIsCreated ? (
          <SharePopup
            url={() => (
              `${window.location.origin}/${props.detailUrl}/`
            )}
            title="Share this product"
            isOpen={state.sharePopupIsOpen}
            shareUrl={() => (
              `${window.location.origin}/${props.shortUrl}/`
            )}
            className="share-popup"
            shareText={(
              `${props.name} by ` +
              `${get(props.brand, 'name')}.`
            )}
            shareImage={props.image}
            onClickClose={this.closeSharePopup}
          />
        ) : null}

        {this.renderImage()}
        {this.renderTitle()}
      </div>
    )
  }
}
