import get from 'lodash/get'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Notification from '../common/Notification'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'

export default class BrandForm extends Component {
  static contextTypes = {
    csrf: PropTypes.string
  }

  static propTypes = {
    brand: PropTypes.object,
    formMethod: PropTypes.string.isRequired
  }

  static defaultProps = {
    brand: {},
    formMethod: 'POST'
  }

  constructor(props) {
    super(props)

    this.state = {
      url: get(props.brand, 'url', ''),
      name: get(props.brand, 'name', ''),
      logo: get(props.brand, 'logo', ''),
      brand: {},
      errors: {},
      isSaving: false,
      hasSaved: false,
      isDeleting: false,
      description: get(props.brand, 'description', ''),
      savingSuccessful: false,
      deletingSuccessful: false
    }
  }

  componentDidMount() {
    const { props, state } = this.state

    window.onbeforeunload = () => {
      const action = props.formMethod === 'POST'
        ? 'adding'
        : 'updating'

      if (state.isSaving) {
        return (
          `You are in the process of ${action} a brand. ` +
          'Are you sure you want to navigate away from this page and ' +
          'loose your progress?'
        )
      }
    }
  }

  onSubmit = (event) => {
    const { props } = this

    const form = this.form
    const isPOST = props.formMethod === 'POST'
    const formData = serialize(form, { hash: true })
    const endpoint = isPOST
      ? '/ajax/brands/'
      : `/ajax/brands/${toStringId(props.brand)}/`

    event.preventDefault()

    this.setState({
      errors: {},
      isSaving: true
    }, () => {
      axios({
        url: endpoint,
        data: formData,
        method: props.formMethod
      })
      .then(({ data: brand }) => {
        const resetData = isPOST ? {
          url: '',
          name: '',
          logo: '',
          description: ''
        } : {}

        this.setState({
          brand,
          errors: {},
          isSaving: false,
          hasSaved: true,
          savingSuccessful: true,
          ...resetData
        })
      })
      .catch(({ response }) => {
        this.setState({
          brand: {},
          errors: get(response, 'data.err', {}),
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
      'Are you sure you want to delete this brand? \n' +
      'This action cannot be undone. ' +
      'Type the word "DELETE" to confirm.'
    )

    if (window.prompt(deleteMessage) === 'DELETE') {
      this.setState({
        errors: {},
        isDeleting: true
      }, () => {
        axios
          .post(`/ajax/brands/${toStringId(props.brand)}/`, {
            _csrf: context.csrf,
            _method: 'delete'
          })
          .then(() => {
            this.setState({
              brand: {},
              isDeleting: false,
              deletingSuccessful: true
            })
          })
          .catch((res) => {
            this.setState({
              brand: {},
              errors: get(res, 'data.err', {}),
              isDeleting: false,
              deletingSuccessful: false
            })
          })
      })
    }
  }

  onNameChange = ({ currentTarget: input }) => {
    this.setState({
      name: input.value
    })
  }

  onUrlChange = ({ currentTarget: input }) => {
    this.setState({
      url: input.value
    })
  }

  onDescriptionChange = ({ currentTarget: input }) => {
    this.setState({
      description: input.value
    })
  }

  form = null;

  renderForm() {
    const { props, state, context } = this

    const isPOST = props.formMethod === 'POST'
    const shouldDisable = (
      state.isSaving ||
      state.isDeleting ||
      state.deletingSuccessful
    )

    const urlError = get(state.errors, 'url')
    const hasUrlError = !isEmpty(urlError)

    const nameError = get(state.errors, 'name')
    const hasNameError = !isEmpty(nameError)

    const descriptionError = get(state.errors, 'description')
    const hasDescriptionError = !isEmpty(descriptionError)

    let btnText = ''

    if (isPOST) {
      btnText = state.isSaving ? 'Adding Brand...' : 'Add Brand'
    } else {
      btnText = state.isSaving ? 'Updating Brand...' : 'Update Brand'
    }

    return (
      <form
        ref={form => { this.form = form }}
        method="POST"
        onSubmit={this.onSubmit}
        className="form brand-form"
      >
        <input type="hidden" name="_csrf" value={context.csrf} />
        <input type="hidden" name="_method" value={props.formMethod} />

        <h1 className="form-title">
          {isPOST ? 'Add Brand' : 'Update Brand'}
          <a href="/admin/brands/" className="form-title-link">
            <MaterialDesignIcon name="list" size={18} />
            All Brands
          </a>
        </h1>

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name <small>required</small>
          </label>

          <input
            id="name"
            type="text"
            name="name"
            required
            value={state.name}
            disabled={shouldDisable}
            onChange={this.onNameChange}
            autoFocus
            className={classNames({
              textfield: true,
              'textfield--error': hasNameError
            })}
            placeholder="E.g. Ikea"
          />

          {hasNameError ? (
            <small className="form-error">{nameError}</small>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="url" className="form-label">
            Url <small>optional</small>
          </label>

          <input
            id="url"
            type="url"
            name="url"
            value={state.url}
            disabled={shouldDisable}
            onChange={this.onUrlChange}
            autoFocus
            className={classNames({
              textfield: true,
              'textfield--error': hasUrlError
            })}
            placeholder="E.g. http://www.ikea.com/"
          />

          {hasUrlError ? (
            <small className="form-error">{urlError}</small>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description <small>optional</small>
          </label>

          <textarea
            id="description"
            name="description"
            value={state.description}
            disabled={shouldDisable}
            onChange={this.onDescriptionChange}
            className={classNames({
              textfield: true,
              'textfield--error': hasDescriptionError
            })}
            placeholder="E.g. The IKEA Concept starts with the idea of..."
          />

          {hasDescriptionError ? (
            <small className="form-error">{descriptionError}</small>
          ) : null}
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
              <a href="/admin/brands/" className="button">
                <span className="button-text">Cancel</span>
              </a>
            ) : (
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
            )}
          </div>
        </div>
      </form>
    )
  }

  renderNotification() {
    const { props, state } = this

    const sid = get(state.brand, 'sid', '')
    const url = !isEmpty(sid) ? `/admin/brands/${sid}/update/` : '#'
    const name = get(state.brand, 'name', 'Brand')

    const genericError = get(state.errors, 'generic')
    const hasGenericError = !isEmpty(genericError)

    const onClose = () => {
      if (state.deletingSuccessful) {
        window.location.href = '/admin/brands/'
      } else {
        this.setState({
          brand: {},
          hasSaved: false,
          savingSuccessful: false
        })
      }
    }

    if (state.savingSuccessful) {
      return (
        <Notification
          type="success"
          onClose={onClose}
          timeout={3500}
          isVisible
        >
          {props.formMethod === 'POST' ? (
            <span>
              "{name}" was added successfully.
              Click <a href={url}>here</a> to edit.
            </span>
          ) : (
            <span>
              "{name}" was updated successfully.
            </span>
          )}
        </Notification>
      )
    } else if (state.deletingSuccessful) {
      return (
        <Notification
          type="success"
          timeout={3500}
          onClose={onClose}
          isVisible
        >
          "{name}" was deleted successfully. Redirecting...
        </Notification>
      )
    } else if (hasGenericError) {
      return (
        <Notification
          type="error"
          timeout={3500}
          onClose={() => {
            this.setState({
              errors: {},
              savingSuccessful: false
            })
          }}
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
      <div className="brand-form-container">
        {this.renderNotification()}
        {this.renderForm()}
      </div>
    )
  }
}
