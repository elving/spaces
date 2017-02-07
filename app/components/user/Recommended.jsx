import get from 'lodash/get'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'

export default class UserRecommendedProducts extends Component {
  static propTypes = {
    params: PropTypes.object,
    recommendations: PropTypes.array
  }

  static defaultProps = {
    params: {},
    recommendations: []
  }

  getIconName = status => {
    switch (status) {
      case 'pending': {
        return 'link'
      }

      case 'approved': {
        return 'approve'
      }

      case 'declined': {
        return 'disapprove'
      }

      default: {
        return 'link'
      }
    }
  }

  renderProductsPageUrl = () => (
    <a href={`/users/${get(this.props, 'params.username')}/products/`}>
      your products page
    </a>
  )

  render() {
    const recommendations = this.props.recommendations

    return (
      <Layout className="user-recommended-products">
        <h1 className="page-title user-recommended-products-title">
          Your recommendations
        </h1>

        {!isEmpty(recommendations) ? (
          <h2 className="user-recommended-products-subtitle">
            These products have been recommended by you and are being
            reviewed to see if they get to be featured on Spaces.
            If any products you have recommended are not here or
            in {this.renderProductsPageUrl()} they have been declined.
          </h2>
        ) : (
          <h2 className="user-recommended-products-empty">
            You haven&apos;t recommended any products yet...
            <a
              href="/about/#curating-products"
              className="button button--primary-alt"
            >
              Get started
            </a>
          </h2>
        )}

        {!isEmpty(recommendations) ? (
          <ul className="user-recommended-products-list">
            {map(recommendations, recommendation =>
              <li
                key={toStringId(recommendation)}
                className="user-recommended-product"
              >
                <span
                  className="user-recommended-product-icon"
                  data-status={get(recommendation, 'status')}
                >
                  <MaterialDesignIcon
                    name={this.getIconName(get(recommendation, 'status'))}
                    size={16}
                  />
                </span>
                <a
                  rel="noopener noreferrer"
                  href={get(recommendation, 'url')}
                  target="_blank"
                >
                  {get(recommendation, 'url')}
                </a>
              </li>
            )}
          </ul>
        ) : null}
      </Layout>
    )
  }
}
