import get from 'lodash/get'
import map from 'lodash/map'
import axios from 'axios'
import Select from 'react-select'
import without from 'lodash/without'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import Popup from '../common/Popup'
import PopupTitle from '../common/PopupTitle'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../utils/toStringId'
import updateSpaces from '../../utils/space/updateSpaces'
import withoutAnyType from '../../utils/spaceType/withoutAnyType'
import productInSpace from '../../utils/product/productInSpace'
import searchCollection from '../../utils/searchCollection'

export default class SpacesPopup extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      popupTitle: 'Add to space',
      filteredSpaces: get(context, 'userSpaces', []),

      type: '',
      name: '',
      errors: {},
      description: '',

      isSaving: false,
      formIsVisible: false,
      isUpdatingSpace: false
    }

    this.form = null
  }

  static contextTypes = {
    user: Type.object,
    csrf: Type.string,
    spaceTypes: Type.array,
    userSpaces: Type.array,
    updateSpace: Type.func,
    userSpacesProductsMap: Type.object
  };

  static propTypes = {
    types: Type.array,
    isOpen: Type.bool,
    className: Type.string,
    productId: Type.string,
    onClickClose: Type.func
  };

  static defaultProps = {
    types: [],
    isOpen: false,
    className: '',
    productId: '',
    onClickClose: (() => {})
  };

  showForm() {
    this.setState({
      popupTitle: 'Create a space',
      formIsVisible: true
    })
  }

  hideForm() {
    this.setState({
      popupTitle: 'Add to space',
      formIsVisible: false
    })
  }

  resetForm(next) {
    this.setState({
      type: '',
      name: '',
      description: '',
      formIsVisible: false
    }, next)
  }

  toggleProduct(space, isAdding = true) {
    const { productId } = this.props
    const { csrf, updateSpace, userSpacesProductsMap } = this.context

    const spaceId = toStringId(space)
    const products = userSpacesProductsMap[spaceId]
    let updatedProducts = products

    if (isAdding) {
      updatedProducts.push(productId)
    } else {
      updatedProducts = without(products, productId)
    }

    this.setState({ isUpdatingSpace: true }, () => {
      axios({
        url: `/ajax/spaces/${spaceId}/`,
        data: {
          _csrf: csrf,
          products: updatedProducts
        },
        method: 'PUT'
      }).then(() => {
        this.setState({ isUpdatingSpace: false }, () => {
          updateSpace(spaceId, updatedProducts)
        })
      }).catch(() => {
        this.setState({ isUpdatingSpace: false })
      })
    })
  }

  onSubmit(event) {
    const { productId } = this.props
    const { productsMap } = this.state

    const formData = serialize(this.form, { hash: true })
    const allSpaces = get(this.context, 'user.spaces', [])

    formData.products = [productId]

    event.preventDefault()

    this.setState({ errors: {}, isSaving: true }, () => {
      axios({
        url: '/ajax/spaces/',
        data: formData,
        method: 'POST'
      }).then((res) => {
        const space = get(res, 'data', {})

        allSpaces.push(space)
        this.setState({
          type: '',
          name: '',
          errors: {},
          isSaving: false,
          popupTitle: 'Add to space',
          description: '',
          productsMap: updateSpaces(productsMap, space, [productId]),
          formIsVisible: false,
          filteredSpaces: allSpaces
        })
      }).catch((res) => {
        this.setState({
          errors: get(res, 'data.err', {}),
          isSaving: false
        })
      })
    })
  }

  onSearch(event) {
    const term = event.currentTarget.value
    const allSpaces = get(this.context, 'user.spaces', [])

    this.setState({
      filteredSpaces: isEmpty(term)
        ? allSpaces
        : searchCollection(allSpaces, 'name', term)
    })
  }

  renderForm() {
    const { csrf, spaceTypes } = this.context
    const { errors, isSaving } = this.state

    const typeError = get(errors, 'type')
    const hasTypeError = !isEmpty(typeError)

    const nameError = get(errors, 'name')
    const hasNameError = !isEmpty(nameError)

    const descriptionError = get(errors, 'description')
    const hasDescriptionError = !isEmpty(descriptionError)

    return (
      <form
        ref={(form) => this.form = form}
        method="POST"
        onSubmit={::this.onSubmit}
        className="form spaces-popup-form">
        <input type="hidden" name="_csrf" value={csrf}/>
        <input type="hidden" name="_method" value="POST"/>

        <div className="form-group form-group--small">
          <label className="form-label">
            Type <small>required</small>
          </label>

          <Select
            name="spaceType"
            value={get(this.state, 'type', '')}
            options={map(withoutAnyType(spaceTypes), (type) => ({
              value: toStringId(type),
              label: get(type, 'name')
            }))}
            required
            onChange={(type) => this.setState({ type })}
            disabled={isSaving}
            className={classNames({
              'select': true,
              'select--small': true,
              'select--error': hasTypeError
            })}
            placeholder="E.g. Kitchen"/>

          {hasTypeError ? (
            <small className="form-error">{typeError}</small>
          ) : null}
        </div>

        <div className="form-group form-group--small">
          <label className="form-label">
            Name <small>required</small>
          </label>

          <input
            type="text"
            name="name"
            required
            value={get(this.state, 'name', '')}
            disabled={isSaving}
            onChange={(event) => {
              this.setState({ name: event.currentTarget.value })
            }}
            className={classNames({
              'textfield': true,
              'textfield--small': true,
              'textfield--error': hasNameError
            })}
            placeholder="E.g. My dream kitchen"/>

          {hasNameError ? (
            <small className="form-error">{nameError}</small>
          ) : null}
        </div>

        <div className="form-group form-group--small">
          <label className="form-label">
            Description <small>optional</small>
          </label>

          <textarea
            name="description"
            value={get(this.state, 'description', '')}
            disabled={isSaving}
            onChange={(event) => {
              this.setState({ description: event.currentTarget.value })
            }}
            className={classNames({
              'textfield': true,
              'textfield--small': true,
              'textfield--error': hasDescriptionError
            })}
            placeholder="E.g. A modern residential kitchen is typically..."/>

          {hasDescriptionError ? (
            <small className="form-error">{descriptionError}</small>
          ) : null}
        </div>

        <div className="form-group form-group--small">
          <div className="form-group form-group--inline">
            <button
              type="submit"
              disabled={isSaving}
              className="button button--primary button--small">
              <span className="button-text">
                {isSaving ? 'Creating...' : 'Create'}
              </span>
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={::this.hideForm}
              className="button button--link button--small">
              <span className="button-text">
                Cancel
              </span>
            </button>
          </div>
        </div>
      </form>
    )
  }

  renderContent() {
    const { productId } = this.props
    const { filteredSpaces, isUpdatingSpace } = this.state
    const { userSpaces, userSpacesProductsMap } = this.context

    return (
      <div className="spaces-popup-content">
        {!isEmpty(userSpaces) ? (
          <div className="popup-item spaces-popup-search">
            <div className="textfield-icon">
              <MaterialDesignIcon name="search"/>
              <input
                type="text"
                disabled={isUpdatingSpace}
                onChange={::this.onSearch}
                autoFocus
                className="textfield textfield--small"
                placeholder="E.g. My future kitchen"/>
            </div>
          </div>
        ) : null}

        {!isEmpty(userSpaces) ? (
          <div className="popup-list spaces-popup-spaces">
            {map(filteredSpaces, (space) => {
              const hasProduct = productInSpace(
                userSpacesProductsMap, space, productId
              )

              return (
                <button
                  key={`space-${get(space, 'sid', '')}`}
                  type="button"
                  title={get(space, 'name', '')}
                  onClick={() => this.toggleProduct(space, !hasProduct)}
                  disabled={isUpdatingSpace}
                  className={classNames({
                    'popup-item': true,
                    'popup-item--clickable': true,
                    'spaces-popup-space': true,
                    'spaces-popup-space--has-product': hasProduct
                  })}>
                  <MaterialDesignIcon
                    name="space-generic"
                    className="spaces-popup-space-icon"/>

                  <span className="popup-item-text spaces-popup-space-name">
                    {get(space, 'name', '')}
                  </span>

                  {hasProduct ? (
                    <span className="spaces-popup-space-actions">
                      <MaterialDesignIcon
                        name="check"
                        className="popup-item-icon"/>
                      <MaterialDesignIcon
                        name="uncheck"
                        className="popup-item-icon"/>
                    </span>
                  ) : (
                    <span className="spaces-popup-space-actions">
                      <MaterialDesignIcon
                        name="check-empty"
                        className="popup-item-icon"/>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ) : null}

        {isEmpty(userSpaces) ? (
          <div className="popup-item spaces-popup-empty">
            You haven't created any spaces yet.
          </div>
        ) : null}

        <button
          type="button"
          onClick={::this.showForm}
          disabled={isUpdatingSpace}
          className="popup-item popup-item--is-last popup-item--clickable"
          data-action="addSpace">
          <MaterialDesignIcon
            name="add"
            fill="#2ECC71"
            className="popup-item-icon"/>
          Create a space
        </button>
      </div>
    )
  }

  render() {
    const { popupTitle, formIsVisible } = this.state
    const { isOpen, className, onClickClose } = this.props

    const onClose = () => this.resetForm(onClickClose)

    return (
      <Popup isOpen={isOpen} className={className} onClickClose={onClose}>
        <PopupTitle onClickClose={onClose}>
          {popupTitle}
        </PopupTitle>
        <div className="popup-content">
          {formIsVisible ? (
            this.renderForm()
          ) : (
            this.renderContent()
          )}
        </div>
      </Popup>
    )
  }
}
