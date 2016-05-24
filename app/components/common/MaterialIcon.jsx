/* eslint-disable max-len */
import React, { Component, PropTypes as Type } from 'react'

export default class MaterialIcon extends Component {
  static propTypes = {
    name: Type.string,
    color: Type.string,
    width: Type.number,
    height: Type.number,
    className: Type.string
  };

  static defaultProps = {
    name: '',
    size: 18,
    color: '#999999',
    className: ''
  };

  render() {
    let path, width, height, viewBox
    const { name, size, color, className } = this.props

    switch (name) {
      case 'redesign': {
        path = <path fill={color} className="icon-fill" d="M8,4 L8,0 L3,5 L8,10 L8,6 C11.3,6 14,8.7 14,12 C14,15.3 11.3,18 8,18 C4.7,18 2,15.3 2,12 L0,12 C0,16.4 3.6,20 8,20 C12.4,20 16,16.4 16,12 C16,7.6 12.4,4 8,4 L8,4 Z"/>
        width = size - 4
        height = size
        viewBox = '0 0 16 20'
        break
      }

      case 'like': {
        path = <path fill={color} className="icon-fill" d="M10,18.4 L8.6,17 C3.4,12.4 0,9.3 0,5.5 C0,2.4 2.4,0 5.5,0 C7.2,0 8.9,0.8 10,2.1 C11.1,0.8 12.8,0 14.5,0 C17.6,0 20,2.4 20,5.5 C20,9.3 16.6,12.4 11.4,17 L10,18.4 L10,18.4 Z"/>
        width = size + 1
        height = size
        viewBox = '0 0 20 19'
        break
      }

      case 'add': {
        path = <path fill={color} className="icon-fill" d="M10,0 C4.5,0 0,4.5 0,10 C0,15.5 4.5,20 10,20 C15.5,20 20,15.5 20,10 C20,4.5 15.5,0 10,0 L10,0 Z M15,11 L11,11 L11,15 L9,15 L9,11 L5,11 L5,9 L9,9 L9,5 L11,5 L11,9 L15,9 L15,11 L15,11 Z"/>
        width = size
        height = size
        viewBox = '0 0 20 20'
        break
      }

      case 'send': {
        path = <path fill={color} className="icon-fill" d="M0,18 L21,9 L0,0 L0,7 L15,9 L0,11 L0,18 Z"/>
        width = size + 5
        height = size
        viewBox = '0 0 23 18'
        break
      }

      default: {
        return null
      }
    }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={viewBox}
        className={`icon icon-${name} ${className}`}
        shapeRendering="geometricPrecision"
        enableBackground={`new ${viewBox}`}
        preserveAspectRatio="xMinYMin meet">
        {path}
      </svg>
    )
  }
}
