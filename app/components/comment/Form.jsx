import get from 'lodash/get'
import size from 'lodash/size'
import merge from 'lodash/merge'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import toStringId from '../../api/utils/toStringId'

export default class CommentForm extends Component {
  static contextTypes = {
    csrf: PropTypes.string,
    user: PropTypes.object,
    userLoggedIn: PropTypes.func
  }

  static propTypes = {
    parent: PropTypes.string.isRequired,
    onCreate: PropTypes.func,
    parentType: PropTypes.string.isRequired
  }

  static defaultProps = {
    onCreate: (() => {})
  }

  state = {
    errors: {},
    content: '',
    isSaving: false,
    contentCharsLeft: 500,
    hasContentCharsError: false
  }

  onSubmit = (event) => {
    event.preventDefault()

    const formData = serialize(this.form, { hash: true })
    const { props, state, context } = this

    if (!isEmpty(state.content)) {
      this.setState({
        errors: {},
        isSaving: true
      }, () => {
        axios
          .post('/ajax/comments/', formData)
          .then(({ data: comment }) => {
            this.setState({
              content: '',
              isSaving: false,
              contentCharsLeft: 500,
              hasContentCharsError: false
            }, () => {
              context.onCreate(merge({}, comment, { createdBy: props.user }))
            })
          })
          .catch(({ response }) => {
            this.setState({
              errors: get(response, 'data.err', {}),
              isSaving: false
            })
          })
      })
    }
  }

  onContentChange = ({ currentTarget: input }) => {
    const contentCharsLeft = 500 - size(input.value)

    this.setState({
      content: input.value,
      contentCharsLeft,
      hasContentCharsError: contentCharsLeft < 0
    })
  }

  form = null;

  render() {
    const { props, state, context } = this

    const contentError = get(state.errors, 'content')
    const hasContentError = !isEmpty(contentError)

    return (
      <form
        ref={form => { this.form = form }}
        className="form comment-form"
        onSubmit={this.onSubmit}
      >
        <input type="hidden" name="_csrf" value={context.csrf} />
        <input type="hidden" name="parent" value={props.parent} />
        <input type="hidden" name="parentType" value={props.parentType} />

        <input
          type="hidden"
          name="createdBy"
          value={toStringId(context.user)}
        />

        <div className="form-group form-group--small">
          <textarea
            name="content"
            value={state.content}
            disabled={state.isSaving}
            onChange={this.onContentChange}
            className={classNames({
              textfield: true,
              'textfield--small': true,
              'textfield--error': hasContentError
            })}
            placeholder={`Post a comment about this ${props.parentType}...`}
          />

          {hasContentError ? (
            <small className="form-error">{contentError}</small>
          ) : null}
        </div>

        <div className="form-group form-group--small">
          <div className="form-group form-group--inline form-group--small">
            <button
              type="submit"
              disabled={state.isSaving || state.hasContentCharsError}
              className="button button--primary button--small"
              data-action="post"
            >
              <span className="button-text">
                {state.isSaving ? 'Posting...' : 'Post'}
              </span>
            </button>
            <small
              style={{
                color: state.hasContentCharsError ? '#ED4542' : '#999999'
              }}
              className="form-note"
            >
              {`${state.contentCharsLeft} characters left`}
            </small>
          </div>
        </div>
      </form>
    )
  }
}
