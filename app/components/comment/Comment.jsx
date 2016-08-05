import get from 'lodash/get'
import axios from 'axios'
import React, { Component, PropTypes } from 'react'

import MiniProfile from '../user/MiniProfile'

import canModify from '../../utils/user/canModify'
import formatDate from '../../utils/formatDate'
import toStringId from '../../api/utils/toStringId'

export default class Comment extends Component {
  static contextTypes = {
    csrf: PropTypes.string,
    user: PropTypes.object
  }

  static propTypes = {
    id: PropTypes.string,
    content: PropTypes.string,
    onDelete: PropTypes.func,
    createdBy: PropTypes.object,
    createdAt: PropTypes.string
  }

  static defaultProps = {
    content: '',
    onDelete: (() => {}),
    createdBy: {}
  }

  state = {
    errors: {},
    isDeleting: false
  }

  onClickDelete = () => {
    const { props, context } = this
    const id = toStringId(props)

    const deleteMessage = (
      'Are you sure you want to delete this comment? \n' +
      'This action cannot be undone. '
    )

    if (window.confirm(deleteMessage)) {
      this.setState({
        errors: {},
        isDeleting: true
      }, () => {
        axios
          .delete(`/ajax/comments/${id}/`, {
            _csrf: context.csrf
          })
          .then(() => {
            props.onDelete(id)
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
    const { props, context } = this

    return (
      <div className="comment">
        <MiniProfile user={props.createdBy} />
        <p className="comment-content">{props.content}</p>
        <div className="comment-actions">
          <small className="comment-date">
            {formatDate(props.createdAt)}
          </small>
          {canModify(context.user, props.createdBy) ? (
            <button
              onClick={this.onClickDelete}
              className="button button--danger button--mini"
              data-action="deleteComment"
            >
              <span className="button-text">Delete</span>
            </button>
          ) : null}
        </div>
      </div>
    )
  }
}
