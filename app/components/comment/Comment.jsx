import get from 'lodash/get'
import axios from 'axios'
import React, { Component, PropTypes as Type } from 'react'

import MiniProfile from '../user/MiniProfile'

import canModify from '../../utils/user/canModify'
import formatDate from '../../utils/formatDate'

export default class Comment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      errors: {},
      isDeleting: false
    }
  }

  static contextTypes = {
    csrf: Type.string,
    user: Type.object
  };

  static propTypes = {
    id: Type.string,
    content: Type.string,
    onDelete: Type.func,
    createdBy: Type.object,
    createdAt: Type.string
  };

  static defaultProps = {
    content: '',
    onDelete: (() => {}),
    createdBy: {}
  };

  onClickDelete() {
    const { csrf } = this.context
    const { id, onDelete } = this.props

    const deleteMessage = (
      'Are you sure you want to delete this comment? \n' +
      'This action cannot be undone. '
    )

    if (window.confirm(deleteMessage)) {
      this.setState({ errors: {}, isDeleting: true }, () => {
        axios({
          url: `/ajax/comments/${id}/`,
          data: { _csrf: csrf },
          method: 'DELETE'
        }).then(() => {
          onDelete(id)
        }).catch(({ response }) => {
          this.setState({
            errors: get(response, 'data.err', {}),
            isDeleting: false
          })
        })
      })
    }
  }

  render() {
    const { user } = this.context
    const { content, createdBy, createdAt } = this.props

    return (
      <div className="comment">
        <MiniProfile user={createdBy}/>
        <p className="comment-content">{content}</p>
        <div className="comment-actions">
          <small className="comment-date">{formatDate(createdAt)}</small>
          {canModify(user, createdBy) ? (
            <button
              onClick={::this.onClickDelete}
              className="button button--danger button--mini"
              data-action="deleteComment">
              <span className="button-text">Delete</span>
            </button>
          ) : null}
        </div>
      </div>
    )
  }
}
