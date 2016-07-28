import get from 'lodash/get'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Notification from '../common/Notification'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'

export default class SpaceTypeForm extends Component {
  static contextTypes = {
    csrf: PropTypes.string
  };

  static propTypes = {
    spaceType: PropTypes.object,
    formMethod: PropTypes.string
  };

  static defaultProps = {
    spaceType: {},
    formMethod: 'POST'
  };

  constructor(props) {
    super(props)

    this.state = {
      name: get(props.spaceType, 'name', ''),
      errors: {},
      isSaving: false,
      hasSaved: false,
      spaceType: {},
      isDeleting: false,
      description: get(props.spaceType, 'description', ''),
      savingSuccessful: false,
      deletingSuccessful: false
    }

    this.form = null
  }

  componentDidMount() {
    const { props, state } = this

    window.onbeforeunload = () => {
      const action = props.formMethod === 'POST' ? 'adding' : 'updating'

      if (state.isSaving) {
        return (
          `You are in the process of ${action} a spaceType. ` +
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
      ? '/ajax/space-types/'
      : `/ajax/space-types/${toStringId(props.spaceType)}/`

    event.preventDefault()

    this.setState({ errors: {}, isSaving: true }, () => {
      axios({
        url: endpoint,
        data: formData,
        method: props.formMethod
      })
      .then(({ spaceType }) => {
        const resetData = isPOST ? {
          name: '',
          description: ''
        } : {}

        this.setState({
          name: '',
          errors: {},
          isSaving: false,
          hasSaved: true,
          spaceType,
          savingSuccessful: true,
          ...resetData
        })
      })
      .catch(({ response }) => {
        this.setState({
          errors: get(response, 'data.err', {}),
          isSaving: false,
          hasSaved: false,
          spaceType: {},
          savingSuccessful: false
        })
      })
    })
  }

  onClickDelete() {
    const { props, context } = this.context

    const deleteMessage = (
      'Are you sure you want to delete this spaceType? \n' +
      'This action cannot be undone. ' +
      'Type the word "DELETE" to confirm.'
    )

    if (window.prompt(deleteMessage) === 'DELETE') {
      this.setState({ errors: {}, isDeleting: true }, () => {
        axios
          .post(`/ajax/space-types/${toStringId(props.spaceType)}/`, {
            _csrf: context.csrf,
            _method: 'delete'
          })
          .then(() => {
            this.setState({
              spaceType: {},
              isDeleting: false,
              deletingSuccessful: true
            })
          })
          .catch(({ response }) => {
            this.setState({
              errors: get(response, 'data.err', {}),
              spaceType: {},
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

    const nameError = get(state.errors, 'name')
    const hasNameError = !isEmpty(nameError)

    const descriptionError = get(state.errors, 'description')
    const hasDescriptionError = !isEmpty(descriptionError)

    let btnText = ''

    if (isPOST) {
      btnText = state.isSaving ? 'Adding Space Type...' : 'Add Space Type'
    } else {
      btnText = state.isSaving ? 'Updating Space Type...' : 'Update Space Type'
    }

    return (
      <form
        ref={(form) => { this.form = form }}
        method="POST"
        onSubmit={::this.onSubmit}
        className="form spaceType-form"
      >
        <input type="hidden" name="_csrf" value={context.csrf} />
        <input type="hidden" name="_method" value={props.formMethod} />

        <h1 className="form-title">
          {isPOST ? 'Add SpaceType' : 'Update SpaceType'}
          <a href="/admin/space-types/" className="form-title-link">
            <MaterialDesignIcon name="list" size={18} />
            All SpaceTypes
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
            placeholder="E.g. Kitchen"
          />

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
            value={state.description}
            disabled={shouldDisable}
            onChange={({ currentTarget: input }) => {
              this.setState({ description: input.value })
            }}
            autoFocus
            className={classNames({
              textfield: true,
              'textfield--error': hasDescriptionError
            })}
            placeholder="E.g. A modern residential kitchen is typically..."
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
              <a href="/admin/space-types/" className="button">
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

    const sid = get(state.spaceType, 'sid', '')
    const url = !isEmpty(sid) ? `/admin/space-types/${sid}/update/` : '#'
    const name = get(state.spaceType, 'name', 'SpaceType')

    const genericError = get(state.errors, 'generic')
    const hasGenericError = !isEmpty(genericError)

    const onClose = () => {
      if (state.deletingSuccessful) {
        window.location.href = '/admin/space-types/'
      } else {
        this.setState({
          hasSaved: false,
          spaceType: {},
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
      <div className="spaceType-form-container">
        {this.renderNotification()}
        {this.renderForm()}
      </div>
    )
  }
}
