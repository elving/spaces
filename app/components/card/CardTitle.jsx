import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes as Type } from 'react'

export default class CardTitle extends Component {
  static propTypes = {
    title: Type.string,
    titleUrl: Type.string,
    subTitle: Type.string,
    className: Type.string,
    subTitleUrl: Type.string
  };

  static defaultProps = {
    title: '',
    titleUrl: '',
    subTitle: '',
    className: '',
    subTitleUrl: ''
  };

  render() {
    const { title, titleUrl, subTitle, className, subTitleUrl } = this.props

    return (
      <div className={`${className} card-title-container`}>
        <div className="card-subtitle">
          {!isEmpty(subTitleUrl) ? (
            <a href={subTitleUrl} className="card-subtitle-link">
              {subTitle}
            </a>
          ) : (
            <span className="card-subtitle-text">
              {subTitle}
            </span>
          )}
        </div>
        <div className="card-title">
          <a href={titleUrl} className="card-title-link">
            {title}
          </a>
        </div>
      </div>
    )
  }
}
