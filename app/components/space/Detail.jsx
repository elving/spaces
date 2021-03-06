/* eslint-disable no-alert */
import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import filter from 'lodash/filter'
import without from 'lodash/without'
import isEmpty from 'lodash/isEmpty'
import toLower from 'lodash/toLower'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Dropdown, {
  DropdownTrigger,
  DropdownContent
} from 'react-simple-dropdown'

import Tag from '../common/Tag'
import Space from '../space/Card'
import Layout from '../common/Layout'
import Product from '../product/Card'
import Comments from '../comment/Comments'
import LikesModal from '../modal/Likes'
import SharePopup from '../common/SharePopup'
import LikeButton from '../common/LikeButton'
import MiniProfile from '../user/MiniProfile'
import Notification from '../common/Notification'
import RedesignPopup from './RedesignPopup'
import RedesignsModal from '../modal/Redesigns'
import AddProductCard from '../product/AddCard'
import SpaceFormModal from '../modal/SpaceForm'
import AddProductModal from '../modal/AddProduct'
import OnboardingModal from '../modal/Onboarding'
import MaterialDesignIcon from '../common/MaterialDesignIcon'
import addProductModalContainer from '../container/AddProductModal'

import inflect from '../../utils/inflect'
import toStringId from '../../api/utils/toStringId'
import getSuggestions from '../../utils/space/getSuggestions'

class SpaceDetail extends Component {
  static contextTypes = {
    user: PropTypes.object,
    csrf: PropTypes.string,
    userLoggedIn: PropTypes.func,
    currentUserIsOwner: PropTypes.func
  }

  static propTypes = {
    space: PropTypes.object,
    location: PropTypes.object,
    otherSpacesInRoom: PropTypes.array,
    openAddProductModal: PropTypes.func,
    closeAddProductModal: PropTypes.func,
    addProductModalIsOpen: PropTypes.bool,
    createAddProductModal: PropTypes.bool
  }

  static defaultProps = {
    space: {},
    location: {},
    otherSpacesInRoom: [],
    openAddProductModal: (() => {}),
    closeAddProductModal: (() => {}),
    addProductModalIsOpen: false,
    createAddProductModal: false
  }

  constructor(props) {
    super(props)

    this.state = {
      name: get(props.space, 'name', ''),
      products: get(props.space, 'products', []),
      coverImage: get(props.space, 'coverImage', ''),
      isDeleting: false,
      likesCount: get(props.space, 'likesCount', 0),
      description: get(props.space, 'description', ''),
      updatedSpace: props.space,
      commentsCount: get(props.space, 'commentsCount', 0),
      redesignsCount: get(props.space, 'redesignsCount', 0),
      editSuccessful: false,
      editModalIsOpen: false,
      createEditModal: false,
      likesModalIsOpen: false,
      createLikesModal: false,
      sharePopupIsOpen: false,
      sharePopupIsCreated: false,
      redesignPopupIsOpen: false,
      redesignsModalIsOpen: false,
      createRedesignsModal: false,
      onboardingModalIsOpen: get(props.location, 'query.onboarding') === '1'
    }
  }

  onModalOpen = () => {
    document.body.classList.add('ReactModal__Body--open')
  }

  onOnboardingClose = () => {
    this.setState({
      onboardingModalIsOpen: false
    })
  }

  onLikesCounterClick = (event) => {
    event.preventDefault()
    this.openLikesModal()
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

  onRedesignsCounterClick = (event) => {
    event.preventDefault()
    this.openRedesignsModal()
  }

  onCommentAdded = () => {
    const { state } = this

    this.setState({
      commentsCount: state.commentsCount + 1
    })
  }

  onCommentRemoved = () => {
    const { state } = this

    this.setState({
      commentsCount: state.commentsCount - 1
    })
  }

  onCloseNotification = () => {
    this.setState({
      editSuccessful: false
    })
  }

  getShortUrl = () => {
    const { props } = this
    return `${window.location.origin}/${get(props.space, 'shortUrl')}/`
  }

  getDetailUrl = () => {
    const { props } = this
    return `${window.location.origin}/${props.detailUrl}/`
  }

  removeProduct(productToRemove) {
    const { props, state, context } = this

    const productId = toStringId(productToRemove)
    const productIds = map(state.products, product => toStringId(product))

    const removeMessage = (
      'Are you sure you want to remove this product? \n' +
      'This action cannot be undone. '
    )

    if (window.confirm(removeMessage)) {
      this.setState({
        products: filter(state.products, product =>
          toStringId(product) !== productId
        )
      })

      axios.put(`/ajax/spaces/${toStringId(props.space)}/`, {
        _csrf: context.csrf,
        products: without(productIds, productId)
      })
    }
  }

  delete = () => {
    const { props, context } = this

    const deleteMessage = (
      'Are you sure you want to delete this space? \n' +
      'This action cannot be undone. ' +
      'Type the word "DELETE" to confirm.'
    )

    if (window.confirm(deleteMessage)) {
      this.setState({
        isDeleting: true
      }, () => {
        axios
          .post(`/ajax/spaces/${toStringId(props.space)}/`, {
            _csrf: context.csrf,
            _method: 'delete'
          })
          .then(() => {
            window.location.href = '/spaces/'
          })
          .catch(({ response }) => {
            this.setState({
              errors: get(response, 'data.err', {}),
              isDeleting: false
            })
          })
      })
    }
  }

  openRedesignPopup = () => {
    const { context } = this

    if (context.userLoggedIn()) {
      this.setState({
        redesignPopupIsOpen: true
      })
    } else {
      window.location.href = '/login/'
    }
  }

  closeRedesignPopup = () => {
    this.setState({
      redesignPopupIsOpen: false
    })
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

  openLikesModal = () => {
    this.setState({
      likesModalIsOpen: true,
      createLikesModal: true
    })
  }

  closeLikesModal = () => {
    this.setState({
      likesModalIsOpen: false
    })
  }

  openRedesignsModal = () => {
    this.setState({
      redesignsModalIsOpen: true,
      createRedesignsModal: true
    })
  }

  closeRedesignsModal = () => {
    this.setState({
      redesignsModalIsOpen: false
    })
  }

  openEditFormModal = () => {
    this.setState({
      editModalIsOpen: true,
      createEditModal: true
    })
  }

  closeEditFormModal = () => {
    this.setState({
      editModalIsOpen: false
    })
  }

  renderHeader() {
    const { props, state, context } = this

    const coverImage = state.coverImage
    const hasCoverImage = !isEmpty(coverImage)

    return (
      <div
        style={{
          backgroundImage: `url(${coverImage})`
        }}
        className={classNames({
          'space-detail-header': true,
          'space-detail-header--has-cover': hasCoverImage
        })}
      >
        <h1 className="space-detail-header-title">
          <small className="space-detail-header-pre-title">
            {get(props.space, 'spaceType.name', 'Space')}
          </small>
          {state.name}
        </h1>
        {!isEmpty(state.description) ? (
          <p className="space-detail-description">
            {state.description}
          </p>
        ) : null}
        {this.renderCounters()}
        {context.currentUserIsOwner(props.space) ? (
          <div className="space-detail-cover-actions">
            <button
              type="button"
              onClick={this.openEditFormModal}
              className="button button--tiny button--primary-alt"
            >
              <span className="button-text">
                <MaterialDesignIcon name="image" />
                {hasCoverImage
                  ? 'Change Cover Photo'
                  : 'Add Cover Photo'
                }
              </span>
            </button>
          </div>
        ) : null}
      </div>
    )
  }

  renderCounters() {
    const { props, state } = this
    const productsCount = size(get(props.space, 'products', []))

    return (
      <div className="space-detail-counters">
        {productsCount ? (
          <a
            href="#products"
            className="space-detail-counter"
            data-action="products"
          >
            <div className="space-detail-counter-number">
              {productsCount}
            </div>
            <div className="space-detail-counter-text">
              {inflect(productsCount, 'Product')}
            </div>
          </a>
        ) : null}
        {state.redesignsCount ? (
          <button
            type="button"
            onClick={this.onRedesignsCounterClick}
            className="space-detail-counter"
            data-action="redesigns"
          >
            <div className="space-detail-counter-number">
              {state.redesignsCount}
            </div>
            <div className="space-detail-counter-text">
              {inflect(state.redesignsCount, 'Redesign')}
            </div>
          </button>
        ) : null}
        {state.likesCount ? (
          <button
            type="button"
            onClick={this.onLikesCounterClick}
            className="space-detail-counter"
            data-action="likes"
          >
            <div className="space-detail-counter-number">
              {state.likesCount}
            </div>
            <div className="space-detail-counter-text">
              {inflect(state.likesCount, 'Like')}
            </div>
          </button>
        ) : null}
        {state.commentsCount ? (
          <a
            href="#comments"
            className="space-detail-counter"
            data-action="comments"
          >
            <div className="space-detail-counter-number">
              {state.commentsCount}
            </div>
            <div className="space-detail-counter-text">
              {inflect(state.commentsCount, 'Comment')}
            </div>
          </a>
        ) : null}
      </div>
    )
  }

  renderSubHeader() {
    return (
      <div className="space-detail-subheader-container">
        <div className="space-detail-subheader">
          {this.renderUser()}
          {this.renderActions()}
        </div>
      </div>
    )
  }

  renderUser() {
    const { props } = this

    return (
      <MiniProfile user={get(props.space, 'createdBy', {})} />
    )
  }

  renderSharePopup() {
    const { props, state } = this

    return state.sharePopupIsCreated ? (
      <SharePopup
        url={() => (
          `${window.location.origin}/${get(props.space, 'detailUrl')}/`
        )}
        title="Share this space"
        isOpen={state.sharePopupIsOpen}
        shareUrl={() => (
          `${window.location.origin}/${get(props.space, 'shortUrl')}/`
        )}
        className="share-popup"
        shareText={(
          `${get(props.space, 'name')} — Designed by ` +
          `${get(props.space, 'createdBy.username')}, ` +
          `featuring ${size(get(props.space, 'products', []))} products.`
        )}
        shareImage={get(props.space, 'shareImage')}
        onClickClose={this.closeSharePopup}
      />
    ) : null
  }

  renderRedesignPopup() {
    const { props, state } = this

    return (
      <RedesignPopup
        isOpen={state.redesignPopupIsOpen}
        spaceId={toStringId(props.space)}
        spaceType={get(props.space, 'spaceType')}
        className="redesign-popup"
        onClickClose={this.closeRedesignPopup}
      />
    )
  }

  renderActions() {
    const { props, state, context } = this

    return (
      <div className="space-detail-actions">
        <div className="space-detail-action">
          <button
            type="button"
            onClick={this.openRedesignPopup}
            className={classNames({
              button: true,
              'button--small': true,
              'popup-trigger': true,
              'button--outline': true,
              'button--primary': true
            })}
            data-action="redesign"
          >
            <span className="button-text">
              <MaterialDesignIcon name="redesign" />
              Redesign
            </span>
          </button>
          {this.renderRedesignPopup()}
        </div>
        <LikeButton
          parent={toStringId(props.space)}
          onLike={this.onLike}
          onUnlike={this.onUnlike}
          className="space-detail-action button--outline"
          parentType="space"
        />
        <div className="space-detail-action">
          <button
            type="button"
            onClick={this.openSharePopup}
            className={classNames({
              button: true,
              'button--icon': true,
              'button--small': true,
              'popup-trigger': true,
              'button--outline': true
            })}
            data-action="share"
          >
            <MaterialDesignIcon name="send" fill="#439fe0" />
          </button>
          {this.renderSharePopup()}
        </div>
        <a
          href="#comments"
          className={(
            'space-detail-action ' +
            'button button--icon button--small button--outline'
          )}
        >
          <MaterialDesignIcon name="comment" />
        </a>
        {context.currentUserIsOwner(props.space) ? (
          <Dropdown className="dropdown space-detail-action">
            <DropdownTrigger
              className="dropdown-trigger dropdown-trigger--no-caret"
            >
              <button
                type="button"
                className="button button--icon button--small button--outline"
              >
                <MaterialDesignIcon name="settings" />
              </button>
            </DropdownTrigger>
            <DropdownContent className="dropdown-content">
              <button
                type="button"
                onClick={this.openEditFormModal}
                disabled={state.isDeleting}
                className="dropdown-link"
              >
                Edit <MaterialDesignIcon name="edit" />
              </button>
              <button
                type="button"
                onClick={this.delete}
                disabled={state.isDeleting}
                className="dropdown-link"
              >
                {state.isDeleting ? 'Deleting...' : 'Delete'}
                <MaterialDesignIcon name="delete" />
              </button>
            </DropdownContent>
          </Dropdown>
        ) : null}
      </div>
    )
  }

  renderSuggestions() {
    const { props, context } = this

    const spaceType = toLower(get(props.space, 'spaceType.name', 'space'))
    const suggestions = getSuggestions(props.space)

    return context.currentUserIsOwner(props.space) && !isEmpty(suggestions) ? (
      <div className="space-detail-suggestion">
        <h3 className="space-detail-suggestion-title">
          Here are some suggestions for your {spaceType}.
        </h3>
        <div className="space-detail-suggestions">
          {map(suggestions, suggestion =>
            <Tag
              key={`suggestion-${toStringId(suggestion)}`}
              url={`/${suggestion.detailUrl}/?show=products`}
              type={suggestion.type}
              name={suggestion.name}
              size="big"
              className="product-detail-tag"
            />
          )}
        </div>
      </div>
    ) : null
  }

  renderProducts() {
    const { props, state, context } = this

    const isOwner = context.currentUserIsOwner(props.space)
    const spaceType = toLower(get(props.space, 'spaceType.name', 'space'))
    const suggestions = get(props.space, 'spaceType.categories', [])

    return (
      <div className="grid">
        <div id="products" className="grid-items">
          {isOwner ? (
            <AddProductCard
              message={`Add the perfect products for this ${spaceType}.`}
              categories={suggestions}
            />
          ) : null}

          {!isEmpty(state.products) ? (
            map(state.products, product =>
              <Product
                {...product}
                key={toStringId(product)}
                mainAction={
                  context.currentUserIsOwner(props.space) ? 'remove' : 'add'
                }
                onAddButtonClick={() => props.openAddProductModal(product)}
                onRemoveButtonClick={() => this.removeProduct(product)}
              />
            )
          ) : null}

          {!isOwner && isEmpty(state.products) ? (
            <div className="space-detail-empty">
              No products in this space yet...
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  renderOtherSpacesInRoom() {
    const { props } = this
    const spaceType = `${get(props.space, 'spaceType.name')}s`

    return !isEmpty(props.otherSpacesInRoom) ? (
      <div id="otherSpaces" className="grids">
        <div className="grid-container">
          <div className="grid-title-container">
            <h3 className="grid-title">
              Other {spaceType}
            </h3>
            <a
              href={`/${get(props.space, 'spaceType.detailUrl')}/`}
              className="button button--small button--outline"
            >
              <span className="button-text">
                See All {spaceType}
              </span>
            </a>
          </div>
          <div className="grid-items">
            {map(props.otherSpacesInRoom, space =>
              <Space key={toStringId(space)} {...space} />
            )}
          </div>
        </div>
      </div>
    ) : null
  }

  renderLikesModal() {
    const { props, state } = this

    return state.createLikesModal ? (
      <LikesModal
        parent={toStringId(props.space)}
        onClose={this.closeLikesModal}
        isVisible={state.likesModalIsOpen}
        parentType="space"
      />
    ) : null
  }

  renderRedesignsModal() {
    const { props, state } = this

    return state.createRedesignsModal ? (
      <RedesignsModal
        parent={toStringId(props.space)}
        onClose={this.closeRedesignsModal}
        isVisible={state.redesignsModalIsOpen}
      />
    ) : null
  }

  renderComments() {
    const { props } = this

    return (
      <div id="comments">
        <Comments
          parent={toStringId(props.space)}
          parentType="space"
          onCommentAdded={this.onCommentAdded}
          onCommentRemoved={this.onCommentRemoved}
        />
      </div>
    )
  }

  render() {
    const { props, state } = this

    return (
      <Layout>
        <Notification
          type="success"
          timeout={3500}
          onClose={this.onCloseNotification}
          isVisible={state.editSuccessful}
        >
          Space updated successfully
        </Notification>

        <OnboardingModal
          room={get(props.space, 'spaceType.name', 'space')}
          onClose={this.onOnboardingClose}
          isVisible={state.onboardingModalIsOpen}
          categories={get(props.space, 'categories', [])}
          onAfterOpen={this.onModalOpen}
        />

        <AddProductModal
          product={props.addProductModalCurrent}
          onClose={props.closeAddProductModal}
          isVisible={props.addProductModalIsOpen}
          onAfterOpen={this.onModalOpen}
        />

        <SpaceFormModal
          space={state.updatedSpace}
          onClose={this.closeEditFormModal}
          onSuccess={space => {
            this.setState({
              name: get(space, 'name'),
              coverImage: get(space, 'coverImage'),
              description: get(space, 'description'),
              updatedSpace: space,
              editSuccessful: true,
              editModalIsOpen: false
            })
          }}
          isVisible={state.editModalIsOpen}
          formMethod="PUT"
          onAfterOpen={this.onModalOpen}
        />

        <div className="space-detail">
          {this.renderHeader()}
          {this.renderSubHeader()}
          {this.renderSuggestions()}
          {this.renderProducts()}
          {this.renderLikesModal()}
          {this.renderRedesignsModal()}
          {this.renderOtherSpacesInRoom()}
          {this.renderComments()}
        </div>
      </Layout>
    )
  }
}

export default addProductModalContainer(SpaceDetail)
