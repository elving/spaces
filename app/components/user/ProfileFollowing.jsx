import get from 'lodash/get'
import map from 'lodash/map'
import axios from 'axios'
import filter from 'lodash/filter'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Rooms from '../spaceType/Rooms'
import Loader from '../common/Loader'
import Designers from '../user/Designers'
import Categories from '../category/Categories'

import toStringId from '../../api/utils/toStringId'

export default class ProfileFollowing extends Component {
  static propTypes = {
    profile: PropTypes.object
  }

  static defaultProps = {
    profile: {}
  }

  state = {
    following: [],
    isWaiting: true,
    showRooms: false,
    showDesigners: true,
    showCategories: false
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    const { props } = this

    axios
      .get(`/ajax/designers/${toStringId(props.profile)}/following/`)
      .then(({ data: following }) => {
        this.setState({
          following,
          isWaiting: false
        })
      })
      .catch(() => {
        this.setState({
          isWaiting: false
        })
      })
  }

  showDesigners = () => {
    this.setState({
      showRooms: false,
      showDesigners: true,
      showCategories: false
    })
  }

  showRooms = () => {
    this.setState({
      showRooms: true,
      showDesigners: false,
      showCategories: false
    })
  }

  showCategories = () => {
    this.setState({
      showRooms: false,
      showDesigners: false,
      showCategories: true
    })
  }

  renderNavigation() {
    const { state } = this

    return (
      <div className="navpills">
        <button
          type="button"
          onClick={this.showDesigners}
          className={classNames({
            'navpills-link': true,
            'navpills-link--active': state.showDesigners
          })}
        >
          Designers
        </button>
        <button
          type="button"
          onClick={this.showRooms}
          className={classNames({
            'navpills-link': true,
            'navpills-link--active': state.showRooms
          })}
        >
          Rooms
        </button>
        <button
          type="button"
          onClick={this.showCategories}
          className={classNames({
            'navpills-link': true,
            'navpills-link--active': state.showCategories
          })}
        >
          Categories
        </button>
      </div>
    )
  }

  renderContent() {
    const { props, state } = this

    const user = get(props.profile, 'name')

    const rooms = filter(state.following, follow =>
      follow.parentType === 'spaceType'
    )

    const designers = filter(state.following, follow =>
      follow.parentType === 'user'
    )

    const categories = filter(state.following, follow =>
      follow.parentType === 'category'
    )

    if (state.showRooms) {
      return (
        <Rooms
          params={{ id: map(rooms, room => toStringId(get(room, 'parent'))) }}
          emptyMessage={`${user} isn't following any rooms yet...`}
        />
      )
    } else if (state.showDesigners) {
      return (
        <Designers
          params={{
            id: map(designers, designer => toStringId(get(designer, 'parent')))
          }}
          emptyMessage={`${user} isn't following any designers yet...`}
        />
      )
    } else if (state.showCategories) {
      return (
        <Categories
          params={{
            id: map(categories, category => toStringId(get(category, 'parent')))
          }}
          emptyMessage={`${user} isn't following any categories yet...`}
        />
      )
    }
  }

  render() {
    const { state } = this

    return (
      <div className="user-profile-content-following">
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
