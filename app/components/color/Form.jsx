import get from 'lodash/get'
import axios from 'axios'
import merge from 'lodash/merge'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import { Panel as ColorPickerPanel } from 'react-colors-picker'
import React, { Component, PropTypes as Type } from 'react'

import Icon from '../common/Icon'
import Notification from '../common/Notification'

import toStringId from '../../api/utils/toStringId'

export default class ColorForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      color: {},
      errors: {},

      hex: get(props, 'color.hex', ''),
      name: get(props, 'color.name', ''),

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
    color: Type.object,
    formMethod: Type.string.isRequired
  };

  static defaultProps = {
    color: {},
    formMethod: 'POST'
  };

  componentDidMount() {
    const { isSaving } = this.state
    const { formMethod } = this.props

    window.onbeforeunload = () => {
      const action = isEqual(formMethod, 'POST') ? 'adding' : 'updating'

      if (isSaving) {
        return (
          `You are in the process of ${action} a color. ` +
          'Are you sure you want to navigate away from this page and ' +
          'loose your progress?'
        )
      }
    }
  }

  reset(next = (() => {})) {
    this.setState({
      color: {},
      errors: {},

      hex: '',
      name: '',

      isSaving: false,
      hasSaved: false,
      savingSuccessful: false,

      isDeleting: false,
      deletingSuccessful: false
    }, next)
  }

  onSubmit(event) {
    const { color, formMethod } = this.props

    const form = this.form
    const formData = serialize(form, { hash: true })
    const isAdding = isEqual(formMethod, 'POST')
    const ajaxEndpoint = isAdding
      ? '/ajax/colors/'
      : `/ajax/colors/${toStringId(color)}/`

    event.preventDefault()

    if (isEmpty(get(formData, 'hex'))) {
      this.setState({
        errors: {
          hex: 'A hex code is required to add a color'
        }
      })

      return
    }

    this.setState({ errors: {}, isSaving: true }, () => {
      axios({
        url: ajaxEndpoint,
        data: formData,
        method: formMethod
      }).then((res) => {
        const resetData = isAdding ? {
          hex: '',
          name: ''
        } : {}

        this.setState(merge({
          color: get(res, 'data', {}),
          errors: {},
          isSaving: false,
          hasSaved: true,
          savingSuccessful: true
        }, resetData))
      }).catch((res) => {
        this.setState({
          color: {},
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
    const { color } = this.props
    const deleteMessage = (
      'Are you sure you want to delete this color? \n' +
      'This action cannot be undone. ' +
      'Type the word "DELETE" to confirm.'
    )

    if (isEqual(window.prompt(deleteMessage), 'DELETE')) {
      this.setState({ errors: {}, isDeleting: true }, () => {
        axios({
          url: `/ajax/colors/${toStringId(color)}/`,
          data: { _csrf: csrf, _method: 'delete' },
          method: 'POST'
        }).then(() => {
          this.setState({
            color: {},
            isDeleting: false,
            deletingSuccessful: true
          })
        }).catch((res) => {
          this.setState({
            color: {},
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

    const hexError = get(errors, 'hex')
    const hasHexError = !isEmpty(hexError)

    const nameError = get(errors, 'name')
    const hasNameError = !isEmpty(nameError)

    return (
      <form
        ref={(form) => this.form = form}
        method="POST"
        onSubmit={::this.onSubmit}
        className="form color-form">
        <input type="hidden" name="hex" value={get(this.state, 'hex', '')}/>
        <input type="hidden" name="_csrf" value={csrf}/>
        <input type="hidden" name="_method" value={formMethod}/>

        <h1 className="form-title">
          {isAdding ? 'Add Color' : 'Update Color'}
          <a href="/admin/colors/" className="form-title-link">
            <Icon name="list" width={18} height={18}/>
            All Colors
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
            placeholder="E.g. Charcoal Gray"/>

          {hasNameError ? (
            <small className="form-error">{nameError}</small>
          ) : null}
        </div>

        <div className="form-group">
          <label className="form-label">
            Hex <small>required</small>
          </label>

          <ColorPickerPanel
            color={get(this.state, 'hex', '#666666')}
            onChange={(value) => {
              this.setState({ hex: get(value, 'color') })
            }}/>

          {hasHexError ? (
            <small className="form-error">{hexError}</small>
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
              <a href="/admin/colors/" className="button">
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
    const { color, errors, savingSuccessful, deletingSuccessful } = this.state

    const sid = get(color, 'sid', '')
    const url = !isEmpty(sid) ? `/admin/colors/${sid}/update/` : '#'
    const name = get(color, 'name', 'Color')

    const genericError = get(errors, 'generic')
    const hasGenericError = !isEmpty(genericError)

    const onClose = () => {
      if (deletingSuccessful) {
        window.location.href = '/admin/colors/'
      } else {
        this.setState({
          color: {},
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
      <div className="color-form-container">
        {this.renderNotification()}
        {this.renderForm()}
      </div>
    )
  }
}
