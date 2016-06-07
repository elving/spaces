import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import filter from 'lodash/filter'
import concat from 'lodash/concat'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes as Type } from 'react'

import Loader from '../common/Loader'
import Comment from './Comment'

import inflect from '../../utils/inflect'

export default class Comments extends Component {
  constructor(props) {
    super(props)

    this.state = {
      comments: get(props, 'comments', []),
      isFetching: false
    }
  }

  static propTypes = {
    parent: Type.string.isRequired,
    parentType: Type.string.isRequired,
    newComments: Type.array,
    onCommentRemoved: Type.func
  };

  static defaultProps = {
    newComments: [],
    onCommentRemoved: (() => {})
  };

  componentDidMount() {
    const { parent, parentType } = this.props

    this.setState({ isFetching: true }, () => {
      axios({
        url: `/ajax/comments/${parentType}/${parent}/`,
        method: 'GET'
      }).then((res) => {
        this.setState({
          comments: get(res, 'data.comments', []),
          isFetching: false
        })
      }).catch(() => {
        this.setState({
          isFetching: false
        })
      })
    })
  }

  removeComment(id) {
    const { comments } = this.state
    const { onCommentRemoved } = this.props

    this.setState({
      comments: filter(comments, (comment) => (
        !isEqual(get(comment, 'id'), id)
      ))
    }, () => onCommentRemoved(id))
  }

  render() {
    const { newComments } = this.props
    const { comments, isFetching } = this.state

    const allComments = concat([], comments, newComments)

    if (isFetching) {
      return (
        <div className="comments-list">
          <h4 className="comments-title">Comments</h4>
          <Loader size={55}/>
        </div>
      )
    } else if (!isEmpty(allComments)) {
      return (
        <div className="comments-list">
          <h4 className="comments-title">
            {`${size(allComments)} ${inflect(allComments, 'Comment')}`}
          </h4>

          {map(allComments, (comment) => (
            <Comment
              key={`comment-${get(comment, 'id')}`}
              onDelete={::this.removeComment}
              {...comment}/>
          ))}
        </div>
      )
    } else {
      return null
    }
  }
}
