import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

export default class Avatar extends Component {
  static contextTypes = {
    user: PropTypes.object
  };

  static propTypes = {
    style: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    imageUrl: PropTypes.string,
    initials: PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
    style: {},
    width: 32,
    height: 32,
    initials: '?',
    className: ''
  };

  render() {
    const { props } = this
    const fontSize = (props.height - 46) > 14 ? (props.height - 46) : 14
    const lineHeight = `${fontSize + 2}px`

    return (
      <div style={props.style} className={`user-avatar ${props.className}`}>
        {!isEmpty(props.imageUrl) ? (
          <img
            src={props.imageUrl}
            role="presentation"
            width={props.width}
            height={props.height}
            className="user-avatar-image"
          />
        ) : (
          <span
            style={{
              width: props.width,
              height: props.height,
              fontSize: props.fontSize,
              lineHeight
            }}
            className="user-avatar-initials"
          >
            {props.initials}
          </span>
        )}
      </div>
    )
  }
}
