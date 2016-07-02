import get from 'lodash/get'
import map from 'lodash/map'
import axios from 'axios'
import Modal from 'react-modal'
import Select from 'react-select'
import assign from 'lodash/assign'
import concat from 'lodash/concat'
import without from 'lodash/without'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Loader from '../common/Loader'
import ProductCard from '../product/Card'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../utils/toStringId'
import productInSpace from '../../utils/product/productInSpace'
import withoutAnyType from '../../utils/spaceType/withoutAnyType'
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
  constructor(props, context) {
    super(props, context)

    this.state = {
      spaces: [],
      filteredSpaces: [],
      spacesHashTable: {},
      hasFetchedSpaces: false,
      isFetchingSpaces: false,
      isTogglingProduct: false,

      formType: '',
      formName: '',
      formErrors: {},
      isCreating: false,
      formIsVisible: false,
      formDescription: '',

      spaceTypes: [],
      hasFetchedSpaceTypes: false,
      isFetchingSpaceTypes: false
    }

    this.form = null
  }

  static contextTypes = {
    user: PropTypes.object,
    csrf: PropTypes.string,
    userSpaces: PropTypes.array,
  };

  static propTypes = {
    product: PropTypes.object,
    onClose: PropTypes.func,
    isVisible: PropTypes.bool
  };

  static defaultProps = {
    product: {},
    onClose: (() => {}),
    isVisible: false
  };

  componentDidMount() {
    this.fetchSpaces(this.fetchSpaceTypes())
  }

  fetchSpaces(next = (() => {})) {
    const { context } = this

    this.setState({ isFetchingSpaces: true }, () => {
      axios
        .get(`/ajax/spaces/designer/${get(context.user, 'id')}`)
        .then(({ data }) => {
          const spaces = get(data, 'spaces', [])

          this.setState({
            spaces,
            filteredSpaces: spaces,
            spacesHashTable: createProductsHash(spaces),
            hasFetchedSpaces: true,
            isFetchingSpaces: false
          }, next)
        })
        .catch(() => {
          this.setState({
            hasFetchedSpaces: true,
            isFetchingSpaces: false
          }, next)
        })
    })
  }

  fetchSpaceTypes(next = (() => {})) {
    this.setState({ isFetchingSpaceTypes: true }, () => {
      axios
        .get('/ajax/space-types/')
        .then(({ data }) => {
          this.setState({
            spaceTypes: get(data, 'spaceTypes', []),
            hasFetchedSpaceTypes: true,
            isFetchingSpaceTypes: false
          }, next)
        })
        .catch(() => {
          this.setState({
            hasFetchedSpaceTypes: true,
            isFetchingSpaceTypes: false
          }, next)
        })
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

  createSpace() {
    const { props, state } = this
    const formData = serialize(this.form, { hash: true })
    const productId = get(props, 'product.id')

    formData.products = [productId]

    this.setState({ formErrors: {}, isCreating: true }, () => {
      axios
        .post('/ajax/spaces/', formData)
        .then(({ data: space }) => {
          const spaces = concat(state.spaces, space)

          this.setState({
            spaces,
            formType: '',
            formName: '',
            formErrors: {},
            isCreating: false,
            formIsVisible: false,
            filteredSpaces: spaces,
            spacesHashTable: assign({}, state.spacesHashTable, {
              [toStringId(space)]: [productId]
            }),
            formDescription: ''
          })
        }).catch(({ data }) => {
          this.setState({
            formErrors: get(data, 'err', {}),
            isCreating: false
          })
        })
    })
  }

  toggleProduct(space, remove = false) {
    const { props, state, context } = this

    const products = state.spacesHashTable[space]
    const productId = get(props, 'product.id')
    const updatedProducts = remove
      ? without(products, productId)
      : concat(products, productId)

    this.setState({ isTogglingProduct: true }, () => {
      axios
        .put(`/ajax/spaces/${space}/`, {
          _csrf: context.csrf,
          products: updatedProducts
        }).then(() => {
          this.setState({
            spacesHashTable: assign({}, state.spacesHashTable, {
              [space]: updatedProducts
            }),
            isTogglingProduct: false
          })
        }).catch(() => {
          this.setState({ isTogglingProduct: false })
        })
    })
  }

  renderContent() {
    const { state } = this

    if (state.isFetchingSpaces) {
      return this.renderLoadingState()
    } else if (state.formIsVisible) {
      return this.renderCreateForm()
    } else if (isEmpty(state.spaces)) {
      return this.renderEmptyState()
    } else {
      return this.renderSpaces()
    }
  }

  renderCloseButton() {
    return (
      <button
        type="button"
        onClick={() => this.props.onClose()}
        className={classNames({
          'button': true,
          'button--icon': true,
          'button--transparent': true,
          'add-product-modal-close': true
        })}>
        <MaterialDesignIcon name="close"/>
      </button>
    )
  }

  renderLoadingState() {
    return (
      <Loader size={55}/>
    )
  }

  renderProduct() {
    const { props } = this

    return (
      <div className="add-product-modal-product">
        <ProductCard {...props.product} forDisplayOnly={true}/>
      </div>
    )
  }

  renderEmptyState() {
    return (
      <div className="add-product-modal-empty">
        <h1 className="add-product-modal-empty-text">
          You haven't created any spaces yet.
        </h1>
        <button
          type="button"
          onClick={() => this.setState({ formIsVisible: true })}
          className="button button--primary">
          Create your first space
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
            <MaterialDesignIcon name="search"/>
            <input
              type="text"
              onChange={({ currentTarget }) => this.search(currentTarget.value)}
              className="textfield"
              placeholder="Search"/>
          </div>
        </div>
        <div className="add-product-modal-spaces-list">
          {map(state.filteredSpaces, ::this.renderSpace)}
        </div>
        <div className="add-product-modal-spaces-actions">
          <button
            type="button"
            onClick={() => this.setState({ formIsVisible: true })}
            className="button button--primary">
            Create a space
            </button>
        </div>
      </div>
    )
  }

  renderSpace(space) {
    const { props, state } = this
    const spaceId = get(space, 'id')
    const hasProduct = productInSpace(
      state.spacesHashTable, space, get(props, 'product.id')
    )

    return (
      <button
        key={spaceId}
        type="button"
        onClick={() => this.toggleProduct(spaceId, hasProduct)}
        className={classNames({
          'add-product-modal-space': true,
          'add-product-modal-space--has-product': hasProduct
        })}>
        <span className="add-product-modal-space-name">
          {get(space, 'name')}
        </span>
        {hasProduct ? (
          <span className="add-product-modal-space-actions">
            <MaterialDesignIcon
              name="check"
              className="add-product-modal-space-icon"/>
            <MaterialDesignIcon
              name="uncheck"
              className="add-product-modal-space-icon"/>
          </span>
        ) : (
          <span className="spaces-popup-space-actions">
            <MaterialDesignIcon
              name="check-empty"
              className="add-product-modal-space-icon"/>
          </span>
        )}
      </button>
    )
  }

  renderCreateForm() {
    const { state, context } = this

    const disabled = state.isFetchingSpaceTypes || state.isCreating

    const typeError = get(state.formErrors, 'type')
    const hasTypeError = !isEmpty(typeError)

    const nameError = get(state.formErrors, 'name')
    const hasNameError = !isEmpty(nameError)

    const descriptionError = get(state.formErrors, 'description')
    const hasDescriptionError = !isEmpty(descriptionError)

    return (
      <div className="add-product-modal-form-container">
        <div className="add-product-modal-title">
          Create a space
        </div>

        <form
          ref={form => this.form = form}
          method="POST"
          onSubmit={(event) => {
            event.preventDefault()
            this.createSpace()
          }}
          className="form add-product-modal-form">
          <input type="hidden" name="_csrf" value={context.csrf}/>
          <input type="hidden" name="_method" value="POST"/>

          <div className="form-group">
            <label className="form-label">
              Type <small>required</small>
            </label>

            <Select
              name="spaceType"
              value={state.formType}
              options={map(withoutAnyType(state.spaceTypes), type => ({
                value: toStringId(type),
                label: get(type, 'name')
              }))}
              required
              onChange={formType => this.setState({ formType })}
              disabled={disabled}
              className={classNames({
                'select': true,
                'select--error': hasTypeError
              })}
              placeholder="E.g. Kitchen"/>

            {hasTypeError ? (
              <small className="form-error">{typeError}</small>
            ) : null}
          </div>

          <div className="form-group">
            <label className="form-label">
              Name <small>required</small>
            </label>

            <input
              type="text"
              name="name"
              required
              value={state.formName}
              disabled={disabled}
              onChange={({ currentTarget }) => {
                this.setState({ formName: currentTarget.value })
              }}
              className={classNames({
                'textfield': true,
                'textfield--error': hasNameError
              })}
              placeholder="E.g. My dream kitchen"/>

            {hasNameError ? (
              <small className="form-error">{nameError}</small>
            ) : null}
          </div>

          <div className="form-group">
            <label className="form-label">
              Description <small>optional</small>
            </label>

            <textarea
              name="description"
              value={state.formDescription}
              disabled={disabled}
              onChange={({ currentTarget }) => {
                this.setState({ formDescription: currentTarget.value })
              }}
              className={classNames({
                'textfield': true,
                'textfield--error': hasDescriptionError
              })}
              placeholder="E.g. A modern kitchen with..."/>

            {hasDescriptionError ? (
              <small className="form-error">{descriptionError}</small>
            ) : null}
          </div>

          <div className="form-group">
            <div className="form-group form-group--inline">
              <button
                type="submit"
                disabled={disabled}
                className="button button--primary">
                <span className="button-text">
                  {state.isCreating ? 'Creating...' : 'Create'}
                </span>
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => this.setState({ formIsVisible: false })}
                className="button button--link">
                <span className="button-text">
                  Cancel
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  render() {
    const { props, context } = this

    return (
      <Modal
        style={overrideDefaultStyles}
        isOpen={props.isVisible}
        className={classNames({
          'ui-modal': true,
          'add-product-modal': true,
          'add-product-modal--has-spaces': !isEmpty(context.userSpaces)
        })}
        onRequestClose={props.onClose}>
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
