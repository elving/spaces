import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

export default class CardTitle extends Component {
  static propTypes = {
    url: PropTypes.string,
    title: PropTypes.string,
    subTitle: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string
  }

  static defaultProps = {
    url: '',
    title: '',
    subTitle: '',
    className: '',
  }

  render() {
    const { url, title, subTitle, className } = this.props

    return !isEmpty(url) ? (
      <a href={url} className={`${className} card-title-container`}>
        <div className="card-subtitle">{subTitle}</div>
        <div className="card-title">{title}</div>
        {this.props.children}
      </a>
    ) : (
      <span className={`${className} card-title-container`}>
        <div className="card-subtitle">{subTitle}</div>
        <div className="card-title">{title}</div>
        {this.props.children}
      </span>
    )
  }
}
