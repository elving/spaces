import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

export default class Avatar extends Component {
  static propTypes = {
    user: PropTypes.object,
    style: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    imageUrl: PropTypes.string,
    initials: PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
    user: {},
    style: {},
    width: 32,
    height: 32,
    imageUrl: '',
    initials: '?',
    className: ''
  };

  render() {
    const { props } = this

    const imageUrl = get(props.user, 'imageUrl', props.imageUrl)

    const fontSize = (props.height - 46) > 14
      ? (props.height - 46)
      : 14

    const lineHeight = `${fontSize + 2}px`

    return (
      <div style={props.style} className={`user-avatar ${props.className}`}>
        {!isEmpty(imageUrl) ? (
          <img
            src={imageUrl}
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
              fontSize,
              lineHeight
            }}
            className="user-avatar-initials"
          >
            {get(props.user, 'initials', props.initials)}
          </span>
        )}
      </div>
    )
  }
}
