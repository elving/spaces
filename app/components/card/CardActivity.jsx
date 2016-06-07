import isNumber from 'lodash/isNumber'
import React, { Component, PropTypes as Type } from 'react'

import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class CardTags extends Component {
  static propTypes = {
    users: Type.array,
    likes: Type.number,
    added: Type.number,
    comments: Type.number,
    redesigns: Type.number
  };

  static defaultProps = {
    users: [],
    likes: 0,
    added: 0,
    comments: 0,
    redesigns: 0
  };

  hasActivity() {
    const { likes, added, comments, redesigns } = this.props

    return (
      (isNumber(likes) && likes > 0) ||
      (isNumber(added) && added > 0) ||
      (isNumber(comments) && comments > 0) ||
      (isNumber(redesigns) && redesigns > 0)
    )
  }

  renderLikes() {
    const { likes } = this.props

    return isNumber(likes) && likes > 0 ? (
      <div data-activity="likes" className="card-activity-count">
        <MaterialDesignIcon
          name="like"
          size={14}
          className="card-activity-count-icon"/>
        <span className="card-activity-count-number">{likes}</span>
      </div>
    ) : null
  }

  renderComments() {
    const { comments } = this.props

    return isNumber(comments) && comments > 0 ? (
      <div data-activity="comments" className="card-activity-count">
        <MaterialDesignIcon
          name="comment"
          size={14}
          className="card-activity-count-icon"/>
        <span className="card-activity-count-number">{comments}</span>
      </div>
    ) : null
  }

  render() {
    return this.hasActivity() ? (
      <div className="card-activity">
        {this.renderLikes()}
        {this.renderComments()}
      </div>
    ) : null
  }
}
