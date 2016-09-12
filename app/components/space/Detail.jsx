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
import LikesModal from '../modal/Likes'
import SharePopup from '../common/SharePopup'
import LikeButton from '../common/LikeButton'
import MiniProfile from '../user/MiniProfile'
import Notification from '../common/Notification'
import RedesignPopup from './RedesignPopup'
import RedesignsModal from '../modal/Redesigns'
import AddProductCard from '../product/AddCard'
import CommentsWidget from '../comment/Widget'
import SpaceFormModal from '../modal/SpaceForm'
import AddProductModal from '../modal/AddProduct'
import OnboardingModal from '../modal/Onboarding'
import CreateSpaceBanner from '../onboarding/CreateSpaceBanner'
import MaterialDesignIcon from '../common/MaterialDesignIcon'
import addProductModalContainer from '../container/AddProductModal'

import inflect from '../../utils/inflect'
import toStringId from '../../api/utils/toStringId'
import getSuggestions from '../../utils/space/getSuggestions'

class SpaceDetail extends Component {
  static contextTypes = {
    user: PropTypes.object,
    csrf: PropTypes.string,
    currentUserIsOwner: PropTypes.func,
    currentUserIsOnboarding: PropTypes.func
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
      isDeleting: false,
      likesCount: get(props.space, 'likesCount', 0),
      description: get(props.space, 'description', ''),
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
    return `${window.location.origin}/${props.shortUrl}/`
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
    this.setState({
      redesignPopupIsOpen: true
    })
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
    const { props, state } = this

    return (
      <div className="space-detail-header">
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
          {this.renderDesigner()}
          {this.renderActions()}
        </div>
      </div>
    )
  }

  renderDesigner() {
    const { props } = this

    return (
      <MiniProfile user={get(props.space, 'createdBy', {})} />
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
          `${get(props.space, 'name')} — Designed by ` +
          `${get(props.space, 'createdBy.username')}, ` +
          `featuring ${size(get(props.space, 'products', []))} products.`
        )}
        shareImage={get(props.space, 'image')}
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
        spaceType={toStringId(get(props.space, 'spaceType'))}
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
            className="button button--primary button--small button--outline"
          >
            <MaterialDesignIcon name="redesign" />
            Redesign
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
            className="button button--icon button--small button--outline"
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
              url={`/${suggestion.detailUrl}/`}
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

    const spaceType = toLower(get(props.space, 'spaceType.name', 'space'))
    const suggestions = get(props.space, 'spaceType.categories', [])

    return (
      <div className="grid">
        <div id="products" className="grid-items">
          {context.currentUserIsOwner(props.space) ? (
            <AddProductCard
              message={`Add the perfect products for this ${spaceType}.`}
              categories={suggestions}
            />
          ) : null}

          {map(state.products, product =>
            <Product
              {...product}
              key={toStringId(product)}
              mainAction={
                context.currentUserIsOwner(props.space) ? 'remove' : 'add'
              }
              onAddButtonClick={() => props.openAddProductModal(product)}
              onRemoveButtonClick={() => this.removeProduct(product)}
            />
          )}
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
              See All {spaceType}
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
        <CommentsWidget
          parent={toStringId(props.space)}
          parentType="space"
          onCommentAdded={this.onCommentAdded}
          onCommentRemoved={this.onCommentRemoved}
        />
      </div>
    )
  }

  render() {
    const { props, state, context } = this

    return (
      <Layout
        className={classNames({
          'user-is-onboarding': context.currentUserIsOnboarding()
        })}
      >
        {context.currentUserIsOnboarding() ? (
          <CreateSpaceBanner />
        ) : null}

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
          space={props.space}
          onClose={this.closeEditFormModal}
          onSuccess={space => {
            this.setState({
              name: get(space, 'name'),
              description: get(space, 'description'),
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
