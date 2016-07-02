/* eslint-disable max-len */
import React, { Component } from 'react'

export default class Icon extends Component {
  static defaultProps = {
    size: 32,
    color: '#FFCC2F'
  };

  render() {
    const { size, color } = this.props

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 291 256"
        className="loader"
        shapeRendering="crispEdges">
        <g className="loader-group" fill={color} stroke="none" strokeWidth="1" fillRule="evenodd">
          <path className="loader-left" d="M145.454545,93.0909091 L87.2727273,167.563636 L87.2727273,130.327273 L44.9586777,130.327273 L44.9586777,204.8 L0,256 L0,0 L145.454545,93.0909091 Z"/>
          <path className="loader-top" d="M145.454545,93.0909091 L290.909091,0 L0,0 L145.454545,93.0909091 L145.454545,93.0909091 Z"/>
          <path className="loader-right" d="M290.909091,0 L145.454545,93.0909091 L290.909091,256 L290.909091,0 L290.909091,0 Z"/>
        </g>
      </svg>
    )
  }
}
