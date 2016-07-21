import get from 'lodash/get'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import { Panel as ColorPickerPanel } from 'react-colors-picker'
import React, { Component, PropTypes } from 'react'

import Notification from '../common/Notification'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'

export default class ColorForm extends Component {
  static contextTypes = {
    csrf: PropTypes.string
  };

  static propTypes = {
    color: PropTypes.object,
    formMethod: PropTypes.string
  };

  static defaultProps = {
    color: {},
    formMethod: 'POST'
  };

  constructor(props) {
    super(props)

    this.state = {
      hex: get(props.color, 'hex', ''),
      name: get(props.color, 'name', ''),
      color: {},
      errors: {},
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
      const action = props.formMethod === 'POST' ? 'adding' : 'updating'

      if (state.isSaving) {
        return (
          `You are in the process of ${action} a color. ` +
          'Are you sure you want to navigate away from this page and ' +
          'loose your progress?'
        )
      }
    }
  }

  onSubmit(event) {
    const { props } = this

    const form = this.form
    const isPOST = props.formMethod === 'POST'
    const formData = serialize(form, { hash: true })
    const endpoint = isPOST
      ? '/ajax/colors/'
      : `/ajax/colors/${toStringId(props.color)}/`

    event.preventDefault()

    if (isEmpty(formData.hex)) {
      this.setState({
        errors: {
          hex: 'A hex code is required to add a color'
        }
      })

      return
    }

    this.setState({ errors: {}, isSaving: true }, () => {
      axios({
        url: endpoint,
        data: formData,
        method: props.formMethod
      })
      .then(({ data: color }) => {
        const resetData = isPOST ? {
          hex: '',
          name: ''
        } : {}

        this.setState({
          color,
          errors: {},
          isSaving: false,
          hasSaved: true,
          savingSuccessful: true,
          ...resetData
        })
      })
      .catch(({ data }) => {
        this.setState({
          color: {},
          errors: get(data, 'err', {}),
          isSaving: false,
          hasSaved: false,
          savingSuccessful: false
        })
      })
    })
  }

  onClickDelete() {
    const { props, context } = this

    const deleteMessage = (
      'Are you sure you want to delete this color? \n' +
      'This action cannot be undone. ' +
      'Type the word "DELETE" to confirm.'
    )

    if (window.prompt(deleteMessage) === 'DELETE') {
      this.setState({ errors: {}, isDeleting: true }, () => {
        axios
          .post(`/ajax/colors/${toStringId(props.color)}/`, {
            _csrf: context.csrf,
            _method: 'delete'
          })
          .then(() => {
            this.setState({
              color: {},
              isDeleting: false,
              deletingSuccessful: true
            })
          })
          .catch(({ data }) => {
            this.setState({
              color: {},
              errors: get(data, 'err', {}),
              isDeleting: false,
              deletingSuccessful: false
            })
          })
      })
    }
  }

  renderForm() {
    const { props, state, context } = this

    const isPOST = props.formMethod === 'POST'

    const shouldDisable = (
      state.isSaving ||
      state.isDeleting ||
      state.deletingSuccessful
    )

    const hexError = get(state.errors, 'hex')
    const hasHexError = !isEmpty(hexError)

    const nameError = get(state.errors, 'name')
    const hasNameError = !isEmpty(nameError)

    let btnText

    if (state.isSaving) {
      btnText = isPOST ? 'Adding...' : 'Add'
    } else if (state.isSaving) {
      btnText = isPOST ? 'Updating...' : 'Update'
    }

    return (
      <form
        ref={(form) => { this.form = form }}
        method="POST"
        onSubmit={::this.onSubmit}
        className="form color-form"
      >
        <input type="hidden" name="hex" value={state.hex} />
        <input type="hidden" name="_csrf" value={context.csrf} />
        <input type="hidden" name="_method" value={props.formMethod} />

        <h1 className="form-title">
          {isPOST ? 'Add Color' : 'Update Color'}
          <a href="/admin/colors/" className="form-title-link">
            <MaterialDesignIcon name="list" size={18} />
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
            value={state.name}
            required
            disabled={shouldDisable}
            onChange={({ currentTarget: input }) => {
              this.setState({ name: input.value })
            }}
            autoFocus
            className={classNames({
              textfield: true,
              'textfield--error': hasNameError
            })}
            placeholder="E.g. Charcoal Gray"
          />

          {hasNameError ? (
            <small className="form-error">{nameError}</small>
          ) : null}
        </div>

        <div className="form-group">
          <label className="form-label">
            Hex <small>required</small>
          </label>

          <ColorPickerPanel
            color={get(state, 'hex', '#666666')}
            onChange={value => {
              this.setState({ hex: value || 'color' })
            }}
          />

          {hasHexError ? (
            <small className="form-error">{hexError}</small>
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
              <a href="/admin/colors/" className="button">
                <span className="button-text">Cancel</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={::this.onClickDelete}
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

    const sid = get(state.color, 'sid', '')
    const url = !isEmpty(sid) ? `/admin/colors/${sid}/update/` : '#'
    const name = get(state.color, 'name', 'Color')

    const genericError = get(state.errors, 'generic')
    const hasGenericError = !isEmpty(genericError)

    const onClose = () => {
      if (state.deletingSuccessful) {
        window.location.href = '/admin/colors/'
      } else {
        this.setState({
          color: {},
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
      <div className="color-form-container">
        {this.renderNotification()}
        {this.renderForm()}
      </div>
    )
  }
}
