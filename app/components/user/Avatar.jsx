import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes as Type } from 'react'

export default class Avatar extends Component {
  static contextTypes = {
    user: Type.object
  };

  static propTypes = {
    width: Type.number,
    height: Type.number,
    imageUrl: Type.string,
    initials: Type.string,
    className: Type.string
  };

  static defaultProps = {
    width: 32,
    height: 32,
    initials: '?',
    className: ''
  };

  render() {
    const avatar = get(this.props, 'imageUrl', '')
    const initials = get(this.props, 'initials', '')
    const { width, height, className } = this.props

    return (
      <div className={`user-avatar ${className}`}>
        {!isEmpty(avatar) ? (
          <img
            src={avatar}
            width={width}
            height={height}
            className="user-avatar-image"/>
          ) : (
          <span
            style={{
              width,
              height,
              fontSize: (height - 46) > 14 ? (height - 46) : 14
            }}
            className="user-avatar-initials">
            {initials}
          </span>
        )}
      </div>
    )
  }
}
