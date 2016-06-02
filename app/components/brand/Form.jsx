import get from 'lodash/get'
import axios from 'axios'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import Icon from '../common/Icon'
import Notification from '../common/Notification'

export default class BrandForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      brand: {},
      errors: {},

      url: get(props, 'brand.url', ''),
      name: get(props, 'brand.name', ''),
      logo: get(props, 'brand.logo', ''),
      description: get(props, 'brand.description', ''),

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
    brand: Type.object,
    formMethod: Type.string.isRequired
  };

  static defaultProps = {
    brand: {},
    formMethod: 'POST'
  };

  componentDidMount() {
    const { isSaving } = this.state
    const { formMethod } = this.props

    window.onbeforeunload = () => {
      const action = isEqual(formMethod, 'POST') ? 'adding' : 'updating'

      if (isSaving) {
        return (
          `You are in the process of ${action} a brand. ` +
          'Are you sure you want to navigate away from this page and ' +
          'loose your progress?'
        )
      }
    }
  }

  reset(next = (() => {})) {
    this.setState({
      brand: {},
      errors: {},

      url: '',
      name: '',
      logo: '',
      description: '',

      isSaving: false,
      hasSaved: false,
      savingSuccessful: false,

      isDeleting: false,
      deletingSuccessful: false
    }, next)
  }

  onSubmit(event) {
    const { brand, formMethod } = this.props

    const form = this.form
    const formData = serialize(form, { hash: true })
    const isAdding = isEqual(formMethod, 'POST')
    const ajaxEndpoint = isAdding
      ? '/ajax/brands/'
      : `/ajax/brands/${get(brand, 'id', '')}/`

    event.preventDefault()

    this.setState({ errors: {}, isSaving: true }, () => {
      axios({
        url: ajaxEndpoint,
        data: formData,
        method: formMethod
      }).then((res) => {
        const resetData = isAdding ? {
          url: '',
          name: '',
          logo: '',
          description: ''
        } : {}

        this.setState(merge({
          brand: get(res, 'data', {}),
          errors: {},
          isSaving: false,
          hasSaved: true,
          savingSuccessful: true
        }, resetData))
      }).catch((res) => {
        this.setState({
          brand: {},
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
    const { brand } = this.props
    const deleteMessage = (
      'Are you sure you want to delete this brand? \n' +
      'This action cannot be undone. ' +
      'Type the word "DELETE" to confirm.'
    )

    if (isEqual(window.prompt(deleteMessage), 'DELETE')) {
      this.setState({ errors: {}, isDeleting: true }, () => {
        axios({
          url: `/ajax/brands/${get(brand, 'id', '')}/`,
          data: { _csrf: csrf, _method: 'delete' },
          method: 'POST'
        }).then(() => {
          this.setState({
            brand: {},
            isDeleting: false,
            deletingSuccessful: true
          })
        }).catch((res) => {
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

  renderForm() {
    const { csrf } = this.context
    const { formMethod } = this.props
    const { errors, isSaving, isDeleting, deletingSuccessful } = this.state

    const isAdding = isEqual(formMethod, 'POST')
    const shouldDisable = isSaving || isDeleting || deletingSuccessful

    const urlError = get(errors, 'url')
    const hasUrlError = !isEmpty(urlError)

    const nameError = get(errors, 'name')
    const hasNameError = !isEmpty(nameError)

    const descriptionError = get(errors, 'description')
    const hasDescriptionError = !isEmpty(descriptionError)

    return (
      <form
        ref={(form) => this.form = form}
        method="POST"
        onSubmit={::this.onSubmit}
        className="form brand-form">
        <input type="hidden" name="_csrf" value={csrf}/>
        <input type="hidden" name="_method" value={formMethod}/>

        <h1 className="form-title">
          {isAdding ? 'Add Brand' : 'Update Brand'}
          <a href="/admin/brands/" className="form-title-link">
            <Icon name="list" width={18} height={18}/>
            All Brands
          </a>
        </h1>

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
            Url <small>optional</small>
          </label>

          <input
            type="url"
            name="url"
            value={get(this.state, 'url', '')}
            disabled={shouldDisable}
            onChange={(event) => {
              this.setState({ url: event.currentTarget.value })
            }}
            autoFocus
            className={classNames({
              'textfield': true,
              'textfield--error': hasUrlError
            })}
            placeholder="E.g. http://www.ikea.com/"/>

          {hasUrlError ? (
            <small className="form-error">{urlError}</small>
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
            className={classNames({
              'textfield': true,
              'textfield--error': hasDescriptionError
            })}
            placeholder="E.g. The IKEA Concept starts with the idea of..."/>

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

  renderNotification() {
    const { formMethod } = this.props
    const { brand, errors, savingSuccessful, deletingSuccessful } = this.state

    const sid = get(brand, 'sid', '')
    const url = !isEmpty(sid) ? `/admin/brands/${sid}/update/` : '#'
    const name = get(brand, 'name', 'Brand')

    const genericError = get(errors, 'generic')
    const hasGenericError = !isEmpty(genericError)

    const onClose = () => {
      if (deletingSuccessful) {
        window.location.href = '/admin/brands/'
      } else {
        this.setState({
          brand: {},
          hasSaved: false,
          savingSuccessful: false
        })
      }
    }

    if (savingSuccessful) {
      return isEqual(formMethod, 'POST') ? (
        <Notification type="success" onClose={onClose}>
          {`"${name}"`} was added successfully.
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

  render() {
    return (
      <div className="brand-form-container">
        {this.renderNotification()}
        {this.renderForm()}
      </div>
    )
  }
}
