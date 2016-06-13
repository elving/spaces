import get from 'lodash/get'
import filter from 'lodash/filter'
import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes as Type } from 'react'

import Comments from './Comments'
import CommentForm from './Form'

export default class CommentsWidget extends Component {
  constructor(props) {
    super(props)

    this.state = {
      newComments: []
    }
  }

  static propTypes = {
    parent: Type.string,
    parentType: Type.string,
    onCommentAdded: Type.func,
    onCommentRemoved: Type.func
  };

  static defaultProps = {
    onCommentAdded: (() => {}),
    onCommentRemoved: (() => {})
  };

  addNewComment(comment) {
    const { newComments } = this.state
    const { onCommentAdded } = this.props

    newComments.push(comment)
    this.setState({ newComments }, onCommentAdded)
  }

  removeComment(id) {
    const { newComments } = this.state
    const { onCommentRemoved } = this.props

    this.setState({
      newComments: filter(newComments, (comment) => (
        !isEqual(get(comment, 'id'), id)
      ))
    }, onCommentRemoved)
  }

  render() {
    const { newComments } = this.state
    const { parent, parentType } = this.props

    return (
      <div className="comments-widget">
        <Comments
          parent={parent}
          parentType={parentType}
          newComments={newComments}
          onCommentRemoved={::this.removeComment}/>
        <CommentForm
          parent={parent}
          onCreate={::this.addNewComment}
          parentType={parentType}/>
      </div>
    )
  }
}
