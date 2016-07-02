/* eslint-disable max-len */
import React, { Component, PropTypes as Type } from 'react'

export default class MaterialDesignIcon extends Component {
  static propTypes = {
    name: Type.string,
    size: Type.number,
    fill: Type.string,
    className: Type.string
  };

  static defaultProps = {
    name: '',
    size: 20,
    fill: '#999999',
    className: ''
  };

  renderIcon() {
    const { name, fill } = this.props

    switch (name) {
      case 'twitter': {
        return (
          <path fill={fill} className="icon-fill" d="M18,0 L2,0 C0.9,0 0,0.9 0,2 L0,18 C0,19.1 0.9,20 2,20 L18,20 C19.1,20 20,19.1 20,18 L20,2 C20,0.9 19.1,0 18,0 L18,0 Z M15.7,7.3 C15.6,11.9 12.7,15.1 8.3,15.3 C6.5,15.4 5.2,14.8 4,14.1 C5.3,14.3 7,13.8 7.9,13 C6.6,12.9 5.8,12.2 5.4,11.1 C5.8,11.2 6.2,11.1 6.5,11.1 C5.3,10.7 4.5,10 4.4,8.4 C4.7,8.6 5.1,8.7 5.5,8.7 C4.6,8.2 4,6.3 4.7,5.1 C6,6.5 7.6,7.7 10.2,7.9 C9.5,5.1 13.3,3.6 14.8,5.5 C15.5,5.4 16,5.1 16.5,4.9 C16.3,5.6 15.9,6 15.4,6.4 C15.9,6.3 16.4,6.2 16.8,6 C16.7,6.5 16.2,6.9 15.7,7.3 L15.7,7.3 Z"/>
        )
      }

      case 'facebook': {
        return (
          <path fill={fill} className="icon-fill" d="M18,0 L2,0 C0.9,0 0,0.9 0,2 L0,18 C0,19.1 0.9,20 2,20 L18,20 C19.1,20 20,19.1 20,18 L20,2 C20,0.9 19.1,0 18,0 L18,0 Z M17,2 L17,5 L15,5 C14.4,5 14,5.4 14,6 L14,8 L17,8 L17,11 L14,11 L14,18 L11,18 L11,11 L9,11 L9,8 L11,8 L11,5.5 C11,3.6 12.6,2 14.5,2 L17,2 L17,2 Z"/>
        )
      }

      case 'pinterest': {
        return (
          <path fill={fill} className="icon-fill" d="M18,0 L2,0 C0.9,0 0,0.9 0,2 L0,18 C0,19.1 0.9,20 2,20 L18,20 C19.1,20 20,19.1 20,18 L20,2 C20,0.9 19.1,0 18,0 L18,0 Z M11,14.2 C10.2,14.2 9.4,13.9 8.9,13.3 L7.9,16.5 L7.8,16.7 C7.6,17 7.3,17.2 6.9,17.2 C6.3,17.2 5.8,16.7 5.8,16.1 L5.8,16 L5.8,16 L5.9,15.8 L7.7,10.2 C7.7,10.2 7.5,9.6 7.5,8.7 C7.5,7 8.4,6.5 9.2,6.5 C9.9,6.5 10.6,6.8 10.6,7.8 C10.6,9.1 9.7,9.8 9.7,10.8 C9.7,11.5 10.3,12.1 11,12.1 C13.3,12.1 14.2,10.3 14.2,8.7 C14.2,6.5 12.3,4.7 10,4.7 C7.7,4.7 5.8,6.5 5.8,8.7 C5.8,9.4 6,10 6.3,10.6 C6.4,10.8 6.4,10.9 6.4,11.1 C6.4,11.7 6,12.1 5.4,12.1 C5,12.1 4.7,11.9 4.5,11.6 C4,10.7 3.7,9.7 3.7,8.6 C3.7,5.3 6.5,2.6 9.9,2.6 C13.3,2.6 16.1,5.3 16.1,8.6 C16.2,11.4 14.6,14.2 11,14.2 L11,14.2 Z"/>
        )
      }

      case 'instagram': {
        return (
          <path fill={fill} className="icon-fill" d="M18,0 L2,0 C0.9,0 0,0.9 0,2 L0,18 C0,19.1 0.9,20 2,20 L18,20 C19.1,20 20,19.1 20,18 L20,2 C20,0.9 19.1,0 18,0 L18,0 Z M10,6 C12.2,6 14,7.8 14,10 C14,12.2 12.2,14 10,14 C7.8,14 6,12.2 6,10 C6,7.8 7.8,6 10,6 L10,6 Z M2.5,18 C2.2,18 2,17.8 2,17.5 L2,9 L4.1,9 C4,9.3 4,9.7 4,10 C4,13.3 6.7,16 10,16 C13.3,16 16,13.3 16,10 C16,9.7 16,9.3 15.9,9 L18,9 L18,17.5 C18,17.8 17.8,18 17.5,18 L2.5,18 L2.5,18 Z M18,4.5 C18,4.8 17.8,5 17.5,5 L15.5,5 C15.2,5 15,4.8 15,4.5 L15,2.5 C15,2.2 15.2,2 15.5,2 L17.5,2 C17.8,2 18,2.2 18,2.5 L18,4.5 L18,4.5 Z"/>
        )
      }

      default: {
        return null
      }
    }
  }

  render() {
    const { name, size, className } = this.props

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        className={`icon icon-${name} ${className}`}
        shapeRendering="geometricPrecision"
        enableBackground="new 0 0 20 20"
        preserveAspectRatio="xMinYMin meet">
        {this.renderIcon()}
      </svg>
    )
  }
}
