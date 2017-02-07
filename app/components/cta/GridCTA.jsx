import React, { Component, PropTypes } from 'react'

import { event as analyticsEvent } from '../../utils/analytics'

export default class GridCTA extends Component {
  static contextTypes = {
    userLoggedIn: PropTypes.func
  }

  render() {
    return !this.context.userLoggedIn() ? (
      <div className="grid-cta">
        <div className="grid-cta-inner">
          <h1 className="grid-cta-title">
            Join Spaces to curate products you love and design spaces with them.
          </h1>
          <div className="grid-cta-actions">
            <a
              href="/about/"
              onClick={() => {
                analyticsEvent({
                  label: 'Learn More',
                  category: 'CTA',
                  action: 'Clicked About CTA',
                })
              }}
              className="grid-cta-action button button--outline"
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
              className="grid-cta-action button button--primary-alt"
            >
              Join Now
            </a>
          </div>
        </div>
      </div>
    ) : null
  }
}
