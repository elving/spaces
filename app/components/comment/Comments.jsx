import get from 'lodash/get'
import size from 'lodash/size'
import axios from 'axios'
import reject from 'lodash/reject'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import orderBy from 'lodash/orderBy'
import React, { Component, PropTypes } from 'react'

import CommentsForm from './Form'
import CommentsList from './List'
import CommentsTitle from './Title'

import toStringId from '../../api/utils/toStringId'

export default class Comments extends Component {
  static contextTypes = {
    userLoggedIn: PropTypes.func
  }

  static childContextTypes = {
    onCommentAdded: PropTypes.func,
    onCommentRemoved: PropTypes.func,
    onCommentsSorted: PropTypes.func
  }

  static propTypes = {
    parent: PropTypes.string.isRequired,
    parentType: PropTypes.string.isRequired,
    onCommentAdded: PropTypes.func,
    onCommentRemoved: PropTypes.func
  }

  static defaultProps = {
    onCommentAdded: (() => {}),
    onCommentRemoved: (() => {})
  }

  constructor(props) {
    super(props)

    this.state = {
      comments: get(props, 'comments', []),
      isFetching: false
    }
  }

  getChildContext() {
    return {
      onCommentAdded: this.addComment,
      onCommentRemoved: this.removeComment,
      onCommentsSorted: this.sortComments
    }
  }

  componentDidMount() {
    this.fetch()
  }

  addComment = comment => {
    const { props, state } = this

    this.setState({
      comments: concat([], comment, state.comments)
    }, props.onCommentAdded)
  }

  removeComment = id => {
    const { props, state } = this

    this.setState({
      comments: reject(state.comments, comment =>
        toStringId(comment) === id
      )
    }, () => {
      props.onCommentRemoved(id)
    })
  }

  sortComments = (sorting, _comments) => {
    const { state } = this
    let comments = []
    const commentsToSort = !isEmpty(_comments)
      ? _comments
      : state.comments

    if (sorting === 'Newest') {
      comments = orderBy(commentsToSort, 'createdAt', 'desc')
    } else if (sorting === 'Oldest') {
      comments = orderBy(commentsToSort, 'createdAt', 'asc')
    } else if (sorting === 'Popular') {
      comments = orderBy(commentsToSort, 'likesCount', 'desc')
    } else {
      comments = commentsToSort
    }

    if (!isEmpty(_comments)) {
      return comments
    }

    this.setState({ comments })
  }

  fetch() {
    const { props } = this

    this.setState({
      isFetching: true
    }, () => {
      axios
        .get(`/ajax/comments/${props.parentType}/${props.parent}/`)
        .then(({ data }) => {
          this.setState({
            comments: this.sortComments('Popular', get(data, 'comments', [])),
            isFetching: false
          })
        })
        .catch(() => {
          this.setState({
            isFetching: false
          })
        })
    })
  }

  render() {
    const { props, state } = this
    const commentsCount = size(state.comments)

    return (
      <div className="comments-container">
        <CommentsTitle
          count={size(state.comments)}
          isFetching={state.isFetching}
          hasSortableComments={!isEmpty(state.comments) && commentsCount > 1}
        />
        <CommentsForm
          parent={props.parent}
          parentType={props.parentType}
        />
        <CommentsList
          parent={props.parent}
          comments={state.comments}
          parentType={props.parentType}
          isFetching={state.isFetching}
        />
      </div>
    )
  }
}
