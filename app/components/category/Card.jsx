import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

import FollowButton from '../common/FollowButton'

import inflect from '../../utils/inflect'
import toStringId from '../../api/utils/toStringId'

export default class CategoryCard extends Component {
  static propTypes = {
    name: PropTypes.string,
    onFollow: PropTypes.func,
    products: PropTypes.array,
    detailUrl: PropTypes.string,
    onUnfollow: PropTypes.func,
    productsCount: PropTypes.number,
    followersCount: PropTypes.number
  };

  static defaultProps = {
    name: '',
    onFollow: (() => {}),
    products: [],
    detailUrl: '',
    onUnfollow: (() => {}),
    productsCount: 0,
    followersCount: 0
  };

  renderProducts() {
    const { props } = this

    return !isEmpty(props.products) ? (
      <div
        className="category-card-products"
        data-products={size(props.products)}
      >
        {map(props.products, product =>
          <div
            key={`${toStringId(props)}-${toStringId(product)}`}
            style={{ backgroundImage: `url(${get(product, 'image')})` }}
            className="category-card-product"
          />
        )}
      </div>
    ) : null
  }

  renderCounters() {
    const { props } = this

    return (
      <div className="category-card-stats">
        <div className="category-card-stat">
          <div className="category-card-stat-number">
            {props.followersCount}
          </div>
          <div className="category-card-stat-text">
            {inflect(props.followersCount, 'Follower')}
          </div>
        </div>
        <div className="category-card-stat">
          <div className="category-card-stat-number">
            {props.productsCount}
          </div>
          <div className="category-card-stat-text">
            {inflect(props.productsCount, 'Product')}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { props } = this

    return (
      <a href={`/${props.detailUrl}/`} className="card category-card">
        <div className="category-card-name-container">
          <div className="category-card-name">
            {props.name}
          </div>
          <FollowButton
            parent={toStringId(props)}
            onFollow={props.onFollow}
            className="category-card-follow button--tiny"
            onUnfollow={props.onUnfollow}
            parentType="category"
            hideWhenLoggedOut
          />
        </div>

        {this.renderProducts()}
        {this.renderCounters()}
      </a>
    )
  }
}
