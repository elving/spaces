import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import React, { Component, PropTypes as Type } from 'react'

import FollowButton from '../common/FollowButton'

import inflect from '../../utils/inflect'

export default class ProfileCard extends Component {
  static propTypes = {
    user: Type.object
  };

  renderProducts() {
    const { products } = this.props

    return (
      <div className="category-card-products" data-products={size(products)}>
        {map(products, (product) => (
          <div
            style={{ backgroundImage: `url(${get(product, 'image')})` }}
            className="category-card-product"/>
        ))}
      </div>
    )
  }

  renderCounters() {
    const { productsCount, followersCount } = this.props

    return (
      <div className="category-card-stats">
        <div className="category-card-stat">
          <div className="category-card-stat-number">
            {followersCount}
          </div>
          <div className="category-card-stat-text">
            {inflect(followersCount, 'Follower')}
          </div>
        </div>
        <div className="category-card-stat">
          <div className="category-card-stat-number">
            {productsCount}
          </div>
          <div className="category-card-stat-text">
            {inflect(productsCount, 'Product')}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { id, name, detailUrl } = this.props

    return (
      <a href={`/${detailUrl}/`} className="card category-card">
        <div className="category-card-name-container">
          <div className="category-card-name">
            {name}
          </div>
          <FollowButton
            parent={id}
            showText={false}
            className="button--tiny category-card-follow"
            parentType="category"
            hideWhenLoggedOut={true}/>
        </div>

        {this.renderProducts()}
        {this.renderCounters()}
      </a>
    )
  }
}