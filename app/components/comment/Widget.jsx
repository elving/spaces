import reject from 'lodash/reject'
import concat from 'lodash/concat'
import React, { Component, PropTypes } from 'react'

import Comments from './Comments'
import CommentForm from './Form'

import toStringId from '../../api/utils/toStringId'

export default class CommentsWidget extends Component {
  static propTypes = {
    parent: PropTypes.string,
    parentType: PropTypes.string,
    onCommentAdded: PropTypes.func,
    onCommentRemoved: PropTypes.func
  }

  static defaultProps = {
    onCommentAdded: (() => {}),
    onCommentRemoved: (() => {})
  }

  state = {
    newComments: []
  }

  addNewComment = (comment) => {
    const { props, state } = this

    this.setState({
      newComments: concat(state.newComments, comment)
    }, props.onCommentAdded)
  }

  removeComment = (id) => {
    const { props, state } = this

    this.setState({
      newComments: reject(state.newComments, comment =>
        toStringId(comment) === id
      )
    }, props.onCommentRemoved)
  }

  render() {
    const { props, state } = this

    return (
      <div className="comments-widget">
        <Comments
          parent={props.parent}
          parentType={props.parentType}
          newComments={state.newComments}
          onCommentRemoved={this.removeComment}
        />
        <CommentForm
          parent={props.parent}
          onCreate={this.addNewComment}
          parentType={props.parentType}
        />
      </div>
    )
  }
}
