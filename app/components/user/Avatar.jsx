import get from 'lodash/get'
import find from 'lodash/find'
import first from 'lodash/first'
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
  }

  static defaultProps = {
    user: {},
    style: {},
    width: 32,
    height: 32,
    imageUrl: '',
    initials: '?',
    className: ''
  }

  getInitials() {
    const { props } = this
    return get(props.user, 'initials', props.initials || '')
  }

  getBackgroundColor() {
    const { props } = this

    const colors = {
      abcde: '#1abc9c',
      fgh: '#2ecc71',
      ij: '#3498db',
      klmn: '#9b59b6',
      op: '#34495e',
      qrs: '#f1c40f',
      tuv: '#e67e22',
      uvwx: '#e74c3c',
      wxyz: '#7f8c8d'
    }

    const initial = first(this.getInitials())

    return find(colors, (color, letters) => (
      !isEmpty(initial.match(new RegExp(`[${letters}]`)))
    )) || '#8d8f92'
  }

  render() {
    const { props } = this

    const imageUrl = get(props.user, 'imageUrl', props.imageUrl)

    const fontSize = (props.height - 46) > 18
      ? props.height - 46
      : 18

    const lineHeight = `${fontSize}px`

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
              lineHeight,
              backgroundColor: this.getBackgroundColor()
            }}
            className="user-avatar-initials"
          >
            {this.getInitials()}
          </span>
        )}
      </div>
    )
  }
}
