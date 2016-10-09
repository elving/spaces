import get from 'lodash/get'
import map from 'lodash/map'
import head from 'lodash/head'
import size from 'lodash/size'
import axios from 'axios'
import Select from 'react-select'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import defaultTo from 'lodash/defaultTo'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Loader from '../common/Loader'
import Notification from '../common/Notification'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'
import focusOnFirstError from '../../utils/dom/focusOnFirstError'

export default class ProductForm extends Component {
  static contextTypes = {
    csrf: PropTypes.string,
    currentUserIsAdmin: PropTypes.func
  }

  static propTypes = {
    brands: PropTypes.array,
    colors: PropTypes.array,
    product: PropTypes.object,
    onAdded: PropTypes.func,
    categories: PropTypes.array,
    spaceTypes: PropTypes.array,
    formMethod: PropTypes.string
  }

  static defaultProps = {
    product: {},
    onAdded: (() => {}),
    formMethod: 'POST'
  }

  constructor(props) {
    super(props)

    const description = get(props.product, 'description', '')
    const descriptionLength = size(description)

    this.state = {
      url: get(props.product, 'url', ''),
      note: get(props.product, 'note', ''),
      name: get(props.product, 'name', ''),
      image: get(props.product, 'image', ''),
      price: get(props.product, 'price', ''),
      brand: get(props.product, 'brand.name', ''),
      colors: map(get(props.product, 'colors', []), 'name'),
      errors: {},
      images: [],
      product: {},
      isSaving: false,
      hasSaved: false,
      imageIndex: 0,
      categories: map(get(props.product, 'categories', []), 'name'),
      spaceTypes: map(get(props.product, 'spaceTypes', []), 'name'),
      isScraping: false,
      isDeleting: false,
      hasScrapped: false,
      description: get(props.product, 'description', ''),
      imageFromUrl: null,
      isLoadingImage: true,
      savingSuccessful: false,
      deletingSuccessful: false,
      scrappedSuccessful: false,
      descriptionCharsLeft: (500 - descriptionLength),
      productAlreadyExists: false,
      imageUrlFormIsVisible: isEqual(get(props, 'formMethod'), 'PUT'),
      isLoadingImageFromUrl: false,
      hasDescriptionCharsError: (descriptionLength > 500)
    }
  }

  componentDidMount() {
    const { props, state } = this

    let action

    if (state.isDeleting) {
      action = 'deleting'
    } else if (state.isSaving && props.formMethod === 'POST') {
      action = 'adding'
    } else if (state.isSaving && props.formMethod === 'PUT') {
      action = 'updating'
    }

    window.onbeforeunload = () => {
      if (state.isSaving || state.isDeleting) {
        return (
          `You are in the process of ${action} a product. ` +
          'Are you sure you want to navigate away from this page and ' +
          'loose your progress?'
        )
      }
    }
  }

  componentDidUpdate() {
    const { state } = this

    if (!isEmpty(state.errors)) {
      focusOnFirstError()
    }
  }

  onScrapeFormSubmit = (event) => {
    const formData = serialize(this.scraperForm, { hash: true })

    event.preventDefault()

    this.setState({
      errors: {},
      isScraping: true
    }, () => {
      axios
        .get(`/ajax/products/fetch/?url=${encodeURIComponent(formData.url)}`)
        .then(({ data: product }) => {
          const description = get(product, 'description', '')
          const productImages = get(product, 'images', [])
          const descriptionLength = size(description)

          if (!isEmpty(get(product, 'id'))) {
            this.setState({
              url: '',
              product,
              isScraping: false,
              hasScrapped: false,
              productAlreadyExists: true
            })
          } else {
            this.setState({
              name: get(product, 'name', ''),
              note: get(product, 'note', ''),
              image: defaultTo(head(productImages), ''),
              price: get(product, 'price', ''),
              brand: get(product, 'brand', ''),
              images: productImages,
              errors: {},
              product: {},
              imageIndex: 0,
              isScraping: false,
              hasScrapped: true,
              description,
              isLoadingImage: true,
              savingSuccessful: false,
              productAlreadyExists: false,
              descriptionCharsLeft: (500 - descriptionLength),
              hasDescriptionCharsError: (descriptionLength > 500)
            })
          }
        })
        .catch(({ response }) => {
          this.setState({
            errors: get(response, 'data.err', {}),
            product: {},
            isScraping: false,
            hasScrapped: true,
            isLoadingImage: false,
            savingSuccessful: false,
            productAlreadyExists: false
          })
        })
    })
  }

  onSubmit = (event) => {
    const { props, state } = this

    const isPOST = props.formMethod === 'POST'

    event.preventDefault()

    if (
      state.isDeleting ||
      state.isLoadingImage ||
      (state.hasSaved && isPOST)
    ) {
      return false
    }

    const form = this.form
    const formData = serialize(form, { hash: true })
    const endpoint = isPOST
      ? '/ajax/products/add/'
      : `/ajax/products/${toStringId(props.product)}/`

    this.setState({
      errors: {},
      isSaving: true
    }, () => {
      axios({
        url: endpoint,
        data: formData,
        method: props.formMethod
      })
      .then(({ data: product }) => {
        this.setState({
          errors: {},
          product,
          hasSaved: true,
          isSaving: false,
          savingSuccessful: true
        }, () => props.onAdded(product))
      })
      .catch(({ response }) => {
        this.setState({
          errors: get(response, 'data.err', {}),
          product: {},
          isSaving: false,
          hasSaved: false,
          savingSuccessful: false
        })
      })
    })
  }

  onClickDelete = () => {
    const { props, context } = this

    const deleteMessage = (
      'Are you sure you want to delete this product? \n' +
      'This action cannot be undone. ' +
      'Type the word "DELETE" to confirm.'
    )

    if (window.prompt(deleteMessage)) {
      this.setState({
        errors: {},
        isDeleting: true
      }, () => {
        axios
          .delete(`/ajax/products/${toStringId(props.product)}/`, {
            params: {
              _csrf: context.csrf
            }
          })
          .then(() => {
            this.setState({
              product: {},
              isDeleting: false,
              deletingSuccessful: true
            })
          })
          .catch(({ response }) => {
            this.setState({
              errors: get(response, 'data.err', {}),
              product: {},
              isDeleting: false,
              deletingSuccessful: false
            })
          })
      })
    }
  }

  onLoadImageClick = () => {
    const { state } = this
    const image = this.imageUrlInput.value

    if (image !== state.image) {
      this.setState({
        image,
        isLoadingImage: true
      })
    }
  }

  onCancelLoadImageClick = () => {
    const { state } = this
    const image = state.image !== this.imageUrlInput.value
      ? state.images[state.imageIndex] || this.imageUrlInput.value
      : state.image

    this.setState({
      image,
      isLoadingImage: state.image !== this.imageUrlInput.value,
      imageUrlFormIsVisible: false
    })
  }

  onProductUrlChange = ({ currentTarget: input }) => {
    this.setState({
      url: input.value
    })
  }

  onPriceChange = ({ currentTarget: input }) => {
    this.setState({
      price: input.value
    })
  }

  onCategoriesChange = (categories) => {
    this.setState({
      categories
    })
  }

  onColorsChange = (colors) => {
    this.setState({
      colors
    })
  }

  onSpaceTypesChange = (spaceTypes) => {
    this.setState({
      spaceTypes
    })
  }

  onUrlChange = ({ currentTarget: input }) => {
    this.setState({
      url: input.value
    })
  }

  onNameChange = ({ currentTarget: input }) => {
    this.setState({
      name: input.value
    })
  }

  onNoteChange = ({ currentTarget: input }) => {
    this.setState({
      note: input.value
    })
  }

  onDescriptionChange = ({ currentTarget: input }) => {
    const descriptionCharsLeft = 500 - size(input.value)

    this.setState({
      description: input.value,
      descriptionCharsLeft,
      hasDescriptionCharsError: descriptionCharsLeft < 0
    })
  }

  onBrandChange = (brand) => {
    this.setState({
      brand
    })
  }

  onNotificationClose = () => {
    const { props, state } = this
    const isPOST = props.formMethod === 'POST'

    if (state.deletingSuccessful || (isPOST && !state.productAlreadyExists)) {
      window.onbeforeunload = null
      window.location.href = '/products/add/'
    } else {
      this.setState({
        product: {},
        hasSaved: false,
        savingSuccessful: false,
        productAlreadyExists: false
      })
    }
  }

  onErrorNotificationClose = () => {
    this.setState({
      errors: {},
      savingSuccessful: false
    })
  }

  onImageLoad = () => {
    this.setState({
      isLoadingImage: false
    })
  }

  onImageError = () => {
    const { state } = this
    const hasMoreImages = (
      !isEmpty(state.images) &&
      size(state.images) > state.imageIndex
    )

    this.setState({
      image: hasMoreImages
        ? state.images[state.imageIndex + 1]
        : '',
      imageIndex: state.imageIndex + 1,
      isLoadingImage: hasMoreImages
    })
  }

  form = null
  scraperForm = null
  imageUrlInput = null

  selectPrevImage = () => {
    const { state } = this
    const nextImage = state.imageIndex - 1

    if (nextImage >= 0) {
      this.setState({
        image: state.images[nextImage],
        imageIndex: nextImage,
        isLoadingImage: true
      })
    }
  }

  selectNextImage = () => {
    const { state } = this
    const nextImage = state.imageIndex + 1

    if (nextImage <= size(state.images) - 1) {
      this.setState({
        image: state.images[nextImage],
        imageIndex: nextImage,
        isLoadingImage: true
      })
    }
  }

  showImageUrlInput = () => {
    this.setState({
      imageUrlFormIsVisible: true
    })
  }

  reset = (next = (() => {})) => {
    this.setState({
      url: '',
      name: '',
      image: '',
      price: '',
      brand: '',
      colors: [],
      errors: {},
      images: [],
      isSaving: false,
      hasSaved: false,
      imageIndex: 0,
      isScraping: false,
      isDeleting: false,
      categories: [],
      spaceTypes: [],
      hasScrapped: false,
      description: '',
      imageFromUrl: null,
      isLoadingImage: false,
      savingSuccessful: false,
      scrappedSuccessful: false,
      deletingSuccessful: false,
      productAlreadyExists: false,
      imageUrlFormIsVisible: false,
      isLoadingImageFromUrl: false
    }, next)
  }

  renderScrapeForm() {
    const { props, state, context } = this

    return (
      <form
        ref={form => { this.scraperForm = form }}
        action="/ajax/products/fetch/"
        method="POST"
        onSubmit={this.onScrapeFormSubmit}
        className="form product-form-scrape"
      >
        <input type="hidden" name="_csrf" value={context.csrf} />
        <input type="hidden" name="_method" value={props.formMethod} />

        <h1 className="form-title">
          {props.formMethod === 'POST' ? 'Add Product' : 'Update Product'}

          {context.currentUserIsAdmin() ? (
            <a href="/admin/products/" className="form-title-link">
              <MaterialDesignIcon name="list" size={18} />
              All Products
            </a>
          ) : null}
        </h1>

        <div className="form-group">
          <label htmlFor="product-url" className="form-label">
            Product Url <small>required</small>
          </label>

          <div className="textfield-icon">
            <MaterialDesignIcon name="search" />
            <input
              id="product-url"
              type="url"
              name="url"
              value={state.url}
              required
              onChange={this.onProductUrlChange}
              disabled={state.isScraping}
              className="textfield"
              autoFocus
              placeholder="E.g. https://example.com/abc-123"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="form-group form-group--inline">
            <button
              type="submit"
              disabled={state.isScraping}
              className="button button--primary"
            >
              <span className="button-text">
                {state.isScraping
                  ? 'Finding Product...'
                  : 'Find Product'
                }
              </span>
            </button>
            <a href="/products/" className="button">
              <span className="button-text">Cancel</span>
            </a>
          </div>
        </div>
      </form>
    )
  }

  renderProductImagePicker() {
    const { props, state } = this

    const isPOST = props.formMethod === 'POST'
    const hasImages = !isEmpty(state.images) || !isEmpty(state.image)

    const shouldDisable = (
      state.isSaving ||
      state.isDeleting ||
      state.isLoadingImage ||
      state.deletingSuccessful ||
      state.isLoadingImageFromUrl
    )

    const noImageAvailable = (
      isPOST &&
      !hasImages &&
      state.hasScrapped &&
      !state.isLoadingImage
    )

    return (
      <div className="image-picker">
        <input type="hidden" name="image" value={state.image} />

        <div
          className={classNames({
            'image-picker-current': true,
            'image-picker-current--loading': state.isLoadingImage
          })}
        >
          {state.isLoadingImage ? (
            <Loader size={60} />
          ) : null}

          {noImageAvailable ? (
            <MaterialDesignIcon
              name="image"
              width={120}
              height={120}
              className="image-picker-no-images-icon"
            />
          ) : (
            <img
              src={state.image}
              role="presentation"
              onLoad={this.onImageLoad}
              onError={this.onImageError}
              className="image-picker-current-image"
            />
          )}
        </div>

        <small style={{ marginTop: 10 }} className="form-help">
          If the images extracted from the product&apos;s website are not
          desirible, click the &ldquo;Upload Image From Url&rdquo; and
          use the url of a better image.
        </small>

        {state.imageUrlFormIsVisible || !hasImages ? (
          <div className="image-picker-url-form">
            <input
              id="image"
              ref={input => { this.imageUrlInput = input }}
              type="url"
              disabled={shouldDisable}
              className="textfield image-picker-url-form-input"
              placeholder="E.g. https://amzn.com/ABC123"
              defaultValue={state.image}
            />
            <button
              type="button"
              onClick={this.onLoadImageClick}
              disabled={shouldDisable}
              className="button"
            >
              <span className="button-text">
                <MaterialDesignIcon name="image" />
                Load Image
              </span>
            </button>
            {isPOST ? (
              <button
                type="button"
                onClick={this.onCancelLoadImageClick}
                disabled={shouldDisable}
                className="button"
              >
                <span className="button-text">
                  <MaterialDesignIcon name="close" />
                  Cancel
                </span>
              </button>
            ) : null}
          </div>
        ) : (
          <div className="image-picker-actions">
            <div className="image-picker-actions-left">
              <button
                type="button"
                onClick={this.showImageUrlInput}
                disabled={shouldDisable}
                className="button"
              >
                <span className="button-text">
                  <MaterialDesignIcon name="link" />
                  Upload Image From Url
                </span>
              </button>
            </div>
            <div className="image-picker-actions-right">
              {hasImages ? (
                <button
                  type="button"
                  onClick={this.selectPrevImage}
                  disabled={shouldDisable || state.imageIndex === 0}
                  className="button button--icon image-picker-nav-prev"
                >
                  <span className="button-text">
                    <MaterialDesignIcon name="caret-left" />
                  </span>
                </button>
              ) : null}
              {hasImages ? (
                <button
                  type="button"
                  onClick={this.selectNextImage}
                  disabled={(
                    shouldDisable ||
                    state.imageIndex >= size(state.images) - 1
                  )}
                  className="button button--icon image-picker-nav-next"
                >
                  <span className="button-text">
                    <MaterialDesignIcon name="caret-right" />
                  </span>
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    )
  }

  renderProductForm() {
    const { props, state, context } = this

    const isPOST = props.formMethod === 'POST'

    const shouldDisable = (
      state.isSaving ||
      state.isDeleting ||
      state.isLoadingImage ||
      state.deletingSuccessful ||
      state.hasDescriptionCharsError
    )

    const formAction = isPOST
      ? '/products/new/'
      : `/products/${toStringId(props.product)}/update/`

    const urlError = get(state.errors, 'url')
    const hasUrlError = !isEmpty(urlError)

    const nameError = get(state.errors, 'name')
    const hasNameError = !isEmpty(nameError)

    const noteError = get(state.errors, 'note')
    const hasNoteError = !isEmpty(noteError)

    const descriptionError = get(state.errors, 'description')
    const hasDescriptionError = !isEmpty(descriptionError)

    const brandError = get(state.errors, 'brand')
    const hasBrandError = !isEmpty(brandError)

    const priceError = get(state.errors, 'price')
    const hasPriceError = !isEmpty(priceError)

    const categoriesError = get(state.errors, 'categories')
    const hasCategoriesError = !isEmpty(categoriesError)

    const spaceTypesError = get(state.errors, 'spaceTypes')
    const hasSpaceTypesError = !isEmpty(spaceTypesError)

    const colorsError = get(state.errors, 'colors')
    const hasColorsError = !isEmpty(colorsError)

    let btnText = ''

    if (isPOST) {
      btnText = state.isSaving
        ? 'Adding Product...'
        : 'Add Product'
    } else {
      btnText = state.isSaving
        ? 'Updating Product...'
        : 'Update Product'
    }

    return (
      <form
        ref={form => { this.form = form }}
        action={formAction}
        method="POST"
        onSubmit={this.onSubmit}
        className="form product-form"
      >
        <input type="hidden" name="_csrf" value={context.csrf} />
        <input type="hidden" name="_method" value={props.formMethod} />

        <h1 className="form-title">
          {isPOST ? 'Add Product' : 'Update Product'}

          {context.currentUserIsAdmin() ? (
            <a href="/admin/products/" className="form-title-link">
              <MaterialDesignIcon name="list" size={18} />
              All Products
            </a>
          ) : null}
        </h1>

        <div className="form-group">
          <label htmlFor="url" className="form-label">
            Url <small>required</small>
          </label>

          <input
            id="url"
            type="text"
            name="url"
            value={state.url}
            required
            readOnly
            onChange={this.onUrlChange}
            disabled={state.isSaving}
            className={classNames({
              textfield: true,
              'textfield--error': hasUrlError
            })}
            placeholder="Url"
          />

          {hasUrlError ? (
            <small className="form-error">{urlError}</small>
          ) : null}

          <small className="form-help">
            If you want to change the product&apos;s url go back to the&nbsp;
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault()
                this.reset()
              }}
            >
              product search form.
            </a>
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">
            Image <small>required</small>
          </label>
          {this.renderProductImagePicker()}
        </div>

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name <small>required</small>
          </label>

          <input
            id="name"
            type="text"
            name="name"
            value={state.name}
            required
            onChange={this.onNameChange}
            disabled={state.isSaving}
            className={classNames({
              textfield: true,
              'textfield--error': hasNameError
            })}
            placeholder="Name"
          />

          {hasNameError ? (
            <small className="form-error">{nameError}</small>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Curator&apos;s Note <small>optional</small>
          </label>

          <textarea
            id="note"
            name="note"
            value={state.note}
            onChange={this.onNoteChange}
            disabled={state.isSaving}
            className={classNames({
              textfield: true,
              'textfield--error': hasNoteError
            })}
            placeholder="I bought this product because it's awesome..."
          />

          {hasNameError ? (
            <small className="form-error">{noteError}</small>
          ) : null}

          <small className="form-help">
            Give some insight into why you are adding this product,
            e.g. you own it and want write a simple review about what
            makes it special.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
            <small
              style={{
                color: state.hasDescriptionCharsError ? '#ED4542' : '#999999'
              }}
            >
              optional &middot; {state.descriptionCharsLeft} chars left
            </small>
          </label>

          <textarea
            id="description"
            name="description"
            value={state.description}
            disabled={state.isSaving}
            onChange={this.onDescriptionChange}
            className={classNames({
              textfield: true,
              'textfield--error': (
                hasDescriptionError ||
                state.hasDescriptionCharsError
              )
            })}
            placeholder="Description"
          />

          {hasDescriptionError ? (
            <small className="form-error">{descriptionError}</small>
          ) : null}
        </div>

        <div className="form-group">
          <div className="form-group form-group--inline">
            <div className="form-group">
              <label htmlFor="brand" className="form-label">
                Brand <small>required</small>
              </label>

              <Select
                id="brand"
                name="brand"
                value={state.brand}
                options={map(props.brands, brand => ({
                  value: get(brand, 'name'),
                  label: get(brand, 'name')
                }))}
                required
                onChange={this.onBrandChange}
                disabled={state.isSaving}
                className={classNames({
                  select: true,
                  'select--error': hasBrandError
                })}
                allowCreate
                placeholder="E.g. Apple"
                addLabelText={'Add "{label}" as a new brand'}
              />

              {hasBrandError ? (
                <small className="form-error">{brandError}</small>
              ) : null}
            </div>

            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Price <small>required</small>
              </label>

              <input
                id="price"
                type="text"
                name="price"
                value={state.price}
                required
                onChange={this.onPriceChange}
                disabled={state.isSaving}
                className={classNames({
                  textfield: true,
                  'textfield--error': hasPriceError
                })}
                placeholder="E.g. $99"
              />

              {hasPriceError ? (
                <small className="form-error">{priceError}</small>
              ) : null}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="categories" className="form-label">
            Categories <small>required</small>
          </label>

          <Select
            id="categories"
            name="categories"
            multi
            value={state.categories}
            options={map(props.categories, category => ({
              value: get(category, 'name'),
              label: get(category, 'name')
            }))}
            required
            onChange={this.onCategoriesChange}
            disabled={state.isSaving}
            className={classNames({
              select: true,
              'select--error': hasCategoriesError
            })}
            allowCreate
            placeholder="E.g. Pattern, Minimal"
            addLabelText={'Add "{label}" as a new category'}
          />

          {hasCategoriesError ? (
            <small className="form-error">{categoriesError}</small>
          ) : null}

          <small className="form-help">
            If you are adding new categories for this product, make sure
            that they can be used for other products. We want to ensure that
            categories have plenty of products.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="colors" className="form-label">
            Colors <small>optional</small>
          </label>

          <Select
            id="colors"
            name="colors"
            multi
            value={state.colors}
            options={map(props.colors, color => ({
              value: get(color, 'name'),
              label: get(color, 'name'),
              color: get(color, 'hex')
            }))}
            required
            onChange={this.onColorsChange}
            disabled={state.isSaving}
            className={classNames({
              select: true,
              'select--error': hasColorsError
            })}
            placeholder="E.g. White, Charcoal Gray"
            valueRenderer={option =>
              <span
                id={`select-value-${get(option, 'value')}`}
                className="select-value-color-container"
              >
                <span
                  style={{ backgroundColor: get(option, 'color') }}
                  className="select-value-color"
                />
                {get(option, 'label')}
              </span>
            }
            optionRenderer={option =>
              <span
                id={`select-option-${get(option, 'value')}`}
                className="select-option-color-container"
              >
                <span
                  style={{ backgroundColor: get(option, 'color') }}
                  className="select-option-color"
                />
                {get(option, 'label')}
              </span>
            }
          />

          {hasColorsError ? (
            <small className="form-error">{colorsError}</small>
          ) : null}

          <small className="form-help">
            If there&apos;s a color that&apos;s not present in this list please
            &nbsp;<a href="mailto:support@joinspaces.co">let us know</a>.
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="spaces" className="form-label">
            Rooms <small>required</small>
          </label>

          <Select
            id="spaces"
            name="spaceTypes"
            multi
            value={state.spaceTypes}
            options={map(props.spaceTypes, spaceTpye => ({
              value: get(spaceTpye, 'name'),
              label: get(spaceTpye, 'name')
            }))}
            required
            onChange={this.onSpaceTypesChange}
            disabled={state.isSaving}
            className={classNames({
              select: true,
              'select--error': hasSpaceTypesError
            })}
            placeholder="E.g. Kitchen, Patio"
            allowCreate={context.currentUserIsAdmin()}
            addLabelText={'Add "{label}" as a new room'}
          />

          {hasSpaceTypesError ? (
            <small className="form-error">{spaceTypesError}</small>
          ) : null}

          <small className="form-help">
            Select rooms where this product could be found or used, e.g. a
            refrigerator is used for kitchens. If this product can be used
            in any room select the &ldquo;Any&rdquo; room option. This is
            used to generate product suggestions for spaces.
          </small>
        </div>

        <div className="form-group">
          <div className="form-group form-group--inline">
            <button
              type="submit"
              disabled={shouldDisable}
              className="button button--primary"
            >
              <span className="button-text">
                <MaterialDesignIcon name={isPOST ? 'add' : 'edit'} />
                {btnText}
              </span>
            </button>

            {isPOST ? (
              <button type="button" onClick={this.reset} className="button">
                <span className="button-text">Cancel</span>
              </button>
            ) : null}

            {!isPOST && context.currentUserIsAdmin() ? (
              <button
                type="button"
                onClick={this.onClickDelete}
                disabled={shouldDisable}
                className="button button--danger"
              >
                <span className="button-text">
                  <MaterialDesignIcon name="delete" />
                  {state.isDeleting ? 'Deleting...' : 'Delete'}
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </form>
    )
  }

  renderForm() {
    const { props, state } = this

    if (!state.hasScrapped && props.formMethod === 'POST') {
      return this.renderScrapeForm()
    } else if (state.hasScrapped || props.formMethod === 'PUT') {
      return this.renderProductForm()
    }
  }

  renderNotification() {
    const { props, state } = this

    const sid = get(state.product, 'sid', '')
    const name = get(state.product, 'name', 'Product')

    const genericError = get(state.errors, 'generic')
    const hasGenericError = !isEmpty(genericError)

    if (state.productAlreadyExists) {
      return (
        <Notification
          timeout={3500}
          onClose={this.onNotificationClose}
          isVisible
        >
          This product aleary exists.
          {'\u00A0'}
          <a href={`/products/${sid}/`}>{name}</a>.
        </Notification>
      )
    } else if (state.savingSuccessful) {
      return props.formMethod === 'POST' ? (
        <Notification
          type="success"
          onClose={this.onNotificationClose}
          timeout={3500}
          isVisible
        >
          &quot;{name}&quot; was added successfully.
          {'\u00A0'}
          Click
          {'\u00A0'}
          <a href={`/products/${sid}/update/`}>here</a>
          {'\u00A0'}
          to edit.
        </Notification>
      ) : (
        <Notification
          type="success"
          timeout={3500}
          onClose={this.onNotificationClose}
          isVisible
        >
          &quot;{name}&quot; was updated successfully.
        </Notification>
      )
    } else if (state.deletingSuccessful) {
      return (
        <Notification
          type="success"
          timeout={3500}
          onClose={this.onNotificationClose}
          isVisible
        >
          &quot;{name}&quot; was deleted successfully. Redirecting...
        </Notification>
      )
    } else if (hasGenericError) {
      return (
        <Notification
          type="error"
          timeout={3500}
          onClose={this.onErrorNotificationClose}
          isVisible
        >
          {genericError}
        </Notification>
      )
    }

    return null
  }

  render() {
    return (
      <div className="product-form-container">
        {this.renderForm()}
        {this.renderNotification()}
      </div>
    )
  }
}
