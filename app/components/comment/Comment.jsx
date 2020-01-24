import get from 'lodash/get'
import axios from 'axios'
import React, { Component, PropTypes } from 'react'

import Avatar from '../user/Avatar'
import LikeButton from '../common/LikeButton'

import inflect from '../../utils/inflect'
import formatDate from '../../utils/formatDate'
import toStringId from '../../api/utils/toStringId'

export default class Comment extends Component {
  static contextTypes = {
    csrf: PropTypes.string,
    user: PropTypes.object,
    onCommentRemoved: PropTypes.func,
    currentUserIsOwner: PropTypes.func
  }

  static propTypes = {
    id: PropTypes.string,
    content: PropTypes.string,
    createdBy: PropTypes.object,
    createdAt: PropTypes.string,
    likesCount: PropTypes.number
  }

  static defaultProps = {
    content: '',
    createdBy: {},
    likesCount: 0
  }

  constructor(props) {
    super(props)

    this.state = {
      errors: {},
      isDeleting: false,
      likesCount: get(props, 'likesCount', 0)
    }
  }

  onLike = () => {
    const { state } = this

    this.setState({
      likesCount: state.likesCount + 1
    })
  }

  onUnlike = () => {
    const { state } = this

    this.setState({
      likesCount: state.likesCount - 1
    })
  }

  onClickDelete = event => {
    const { props, context } = this
    const id = toStringId(props)

    const deleteMessage = (
      'Are you sure you want to delete this comment? \n' +
      'This action cannot be undone. '
    )

    event.preventDefault()

    if (window.confirm(deleteMessage)) {
      this.setState({
        errors: {},
        isDeleting: true
      }, () => {
        axios
          .delete(`/ajax/comments/${id}/`, {
            params: {
              _csrf: context.csrf
            }
          })
          .then(() => {
            context.onCommentRemoved(id)
          })
          .catch(({ response }) => {
            this.setState({
              errors: get(response, 'data.err', {}),
              isDeleting: false
            })
          })
      })
    }
  }

  render() {
    const { props, state, context } = this

    return (
      <div id={`comment-${toStringId(props)}`} className="comment">
        <div className="comment-left">
          <Avatar
            user={props.createdBy}
            width={52}
            height={52}
            className="comment-author-avatar"
          />
        </div>
        <div className="comment-right">
          <p className="comment-content">
            <a
              rel="noopener noreferrer"
              href={`/${get(props.createdBy, 'detailUrl')}/`}
              target="_blank"
              className="comment-author-name"
            >
              {get(props.createdBy, 'name')}
            </a>
            :&nbsp;{props.content}
          </p>
          <div className="comment-actions">
            <div className="comment-actions-left">
              <small className="comment-action comment-date">
                {formatDate(props.createdAt)}
              </small>
              {state.likesCount ? (
                <small className="comment-action comment-likes">
                  {`${state.likesCount} ${inflect(state.likesCount, 'like')}`}
                </small>
              ) : null}
            </div>
            <div className="comment-actions-right">
              <LikeButton
                parent={props.id}
                onLike={this.onLike}
                onUnlike={this.onUnlike}
                showText
                className={
                  'button--transparent comment-action comment-action-like'
                }
                parentType="comment"
              />
              {context.currentUserIsOwner(props.createdBy) ? (
                <a
                  href={`#${toStringId(props)}`}
                  onClick={this.onClickDelete}
                  className="comment-action"
                  data-action="deleteComment"
                >
                  <small className="button-text">Delete</small>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
