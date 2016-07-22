import get from 'lodash/get'
import map from 'lodash/map'
import ceil from 'lodash/ceil'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Loader from '../common/Loader'
import Space from '../space/Card'
import Product from './Card'
import SharePopup from '../common/SharePopup'
import LikeButton from '../common/LikeButton'
import CardAvatars from '../card/CardAvatars'
import CommentsWidget from '../comment/Widget'
import AddProductModal from '../modal/AddProduct'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import {
  default as addProductModalContainer
} from '../container/AddProductModal'

import getTags from '../../utils/getTags'
import getDomain from '../../utils/getDomain'
import toStringId from '../../api/utils/toStringId'

class ProductDetail extends Component {
  static contextTypes = {
    csrf: PropTypes.string,
    userLoggedIn: PropTypes.func
  };

  static propTypes = {
    product: PropTypes.object,
    relatedProducts: PropTypes.array,
    openAddProductModal: PropTypes.func,
    closeAddProductModal: PropTypes.func,
    addProductModalIsOpen: PropTypes.bool
  };

  static defaultProps = {
    product: {},
    relatedProducts: [],
    openAddProductModal: (() => {}),
    closeAddProductModal: (() => {}),
    addProductModalIsOpen: false
  };

  constructor(props) {
    super(props)

    this.state = {
      imageWidth: '100%',
      imageHeight: '100%',
      imageIsLoaded: false,
      imageIsLoading: true,
      sharePopupIsOpen: false,
      sharePopupIsCreated: false
    }

    this.imageDidLoad = (img) => {
      this.setState({
        imageWidth: get(img, 'width', '100%'),
        imageHeight: get(img, 'height', '100%'),
        imageIsLoaded: true,
        imageIsLoading: false
      })
    }
  }

  componentDidMount() {
    const { props } = this
    const img = new Image()

    img.onload = () => this.imageDidLoad(img)
    img.src = get(props.product, 'image')

    if (img.complete) {
      this.imageDidLoad(img)
    }
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

  renderImage() {
    const { props, state } = this
    const maxWidth = state.imageWidth
    const maxHeight = state.imageHeight


    return (
      <div
        className={classNames({
          'product-detail-image-container': true,
          'product-detail-image-container--loading': state.imageIsLoading
        })}
      >
        {state.imageIsLoading ? (
          <Loader size={50} />
        ) : null}

        {state.imageIsLoaded ? (
          <img
            src={get(props.product, 'image')}
            alt={get(props.product, 'name')}
            title={get(props.product, 'name')}
            style={{ maxWidth, maxHeight }}
            className="product-detail-image"
          />
        ) : null}
      </div>
    )
  }

  renderName() {
    const { props } = this

    return (
      <h1 className="product-detail-name">
        {get(props.product, 'name')}
      </h1>
    )
  }

  renderBrand() {
    const { props } = this

    return (
      <p className="product-detail-brand">
        {`By ${get(props.product, 'brand.name')}`}
      </p>
    )
  }

  renderDescription() {
    const { props } = this
    const description = get(props.product, 'description')

    return !isEmpty(description) ? (
      <p className="product-detail-description">
        {get(props.product, 'name')}
      </p>
    ) : null
  }

  renderLikesCount() {
    const { props } = this
    const lastLikes = get(props.product, 'lastLikes')
    const usersWhoLiked = map(
      get(lastLikes, 'likes'), like => get(like, 'createdBy')
    )

    return (
      <div className="product-detail-likes">
        <CardAvatars
          verb="like"
          users={usersWhoLiked}
          count={get(lastLikes, 'count', 0)}
          action="liked"
          avatarSize={32}
        />
      </div>
    )
  }

  renderCommentsCount() {
    const { props } = this
    const lastComments = get(props.product, 'lastComments')
    const usersWhoCommented = map(
      get(lastComments, 'comments'), comment => get(comment, 'createdBy')
    )

    return (
      <div className="product-detail-comments">
        <CardAvatars
          verb="comment"
          users={usersWhoCommented}
          count={get(lastComments, 'count', 0)}
          action="commented"
          avatarSize={32}
        />
      </div>
    )
  }

  renderTags() {
    const { props } = this

    return (
      <div className="product-detail-tags">
        {map(getTags(props.product), tag =>
          <a
            key={`tag-${toStringId(tag.id)}`}
            href={tag.url}
            className="product-detail-tag"
          >
            <MaterialDesignIcon name={tag.type} size={14} />
            {tag.name}
          </a>
        )}
      </div>
    )
  }

  renderUrl() {
    const { props } = this
    const url = get(props.product, 'url')
    const price = get(props.product, 'price')

    return (
      <a
        href={url}
        target="_blank"
        className="product-detail-url button button--primary"
      >
        <MaterialDesignIcon name="cart" />
        {`$${ceil(price)} on ${getDomain(url)}`}
      </a>
    )
  }

  renderSharePopup() {
    const { props, state } = this

    return state.sharePopupIsCreated ? (
      <SharePopup
        url={() => (
          `${window.location.origin}/${get(props.product, 'shortUrl')}/`
        )}
        title="Share this product"
        isOpen={state.sharePopupIsOpen}
        shareUrl={() => (
          `${window.location.origin}/${get(props.product, 'detailUrl')}/`
        )}
        className="share-popup"
        shareText={(
          `${get(props.product, 'name')} by ` +
          `${get(props.product, 'brand.name')}.`
        )}
        shareImage={get(props.product, 'image')}
        onClickClose={::this.closeSharePopup}
      />
    ) : null
  }

  renderActions() {
    const { props } = this

    return (
      <div className="product-detail-actions">
        <button
          type="button"
          onClick={() => props.openAddProductModal(props.product)}
          className="product-detail-action collect-button button"
          data-action="add"
        >
          <MaterialDesignIcon name="add" />
          Collect
        </button>

        <LikeButton
          size="normal"
          parent={toStringId(props.product)}
          isWhite
          showText
          className="product-detail-action"
          parentType="product"
        />

        <div className="product-detail-action">
          <button
            type="button"
            onClick={::this.openSharePopup}
            className="button button--outline"
          >
            <MaterialDesignIcon name="send" />
            Share
          </button>
          {this.renderSharePopup()}
        </div>
      </div>
    )
  }

  renderContent() {
    return (
      <div className="product-detail-content">
        {this.renderName()}
        {this.renderBrand()}
        {this.renderDescription()}
        {this.renderLikesCount()}
        {this.renderCommentsCount()}
        {this.renderTags()}
        {this.renderUrl()}
        {this.renderActions()}
      </div>
    )
  }

  renderProduct() {
    return (
      <div className="product-detail">
        <div className="product-detail-inner">
          {this.renderImage()}
          {this.renderContent()}
        </div>
      </div>
    )
  }

  renderRelatedProducts() {
    const { props } = this

    return (
      <div className="grid-container">
        <h3 className="grid-title">Related Products</h3>
        <div className="grid">
          <div className="grid-items">
            {map(props.relatedProducts, product =>
              <Product
                {...product}
                key={toStringId(product)}
                onAddButtonClick={() => props.openAddProductModal(product)}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  renderRelatedSpaces() {
    const { props } = this

    return (
      <div className="grid-container">
        <h3 className="grid-title">Spaces featuring this product</h3>
        <div className="grid">
          <div className="grid-items">
            {map(props.relatedSpaces, space =>
              <Space {...space} key={toStringId(space)} />
            )}
          </div>
        </div>
      </div>
    )
  }

  renderComments() {
    const { props } = this

    return (
      <div id="comments">
        <CommentsWidget
          parent={toStringId(props.product)}
          parentType="product"
        />
      </div>
    )
  }

  render() {
    const { props } = this

    return (
      <Layout>
        <AddProductModal
          product={props.addProductModalCurrent}
          onClose={props.closeAddProductModal}
          isVisible={props.addProductModalIsOpen}
        />

        {this.renderProduct()}

        <div className="grids">
          {!isEmpty(props.relatedProducts)
            ? this.renderRelatedProducts()
            : null
          }

          {!isEmpty(props.relatedSpaces)
            ? this.renderRelatedSpaces()
            : null
          }
        </div>

        {this.renderComments()}
      </Layout>
    )
  }
}

export default addProductModalContainer(
  ProductDetail
)