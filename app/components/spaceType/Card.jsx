import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import slice from 'lodash/slice'
import reverse from 'lodash/reverse'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Loader from '../common/Loader'
import FollowButton from '../common/FollowButton'

import inflect from '../../utils/inflect'
import toStringId from '../../api/utils/toStringId'
import preloadImages from '../../utils/preloadImages'

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
  }

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
  }

  constructor(props) {
    super(props)

    this.state = {
      images: [],
      followersCount: get(props, 'followersCount', 0),
      imagesAreLoaded: false,
      imagesAreLoading: true
    }
  }

  componentDidMount() {
    const { props } = this

    const images = map(
      slice(reverse(props.products), 0, 4),
      product => get(product, 'image', '')
    )

    preloadImages(images).then(() => {
      this.setState({
        images,
        imagesAreLoaded: true,
        imagesAreLoading: false
      })
    })
  }

  onFollow = () => {
    const { props, state } = this

    this.setState({
      followersCount: state.followersCount + 1
    }, () => {
      props.onFollow()
    })
  }

  onUnfollow = () => {
    const { props, state } = this

    this.setState({
      followersCount: state.followersCount - 1
    }, () => {
      props.onUnfollow()
    })
  }

  renderProducts() {
    const { props, state } = this

    return !isEmpty(props.products) ? (
      <div
        className={classNames({
          'space-type-card-products': true,
          'space-type-card-products--loading': state.imagesAreLoading
        })}
        data-products={size(props.products)}
      >
        {state.imagesAreLoading ? (
          <Loader size={50} />
        ) : null}

        {state.imagesAreLoaded ? (
          map(props.products, product =>
            <div
              key={`${toStringId(props)}-${toStringId(product)}`}
              style={{ backgroundImage: `url(${get(product, 'image')})` }}
              className="space-type-card-product"
            />
          )
        ) : null}
      </div>
    ) : null
  }

  renderCounters() {
    const { props, state } = this

    return (
      <div className="space-type-card-stats">
        <div className="space-type-card-stat">
          <div className="space-type-card-stat-number">
            {state.followersCount}
          </div>
          <div className="space-type-card-stat-text">
            {inflect(state.followersCount, 'Follower')}
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

    return !isEmpty(props.products) ? (
      <a href={`/${props.detailUrl}/`} className="card space-type-card">
        <div className="space-type-card-name-container">
          <div className="space-type-card-name">
            {props.name}
          </div>
          <FollowButton
            parent={toStringId(props)}
            onFollow={this.onFollow}
            className="space-type-card-follow button--tiny"
            onUnfollow={this.onUnfollow}
            parentType="spaceType"
            hideWhenLoggedOut
          />
        </div>

        {this.renderProducts()}
        {this.renderCounters()}
      </a>
    ) : null
  }
}
