import get from 'lodash/get'
import map from 'lodash/map'
import axios from 'axios'
import Select from 'react-select'
import concat from 'lodash/concat'
import filter from 'lodash/filter'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import Popup from '../common/Popup'
import PopupTitle from '../common/PopupTitle'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import productInSpace from '../../utils/product/productInSpace'
import searchCollection from '../../utils/searchCollection'

export default class SpacesPopup extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      popupTitle: 'Add to space',
      filteredSpaces: get(context, 'userData.spaces', []),

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
    csrf: Type.string,
    userData: Type.object,
    spaceTypes: Type.array,
    addUserSpace: Type.func,
    onSpaceUpdated: Type.func
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

  toggleProduct(space, add = true) {
    const { productId } = this.props
    const { csrf, onSpaceUpdated } = this.context

    const id = get(space, 'id', '')
    const products = get(space, 'products', [])

    this.setState({ isUpdatingSpace: true }, () => {
      axios({
        url: `/ajax/spaces/${id}/`,
        data: {
          _csrf: csrf,
          products: add
            ? concat(products, productId)
            : filter(products, (product) => (
              !isEqual(get(product, 'id', product), productId)
            ))
        },
        method: 'PUT'
      }).then((res) => {
        onSpaceUpdated(get(res, 'data', {}))
        this.setState({ isUpdatingSpace: false })
      }).catch(() => {
        this.setState({ isUpdatingSpace: false })
      })
    })
  }

  onSubmit(event) {
    const { productId } = this.props
    const { addUserSpace } = this.context
    const formData = serialize(this.form, { hash: true })

    event.preventDefault()

    formData.products = [productId]

    this.setState({ errors: {}, isSaving: true }, () => {
      axios({
        url: '/ajax/spaces/',
        data: formData,
        method: 'POST'
      }).then((res) => {
        addUserSpace(get(res, 'data', {}))

        console.log(':D')

        this.setState({
          type: '',
          name: '',
          errors: {},
          isSaving: false,
          description: '',
          formIsVisible: false
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
    const allSpaces = get(this.context, 'userData.spaces', [])

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
            options={map(spaceTypes, (type) => ({
              value: get(type, 'id'),
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
    const { userData } = this.context
    const { productId } = this.props
    const { filteredSpaces, isUpdatingSpace } = this.state

    const allSpaces = get(userData, 'spaces', [])

    return (
      <div className="spaces-popup-content">
        {!isEmpty(allSpaces) ? (
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

        {!isEmpty(allSpaces) ? (
          <div className="popup-list spaces-popup-spaces">
            {map(filteredSpaces, (space) => {
              const hasProduct = productInSpace(productId, space)

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

        {isEmpty(allSpaces) ? (
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
