import get from 'lodash/get'
import map from 'lodash/map'
import omit from 'lodash/omit'
import head from 'lodash/head'
import size from 'lodash/size'
import axios from 'axios'
import Select from 'react-select'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import Icon from '../common/Icon'
import Loader from '../common/Loader'
import Notification from '../common/Notification'
import getValidProductImages from '../../utils/getValidProductImages'

export default class ProductForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: {},
      product: {},

      url: get(props, 'product.url', ''),
      name: get(props, 'product.name', ''),
      image: get(props, 'product.image', ''),
      price: get(props, 'product.price', ''),
      brand: get(props, 'product.brand.name', ''),
      colors: map(get(props, 'product.colors', []), 'name'),
      categories: map(get(props, 'product.categories', []), 'name'),
      spaceTypes: map(get(props, 'product.spaceTypes', []), 'name'),
      description: get(props, 'product.description', ''),

      isSaving: false,
      hasSaved: false,
      savingSuccessful: false,

      isScraping: false,
      hasScrapped: false,
      scrappedSuccessful: false,

      images: [],
      imageIndex: 0,
      isLoadingImage: false,

      imageFromUrl: null,
      imageUrlFormIsVisible: isEqual(get(props, 'formMethod'), 'PUT'),
      isLoadingImageFromUrl: false,

      isDeleting: false,
      deletingSuccessful: false,

      productAlreadyExists: false
    }

    this.form = null
    this.scraperForm = null
    this.imageUrlInput = null
  }

  static contextTypes = {
    csrf: Type.string,
    currentUserIsAdmin: Type.func
  };

  static propTypes = {
    brands: Type.array,
    colors: Type.array,
    product: Type.object,
    onAdded: Type.func,
    categories: Type.array,
    spaceTypes: Type.array,
    formMethod: Type.string,
    isAddingForSpace: Type.bool
  };

  static defaultProps = {
    product: {},
    onAdded: (() => {}),
    formMethod: 'POST',
    isAddingForSpace: false
  };

  componentDidMount() {
    const { hasSaved, isSaving, savingSuccessful } = this.state

    window.onbeforeunload = () => {
      if (hasSaved) {
        return
      }

      const formData = omit(
        serialize(this.form, { hash: true }), ['_csrf', '_method']
      )

      if (isSaving || (!isEmpty(formData) && !savingSuccessful)) {
        return (
          'You are in the process of adding a product. ' +
          'Are you sure you want to navigate away from this page and ' +
          'loose your progress?'
        )
      }
    }
  }

  reset(next = (() => {})) {
    this.setState({
      errors: {},

      url: '',
      name: '',
      image: '',
      price: '',
      brand: '',
      colors: [],
      categories: [],
      spaceTypes: [],
      description: '',

      isSaving: false,
      hasSaved: false,
      savingSuccessful: false,

      isScraping: false,
      hasScrapped: false,
      scrappedSuccessful: false,

      images: [],
      imageIndex: 0,
      isLoadingImage: false,

      imageFromUrl: null,
      imageUrlFormIsVisible: false,
      isLoadingImageFromUrl: false,

      isDeleting: false,
      deletingSuccessful: false,

      productAlreadyExists: false
    }, next)
  }

  onScrapeFormSubmit(event) {
    const form = this.scraperForm
    const formData = serialize(form, { hash: true })

    event.preventDefault()

    this.setState({ errors: {}, isScraping: true }, () => {
      axios({
        url: `/ajax/products/fetch/?url=${get(formData, 'url')}`,
        method: 'get'
      }).then((res) => {
        if (!isEmpty(get(res, 'data.id'))) {
          this.setState({
            url: '',
            product: get(res, 'data'),
            isScraping: false,
            hasScrapped: false,
            productAlreadyExists: true
          })
        } else {
          this.setState({
            name: get(res, 'data.title', ''),
            price: get(res, 'data.price', ''),
            brand: get(res, 'data.brand', ''),
            errors: {},
            product: {},
            isScraping: false,
            hasScrapped: true,
            description: get(res, 'data.description', ''),
            isLoadingImage: true,
            savingSuccessful: false,
            productAlreadyExists: false
          }, () => {
            getValidProductImages(
              get(res, 'data.images', []), 200
            ).then((images) => {
              images = !isEmpty(images) ? images : get(res, 'data.images', [])

              this.setState({
                image: head(images),
                images,
                errors: {},
                product: {},
                imageIndex: 0,
                isScraping: false,
                hasScrapped: true,
                isLoadingImage: !isEmpty(images),
                savingSuccessful: false,
                productAlreadyExists: false
              })
            }).catch(() => {
              this.setState({
                image: head(get(res, 'data.images', [])),
                images: get(res, 'data.images', []),
                errors: {},
                product: {},
                imageIndex: 0,
                isScraping: false,
                hasScrapped: true,
                isLoadingImage: !isEmpty(get(res, 'data.images', [])),
                savingSuccessful: false,
                productAlreadyExists: false
              })
            })
          })
        }
      }).catch((res) => {
        this.setState({
          errors: get(res, 'data.err', {}),
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

  renderScrapeForm() {
    const { csrf } = this.context
    const { formMethod } = this.props
    const { isScraping } = this.state

    return (
      <form
        ref={(form) => this.scraperForm = form}
        action="/ajax/products/fetch/"
        method="POST"
        onSubmit={::this.onScrapeFormSubmit}
        className="form product-form-scrape">
        <input type="hidden" name="_csrf" value={csrf}/>
        <input type="hidden" name="_method" value={formMethod}/>

        <h1 className="form-title">
          {isEqual(formMethod, 'POST') ? 'Add Product' : 'Update Product'}
        </h1>

        <div className="form-group">
          <label className="form-label">
            Product's Url <small>required</small>
          </label>

          <div className="textfield-icon">
            <Icon name="search"/>
            <input
              type="url"
              name="url"
              value={get(this.state, 'url', '')}
              required
              onChange={(event) => {
                this.setState({ url: event.currentTarget.value })
              }}
              disabled={isScraping}
              autoFocus
              className="textfield"
              placeholder="E.g. https://example.com/abc-123"/>
          </div>
        </div>

        <div className="form-group">
          <div className="form-group form-group--inline">
            <button
              type="submit"
              disabled={isScraping}
              className="button button--primary">
              <span className="button-text">
                <Icon name="info"/>
                {isScraping ? 'Getting Product Info...' : 'Get Product Info'}
              </span>
            </button>
            <button onClick={::this.reset} className="button">
              <span className="button-text">Cancel</span>
            </button>
          </div>
        </div>
      </form>
    )
  }

  onSubmit(event) {
    const { product, onAdded, formMethod } = this.props
    const { hasSaved, isDeleting, isLoadingImage } = this.state

    const isAdding = isEqual(formMethod, 'POST')

    event.preventDefault()

    if ((hasSaved && isAdding) || isLoadingImage || isDeleting) {
      return
    }

    const form = this.form
    const formData = serialize(form, { hash: true })
    const ajaxEndpoint = isAdding
      ? '/ajax/products/add/'
      : `/ajax/products/${get(product, 'id', '')}/`

    this.setState({ errors: {}, isSaving: true }, () => {
      axios({
        url: ajaxEndpoint,
        data: formData,
        method: formMethod
      }).then((res) => {
        const product = get(res, 'data', {})

        this.setState({
          errors: {},
          product,
          isSaving: false,
          hasSaved: true,
          savingSuccessful: true
        }, () => onAdded(product))
      }).catch((res) => {
        this.setState({
          errors: get(res, 'data.err', {}),
          product: {},
          isSaving: false,
          hasSaved: false,
          savingSuccessful: false
        })
      })
    })
  }

  onClickDelete() {
    const { csrf } = this.context
    const { product } = this.props
    const deleteMessage = (
      'Are you sure you want to delete this product? \n' +
      'This action cannot be undone. ' +
      'Type the word "DELETE" to confirm.'
    )

    if (isEqual(window.prompt(deleteMessage), 'DELETE')) {
      this.setState({ errors: {}, isDeleting: true }, () => {
        axios({
          url: `/ajax/products/${get(product, 'id', '')}/`,
          data: { _csrf: csrf, _method: 'delete' },
          method: 'POST'
        }).then(() => {
          this.setState({
            product: {},
            isDeleting: false,
            deletingSuccessful: true
          })
        }).catch((res) => {
          this.setState({
            errors: get(res, 'data.err', {}),
            product: {},
            isDeleting: false,
            deletingSuccessful: false
          })
        })
      })
    }
  }

  renderProductImagePicker() {
    const { formMethod } = this.props

    const {
      image,
      images,
      isSaving,
      isDeleting,
      imageIndex,
      hasScrapped,
      isLoadingImage,
      deletingSuccessful,
      imageUrlFormIsVisible,
      isLoadingImageFromUrl
    } = this.state

    const isAdding = isEqual(formMethod, 'POST')
    const hasImages = !isEmpty(images)
    const shouldDisable = (
      isSaving || isDeleting || isLoadingImage ||
      deletingSuccessful || isLoadingImageFromUrl
    )

    const selectPrevImage = () => {
      const nextImage = imageIndex - 1

      if (nextImage >= 0) {
        this.setState({
          image: images[nextImage],
          imageIndex: nextImage,
          isLoadingImage: true
        })
      }
    }

    const selectNextImage = () => {
      const nextImage = imageIndex + 1

      if (nextImage <= size(images) - 1) {
        this.setState({
          image: images[nextImage],
          imageIndex: nextImage,
          isLoadingImage: true
        })
      }
    }

    const onImageLoad = () => {
      this.setState({
        isLoadingImage: false
      })
    }

    return (
      <div className="image-picker">
        <input type="hidden" name="image" value={image}/>

        <div
          className={classNames({
            'image-picker-current': true,
            'image-picker-current--loading': (
              isLoadingImage
            )
          })}>
          {isLoadingImage ? (
            <Loader size={60}/>
          ) : null}

          {hasScrapped && isAdding ? (
            !hasImages && !isLoadingImage ? (
              <Icon
                name="image"
                width={120}
                height={120}
                className="image-picker-no-images-icon"/>
            ) : (
              <img
                src={image}
                onLoad={onImageLoad}
                className="image-picker-current-image"/>
            )
          ) : (
            <img
              src={image}
              onLoad={onImageLoad}
              className="image-picker-current-image"/>
          )}
        </div>

        {imageUrlFormIsVisible || !hasImages ? (
          <div className="image-picker-url-form">
            <input
              ref={(input) => this.imageUrlInput = input}
              type="url"
              value={get(this.state, 'image', '')}
              onChange={(event) => {
                const newImage = event.currentTarget.value

                if (!isEqual(newImage, image)) {
                  this.setState({
                    image: newImage,
                    isLoadingImage: true
                  })
                }
              }}
              disabled={shouldDisable}
              autoFocus
              className="textfield image-picker-url-form-input"
              placeholder="E.g. https://amzn.com/ABC123"/>
            <button
              type="button"
              onClick={() => {
                const newImage = this.imageUrlInput.value

                if (!isEqual(newImage, image)) {
                  this.setState({
                    image: newImage,
                    isLoadingImage: true
                  })
                }
              }}
              disabled={shouldDisable}
              className="button">
              <span className="button-text">
                <Icon name="image"/> Load Image
              </span>
            </button>
            {isAdding ? (
              <button
                type="button"
                onClick={() => {
                  this.setState({
                    image: images[imageIndex],
                    isLoadingImage: true,
                    imageUrlFormIsVisible: false
                  })
                }}
                disabled={shouldDisable}
                className="button">
                <span className="button-text">
                  <Icon name="close"/> Cancel
                </span>
              </button>
            ) : null}
          </div>
        ) : (
          <div className="image-picker-actions">
            <div className="image-picker-actions-left">
              <button
                type="button"
                onClick={() => this.setState({ imageUrlFormIsVisible: true })}
                disabled={shouldDisable}
                className="button">
                <span className="button-text">
                  <Icon name="link"/> Upload From Url
                </span>
              </button>
            </div>
            <div className="image-picker-actions-right">
              {hasImages ? (
                <button
                  type="button"
                  onClick={selectPrevImage}
                  disabled={(
                    shouldDisable ||
                    isEqual(imageIndex, 0)
                  )}
                  className="button button--icon image-picker-nav-prev">
                  <span className="button-text">
                    <Icon name="prev"/>
                  </span>
                </button>
              ) : null}
              {hasImages ? (
                <button
                  type="button"
                  onClick={selectNextImage}
                  disabled={(
                    shouldDisable ||
                    imageIndex >= size(images) - 1
                  )}
                  className="button button--icon image-picker-nav-next">
                  <span className="button-text">
                    <Icon name="next"/>
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
    const { csrf, currentUserIsAdmin } = this.context

    const {
      errors,
      isSaving,
      isDeleting,
      isLoadingImage,
      deletingSuccessful
    } = this.state

    const {
      brands,
      colors,
      product,
      categories,
      spaceTypes,
      formMethod
    } = this.props

    const isAdding = isEqual(formMethod, 'POST')

    const shouldDisable = (
      isSaving || isDeleting || isLoadingImage || deletingSuccessful
    )

    const formAction = isAdding
      ? '/products/new/'
      : `/products/${get(product, 'customId')}/update/`

    const urlError = get(errors, 'url')
    const hasUrlError = !isEmpty(urlError)

    const nameError = get(errors, 'name')
    const hasNameError = !isEmpty(nameError)

    const descriptionError = get(errors, 'description')
    const hasDescriptionError = !isEmpty(descriptionError)

    const brandError = get(errors, 'brand')
    const hasBrandError = !isEmpty(brandError)

    const priceError = get(errors, 'price')
    const hasPriceError = !isEmpty(priceError)

    const categoriesError = get(errors, 'categories')
    const hasCategoriesError = !isEmpty(categoriesError)

    const spaceTypesError = get(errors, 'spaceTypes')
    const hasSpaceTypesError = !isEmpty(spaceTypesError)

    const colorsError = get(errors, 'colors')
    const hasColorsError = !isEmpty(colorsError)

    return (
      <form
        ref={(form) => this.form = form}
        action={formAction}
        method="POST"
        onSubmit={::this.onSubmit}
        className="form product-form">
        <input type="hidden" name="_csrf" value={csrf}/>
        <input type="hidden" name="_method" value={formMethod}/>

        <h1 className="form-title">
          {isEqual(formMethod, 'POST') ? 'Add Product' : 'Update Product'}
        </h1>

        {!isAdding ? (
          <div className="form-group">
            <label className="form-label">
              Url <small>required</small>
            </label>

            <input
              type="text"
              name="url"
              value={get(this.state, 'url', '')}
              required
              onChange={(event) => {
                this.setState({ url: event.currentTarget.value })
              }}
              disabled={isSaving}
              className={classNames({
                'textfield': true,
                'textfield--error': hasUrlError
              })}
              placeholder="Name"/>

            {hasUrlError ? (
              <small className="form-error">{urlError}</small>
            ) : null}
          </div>
        ) : (
          <input type="hidden" name="url" value={get(this.state, 'url', '')}/>
        )}

        <div className="form-group">
          <label className="form-label">
            Image <small>required</small>
          </label>
          {this.renderProductImagePicker()}
        </div>

        <div className="form-group">
          <label className="form-label">
            Name <small>required</small>
          </label>

          <input
            type="text"
            name="name"
            value={get(this.state, 'name', '')}
            required
            onChange={(event) => {
              this.setState({ name: event.currentTarget.value })
            }}
            disabled={isSaving}
            className={classNames({
              'textfield': true,
              'textfield--error': hasNameError
            })}
            placeholder="Name"/>

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
            value={get(this.state, 'description', '')}
            disabled={isSaving}
            onChange={(event) => {
              this.setState({ description: event.currentTarget.value })
            }}
            className={classNames({
              'textfield': true,
              'textfield--error': hasDescriptionError
            })}
            placeholder="Description"/>

          {hasDescriptionError ? (
            <small className="form-error">{descriptionError}</small>
          ) : null}
        </div>

        <div className="form-group">
          <div className="form-group form-group--inline">
            <div className="form-group">
              <label className="form-label">
                Brand <small>required</small>
              </label>

              <Select
                name="brand"
                value={get(this.state, 'brand', '')}
                options={map(brands, (brand) => ({
                  value: get(brand, 'name'),
                  label: get(brand, 'name')
                }))}
                required
                onChange={(brand) => {
                  this.setState({ brand })
                }}
                disabled={isSaving}
                className={classNames({
                  'select': true,
                  'select--error': hasBrandError
                })}
                placeholder="E.g. Apple"
                allowCreate={true}
                addLabelText={'Add "{label}" as a new brand'}/>

              {hasBrandError ? (
                <small className="form-error">{brandError}</small>
              ) : null}
            </div>

            <div className="form-group">
              <label className="form-label">
                Price <small>required</small>
              </label>

              <input
                type="text"
                name="price"
                value={get(this.state, 'price', '')}
                required
                onChange={(event) => {
                  this.setState({ price: event.currentTarget.value })
                }}
                disabled={isSaving}
                className={classNames({
                  'textfield': true,
                  'textfield--error': hasPriceError
                })}
                placeholder="E.g. $99"/>

              {hasPriceError ? (
                <small className="form-error">{priceError}</small>
              ) : null}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">
            Categories <small>required</small>
          </label>

          <Select
            name="categories"
            multi={true}
            value={get(this.state, 'categories', '')}
            options={map(categories, (category) => ({
              value: get(category, 'name'),
              label: get(category, 'name')
            }))}
            required
            onChange={(categories) => {
              this.setState({ categories })
            }}
            disabled={isSaving}
            className={classNames({
              'select': true,
              'select--error': hasCategoriesError
            })}
            placeholder="E.g. Pattern, Minimal"
            allowCreate={true}
            addLabelText={'Add "{label}" as a new category'}/>

          {hasCategoriesError ? (
            <small className="form-error">{categoriesError}</small>
          ) : null}
        </div>

        <div className="form-group">
          <label className="form-label">
            Colors <small>optional</small>
          </label>

          <Select
            name="colors"
            multi={true}
            value={get(this.state, 'colors', '')}
            options={map(colors, (color) => ({
              value: get(color, 'name'),
              label: get(color, 'name'),
              color: get(color, 'hex')
            }))}
            required
            onChange={(colors) => {
              this.setState({ colors })
            }}
            disabled={isSaving}
            className={classNames({
              'select': true,
              'select--error': hasColorsError
            })}
            placeholder="E.g. White, Charcoal Gray"
            valueRenderer={(option) => (
              <span
                id={`select-value-${get(option, 'value')}`}
                className="select-value-color-container">
                <span
                  style={{ backgroundColor: get(option, 'color') }}
                  className="select-value-color"/>
                {get(option, 'label')}
              </span>
            )}
            optionRenderer={(option) => (
            	<span
                id={`select-option-${get(option, 'value')}`}
                className="select-option-color-container">
                <span
                  style={{ backgroundColor: get(option, 'color') }}
                  className="select-option-color"/>
                {get(option, 'label')}
              </span>
            )}/>

          {hasColorsError ? (
            <small className="form-error">{colorsError}</small>
          ) : null}
        </div>

        <div className="form-group">
          <label className="form-label">
            Spaces <small>required</small>
          </label>

          <Select
            name="spaceTypes"
            multi={true}
            value={get(this.state, 'spaceTypes', '')}
            options={map(spaceTypes, (spaceTpye) => ({
              value: get(spaceTpye, 'name'),
              label: get(spaceTpye, 'name')
            }))}
            required
            onChange={(spaceTypes) => {
              this.setState({ spaceTypes })
            }}
            disabled={isSaving}
            className={classNames({
              'select': true,
              'select--error': hasSpaceTypesError
            })}
            placeholder="E.g. Kitchen, Patio"
            allowCreate={currentUserIsAdmin() ? true : false}
            addLabelText={'Add "{label}" as a new space type'}/>

          {hasSpaceTypesError ? (
            <small className="form-error">{spaceTypesError}</small>
          ) : null}
        </div>

        <div className="form-group">
          <div className="form-group form-group--inline">
            <button
              type="submit"
              disabled={shouldDisable}
              className="button button--primary">
              <span className="button-text">
                <Icon name={isAdding ? 'add' : 'info'}/>
                {isSaving ? (
                  isAdding ? 'Adding...' : 'Updating...'
                ) : (
                  isAdding ? 'Add' : 'Update'
                )}
              </span>
            </button>
            {isAdding ? (
              <a href="/admin/brands/" className="button">
                <span className="button-text">Cancel</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={::this.onClickDelete}
                disabled={shouldDisable}
                className="button button--danger">
                <span className="button-text">
                  <Icon name="delete"/>
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </span>
              </button>
            )}
          </div>
        </div>
      </form>
    )
  }

  renderForm() {
    const { formMethod } = this.props
    const { hasScrapped } = this.state

    if (!hasScrapped && isEqual(formMethod, 'POST')) {
      return this.renderScrapeForm()
    } else if (hasScrapped || isEqual(formMethod, 'PUT')) {
      return this.renderProductForm()
    }
  }

  renderNotification() {
    const {
      formMethod,
      isAddingForSpace
    } = this.props

    const {
      errors,
      product,
      savingSuccessful,
      deletingSuccessful,
      productAlreadyExists
    } = this.state

    const isUpdating = isEqual(formMethod, 'PUT')

    const sid = get(product, 'sid', '')
    const name = get(product, 'name', 'Color')

    const genericError = get(errors, 'generic')
    const hasGenericError = !isEmpty(genericError)

    const onClose = () => {
      if (deletingSuccessful || !isAddingForSpace && !isUpdating) {
        window.onbeforeunload = () => {}
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


    if (productAlreadyExists) {
      return (
        <Notification onClose={onClose}>
          This product aleary exists. <a href={`/products/${sid}/`}>{name}</a>.
        </Notification>
      )
    } else if (savingSuccessful) {
      return isEqual(formMethod, 'POST') ? (
        <Notification type="success" delay={2500} onClose={onClose}>
          {`"${name}"`} was added successfully.
          Click <a href={`/products/${sid}/update/`}>here</a> to edit.
        </Notification>
      ) : (
        <Notification type="success" onClose={onClose}>
          {`"${name}"`} was updated successfully.
        </Notification>
      )
    } else if (deletingSuccessful) {
      return (
        <Notification type="success" delay={2500} onClose={onClose}>
          {`"${name}"`} was deleted successfully. Redirecting...
        </Notification>
      )
    } else if (hasGenericError) {
      return (
        <Notification
          type="error"
          onClose={() => {
            this.setState({
              errors: {},
              savingSuccessful: false
            })
          }}>
          {genericError}
        </Notification>
      )
    } else {
      return null
    }
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
