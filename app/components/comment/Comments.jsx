import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import reject from 'lodash/reject'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

import Loader from '../common/Loader'
import Comment from './Comment'

import inflect from '../../utils/inflect'
import toStringId from '../../api/utils/toStringId'

export default class Comments extends Component {
  static contextTypes = {
    userLoggedIn: PropTypes.func
  }

  static propTypes = {
    parent: PropTypes.string.isRequired,
    parentType: PropTypes.string.isRequired,
    newComments: PropTypes.array,
    onCommentRemoved: PropTypes.func
  }

  static defaultProps = {
    newComments: [],
    onCommentRemoved: (() => {})
  }

  constructor(props) {
    super(props)

    this.state = {
      comments: get(props, 'comments', []),
      isFetching: false
    }
  }

  componentDidMount() {
    this.fetch()
  }

  removeComment = (id) => {
    const { props, state } = this

    this.setState({
      comments: reject(state.comments, comment => toStringId(comment) === id)
    }, () => {
      props.onCommentRemoved(id)
    })
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
            comments: get(data, 'comments', []),
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
    const { props, state, context } = this
    const allComments = concat([], state.comments, props.newComments)
    const count = size(allComments)

    if (state.isFetching) {
      return (
        <div className="comments-list">
          <h4 className="comments-title">Comments</h4>
          <Loader size={55} />
        </div>
      )
    } else if (!isEmpty(allComments)) {
      return (
        <div className="comments-list">
          <h4 className="comments-title">
            {`${count} ${inflect(count, 'person', 'people')} commented`}
          </h4>

          {map(allComments, (comment) => (
            <Comment
              {...comment}
              key={`comment-${toStringId(comment)}`}
              onDelete={this.removeComment}
            />
          ))}
        </div>
      )
    }

    return context.userLoggedIn() ? (
      <h4 className="comments-title">
        Be the first to comment!
      </h4>
    ) : null
  }
}
