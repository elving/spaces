import React, { Component, PropTypes as Type } from 'react'

export default class CardTitle extends Component {
  static propTypes = {
    url: Type.string,
    title: Type.string,
    subTitle: Type.string,
    className: Type.string,
  };

  static defaultProps = {
    url: '',
    title: '',
    subTitle: '',
    className: '',
  };

  render() {
    const { url, title, subTitle, className } = this.props

    return (
      <a href={url} className={`${className} card-title-container`}>
        <div className="card-subtitle">{subTitle}</div>
        <div className="card-title">{title}</div>
        {this.props.children}
      </a>
    )
  }
}
