import isEmpty from 'lodash/isEmpty'
import truncate from 'lodash/truncate'
import React, { Component, PropTypes } from 'react'

export default class CardTitle extends Component {
  static propTypes = {
    url: PropTypes.string,
    title: PropTypes.string,
    limit: PropTypes.number,
    subTitle: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string
  }

  static defaultProps = {
    url: '',
    limit: 65,
    title: '',
    subTitle: '',
    className: '',
  }

  render() {
    const { url, title, limit, subTitle, className } = this.props

    return !isEmpty(url) ? (
      <a href={url} className={`${className} card-title-container`}>
        <div className="card-subtitle">{subTitle}</div>
        <div className="card-title" title={title}>
          {truncate(title, { length: limit })}
        </div>
        {this.props.children}
      </a>
    ) : (
      <span className={`${className} card-title-container`}>
        <div className="card-subtitle">{subTitle}</div>
        <div className="card-title" title={title}>
          {truncate(title, { length: limit })}
        </div>
        {this.props.children}
      </span>
    )
  }
}
