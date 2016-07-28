import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes } from 'react'

import FollowButton from '../common/FollowButton'

import inflect from '../../utils/inflect'
import toStringId from '../../api/utils/toStringId'

export default class SpaceTypeCard extends Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    onFollow: PropTypes.func,
    products: PropTypes.array,
    detailUrl: PropTypes.string,
    onUnfollow: PropTypes.func,
    spacesCount: PropTypes.number,
    productsCount: PropTypes.number,
    followersCount: PropTypes.number
  };

  static defaultProps = {
    id: '',
    name: '',
    onFollow: (() => {}),
    products: [],
    detailUrl: '',
    onUnfollow: (() => {}),
    spacesCount: 0,
    productsCount: 0,
    followersCount: 0
  };

  renderProducts() {
    const { props } = this

    return !isEmpty(props.products) ? (
      <div
        className="space-type-card-products"
        data-products={size(props.products)}
      >
        {map(props.products, product =>
          <div
            key={`${toStringId(props)}-${toStringId(product)}`}
            style={{ backgroundImage: `url(${get(product, 'image')})` }}
            className="space-type-card-product"
          />
        )}
      </div>
    ) : null
  }

  renderCounters() {
    const { props } = this

    return (
      <div className="space-type-card-stats">
        <div className="space-type-card-stat">
          <div className="space-type-card-stat-number">
            {props.followersCount}
          </div>
          <div className="space-type-card-stat-text">
            {inflect(props.followersCount, 'Follower')}
          </div>
        </div>
        <div className="space-type-card-stat">
          <div className="space-type-card-stat-number">
            {props.spacesCount}
          </div>
          <div className="space-type-card-stat-text">
            {inflect(props.spacesCount, 'Space')}
          </div>
        </div>
        <div className="space-type-card-stat">
          <div className="space-type-card-stat-number">
            {props.productsCount}
          </div>
          <div className="space-type-card-stat-text">
            {inflect(props.productsCount, 'Product')}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { props } = this

    return (
      <a href={`/${props.detailUrl}/`} className="card space-type-card">
        <div className="space-type-card-name-container">
          <div className="space-type-card-name">
            {props.name}
          </div>
          <FollowButton
            parent={toStringId(props)}
            onFollow={props.onFollow}
            className="space-type-card-follow button--tiny"
            onUnfollow={props.onUnfollow}
            parentType="spaceType"
            hideWhenLoggedOut
          />
        </div>

        {this.renderProducts()}
        {this.renderCounters()}
      </a>
    )
  }
}
