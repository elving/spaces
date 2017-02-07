import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from '../common/MaterialDesignIcon'
import { event as analyticsEvent } from '../../utils/analytics'

export default class JoinCTA extends Component {
  static propTypes = {
    onClose: PropTypes.func
  }

  static defaultProps = {
    onClose: (() => {})
  }

  static contextTypes = {
    userLoggedIn: PropTypes.func
  }

  state = {
    isVisible: false
  }

  componentDidMount() {
    this.checkState()
  }

  onClose() {
    this.setState({
      isVisible: false
    }, () => {
      sessionStorage.setItem('hide-join-cta', 1)
      this.props.onClose()
    })
  }

  checkState = () => {
    this.setState({
      isVisible: (
        !this.context.userLoggedIn() &&
        isEmpty(sessionStorage.getItem('hide-join-cta'))
      )
    })
  }

  render() {
    return this.state.isVisible ? (
      <div className="join-cta">
        <button
          onClick={() => this.onClose()}
          className={classNames({
            button: true,
            'button--icon': true,
            'button--transparent': true,
            'join-cta-close': true
          })}
        >
          <MaterialDesignIcon name="close" size={32} />
        </button>
        <div className="join-cta-inner">
          <h1 className="join-cta-title">
            Find curated products for your home.
          </h1>
          <div className="join-cta-actions">
            <a
              href="/about/"
              onClick={() => {
                analyticsEvent({
                  label: 'Learn More',
                  category: 'CTA',
                  action: 'Clicked About CTA',
                })
              }}
              className="join-cta-action button button--outline"
            >
              Learn More
            </a>
            <a
              href="/join/"
              onClick={() => {
                analyticsEvent({
                  label: 'Join Now',
                  category: 'CTA',
                  action: 'Clicked Join CTA',
                })
              }}
              className="join-cta-action button button--primary-alt"
            >
              Join Now
            </a>
            <a
              href="/finder/"
              onClick={() => {
                analyticsEvent({
                  label: 'Find Products',
                  category: 'CTA',
                  action: 'Clicked Finder CTA',
                })
              }}
              className="join-cta-action button button--outline"
            >
              Find Products
            </a>
          </div>
        </div>
      </div>
    ) : null
  }
}
