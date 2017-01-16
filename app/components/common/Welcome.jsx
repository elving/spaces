import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from './MaterialDesignIcon'

export default class Header extends Component {
  static propTypes = {
    onClose: PropTypes.func
  }

  static defaultProps = {
    onClose: (() => {})
  }

  render() {
    const { props } = this

    return (
      <div className="welcome-banner">
        <button
          onClick={() => props.onClose()}
          className={
            'welcome-banner-close button button--icon button--transparent'
          }
        >
          <MaterialDesignIcon name="close" size={32} />
        </button>
        <div className="welcome-banner-inner">
          <h1 className="welcome-banner-title">
            Spaces is a shopping guide for your home, curated by people
            like you. Join to curate products and design spaces.
          </h1>
          <div className="welcome-banner-actions">
            <a
              href="/join/"
              className="button button--primary-alt welcome-banner-action"
            >
              Join Now
            </a>
            <a
              href="/about/"
              className="button welcome-banner-action"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    )
  }
}
