import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

import Loader from '../common/Loader'
import Comment from './Comment'

import toStringId from '../../api/utils/toStringId'

export default class CommentsList extends Component {
  static propTypes = {
    parent: PropTypes.string,
    comments: PropTypes.array,
    parenType: PropTypes.string,
    isFetching: PropTypes.bool
  }

  static defaultProps = {
    comments: [],
    isFetching: false
  }

  render() {
    const { props } = this

    return isEmpty(props.comments) && !props.isFetching ? null : (
      <div className="comments-list">
        {props.isFetching ? (
          <Loader size={52} />
        ) : (
          map(props.comments, comment =>
            <Comment
              {...comment}
              key={`comment-${props.parentType}-${toStringId(comment)}`}
            />
          )
        )}
      </div>
    )
  }
}
