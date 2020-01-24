import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import ceil from 'lodash/ceil'
import slice from 'lodash/slice'
import concat from 'lodash/concat'
import uniqBy from 'lodash/uniqBy'
import isEmpty from 'lodash/isEmpty'
import ReactGA from 'react-ga'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Tag from '../common/Tag'
import Space from '../space/Card'
import Layout from '../common/Layout'
import Avatar from '../user/Avatar'
import Loader from '../common/Loader'
import Product from './Card'
import Comments from '../comment/Comments'
import SharePopup from '../common/SharePopup'
import LikeButton from '../common/LikeButton'
import AddProductModal from '../modal/AddProduct'
import MaterialDesignIcon from '../common/MaterialDesignIcon'
import addProductModalContainer from '../container/AddProductModal'

import getTags from '../../utils/getTags'
import getDomain from '../../utils/getDomain'
import isCurator from '../../utils/user/isCurator'
import toStringId from '../../api/utils/toStringId'

class ProductDetail extends Component {
  static contextTypes = {
    user: PropTypes.object,
    csrf: PropTypes.string,
    userLoggedIn: PropTypes.func,
    currentUserIsAdmin: PropTypes.func
  }

  static propTypes = {
    product: PropTypes.object,
    moreFromBrand: PropTypes.array,
    relatedProducts: PropTypes.array,
    openAddProductModal: PropTypes.func,
    closeAddProductModal: PropTypes.func,
    addProductModalIsOpen: PropTypes.bool
  }

  static defaultProps = {
    product: {},
    moreFromBrand: [],
    relatedProducts: [],
    openAddProductModal: (() => {}),
    closeAddProductModal: (() => {}),
    addProductModalIsOpen: false
  }

  state = {
    imageWidth: '100%',
    imageHeight: '100%',
    imageIsLoaded: false,
    imageIsLoading: true,
    sharePopupIsOpen: false,
    sharePopupIsCreated: false
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

  imageDidLoad = (img) => {
    this.setState({
      imageWidth: get(img, 'width', '100%'),
      imageHeight: get(img, 'height', '100%'),
      imageIsLoaded: true,
      imageIsLoading: false
    })
  }

  openAddModal = () => {
    const { props, context } = this

    if (context.userLoggedIn()) {
      props.openAddProductModal(props.product)
    } else {
      window.location.href = '/login/'
    }
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

  renderImage() {
    const { props, state, context } = this

    return (
      <div
        className={classNames({
          'product-detail-image-container': true,
          'product-detail-image-container--loading': state.imageIsLoading
        })}
      >
        {context.currentUserIsAdmin() ? (
          <a
            href={`/products/${get(props.product, 'sid')}/update/`}
            className="button button--primary button--small"
            data-action="editProduct"
          >
            <span className="button-text">
              <MaterialDesignIcon name="edit" />
              Edit
            </span>
          </a>
        ) : null}

        {state.imageIsLoading ? (
          <Loader size={50} />
        ) : null}

        {state.imageIsLoaded ? (
          <img
            src={get(props.product, 'image')}
            alt={get(props.product, 'name')}
            title={get(props.product, 'name')}
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
    const createdBy = get(props.product, 'createdBy', {})

    return (
      <p className="product-detail-brand">
        {`By ${get(props.product, 'brand.name')}`}
        {` · ${isCurator(createdBy) ? 'Curated' : 'Recommended'} by `}
        <a
          href={`/${get(props.product, 'createdBy.detailUrl')}/`}
          className="product-detail-curator"
        >
          @{get(props.product, 'createdBy.username')}
        </a>
      </p>
    )
  }

  renderCommentCTA() {
    const comments = get(this.props, 'product.commentsCount', 0)

    return (
      <a href="#comments" className="product-detail-comment-cta">
        <MaterialDesignIcon name="comment" />
        {comments === 1 || !comments ? 'Join the discussion' : null}
        {comments ? `Join ${comments} others in the discussion` : null}
      </a>
    )
  }

  renderInfo() {
    const { props } = this
    const note = get(props.product, 'note')
    const otherImages = get(props.product, 'otherImages', [])
    const description = get(props.product, 'description')
    const hasBoth = !isEmpty(description) && !isEmpty(note)

    return !isEmpty(description) || !isEmpty(note) ? (
      <div
        className={classNames({
          'product-detail-info-container': true,
          'product-detail-info-container--has-both': hasBoth
        })}
      >
        {!isEmpty(description) ? (
          <div id="about" className="product-detail-info">
            <h3 className="product-detail-info-title">About this product</h3>
            <p className="product-detail-info-text">
              {description}
            </p>
          </div>
        ) : null}
        {isEmpty(note) && !isEmpty(otherImages) ? (
          this.renderotherImages()
        ) : null}
        {!isEmpty(note) ? (
          <div
            className={classNames({
              'product-detail-info': true,
              'product-detail-info--has-images': !isEmpty(otherImages)
            })}
          >
            {this.renderotherImages()}
            <div id="note" className="product-detail-info-content">
              <h3 className="product-detail-info-title">From the curator</h3>
              <p className="product-detail-info-text">
                {note}
              </p>
              <a
                href={`/${get(props.product, 'createdBy.detailUrl')}/products/`}
                className={
                  'button button--primary-alt product-detail-info-button'
                }
              >
                <span className="button-text">
                  More from @{get(props.product, 'createdBy.username')}
                </span>
              </a>
            </div>
          </div>
        ) : null}
      </div>
    ) : null
  }

  renderotherImages() {
    const { props } = this
    const otherImages = get(props, 'product.otherImages', [])
    const otherImagesLength = size(otherImages)

    if (!otherImagesLength) {
      return null
    }

    return otherImagesLength >= 2 ? (
      <div
        className="product-detail-info-images"
        data-images={otherImagesLength}
      >
        <div
          style={{ backgroundImage: `url(${otherImages[0]})` }}
          className="product-detail-info-image"
        />
        <div className="product-detail-info-images-grid">
          {map(slice(otherImages, 1, otherImagesLength), image =>
            <div
              style={{ backgroundImage: `url(${image})` }}
              className="product-detail-info-image"
            />
          )}
        </div>
      </div>
    ) : (
      <div
        className="product-detail-info-images"
        data-images={otherImagesLength}
      >
        {map(otherImages, image =>
          <div
            style={{ backgroundImage: `url(${image})` }}
            className="product-detail-info-image"
          />
        )}
      </div>
    )
  }

  renderActivity() {
    const { props } = this

    const lastLikes = get(props.product, 'lastLikes')
    const likesCount = get(lastLikes, 'count', 0)
    const usersWhoLiked = map(get(lastLikes, 'likes'), like => {
      const user = get(like, 'createdBy', {})
      return { ...user, activity: 'like' }
    })

    const lastComments = get(props.product, 'lastComments')
    const commentsCount = get(lastComments, 'count', 0)
    const usersWhoCommented = uniqBy(
      map(get(lastComments, 'comments'), comment => {
        const user = get(comment, 'createdBy', {})
        return { ...user, activity: 'comment' }
      }), 'id'
    )

    const hasActivity = likesCount || commentsCount
    const activityCount = (
      (likesCount + commentsCount) -
      (size(usersWhoLiked) + size(usersWhoCommented))
    )
    const activityUsers = concat([], usersWhoLiked, usersWhoCommented)

    return hasActivity ? (
      <div className="product-detail-activity">
        <div className="product-detail-activity-users">
          {map(activityUsers, user =>
            <a
              rel="noopener noreferrer"
              key={`product-activity-${toStringId(user)}-${user.activity}`}
              href={`/${get(user, 'detailUrl')}/`}
              target="_blank"
              className="product-detail-activity-user"
              data-activity={user.activity}
            >
              <Avatar
                user={user}
                width={34}
                height={34}
                className="product-detail-activity-avatar"
              />
              <span className="product-detail-activity-icon-container">
                <MaterialDesignIcon
                  name={user.activity}
                  size={10}
                  className="product-detail-activity-icon"
                />
              </span>
            </a>
          )}
          {activityCount ? (
            <div className="product-detail-activity-count">
              +{activityCount}
            </div>
          ) : null}
        </div>
      </div>
    ) : null
  }

  renderTags() {
    const { props } = this

    return (
      <div className="product-detail-tags">
        {map(getTags(props.product), tag =>
          <Tag
            key={`tag-${toStringId(tag)}`}
            url={tag.url}
            type={tag.type}
            name={tag.name}
            size="medium"
            className="product-detail-tag"
          />
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
        rel="noreferrer noopener"
        href={url}
        target="_blank"
        onClick={() => {
          ReactGA.outboundLink({
            label: `product-detail-${props.id}`
          }, () => {})
        }}
        className="product-detail-url button button--primary"
      >
        <span className="button-text">
          <MaterialDesignIcon name="cart" />
          <span className="product-detail-url-text">
            {`$${ceil(price)}`}
          </span>
          <span className="product-detail-url-text-full">
            {`$${ceil(price)} on ${getDomain(url)}`}
          </span>
        </span>
      </a>
    )
  }

  renderSharePopup() {
    const { props, state } = this

    return state.sharePopupIsCreated ? (
      <SharePopup
        url={() => (
          `${window.location.origin}/${get(props.product, 'detailUrl')}/`
        )}
        title="Share this product"
        isOpen={state.sharePopupIsOpen}
        shareUrl={() => (
          `${window.location.origin}/${get(props.product, 'shortUrl')}/`
        )}
        className="share-popup"
        shareText={(
          `${get(props.product, 'name')} by ` +
          `${get(props.product, 'brand.name')}.`
        )}
        shareImage={get(props.product, 'image')}
        onClickClose={this.closeSharePopup}
      />
    ) : null
  }

  renderActions() {
    const { props } = this

    return (
      <div className="product-detail-actions">
        <button
          type="button"
          onClick={this.openAddModal}
          className="product-detail-action collect-button button"
          data-action="add"
        >
          <span className="button-text">
            <MaterialDesignIcon name="check-simple" />
            Add to space
          </span>
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
            onClick={this.openSharePopup}
            className="button share-button popup-trigger"
          >
            <span className="button-text">
              <MaterialDesignIcon name="send" />
              Share
            </span>
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
        {this.renderActivity()}
        {this.renderTags()}
        {this.renderUrl()}
        {this.renderActions()}
      </div>
    )
  }

  renderProduct() {
    return (
      <div
        ref={productDetail => {
          this.productDetail = productDetail
        }}
        className="product-detail"
      >
        <div className="product-detail-inner">
          {this.renderImage()}
          {this.renderContent()}
        </div>
      </div>
    )
  }

  renderMoreFromBrand() {
    const { props } = this

    return (
      <div className="grid-container">
        <h3 className="grid-title">
          More from {get(props.product, 'brand.name')}
        </h3>
        <div className="grid">
          <div className="grid-items">
            {map(props.moreFromBrand, product =>
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
        <Comments
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
        {this.renderCommentCTA()}
        {this.renderInfo()}

        <div className="grids">
          {!isEmpty(props.relatedSpaces)
            ? this.renderRelatedSpaces()
            : null
          }

          {!isEmpty(props.relatedProducts)
            ? this.renderRelatedProducts()
            : null
          }

          {!isEmpty(props.moreFromBrand)
            ? this.renderMoreFromBrand()
            : null
          }
        </div>

        {this.renderComments()}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: (`
              {
                "@context": "http://schema.org/",
                "@type": "Product",
                "name": ${get(props, 'product.name')},
                "image": ${get(props, 'product.image')},
                "description": ${get(props, 'product.description')},
                "brand": {
                  "@type": "Thing",
                  "name": ${get(props, 'product.brand.name')}
                },
                "offers": {
                  "@type": "Offer",
                  "priceCurrency": "USD",
                  "price": ${get(props, 'product.price')},
                  "seller": {
                    "@type": "Organization",
                    "name": ${get(props, 'product.brand.name')}
                  }
                }
              }
            `)
          }}
        />

      </Layout>
    )
  }
}

export default addProductModalContainer(
  ProductDetail
)
