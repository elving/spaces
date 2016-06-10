import get from 'lodash/get'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import Loader from '../common/Loader'
import Avatar from '../user/Avatar'
import CardTags from '../card/CardTags'
import CardTitle from '../card/CardTitle'
import SharePopup from '../common/SharePopup'
import SpacesPopup from './SpacesPopup'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class ProductCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imageIsLoaded: false,
      imageIsLoading: false,
      sharePopupIsOpen: false,
      spacesPopupIsOpen: false,
      sharePopupIsCreated: false,
      spacesPopupIsCreated: false
    }
  }

  static contextTypes = {
    csrf: Type.string,
    userLoggedIn: Type.func
  };

  static propTypes = {
    id: Type.string,
    url: Type.string,
    name: Type.string,
    brand: Type.object,
    image: Type.string,
    price: Type.number,
    colors: Type.array,
    createdBy: Type.object,
    categories: Type.array,
    spaceTypes: Type.array
  };

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
    spaceTypes: []
  };

  componentDidMount() {
    const { image } = this.props
    const imagePreloader = new Image()

    const onImageLoad = () => {
      this.setState({
        imageIsLoaded: true,
        imageIsLoading: false
      })
    }

    this.setState({
      imageIsLoading: true
    }, () => {
      imagePreloader.onload = onImageLoad
      imagePreloader.src = image

      if (imagePreloader.complete) {
        onImageLoad()
      }
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

  openSpacesPopup() {
    const { spacesPopupIsCreated } = this.state

    if (!spacesPopupIsCreated) {
      this.setState({
        spacesPopupIsOpen: true,
        spacesPopupIsCreated: true
      })
    } else {
      this.setState({
        spacesPopupIsOpen: true
      })
    }
  }

  closeSpacesPopup() {
    this.setState({
      spacesPopupIsOpen: false
    })
  }

  renderImage() {
    const { name, image } = this.props
    const { imageIsLoaded, imageIsLoading } = this.state

    return (
      <div
        className={classNames({
          'product-card-image-container': true,
          'product-card-image-container--loading': imageIsLoading
        })}>
        {this.renderActions()}

        {imageIsLoading ? (
          <Loader size={50}/>
        ) : null}

        {imageIsLoaded ? (
          <div
            title={name}
            style={{ backgroundImage: `url(${image})` }}
            className="product-card-image"/>
        ) : null}

        {this.renderPrice()}
      </div>
    )
  }

  renderActions() {
    const { detailUrl } = this.props

    return (
      <div className="product-card-actions card-actions-container">
        <a href={`/${detailUrl}/`} className="card-actions-overlay"/>

        <div className="card-actions card-actions--left">
          <button
            type="button"
            onClick={::this.openSpacesPopup}
            className="card-action button button--icon"
            data-action="add">
            <MaterialDesignIcon name="add" fill="#2ECC71"/>
          </button>
          <button
            type="button"
            className="card-action button button--icon"
            data-action="like">
            <MaterialDesignIcon name="like" fill="#E74C3C"/>
          </button>
        </div>

        <div className="card-actions card-actions--right">
          <button
            type="button"
            onClick={::this.openSharePopup}
            className="card-action button button--icon"
            data-action="send">
            <MaterialDesignIcon name="send"/>
          </button>
        </div>
      </div>
    )
  }

  renderPrice() {
    const { url, price } = this.props

    return (
      <a
        href={url}
        target="_blank"
        className={classNames({
          'button': true,
          'button--primary-outline': true,
          'product-card-price': true
        })}>
        <MaterialDesignIcon name="cart" size={16} color="#2ECC71"/>
        {`$${price}`}
      </a>
    )
  }

  renderTitle() {
    const { name, brand, detailUrl } = this.props

    return (
      <CardTitle
        url={`/${detailUrl}/`}
        title={name}
        subTitle={get(brand, 'name')}
        className="product-title"/>
    )
  }

  renderTags() {
    const { colors, spaceTypes, categories } = this.props

    return (
      <CardTags
        tags={[spaceTypes, categories, colors]}
        className="product-tags"/>
    )
  }

  renderDesigner() {
    const { createdBy } = this.props

    return (
      <div className="product-card-designer">
        <Avatar
          width={30}
          height={30}
          imageUrl={get(createdBy, 'avatar', '')}
          initials={get(createdBy, 'initials', '')}
          className="product-card-designer-avatar"/>
        <span className="product-card-designer-name">
          Added by <a
            href={`/${get(createdBy, 'detailUrl', '#')}/`}
            className="product-card-designer-link">
            {get(createdBy, 'name')}
          </a>
        </span>
      </div>
    )
  }

  render() {
    const { id } = this.props

    const {
      sharePopupIsOpen,
      spacesPopupIsOpen,
      sharePopupIsCreated,
      spacesPopupIsCreated
    } = this.state

    return (
      <div
        className={classNames({
          'product': true,
          'product-card card': true,
          'product-card--popup-open': (
            sharePopupIsOpen ||
            spacesPopupIsOpen
          )
        })}>
        <div className="product-card-overlay"/>

        {spacesPopupIsCreated ? (
          <SpacesPopup
            isOpen={spacesPopupIsOpen}
            className="spaces-popup"
            productId={id}
            onClickClose={::this.closeSpacesPopup}/>
        ) : null}

        {sharePopupIsCreated ? (
          <SharePopup
            title="Share this product"
            isOpen={sharePopupIsOpen}
            className="share-popup"
            onClickClose={::this.closeSharePopup}/>
        ) : null}

        {this.renderImage()}
        {this.renderTitle()}
        {this.renderTags()}
        {this.renderDesigner()}
      </div>
    )
  }
}
