import get from 'lodash/get'
import size from 'lodash/size'
import axios from 'axios'
import toLower from 'lodash/toLower'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Popup from '../common/Popup'
import PopupTitle from '../common/PopupTitle'

import toStringId from '../../api/utils/toStringId'

export default class RedesignPopup extends Component {
  static contextTypes = {
    csrf: PropTypes.string
  }

  static propPropTypess = {
    isOpen: PropTypes.bool,
    spaceId: PropTypes.string,
    className: PropTypes.string,
    onClickClose: PropTypes.func
  }

  static defaultProps = {
    isOpen: false,
    spaceId: '',
    spaceType: '',
    className: '',
    onClickClose: (() => {})
  }

  state = {
    name: '',
    errors: {},
    isSaving: false,
    description: '',
    descriptionCharsLeft: 140,
    hasDescriptionCharsError: false
  }

  onSubmit = (event) => {
    const formData = serialize(this.form, { hash: true, empty: true })
    const { props } = this

    event.preventDefault()

    this.setState({
      errors: {},
      isSaving: true
    }, () => {
      axios
        .post(`/ajax/spaces/${props.spaceId}/redesign/`, formData)
        .then(({ data: space }) => {
          window.location.href = `/${get(space, 'detailUrl')}/`
        })
        .catch(({ response }) => {
          this.setState({
            errors: get(response, 'data.err', {}),
            isSaving: false
          })
        })
    })
  }

  onNameChange = ({ currentTarget: input }) => {
    this.setState({
      name: input.value
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

  onCancelClick = () => {
    const { props } = this
    this.reset(props.onClickClose)
  }

  closePopup = () => {
    const { props } = this
    this.reset(props.onClickClose)
  }

  form = null

  reset(next) {
    this.setState({
      name: '',
      errors: {},
      description: ''
    }, next)
  }

  renderForm() {
    const { props, state, context } = this

    const isDisabled = (
      state.isSaving
    )

    const nameError = get(state.errors, 'name')
    const hasNameError = !isEmpty(nameError)

    const descriptionError = get(state.errors, 'description')
    const hasDescriptionError = !isEmpty(descriptionError)

    return (
      <form
        ref={form => { this.form = form }}
        method="POST"
        onSubmit={this.onSubmit}
        className="form redesign-popup-form"
      >
        <input type="hidden" name="_csrf" value={context.csrf} />
        <input type="hidden" name="_method" value="POST" />

        <input
          type="hidden"
          name="spaceType"
          value={toStringId(props.spaceType)}
        />

        <input type="hidden" name="originalSpace" value={props.spaceId} />

        <div className="form-group form-group--small">
          <label htmlFor="name" className="form-label">
            Name <small>required</small>
          </label>

          <input
            id="name"
            type="text"
            name="name"
            required
            value={state.name}
            disabled={isDisabled}
            onChange={this.onNameChange}
            className={classNames({
              textfield: true,
              'textfield--small': true,
              'textfield--error': hasNameError
            })}
            placeholder="E.g. My dream kitchen"
          />

          {hasNameError ? (
            <small className="form-error">{nameError}</small>
          ) : null}
        </div>

        <div className="form-group form-group--small">
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
            disabled={state.isSaving}
            onChange={this.onDescriptionChange}
            className={classNames({
              textfield: true,
              'textfield--small': true,
              'textfield--error': (
                hasDescriptionError ||
                state.hasDescriptionCharsError
              )
            })}
            placeholder="E.g. A modern residential kitchen is typically..."
          />

          {hasDescriptionError ? (
            <small className="form-error">{descriptionError}</small>
          ) : null}
        </div>

        <div className="form-group form-group--small">
          <div className="form-group form-group--inline">
            <button
              type="submit"
              disabled={isDisabled || state.hasDescriptionCharsError}
              className="button button--primary button--small"
            >
              <span className="button-text">
                {state.isSaving ? 'Redesigning...' : 'Redesign'}
              </span>
            </button>
            <button
              type="button"
              disabled={isDisabled || state.hasDescriptionCharsError}
              onClick={this.onCancelClick}
              className="button button--link button--small"
            >
              <span className="button-text">
                Cancel
              </span>
            </button>
          </div>
        </div>
      </form>
    )
  }

  render() {
    const { props } = this

    return (
      <Popup
        isOpen={props.isOpen}
        className={props.className}
        onClickClose={this.closePopup}
      >
        <PopupTitle onClickClose={this.closePopup}>
          Redesign this {toLower(get(props.spaceType, 'name', 'space'))}
        </PopupTitle>
        <div className="popup-content">
          {this.renderForm()}
        </div>
      </Popup>
    )
  }
}
