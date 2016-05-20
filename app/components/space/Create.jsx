import get from 'lodash/get'
import axios from 'axios'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import Icon from '../common/Icon'
import Layout from '../common/Layout'
import Notification from '../common/Notification'
import ProductSearchForm from '../product/SearchForm'

export default class CreateSpace extends Component {
  constructor(props) {
    super(props)

    this.state = {
      space: {},
      errors: {},

      name: get(props, 'space.name', ''),
      products: get(props, 'space.products', []),
      description: get(props, 'space.description', ''),

      isSaving: false,
      hasSaved: false,
      savingSuccessful: false,

      isDeleting: false,
      deletingSuccessful: false
    }

    this.form = null
  }

  static contextTypes = {
    csrf: Type.string
  };

  static propTypes = {
    space: Type.object,
    formMethod: Type.string.isRequired
  };

  static defaultProps = {
    space: {},
    formMethod: 'POST'
  };

  componentDidMount() {
    const { isSaving } = this.state
    const { formMethod } = this.props

    window.onbeforeunload = () => {
      const action = isEqual(formMethod, 'POST') ? 'creating' : 'updating'

      if (isSaving) {
        return (
          `You are in the process of ${action} a space. ` +
          'Are you sure you want to navigate away from this page and ' +
          'loose your progress?'
        )
      }
    }
  }

  onSubmit(event) {
    const { space, formMethod } = this.props

    const form = this.form
    const formData = serialize(form, { hash: true })
    const isCreating = isEqual(formMethod, 'POST')
    const ajaxEndpoint = isCreating
      ? '/ajax/spaces/'
      : `/ajax/spaces/${get(space, 'sid', '')}/`

    event.preventDefault()

    this.setState({ errors: {}, isSaving: true }, () => {
      axios({
        url: ajaxEndpoint,
        data: formData,
        method: formMethod
      }).then((res) => {
        const resetData = isCreating ? { name: '' } : {}

        this.setState(merge({
          space: get(res, 'data', {}),
          errors: {},
          isSaving: false,
          hasSaved: true,
          savingSuccessful: true
        }, resetData))
      }).catch((res) => {
        this.setState({
          space: {},
          errors: get(res, 'data.err', {}),
          isSaving: false,
          hasSaved: false,
          savingSuccessful: false
        })
      })
    })
  }

  onClickDelete() {
    const { csrf } = this.context
    const { space } = this.props
    const deleteMessage = (
      'Are you sure you want to delete this space? \n' +
      'This action cannot be undone. ' +
      'Type the word "DELETE" to confirm.'
    )

    if (isEqual(window.prompt(deleteMessage), 'DELETE')) {
      this.setState({ errors: {}, isDeleting: true }, () => {
        axios({
          url: `/ajax/spaces/${get(space, 'sid', '')}/`,
          data: { _csrf: csrf, _method: 'delete' },
          method: 'POST'
        }).then(() => {
          this.setState({
            space: {},
            isDeleting: false,
            deletingSuccessful: true
          })
        }).catch((res) => {
          this.setState({
            space: {},
            errors: get(res, 'data.err', {}),
            isDeleting: false,
            deletingSuccessful: false
          })
        })
      })
    }
  }

  renderForm() {
    const { csrf } = this.context
    const { formMethod } = this.props
    const { errors, isSaving, isDeleting, deletingSuccessful } = this.state

    const isCreating = isEqual(formMethod, 'POST')
    const shouldDisable = isSaving || isDeleting || deletingSuccessful

    const nameError = get(errors, 'name')
    const hasNameError = !isEmpty(nameError)

    const descriptionError = get(errors, 'description')
    const hasDescriptionError = !isEmpty(descriptionError)

    return (
      <form
        ref={(form) => this.form = form}
        method="POST"
        onSubmit={::this.onSubmit}
        className="form space-form">
        <input type="hidden" name="_csrf" value={csrf}/>
        <input type="hidden" name="_method" value={formMethod}/>

        <div className="form-group">
          <label className="form-label">
            Name <small>required</small>
          </label>

          <input
            type="text"
            name="name"
            required
            value={get(this.state, 'name', '')}
            disabled={shouldDisable}
            onChange={(event) => {
              this.setState({ name: event.currentTarget.value })
            }}
            autoFocus
            className={classNames({
              'textfield': true,
              'textfield--error': hasNameError
            })}
            placeholder="E.g. Ikea"/>

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
            disabled={shouldDisable}
            onChange={(event) => {
              this.setState({ description: event.currentTarget.value })
            }}
            autoFocus
            className={classNames({
              'textfield': true,
              'textfield--error': hasDescriptionError
            })}
            placeholder="E.g. This is my dream kitchen..."/>

          {hasDescriptionError ? (
            <small className="form-error">{descriptionError}</small>
          ) : null}
        </div>

        <div className="form-group">
          <div className="form-group form-group--inline">
            <button
              type="submit"
              disabled={shouldDisable}
              className="button button--primary">
              <span className="button-text">
                <Icon name={isCreating ? 'add' : 'info'}/>
                {isSaving ? (
                  isCreating ? 'Creating...' : 'Updating...'
                ) : (
                  isCreating ? 'Create' : 'Update'
                )}
              </span>
            </button>
            {isCreating ? (
              <a href="/admin/spaces/" className="button">
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

  renderNotification() {
    const { formMethod } = this.props

    const {
      errors,
      space,
      savingSuccessful,
      deletingSuccessful
    } = this.state

    const sid = get(space, 'sid', '')
    const url = !isEmpty(sid) ? `/admin/spaces/${sid}/update/` : '#'
    const name = get(space, 'name', 'Space')

    const genericError = get(errors, 'generic')
    const hasGenericError = !isEmpty(genericError)

    const onClose = () => {
      if (deletingSuccessful) {
        window.location.href = '/admin/spaces/'
      } else {
        this.setState({
          space: {},
          hasSaved: false,
          savingSuccessful: false
        })
      }
    }

    if (savingSuccessful) {
      return isEqual(formMethod, 'POST') ? (
        <Notification type="success" onClose={onClose}>
          {`"${name}"`} was created successfully.
          Click <a href={url}>here</a> to edit.
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

  renderProducts() {
    return (
      <ProductSearchForm/>
    )
  }

  render() {
    const isCreating = isEqual(this.props.formMethod, 'POST')

    return (
      <Layout>
        <div className="space-form-container">
          {this.renderNotification()}

          <h1 className="space-form-title">
            {isCreating ? 'Create Space' : 'Update Space'}
          </h1>

          <div className="space-form-content">
            <div className="space-form-content-left">
              {this.renderForm()}
            </div>
            <div className="space-form-content-right">
              {this.renderProducts()}
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}
