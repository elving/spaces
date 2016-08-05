import isNumber from 'lodash/isNumber'
import React, { PropTypes, Component } from 'react'

import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class CardTags extends Component {
  static propTypes = {
    users: PropTypes.array,
    likes: PropTypes.number,
    added: PropTypes.number,
    comments: PropTypes.number,
    redesigns: PropTypes.number
  }

  static defaultProps = {
    users: [],
    likes: 0,
    added: 0,
    comments: 0,
    redesigns: 0
  }

  hasActivity = () => {
    const { props } = this

    return (
      (isNumber(props.likes) && props.likes > 0) ||
      (isNumber(props.added) && props.added > 0) ||
      (isNumber(props.comments) && props.comments > 0) ||
      (isNumber(props.redesigns) && props.redesigns > 0)
    )
  }

  renderLikes() {
    const { props } = this

    return isNumber(props.likes) && props.likes > 0 ? (
      <div data-activity="likes" className="card-activity-count">
        <MaterialDesignIcon
          name="like"
          size={14}
          className="card-activity-count-icon"
        />
        <span className="card-activity-count-number">
          {props.likes}
        </span>
      </div>
    ) : null
  }

  renderComments() {
    const { props } = this

    return isNumber(props.comments) && props.comments > 0 ? (
      <div data-activity="comments" className="card-activity-count">
        <MaterialDesignIcon
          name="comment"
          size={14}
          className="card-activity-count-icon"
        />
        <span className="card-activity-count-number">
          {props.comments}
        </span>
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
