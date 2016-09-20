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

import toStringId from '../../api/utils/toStringId'
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
      name: '',
      errors: {},
      spaceType: '',
      isWaiting: false,
      spaceTypes,
      description: '',
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

    const { props, context } = this

    const isPOST = props.formMethod === 'POST'

    const formData = assign(
      isPOST ? { products: props.products } : {},
      serialize(this.form, { hash: true })
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
          spaceType: '',
          description: ''
        } : {}

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
          <input type="hidden" name="_method" value="POST" />

          {isPOST ? (
            <div className="form-group">
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
                  'select--error': hasTypeError
                })}
                placeholder="E.g. Kitchen"
              />

              {hasTypeError ? (
                <small className="form-error">{typeError}</small>
              ) : null}
            </div>
          ) : null}

          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Name <small>required</small>
            </label>

            <input
              id="name"
              type="text"
              name="name"
              required
              disabled={disabled}
              onChange={this.onNameChange}
              className={classNames({
                textfield: true,
                'textfield--error': hasNameError
              })}
              placeholder="E.g. My dream kitchen"
              defaultValue={get(props.space, 'name')}
            />

            {hasNameError ? (
              <small className="form-error">{nameError}</small>
            ) : null}
          </div>

          <div className="form-group">
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
              disabled={state.isWaiting}
              onChange={this.onDescriptionChange}
              className={classNames({
                textfield: true,
                'textfield--error': (
                  hasDescriptionError ||
                  state.hasDescriptionCharsError
                )
              })}
              placeholder="E.g. A modern kitchen with..."
              defaultValue={get(props.space, 'description')}
            />

            {hasDescriptionError ? (
              <small className="form-error">{descriptionError}</small>
            ) : null}
          </div>

          <div className="form-group">
            <div className="form-group form-group--inline">
              <button
                type="submit"
                disabled={disabled || state.hasDescriptionCharsError}
                className="button button--primary"
              >
                <span className="button-text">
                  {btnText}
                </span>
              </button>
              <button
                type="button"
                onClick={props.onCancel}
                disabled={disabled || state.hasDescriptionCharsError}
                className="button button--link"
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
