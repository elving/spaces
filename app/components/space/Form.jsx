import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import assign from 'lodash/assign'
import Select from 'react-select'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'
import getImageSize from '../../utils/image/getSize'
import withoutAnyType from '../../utils/spaceType/withoutAnyType'

export default class SpaceForm extends Component {
  static contextTypes = {
    user: PropTypes.object,
    csrf: PropTypes.string,
    currentUserIsOnboarding: PropTypes.func
  }

  static propTypes = {
    space: PropTypes.object,
    onError: PropTypes.func,
    onCancel: PropTypes.func,
    products: PropTypes.array,
    onSuccess: PropTypes.func,
    formMethod: PropTypes.string,
    spaceTypes: PropTypes.array
  }

  static defaultProps = {
    space: {},
    onError: (() => {}),
    onCancel: (() => {}),
    products: [],
    onSuccess: (() => {}),
    formMethod: 'POST',
    spaceTypes: []
  }

  constructor(props, context) {
    super(props, context)

    const formMethod = get(props, 'formMethod', 'POST')
    const spaceTypes = get(props, 'spaceTypes', [])
    const description = get(props.space, 'description', '')
    const descriptionLength = size(description)

    this.state = {
      name: get(props.space, 'name', ''),
      errors: {},
      spaceType: get(props.space, 'spaceType', ''),
      isWaiting: false,
      spaceTypes,
      coverImage: get(props.space, 'coverImage', ''),
      description,
      hasCoverError: false,
      isFetchingSpaceTypes: isEmpty(spaceTypes) && formMethod === 'POST',
      hasFetchedSpaceTypes: !isEmpty(spaceTypes) && formMethod !== 'POST',
      descriptionCharsLeft: (140 - descriptionLength),
      hasDescriptionCharsError: descriptionLength > 140
    }

    this.form = null
  }

  componentDidMount() {
    const { props, state } = this

    const resetFetchingStatus = {
      hasFetchedSpaceTypes: true,
      isFetchingSpaceTypes: false
    }

    if (
      props.formMethod === 'POST' &&
      isEmpty(state.spaceTypes) &&
      !state.hasFetchedSpaceTypes
    ) {
      this.fetchSpaceTypes()
        .then(spaceTypes => {
          this.setState({
            spaceTypes,
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

  onSpaceTypeChange = (spaceType) => {
    this.setState({
      spaceType
    })
  }

  onNameChange = ({ currentTarget }) => {
    this.setState({
      name: currentTarget.value
    })
  }

  onCoverChange = ({ currentTarget: input }) => {
    const file = input.files[0]
    const reader = new FileReader()

    if (!file) {
      return
    }

    if (getImageSize(file) > 9999) {
      this.setState({
        errors: { coverImage: 'Cover photo can\'t be larger than 10MB.' },
        coverImage: '',
        hasCoverError: true
      })
    } else {
      reader.onload = () => {
        this.setState({
          errors: { coverImage: null },
          coverImage: reader.result,
          hasCoverError: false
        })
      }

      reader.readAsDataURL(file)
    }
  }

  onDescriptionChange = ({ currentTarget: input }) => {
    const descriptionCharsLeft = 140 - size(input.value)

    this.setState({
      description: input.value,
      descriptionCharsLeft,
      hasDescriptionCharsError: descriptionCharsLeft < 0
    })
  }

  onSubmit = (event) => {
    event.preventDefault()

    const { props, state, context } = this

    if (state.hasCoverError || state.hasDescriptionCharsError) {
      return
    }

    const isPOST = props.formMethod === 'POST'

    const formData = assign(
      serialize(this.form, { hash: true }),
      isPOST ? { products: props.products } : {},
      !isEmpty(state.coverImage) ? {
        coverImage: state.coverImage
      } : {
        coverImage: ''
      }
    )

    const endpoint = isPOST
      ? '/ajax/spaces/'
      : `/ajax/spaces/${toStringId(props.space)}/`

    this.setState({
      errors: {},
      isWaiting: true
    }, () => {
      axios({
        url: endpoint,
        data: formData,
        method: props.formMethod
      })
      .then(({ data: space }) => {
        const resetData = isPOST ? {
          name: '',
          cover: '',
          spaceType: '',
          description: ''
        } : space

        this.setState({
          errors: {},
          isWaiting: false,
          ...resetData
        }, () => {
          if (context.currentUserIsOnboarding()) {
            window.location.href = `/${get(space, 'detailUrl')}/?onboarded=1`
          } else {
            props.onSuccess(space)
          }
        })
      })
      .catch(({ response }) => {
        const errors = get(response, 'data.err', {})

        this.setState({
          errors,
          isWaiting: false
        }, () => props.onError(errors))
      })
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

  triggerCoverInput = () => {
    this.coverInput.click()
  }

  removeCoverImage = () => {
    this.setState({
      errors: { coverImage: null },
      coverImage: '',
      hasCoverError: false
    })
  }

  render() {
    const { props, state, context } = this

    const isPOST = props.formMethod === 'POST'

    const disabled = (
      state.isFetchingSpaceTypes ||
      state.isWaiting
    )

    const typeError = get(state.errors, 'type')
    const hasTypeError = !isEmpty(typeError)

    const nameError = get(state.errors, 'name')
    const hasNameError = !isEmpty(nameError)

    const coverError = get(state.errors, 'coverImage')
    const hasCoverError = !isEmpty(coverError)

    const descriptionError = get(state.errors, 'description')
    const hasDescriptionError = !isEmpty(descriptionError)

    let btnText = ''

    if (isPOST) {
      btnText = state.isWaiting ? 'Creating...' : 'Create Space'
    } else {
      btnText = state.isWaiting ? 'Updating...' : 'Update Space'
    }

    return (
      <div className="space-form-container">
        <div className="space-form-title">
          {`${isPOST ? 'Create a' : 'Edit'} space`}
        </div>

        <form
          ref={form => { this.form = form }}
          method={props.formMethod}
          onSubmit={this.onSubmit}
          className="form space-form"
        >
          <input type="hidden" name="_csrf" value={context.csrf} />
          <input type="hidden" name="_method" value={props.formMethod} />
          <input type="hidden" name="coverImage" value={state.coverImage} />

          {isPOST ? (
            <div
              className={classNames({
                'form-group': true,
                'form-group--small': isPOST
              })}
            >
              <label htmlFor="type" className="form-label">
                Type <small>required</small>
              </label>

              <Select
                id="type"
                name="spaceType"
                value={state.spaceType}
                options={map(withoutAnyType(state.spaceTypes), type => ({
                  value: toStringId(type),
                  label: get(type, 'name')
                }))}
                required
                onChange={this.onSpaceTypeChange}
                disabled={disabled}
                className={classNames({
                  select: true,
                  'select--small': isPOST,
                  'select--error': hasTypeError
                })}
                placeholder="E.g. Kitchen"
              />

              {hasTypeError ? (
                <small className="form-error">{typeError}</small>
              ) : null}
            </div>
          ) : null}

          <div
            className={classNames({
              'form-group': true,
              'form-group--small': isPOST
            })}
          >
            <label htmlFor="name" className="form-label">
              Name <small>required</small>
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={state.name}
              required
              disabled={disabled}
              onChange={this.onNameChange}
              className={classNames({
                textfield: true,
                'textfield--small': isPOST,
                'textfield--error': hasNameError
              })}
              placeholder="E.g. My dream kitchen"
            />

            {hasNameError ? (
              <small className="form-error">{nameError}</small>
            ) : null}
          </div>

          <div
            className={classNames({
              'form-group': true,
              'form-group--small': isPOST
            })}
            style={{ position: 'relative' }}
          >
            <label htmlFor="name" className="form-label">
              Cover Photo <small>optional</small>
            </label>

            {!isEmpty(state.coverImage) ? (
              <div
                className={classNames({
                  'form-group': true,
                  'form-group--small': isPOST,
                  'form-group--inline': true,
                  'space-form-cover-form-group': true
                })}
              >
                <a
                  rel="noopener noreferrer"
                  href={state.coverImage}
                  target="_blank"
                  className="space-form-cover-container"
                >
                  <img
                    alt="Cover"
                    src={state.coverImage}
                    className="space-form-cover"
                  />
                </a>
                <div className="space-form-cover-actions">
                  <button
                    type="button"
                    onClick={this.triggerCoverInput}
                    className={classNames({
                      button: true,
                      'button--small': true,
                      'space-form-cover-btn': true
                    })}
                  >
                    <span className="button-text">
                      <MaterialDesignIcon name="image" />
                      Change Cover Photo
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={this.removeCoverImage}
                    className={classNames({
                      button: true,
                      'button--small': true,
                      'button--danger': true,
                      'space-form-cover-btn': true
                    })}
                  >
                    <span className="button-text">
                      <MaterialDesignIcon name="close" />
                      Remove Cover Photo
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={this.triggerCoverInput}
                className={classNames({
                  button: true,
                  'button--small': true
                })}
              >
                <span className="button-text">
                  <MaterialDesignIcon name="image" />
                  Add Cover Photo
                </span>
              </button>
            )}

            <input
              id="cover-image"
              ref={coverInput => { this.coverInput = coverInput }}
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              multiple={false}
              onChange={this.onCoverChange}
              className={classNames({
                textfield: true,
                'textfield--small': isPOST,
                'textfield--error': hasCoverError
              })}
            />

            {hasCoverError ? (
              <small className="form-error">{coverError}</small>
            ) : null}

            <small className="form-help">
              Tip: Share an image of your space to let others see how
              the products look in your home.
            </small>
          </div>

          <div
            className={classNames({
              'form-group': true,
              'form-group--small': isPOST
            })}
          >
            <label htmlFor="description" className="form-label">
              Description
              <small
                style={{
                  color: state.hasDescriptionCharsError ? '#ED4542' : '#999999'
                }}
              >
                optional &middot; {state.descriptionCharsLeft}
              </small>
            </label>

            <textarea
              id="description"
              name="description"
              value={state.description}
              disabled={state.isWaiting}
              onChange={this.onDescriptionChange}
              className={classNames({
                textfield: true,
                'textfield--small': isPOST,
                'textfield--error': (
                  hasDescriptionError ||
                  state.hasDescriptionCharsError
                )
              })}
              placeholder="E.g. A modern kitchen with..."
            />

            {hasDescriptionError ? (
              <small className="form-error">{descriptionError}</small>
            ) : null}
          </div>

          <div
            className={classNames({
              'form-group': true,
              'form-group--small': isPOST
            })}
          >
            <div
              className={classNames({
                'form-group': true,
                'form-group--small': isPOST,
                'form-group--inline': true
              })}
            >
              <button
                type="submit"
                disabled={disabled || state.hasDescriptionCharsError}
                className={classNames({
                  button: true,
                  'button--small': isPOST,
                  'button--primary': true
                })}
              >
                <span className="button-text">
                  {btnText}
                </span>
              </button>
              <button
                type="button"
                onClick={props.onCancel}
                disabled={disabled || state.hasDescriptionCharsError}
                className={classNames({
                  button: true,
                  'button--link': true,
                  'button--small': isPOST
                })}
              >
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
}
