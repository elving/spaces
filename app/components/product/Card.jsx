import get from 'lodash/get'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Loader from '../common/Loader'
import Avatar from '../user/Avatar'
import CardTags from '../card/CardTags'
import CardTitle from '../card/CardTitle'
import SharePopup from '../common/SharePopup'
import LikeButton from '../common/LikeButton'
import CuratorBadge from '../user/CuratorBadge'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class ProductCard extends Component {
  static contextTypes = {
    csrf: PropTypes.string,
    userLoggedIn: PropTypes.func
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
    forDisplayOnly: PropTypes.bool,
    onAddButtonClick: PropTypes.func
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
    forDisplayOnly: false,
    onAddButtonClick: (() => {})
  }

  state = {
    imageIsLoaded: false,
    imageIsLoading: true,
    sharePopupIsOpen: false,
    sharePopupIsCreated: false
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

  onImageLoad = () => {
    this.setState({
      imageIsLoaded: true,
      imageIsLoading: false
    })
  }

  getProductUrl = () => {
    const { props } = this
    return `${window.location.origin}/${props.shortUrl}/`
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

        {this.renderPrice()}
      </div>
    )
  }

  renderActions() {
    const { props } = this

    return (
      <div className="product-card-actions card-actions-container">
        <div className="card-actions card-actions--left">
          <button
            type="button"
            onClick={props.onAddButtonClick}
            className="card-action button button--icon"
            data-action="add"
          >
            <MaterialDesignIcon name="add" fill="#2ECC71" />
          </button>
          <LikeButton
            parent={props.id}
            isWhite
            className="card-action"
            parentType="product"
          />
        </div>

        <div className="card-actions card-actions--right">
          <button
            type="button"
            onClick={this.openSharePopup}
            className="card-action share-button button button--icon"
            data-action="send"
          >
            <MaterialDesignIcon name="send" />
          </button>
        </div>
      </div>
    )
  }

  renderPrice() {
    const { props } = this

    return (
      <a
        rel="noopener noreferrer"
        href={props.url}
        target="_blank"
        className={classNames({
          button: true,
          'product-card-price': true,
          'button--primary-outline': true
        })}
      >
        <MaterialDesignIcon name="cart" size={16} color="#2ECC71" />
        {`$${props.price}`}
      </a>
    )
  }

  renderTitle() {
    const { props } = this

    return (
      <CardTitle
        url={props.forDisplayOnly ? '' : `/${props.detailUrl}/`}
        title={props.name}
        subTitle={get(props.brand, 'name')}
        className="product-title"
      />
    )
  }

  renderTags() {
    const { state, props } = this

    return (
      <CardTags
        model={props}
        className="product-tags"
        autoScroll={state.isHovering}
        forDisplayOnly={props.forDisplayOnly}
      />
    )
  }

  renderDesigner() {
    const { props } = this

    return (
      <div className="product-card-designer">
        <Avatar
          user={props.createdBy}
          width={26}
          height={26}
          className="product-card-designer-avatar"
        />
        <span className="product-card-designer-name">
          Added by {' '}
          {!props.forDisplayOnly ? (
            <a
              href={`/${get(props.createdBy, 'detailUrl', '#')}/`}
              className="product-card-designer-link"
            >
              {get(props.createdBy, 'name')}
              <CuratorBadge user={props.createdBy} size={16} />
            </a>
          ) : (
            <span className="product-card-designer-link">
              {get(props.createdBy, 'name')}
              <CuratorBadge user={props.createdBy} size={16} />
            </span>
          )}
        </span>
      </div>
    )
  }

  render() {
    const { props, state } = this

    return (
      <div
        className={classNames({
          product: true,
          'product-card card': true,
          'product-card--popup-open': state.sharePopupIsOpen,
          'product-card--display-only': props.forDisplayOnly
        })}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div className="product-card-overlay" />

        {state.sharePopupIsCreated ? (
          <SharePopup
            url={this.getProductUrl}
            title="Share this product"
            isOpen={state.sharePopupIsOpen}
            className="share-popup"
            onClickClose={this.closeSharePopup}
          />
        ) : null}

        {this.renderImage()}
        {this.renderTitle()}
        {this.renderTags()}
        {this.renderDesigner()}
      </div>
    )
  }
}
