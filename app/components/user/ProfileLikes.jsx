import get from 'lodash/get'
import map from 'lodash/map'
import axios from 'axios'
import filter from 'lodash/filter'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Loader from '../common/Loader'
import Spaces from '../space/Spaces'
import Guides from '../guide/Guides'
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
    showGuides: false,
    showProducts: false
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    const { props } = this

    axios
      .get(`/ajax/users/${toStringId(props.profile)}/likes/`)
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
      showGuides: false,
      showProducts: false
    })
  }

  showGuides = () => {
    this.setState({
      showSpaces: false,
      showGuides: true,
      showProducts: false
    })
  }

  showProducts = () => {
    this.setState({
      showSpaces: false,
      showGuides: false,
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
        <button
          type="button"
          onClick={this.showGuides}
          className={classNames({
            'navpills-link': true,
            'navpills-link--active': state.showGuides
          })}
        >
          Guides
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

    const guides = filter(state.likes, like =>
      like.parentType === 'guide'
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
    } else if (state.showGuides) {
      return (
        <Guides
          params={{
            id: map(guides, guide => toStringId(get(guide, 'parent')))
          }}
          emptyMessage={`${user} hasn't liked any guides yet...`}
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
