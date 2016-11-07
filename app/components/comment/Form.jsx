import get from 'lodash/get'
import size from 'lodash/size'
import merge from 'lodash/merge'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Avatar from '../user/Avatar'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'

export default class CommentsForm extends Component {
  static contextTypes = {
    csrf: PropTypes.string,
    user: PropTypes.object,
    userLoggedIn: PropTypes.func,
    onCommentAdded: PropTypes.func
  }

  static propTypes = {
    parent: PropTypes.string.isRequired,
    parentType: PropTypes.string.isRequired,
    hasComments: PropTypes.bool
  }

  state = {
    errors: {},
    content: '',
    isSaving: false,
    hasFocused: false,
    contentCharsLeft: 500,
    hasContentCharsError: false
  }

  onSubmit = (event) => {
    event.preventDefault()

    const formData = serialize(this.form, { hash: true })
    const { state, context } = this

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
              context.onCommentAdded(
                merge({}, comment, { createdBy: context.user })
              )
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

  render() {
    const { props, state, context } = this

    const contentError = get(state.errors, 'content')
    const hasContentError = !isEmpty(contentError)

    return (
      <form
        ref={form => { this.form = form }}
        onSubmit={this.onSubmit}
        className={classNames({
          form: true,
          'comment-form': true,
          'form--has-focused': state.hasFocused
        })}
      >
        <input type="hidden" name="_csrf" value={context.csrf} />
        <input type="hidden" name="parent" value={props.parent} />
        <input type="hidden" name="parentType" value={props.parentType} />

        <input
          type="hidden"
          name="createdBy"
          value={toStringId(context.user)}
        />

        <div className="comment-form-left">
          <Avatar
            user={context.user}
            width={52}
            height={52}
          />
        </div>

        <div className="comment-form-right">
          <textarea
            name="content"
            value={state.content}
            onFocus={() => {
              if (!context.userLoggedIn()) {
                window.location.href = '/login/'
              } else if (!state.hasFocused) {
                this.setState({
                  hasFocused: true
                })
              }
            }}
            disabled={state.isSaving}
            onChange={this.onContentChange}
            className={classNames({
              textfield: true,
              'textfield--error': hasContentError,
              'comment-form-textfield': true
            })}
            placeholder={props.hasComments ? (
              'Join the discussion...'
            ) : (
              'Start the discussion...'
            )}
          />

          {hasContentError ? (
            <small className="form-error">{contentError}</small>
          ) : null}

          <div className="comment-form-actions">
            <button
              type="submit"
              disabled={state.isSaving || state.hasContentCharsError}
              className="button button--primary button--tiny"
              data-action="post"
            >
              <span className="button-text">
                <MaterialDesignIcon name="comment" />
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
