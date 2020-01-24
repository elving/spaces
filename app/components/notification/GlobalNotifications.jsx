import get from 'lodash/get'
import map from 'lodash/map'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Dropdown, {
  DropdownTrigger,
  DropdownContent
} from 'react-simple-dropdown'

import Loader from '../common/Loader'
import Notification from './Notification'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'

export default class GlobalNotifications extends Component {
  static contextTypes = {
    csrf: PropTypes.string,
    userLoggedIn: PropTypes.func
  }

  state = {
    count: 0,
    offset: 0,
    isFetching: false,
    previousCount: 0,
    notifications: [],
    isMarkingRead: false,
    isFetchingCount: false
  }

  componentDidMount() {
    const { state } = this

    if (!state.isFetchingCount) {
      this.getCount()
    }

    this.countInterval = setInterval(() => {
      this.getCount()
    }, 60000)
  }

  componentWillUnmount() {
    clearInterval(this.countInterval)
  }

  onPopupOpen = () => {
    if (this.shouldFetch()) {
      this.fetch()
    }
  }

  getCount = () => {
    const { state } = this

    if (state.isFetchingCount) {
      return
    }

    this.setState({
      previousCount: state.count,
      isFetchingCount: true
    }, () => {
      axios
        .get('/ajax/notifications/count/')
        .then(({ data }) => {
          this.setState({
            count: get(data, 'count', 0),
            isFetchingCount: false
          })
        })
        .catch(() => {
          this.setState({
            isFetchingCount: false
          })
        })
    })
  }

  fetch = () => {
    if (this.state.isFetching) {
      return
    }

    this.setState({
      isFetching: true
    }, () => {
      axios
        .get('/ajax/notifications/?limit=5')
        .then(({ data }) => {
          this.setState({
            isFetching: false,
            notifications: get(data, 'results', [])
          })
        })
        .catch(() => {
          this.setState({
            isFetching: false
          })
        })
    })
  }

  markAllRead = () => {
    const { context } = this

    this.setState({
      isMarkingRead: true
    }, () => {
      axios
        .post('/ajax/notifications/read/', {
          _csrf: context.csrf
        })
        .then(() => {
          this.setState({
            count: 0,
            notifications: [],
            isMarkingRead: false,
            previousCount: 0
          })
        })
        .catch(() => {
          this.setState({
            isMarkingRead: false
          })
        })
    })
  }

  shouldFetch = () => {
    const { state } = this

    return (
      !state.isFetching &&
      state.count !== state.previousCount
    )
  }

  renderNotifications() {
    const { state } = this

    if (state.isFetching) {
      return (
        <div className="user-notifications-loading">
          <Loader size={50} />
        </div>
      )
    }

    if (isEmpty(state.notifications)) {
      return (
        <div className="user-notifications-empty">
          No unread notifications yet...
        </div>
      )
    }

    return !isEmpty(state.notifications) ? (
      <div className="user-notifications-list">
        {map(state.notifications, notification =>
          <Notification
            key={`user-notification-${toStringId(notification)}`}
            notification={notification}
          />
        )}
      </div>
    ) : null
  }

  renderActions() {
    const { state } = this
    const notificationsCount = get(state, 'count', 0)

    return (
      <div
        className={classNames({
          'user-notifications-actions': true,
          'user-notifications-actions--single': notificationsCount <= 0
        })}
      >
        {notificationsCount > 0 ? (
          <button
            type="button"
            onClick={this.markAllRead}
            className={classNames({
              button: true,
              'button--small': true,
              'button--primary-alt': true,
              'user-notifications-action': true
            })}
          >
            {state.isMarkingRead ? 'Marking...' : 'Mark all read'}
          </button>
        ) : null}
        <a
          href="/notifications/"
          className="user-notifications-action button button--small"
        >
          View all
        </a>
      </div>
    )
  }

  render() {
    const { state, context } = this
    const notificationsCount = get(state, 'count', 0)
    const hasNotifications = notificationsCount > 0

    return context.userLoggedIn() ? (
      <div
        className={classNames({
          'user-notifications': true,
          'user-notifications--is-fetching': state.isFetching,
          'user-notifications--has-notifications': notificationsCount > 0
        })}
      >
        <Dropdown
          onShow={this.onPopupOpen}
          className="dropdown"
        >
          <DropdownTrigger className="dropdown-trigger">
            {hasNotifications ? (
              <span className="user-notifications-count">
                {notificationsCount}
              </span>
            ) : null}
            <MaterialDesignIcon
              name={hasNotifications ? 'notifications-active' : 'notifications'}
              size={26}
              className="user-notifications-icon"
            />
          </DropdownTrigger>
          <DropdownContent className="dropdown-content">
            <div className="user-notifications-header">
              Your Notifications
            </div>
            {this.renderNotifications()}
            {this.renderActions()}
          </DropdownContent>
        </Dropdown>
      </div>
    ) : null
  }
}
