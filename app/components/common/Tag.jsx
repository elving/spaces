import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class Tag extends Component {
  static propTypes = {
    url: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    size: PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    type: 'category',
    name: '',
    size: 'small',
    className: ''
  }

  getIconSize() {
    const { props } = this

    switch (props.size) {
      case 'small': {
        return 12
      }

      case 'medium': {
        return 14
      }

      case 'big': {
        return 18
      }

      default: {
        return 12
      }
    }
  }

  render() {
    const { props } = this

    return !isEmpty(props.url) ? (
      <a
        href={props.url}
        className={`tag tag--${props.size} ${props.className}`}
      >
        <MaterialDesignIcon name={props.type} size={this.getIconSize()} />
        {props.name}
      </a>
    ) : (
      <span
        className={`tag tag--${props.size} ${props.className}`}
      >
        <MaterialDesignIcon name={props.type} size={this.getIconSize()} />
        {props.name}
      </span>
    )
  }
}
