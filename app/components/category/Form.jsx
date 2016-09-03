import get from 'lodash/get'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Notification from '../common/Notification'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'

export default class CategoryForm extends Component {
  static contextTypes = {
    csrf: PropTypes.string
  }

  static propTypes = {
    category: PropTypes.object,
    formMethod: PropTypes.string
  }

  static defaultProps = {
    category: {},
    formMethod: 'POST'
  }

  constructor(props) {
    super(props)

    this.state = {
      name: get(props.category, 'name', ''),
      errors: {},
      category: {},
      isSaving: false,
      hasSaved: false,
      isDeleting: false,
      savingSuccessful: false,
      deletingSuccessful: false
    }

    this.form = null
  }

  componentDidMount() {
    const { props, state } = this.state

    window.onbeforeunload = () => {
      let action

      if (state.isDeleting) {
        action = 'deleting'
      } else if (state.isSaving && props.formMethod === 'POST') {
        action = 'adding'
      } else if (state.isSaving && props.formMethod === 'PUT') {
        action = 'updating'
      }

      if (state.isSaving || state.isDeleting) {
        return (
          `You are in the process of ${action} a category. ` +
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
      ? '/ajax/categories/'
      : `/ajax/categories/${toStringId(props.category)}/`

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
      .then(({ data: category }) => {
        const resetData = isPOST ? { name: '' } : {}

        this.setState({
          errors: {},
          isSaving: false,
          hasSaved: true,
          category,
          savingSuccessful: true,
          ...resetData
        })
      })
      .catch(({ response }) => {
        this.setState({
          errors: get(response, 'data.err', {}),
          category: {},
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
      'Are you sure you want to delete this category? \n' +
      'This action cannot be undone. ' +
      'Type the word "DELETE" to confirm.'
    )

    if (window.prompt(deleteMessage) === 'DELETE') {
      this.setState({
        errors: {},
        isDeleting: true
      }, () => {
        axios
          .post(`/ajax/categories/${toStringId(props.category)}/`, {
            _csrf: context.csrf,
            _method: 'delete'
          })
          .then(() => {
            this.setState({
              category: {},
              isDeleting: false,
              deletingSuccessful: true
            })
          })
          .catch(({ response }) => {
            this.setState({
              errors: get(response, 'data.err', {}),
              category: {},
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

  renderForm() {
    const { props, state, context } = this

    const isPOST = props.formMethod === 'POST'

    const shouldDisable = (
      state.isSaving ||
      state.isDeleting ||
      state.deletingSuccessful
    )

    const nameError = get(state.errors, 'name')
    const hasNameError = !isEmpty(nameError)

    let btnText = ''

    if (isPOST) {
      btnText = state.isSaving ? 'Adding Category...' : 'Add Category'
    } else {
      btnText = state.isSaving ? 'Updating Category...' : 'Update Category'
    }

    return (
      <form
        ref={form => { this.form = form }}
        method="POST"
        onSubmit={this.onSubmit}
        className="form category-form"
      >
        <input type="hidden" name="_csrf" value={context.csrf} />
        <input type="hidden" name="_method" value={props.formMethod} />

        <h1 className="form-title">
          {isPOST ? 'Add Category' : 'Update Category'}
          <a href="/admin/categories/" className="form-title-link">
            <MaterialDesignIcon name="list" size={18} />
            All Categories
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
            value={state.name}
            required
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
              <a href="/admin/categories/" className="button">
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

    const sid = get(state.category, 'sid', '')
    const url = !isEmpty(sid) ? `/admin/categories/${sid}/update/` : '#'
    const name = get(state.category, 'name', 'Category')

    const genericError = get(state.errors, 'generic')
    const hasGenericError = !isEmpty(genericError)

    const onClose = () => {
      if (state.deletingSuccessful) {
        window.location.href = '/admin/categories/'
      } else {
        this.setState({
          category: {},
          hasSaved: false,
          savingSuccessful: false
        })
      }
    }

    if (state.savingSuccessful) {
      return (
        <Notification
          type="success"
          timeout={3500}
          onClose={onClose}
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
      <div className="category-form-container">
        {this.renderNotification()}
        {this.renderForm()}
      </div>
    )
  }
}
