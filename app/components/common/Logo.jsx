/* eslint-disable max-len */
import React, { Component } from 'react'

export default class Icon extends Component {
  static defaultProps = {
    width: 24,
    height: 24
  };

  render() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={this.props.width}
        height={this.props.height}
        viewBox="0 0 400 400"
        className="icon icon-logo"
        shapeRendering="geometricPrecision"
        enableBackground="new 0 0 400 400"
        preserveAspectRatio="xMinYMin meet">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <circle className="icon-fill" fill="#ffcc2f" cx="200" cy="200" r="200"/>
          <path className="icon-fill" fill="#ffffff" d="M313.272727,100 L199.636364,172.727273 L313.272727,300 L313.272727,100 Z M199.636364,172.727273 L313.272727,100 L86,100 L199.636364,172.727273 Z M86,100 L199.636364,172.727273 L154.181818,230.909091 L154.181818,201.818182 L121.123967,201.818182 L121.123967,260 L86,300 L86,100 Z"/>
        </g>
      </svg>
    )
  }
}
