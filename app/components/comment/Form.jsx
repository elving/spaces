import get from 'lodash/get'
import size from 'lodash/size'
import merge from 'lodash/merge'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import toStringId from '../../api/utils/toStringId'

export default class CommentForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: {},
      content: '',
      isSaving: false,
      contentCharsLeft: 500,
      hasContentCharsError: false
    }

    this.form = null
  }

  static contextTypes = {
    csrf: Type.string,
    user: Type.object,
    userLoggedIn: Type.func
  };

  static propTypes = {
    parent: Type.string.isRequired,
    onCreate: Type.func,
    parentType: Type.string.isRequired
  };

  static defaultProps = {
    onCreate: (() => {})
  };

  onSubmit(event) {
    event.preventDefault()

    const formData = serialize(this.form, { hash: true })
    const { user } = this.context
    const { content } = this.state
    const { onCreate } = this.props

    if (!isEmpty(content)) {
      this.setState({ errors: {}, isSaving: true }, () => {
        axios({
          url: '/ajax/comments/',
          data: formData,
          method: 'POST'
        }).then((res) => {
          this.setState({
            content: '',
            isSaving: false,
            contentCharsLeft: 500,
            hasContentCharsError: false
          }, () => {
            onCreate(merge(get(res, 'data', {}), { createdBy: user }))
          })
        }).catch(({ response }) => {
          this.setState({
            errors: get(response, 'data.err', {}),
            isSaving: false
          })
        })
      })
    }
  }

  render() {
    const { csrf, user } = this.context
    const { parent, parentType } = this.props

    const {
      errors,
      isSaving,
      contentCharsLeft,
      hasContentCharsError
    } = this.state

    const contentError = get(errors, 'content')
    const hasContentError = !isEmpty(contentError)

    return (
      <form
        ref={(form) => this.form = form}
        className="form comment-form"
        onSubmit={::this.onSubmit}>
        <input type="hidden" name="_csrf" value={csrf}/>
        <input type="hidden" name="parent" value={parent}/>
        <input type="hidden" name="createdBy" value={toStringId(user)}/>
        <input type="hidden" name="parentType" value={parentType}/>

        <div className="form-group form-group--small">
          <textarea
            name="content"
            value={get(this.state, 'content', '')}
            disabled={isSaving}
            onChange={(event) => {
              const { value } = event.target
              const contentCharsLeft = 500 - size(value)

              this.setState({
                content: value,
                contentCharsLeft,
                hasContentCharsError: contentCharsLeft < 0
              })
            }}
            className={classNames({
              'textfield': true,
              'textfield--small': true,
              'textfield--error': hasContentError
            })}
            placeholder={`Post a comment about this ${parentType}...`}/>

          {hasContentError ? (
            <small className="form-error">{contentError}</small>
          ) : null}
        </div>

        <div className="form-group form-group--small">
          <div className="form-group form-group--inline form-group--small">
            <button
              type="submit"
              disabled={isSaving || hasContentCharsError}
              className="button button--primary button--small"
              data-action="post">
              <span className="button-text">
                {isSaving ? 'Posting...' : 'Post'}
              </span>
            </button>
            <small
              style={{color: hasContentCharsError ? '#ED4542' : '#999999'}}
              className="form-note">
              {`${contentCharsLeft} characters left`}
            </small>
          </div>
        </div>
      </form>
    )
  }
}
