import get from 'lodash/get'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Popup from '../common/Popup'
import PopupTitle from '../common/PopupTitle'

export default class RedesignPopup extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      name: '',
      errors: {},
      isSaving: false,
      description: ''
    }

    this.form = null
  }

  static contextTypes = {
    csrf: PropTypes.string
  };

  static propPropTypess = {
    isOpen: PropTypes.bool,
    spaceId: PropTypes.string,
    className: PropTypes.string,
    onClickClose: PropTypes.func
  };

  static defaultProps = {
    isOpen: false,
    spaceId: '',
    spaceType: '',
    className: '',
    onClickClose: (() => {})
  };

  reset(next) {
    this.setState({
      name: '',
      errors: {},
      description: ''
    }, next)
  }

  onSubmit(event) {
    const formData = serialize(this.form, { hash: true })
    const { props } = this

    event.preventDefault()

    this.setState({ errors: {}, isSaving: true }, () => {
      axios
        .post(`/ajax/spaces/${props.spaceId}/redesign/`, formData)
        .then(({ data: space }) => {
          window.location.href = `/${get(space, 'detailUrl')}/`
        }).catch(({ data }) => {
          this.setState({
            errors: get(data, 'err', {}),
            isSaving: false
          })
        })
    })
  }

  renderForm() {
    const { props, state, context } = this

    const nameError = get(state.errors, 'name')
    const hasNameError = !isEmpty(nameError)

    const descriptionError = get(state.errors, 'description')
    const hasDescriptionError = !isEmpty(descriptionError)

    return (
      <form
        ref={(form) => this.form = form}
        method="POST"
        onSubmit={::this.onSubmit}
        className="form redesign-popup-form">
        <input type="hidden" name="_csrf" value={context.csrf}/>
        <input type="hidden" name="_method" value="POST"/>

        <input type="hidden" name="spaceType" value={props.spaceType}/>
        <input type="hidden" name="originalSpace" value={props.spaceId}/>

        <div className="form-group form-group--small">
          <label className="form-label">
            Name <small>required</small>
          </label>

          <input
            type="text"
            name="name"
            required
            value={state.name}
            disabled={state.isSaving}
            onChange={({ currentTarget: input }) => {
              this.setState({ name: input.value })
            }}
            className={classNames({
              'textfield': true,
              'textfield--small': true,
              'textfield--error': hasNameError
            })}
            placeholder="E.g. My dream kitchen"/>

          {hasNameError ? (
            <small className="form-error">{nameError}</small>
          ) : null}
        </div>

        <div className="form-group form-group--small">
          <label className="form-label">
            Description <small>optional</small>
          </label>

          <textarea
            name="description"
            value={state.description}
            disabled={state.isSaving}
            onChange={({ currentTarget: input }) => {
              this.setState({ description: input.value })
            }}
            className={classNames({
              'textfield': true,
              'textfield--small': true,
              'textfield--error': hasDescriptionError
            })}
            placeholder="E.g. A modern residential kitchen is typically..."/>

          {hasDescriptionError ? (
            <small className="form-error">{descriptionError}</small>
          ) : null}
        </div>

        <div className="form-group form-group--small">
          <div className="form-group form-group--inline">
            <button
              type="submit"
              disabled={state.isSaving}
              className="button button--primary button--small">
              <span className="button-text">
                {state.isSaving ? 'Redesigning...' : 'Redesign'}
              </span>
            </button>
            <button
              type="button"
              disabled={state.isSaving}
              onClick={() => this.reset(props.onClickClose)}
              className="button button--link button--small">
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
    const closePopup = () => this.reset(props.onClickClose)

    return (
      <Popup
        isOpen={props.isOpen}
        className={props.className}
        onClickClose={closePopup}>
        <PopupTitle onClickClose={closePopup}>
          Redesign this space
        </PopupTitle>
        <div className="popup-content">
          {this.renderForm()}
        </div>
      </Popup>
    )
  }
}
