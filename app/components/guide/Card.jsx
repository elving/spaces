import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from '../common/MaterialDesignIcon'

import getDate from '../../utils/guide/getDate'

export default class GuideCard extends Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    createdAt: PropTypes.date,
    detailUrl: PropTypes.string,
    coverImage: PropTypes.string,
    likesCount: PropTypes.number,
    description: PropTypes.string
  }

  render() {
    const { props } = this

    return (
      <a
        href={`/${props.detailUrl}/`}
        style={{ backgroundImage: `url(${props.coverImage})` }}
        className="card guide-card"
      >
        {props.likesCount > 0 ? (
          <div className="guide-card-likes">
            <MaterialDesignIcon name="like" size={16} />
            {props.likesCount}
          </div>
        ) : null}
        <div className="guide-card-content">
          <p className="guide-card-date">{getDate(props.createdAt)}</p>
          <p className="guide-card-name">{props.name}</p>
          <p className="guide-card-description">{props.description}</p>
        </div>
      </a>
    )
  }
}
