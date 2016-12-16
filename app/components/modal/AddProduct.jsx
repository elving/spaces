import get from 'lodash/get'
import map from 'lodash/map'
import axios from 'axios'
import Modal from 'react-modal'
import assign from 'lodash/assign'
import concat from 'lodash/concat'
import without from 'lodash/without'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Loader from '../common/Loader'
import SpaceForm from '../space/Form'
import ProductCard from '../product/Card'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'
import productInSpace from '../../utils/product/productInSpace'
import searchCollection from '../../utils/searchCollection'
import createProductsHash from '../../utils/space/createProductsHash'

const overrideDefaultStyles = {
  overlay: { backgroundColor: null },
  content: {
    top: 'initial',
    left: 'initial',
    right: 'initial',
    bottom: 'initial',
    border: null,
    padding: null,
    position: null,
    background: null,
    borderRadius: null
  }
}

export default class AddProductModal extends Component {
  static contextTypes = {
    user: PropTypes.object,
    csrf: PropTypes.string,
    currentUserIsOnboarding: PropTypes.func
  }

  static propTypes = {
    product: PropTypes.object,
    onClose: PropTypes.func,
    isVisible: PropTypes.bool
  }

  static defaultProps = {
    product: {},
    onClose: (() => {}),
    isVisible: false
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      spaces: [],
      filteredSpaces: [],
      spacesHashTable: {},
      hasFetchedSpaces: false,
      isFetchingSpaces: true,
      isTogglingProduct: false,
      formIsVisible: context.currentUserIsOnboarding(),
      spaceTypes: [],
      hasFetchedSpaceTypes: false,
      isFetchingSpaceTypes: true
    }
  }

  componentWillReceiveProps(nextProps) {
    const { state } = this

    const resetFetchingStatus = {
      hasFetchedSpaces: true,
      isFetchingSpaces: false,
      hasFetchedSpaceTypes: true,
      isFetchingSpaceTypes: false
    }

    if (
      nextProps.isVisible &&
      !state.hasFetchedSpaces &&
      !state.hasFetchedSpaceTypes
    ) {
      Promise
        .all([this.fetchSpaces(), this.fetchSpaceTypes()])
        .then(([spaces, spaceTypes]) => {
          this.setState({
            spaces,
            spaceTypes,
            filteredSpaces: spaces,
            spacesHashTable: createProductsHash(spaces),
            ...resetFetchingStatus
          })
        })
        .catch(() => {
          this.setState({
            ...resetFetchingStatus
          })
        })
    }
  }

  onSearchChange = ({ currentTarget: input }) => {
    this.search(input.value)
  }

  onFormSuccess = (space) => {
    const { props, state } = this
    const spaces = concat([], space, state.spaces)

    this.setState({
      spaces,
      formIsVisible: false,
      filteredSpaces: spaces,
      spacesHashTable: assign({}, state.spacesHashTable, {
        [toStringId(space)]: [toStringId(props.product)]
      })
    })
  }

  closeModal = () => {
    const { state, props } = this

    this.setState({
      formIsVisible: false,
      filteredSpaces: state.spaces
    }, () => {
      document.body.classList.remove('ReactModal__Body--open')
      document.querySelector('html').classList.remove(
        'ReactModal__Body--open'
      )

      props.onClose()
    })
  }

  showForm = () => {
    this.setState({
      formIsVisible: true
    })
  }

  hideForm = () => {
    this.setState({
      formIsVisible: false
    })
  }

  stopPropagation = (event) => {
    event.stopPropagation()
  }

  fetchSpaces() {
    return new Promise(async (resolve, reject) => {
      const { context } = this

      axios
        .get(`/ajax/spaces/designer/${toStringId(context.user)}/`)
        .then(({ data }) => {
          resolve(get(data, 'spaces', []))
        })
        .catch(reject)
    })
  }

  fetchSpaceTypes() {
    return new Promise(async (resolve, reject) => {
      axios
        .get('/ajax/space-types/')
        .then(({ data }) => {
          resolve(get(data, 'spaceTypes', []))
        })
        .catch(reject)
    })
  }

  search(term) {
    const { state } = this

    this.setState({
      filteredSpaces: isEmpty(term)
        ? state.spaces
        : searchCollection(state.spaces, 'name', term)
    })
  }

  toggleProduct(space, remove = false) {
    const { props, state, context } = this

    const products = state.spacesHashTable[space]
    const updatedProducts = remove
      ? without(products, toStringId(props.product))
      : concat(products, toStringId(props.product))

    this.setState({
      addingTo: space,
      isTogglingProduct: true
    }, () => {
      axios
        .put(`/ajax/spaces/${space}/`, {
          _csrf: context.csrf,
          products: updatedProducts
        }).then(() => {
          this.setState({
            addingTo: null,
            spacesHashTable: assign({}, state.spacesHashTable, {
              [space]: updatedProducts
            }),
            isTogglingProduct: false
          })
        }).catch(() => {
          this.setState({
            addingTo: null,
            isTogglingProduct: false
          })
        })
    })
  }

  isAddingToSpace(space) {
    const { state } = this
    const spaceId = toStringId(space)
    const addingToId = toStringId(state.addingTo)

    return (
      !isEmpty(spaceId) &&
      !isEmpty(addingToId) &&
      state.addingTo === space &&
      state.isTogglingProduct
    )
  }

  renderContent() {
    const { state } = this

    if (state.isFetchingSpaces || state.isFetchingSpaceTypes) {
      return this.renderLoadingState()
    } else if (state.formIsVisible) {
      return this.renderForm()
    } else if (isEmpty(state.spaces)) {
      return this.renderEmptyState()
    }

    return this.renderSpaces()
  }

  renderCloseButton() {
    const { state } = this

    return (
      <button
        type="button"
        onClick={this.closeModal}
        disabled={state.isTogglingProduct}
        className={classNames({
          button: true,
          'button--icon': true,
          'button--transparent': true,
          'add-product-modal-close': true
        })}
      >
        <MaterialDesignIcon name="close" />
      </button>
    )
  }

  renderLoadingState() {
    return (
      <Loader size={55} />
    )
  }

  renderProduct() {
    const { props } = this

    return (
      <div className="add-product-modal-product">
        <ProductCard {...props.product} forDisplayOnly />
      </div>
    )
  }

  renderEmptyState() {
    return (
      <div className="add-product-modal-empty">
        <h1 className="add-product-modal-empty-text">
          You haven&apos;t created any spaces yet.
        </h1>
        <button
          type="button"
          onClick={this.showForm}
          className="button button--primary"
        >
          <span className="button-text">
            Create your first space
          </span>
        </button>
      </div>
    )
  }

  renderSpaces() {
    const { state } = this

    return (
      <div className="add-product-modal-spaces">
        <div className="add-product-modal-title">
          Add to space
        </div>
        <div className="add-product-modal-spaces-search">
          <div className="textfield-icon">
            <MaterialDesignIcon name="search" />
            <input
              type="text"
              onChange={this.onSearchChange}
              className="textfield"
              placeholder="Search spaces by name"
            />
          </div>
        </div>
        <div className="add-product-modal-spaces-list">
          {map(state.filteredSpaces, ::this.renderSpace)}
          {isEmpty(state.filteredSpaces) ? (
            <div className="add-product-modal-spaces-list-empty">
              No spaces found...
            </div>
          ) : null}
        </div>
        <div className="add-product-modal-spaces-actions">
          <button
            type="button"
            onClick={this.showForm}
            disabled={state.isTogglingProduct}
            className="button button--primary"
          >
            Create a space
          </button>
        </div>
      </div>
    )
  }

  renderSpace(space) {
    const { props, state } = this
    const spaceId = toStringId(space)

    const hasProduct = productInSpace(
      state.spacesHashTable, space, toStringId(props.product)
    )

    return (
      <button
        key={spaceId}
        type="button"
        onClick={() => this.toggleProduct(spaceId, hasProduct)}
        disabled={state.isTogglingProduct}
        className={classNames({
          'add-product-modal-space': true,
          'add-product-modal-space--has-product': hasProduct
        })}
      >
        <div className="add-product-modal-space-inner">
          <span className="add-product-modal-space-name">
            <small className="add-product-modal-space-room">
              {get(space, 'spaceType.name')}
            </small>
            {this.isAddingToSpace(spaceId) ? 'Adding...' : get(space, 'name')}
          </span>
          {hasProduct ? (
            <span className="add-product-modal-space-actions">
              <MaterialDesignIcon
                name="check"
                className="add-product-modal-space-icon"
              />
              <MaterialDesignIcon
                name="uncheck"
                className="add-product-modal-space-icon"
              />
              <a
                rel="noopener noreferrer"
                href={`/${get(space, 'detailUrl')}/`}
                target="_blank"
                onClick={this.stopPropagation}
                className="add-product-modal-space-action"
              >
                <MaterialDesignIcon
                  name="open"
                  className="add-product-modal-space-icon"
                />
              </a>
            </span>
          ) : (
            <span className="spaces-popup-space-actions">
              <MaterialDesignIcon
                name="check-empty"
                className="add-product-modal-space-icon"
              />
              <a
                rel="noopener noreferrer"
                href={`/${get(space, 'detailUrl')}/`}
                target="_blank"
                onClick={this.stopPropagation}
                className="add-product-modal-space-action"
              >
                <MaterialDesignIcon
                  name="open"
                  className="add-product-modal-space-icon"
                />
              </a>
            </span>
          )}
        </div>
      </button>
    )
  }

  renderForm() {
    const { props, state } = this

    return (
      <SpaceForm
        products={[props.product]}
        onCancel={this.hideForm}
        onSuccess={this.onFormSuccess}
        spaceTypes={state.spaceTypes}
      />
    )
  }

  render() {
    const { props, context } = this
    const spaces = get(context.user, 'spaces', [])

    return (
      <Modal
        style={overrideDefaultStyles}
        isOpen={props.isVisible}
        className={classNames({
          modal: true,
          'add-product-modal': true,
          'add-product-modal--has-spaces': !isEmpty(spaces)
        })}
        onAfterOpen={() => {
          document.body.classList.add('ReactModal__Body--open')
          document.querySelector('html').classList.add('ReactModal__Body--open')
        }}
        contentLabel="Modal"
        onRequestClose={this.closeModal}
      >
        <section className="add-product-modal-content">
          {this.renderCloseButton()}
          <div className="add-product-modal-left">
            {this.renderProduct()}
          </div>
          <div className="add-product-modal-right">
            {this.renderContent()}
          </div>
        </section>
      </Modal>
    )
  }
}
