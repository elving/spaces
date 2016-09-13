import get from 'lodash/get'
import map from 'lodash/map'
import axios from 'axios'
import filter from 'lodash/filter'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Loader from '../common/Loader'
import Spaces from '../space/Spaces'
import Products from '../product/Products'

import toStringId from '../../api/utils/toStringId'

export default class ProfileLikes extends Component {
  static propTypes = {
    profile: PropTypes.object
  }

  static defaultProps = {
    profile: {}
  }

  state = {
    likes: [],
    isWaiting: true,
    showSpaces: true,
    showProducts: false
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    const { props } = this

    axios
      .get(`/ajax/designers/${toStringId(props.profile)}/likes/`)
      .then(({ data: likes }) => {
        this.setState({
          likes,
          isWaiting: false
        })
      })
      .catch(() => {
        this.setState({
          isWaiting: false
        })
      })
  }

  showSpaces = () => {
    this.setState({
      showSpaces: true,
      showProducts: false
    })
  }

  showProducts = () => {
    this.setState({
      showSpaces: false,
      showProducts: true
    })
  }

  renderNavigation() {
    const { state } = this

    return (
      <div className="navpills" data-links="2">
        <button
          type="button"
          onClick={this.showSpaces}
          className={classNames({
            'navpills-link': true,
            'navpills-link--active': state.showSpaces
          })}
        >
          Spaces
        </button>
        <button
          type="button"
          onClick={this.showProducts}
          className={classNames({
            'navpills-link': true,
            'navpills-link--active': state.showProducts
          })}
        >
          Products
        </button>
      </div>
    )
  }

  renderContent() {
    const { props, state } = this

    const user = get(props.profile, 'name', '')

    const spaces = filter(state.likes, like =>
      like.parentType === 'space'
    )

    const products = filter(state.likes, like =>
      like.parentType === 'product'
    )

    if (state.showSpaces) {
      return (
        <Spaces
          params={{
            id: map(spaces, space => toStringId(get(space, 'parent')))
          }}
          emptyMessage={`${user} hasn't liked any spaces yet...`}
        />
      )
    } else if (state.showProducts) {
      return (
        <Products
          params={{
            id: map(products, product => toStringId(get(product, 'parent')))
          }}
          emptyMessage={`${user} hasn't liked any products yet...`}
        />
      )
    }

    return null
  }

  render() {
    const { state } = this

    return (
      <div className="user-profile-content-likes">
        {state.isWaiting ? (
          <Loader size="52" />
        ) : (
          <div style={{ width: '100%' }}>
            {this.renderNavigation()}
            {this.renderContent()}
          </div>
        )}
      </div>
    )
  }
}
