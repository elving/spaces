import get from 'lodash/get'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import Popup from '../common/Popup'
import PopupTitle from '../common/PopupTitle'

export default class SpacesPopup extends Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      name: '',
      description: '',
      errors: {},
      isSaving: false
    }

    this.form = null
  }

  static contextTypes = {
    csrf: Type.string,
    addUserSpace: Type.func
  };

  static propTypes = {
    isOpen: Type.bool,
    spaceId: Type.string,
    spaceType: Type.string,
    className: Type.string,
    onClickClose: Type.func
  };

  static defaultProps = {
    isOpen: false,
    spaceId: '',
    spaceType: '',
    className: '',
    onClickClose: (() => {})
  };

  resetForm(next) {
    this.setState({
      name: '',
      errors: {},
      description: ''
    }, next)
  }

  onSubmit(event) {
    const formData = serialize(this.form, { hash: true })

    const { spaceId } = this.props
    const { addUserSpace } = this.context

    event.preventDefault()

    this.setState({ errors: {}, isSaving: true }, () => {
      axios({
        url: `/ajax/spaces/${spaceId}/redesign/`,
        data: formData,
        method: 'POST'
      }).then((res) => {
        addUserSpace(get(res, 'data', {}))

        this.setState({
          name: '',
          errors: {},
          isSaving: false,
          description: ''
        })
      }).catch((res) => {
        this.setState({
          errors: get(res, 'data.err', {}),
          isSaving: false
        })
      })
    })
  }

  renderForm() {
    const { csrf } = this.context
    const { errors, isSaving } = this.state
    const { spaceId, spaceType, onClickClose } = this.props

    const nameError = get(errors, 'name')
    const hasNameError = !isEmpty(nameError)

    const descriptionError = get(errors, 'description')
    const hasDescriptionError = !isEmpty(descriptionError)

    return (
      <form
        ref={(form) => this.form = form}
        method="POST"
        onSubmit={::this.onSubmit}
        className="form redesign-popup-form">
        <input type="hidden" name="_csrf" value={csrf}/>
        <input type="hidden" name="_method" value="POST"/>

        <input type="hidden" name="spaceType" value={spaceType}/>
        <input type="hidden" name="originalSpace" value={spaceId}/>

        <div className="form-group form-group--small">
          <label className="form-label">
            Name <small>required</small>
          </label>

          <input
            type="text"
            name="name"
            required
            value={get(this.state, 'name', '')}
            disabled={isSaving}
            onChange={(event) => {
              this.setState({ name: event.currentTarget.value })
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
            value={get(this.state, 'description', '')}
            disabled={isSaving}
            onChange={(event) => {
              this.setState({ description: event.currentTarget.value })
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
              disabled={isSaving}
              className="button button--primary button--small">
              <span className="button-text">
                {isSaving ? 'Redesigning...' : 'Redesign'}
              </span>
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => this.resetForm(onClickClose)}
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
    const { isOpen, className, onClickClose } = this.props
    const close = () => this.resetForm(onClickClose)

    return (
      <Popup isOpen={isOpen} className={className} onClickClose={close}>
        <PopupTitle onClickClose={close}>
          Redesign this space
        </PopupTitle>
        <div className="popup-content">
          {this.renderForm()}
        </div>
      </Popup>
    )
  }
}
