import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import concat from 'lodash/concat'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Layout from '../common/Layout'
import Loader from '../common/Loader'
import Sticky from '../common/Sticky'
import Notification from './Notification'

import toStringId from '../../api/utils/toStringId'

export default class NotificationsIndex extends Component {
  static contextTypes = {
    csrf: PropTypes.string
  }

  state = {
    count: 0,
    offset: 0,
    isFetching: false,
    hasFetched: false,
    isMarkingRead: false,
    notifications: []
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = () => {
    const { state } = this

    if (state.isFetching) {
      return
    }

    this.setState({
      isFetching: true
    }, () => {
      axios
        .get(`/ajax/notifications/all/?skip=${state.offset}`)
        .then(({ data }) => {
          const notifications = get(data, 'results', [])

          this.setState({
            count: get(data, 'count', 0),
            offset: state.offset + size(notifications),
            isFetching: false,
            hasFetched: true,
            notifications: concat(state.notifications, notifications)
          })
        })
        .catch(() => {
          this.setState({
            isFetching: false,
            hasFetched: true
          })
        })
    })
  }

  markAllRead = () => {
    const { state, context } = this

    this.setState({
      isMarkingRead: true
    }, () => {
      axios
        .post('/ajax/notifications/read/', {
          _csrf: context.csrf
        })
        .then(() => {
          this.setState({
            notifications: map(state.notifications, notification => ({
              ...notification,
              unread: false
            })),
            isMarkingRead: false
          })
        })
        .catch(() => {
          this.setState({
            isMarkingRead: false
          })
        })
    })
  }

  hasUnreadNotifications() {
    const { state } = this

    return !isEmpty(filter(state.notifications, notification =>
      notification.unread
    ))
  }

  renderPagination() {
    const { state } = this

    return size(state.notifications) < state.count ? (
      <div className="grid-pagination">
        <button
          onClick={this.fetch}
          disabled={state.isFetching}
          className="button button--outline"
        >
          <span className="button-text">
            {state.isFetching ? (
              'Loading More Notifications...'
            ) : (
              'Load More Notifications'
            )}
          </span>
        </button>
      </div>
    ) : null
  }

  renderNotifications() {
    const { state } = this

    const hasNoResults = (
      !state.isFetching &&
      isEmpty(state.notifications)
    )

    return (
      <div className="user-notifications-list">
        {hasNoResults ? (
          <p className="user-notifications-empty">
            No notifications yet...
          </p>
        ) : (
          map(state.notifications, notification =>
            <Notification
              key={toStringId(notification)}
              notification={notification}
            />
          )
        )}

        {!hasNoResults ? this.renderPagination() : null}
      </div>
    )
  }

  render() {
    const { state } = this

    return (
      <Layout contentClassName="user-notifications-container">
        <Sticky>
          <div className="user-notifications-header">
            <h1 className="user-notifications-header-text">
              Your Notifications
            </h1>
            {this.hasUnreadNotifications() ? (
              <button
                type="button"
                onClick={this.markAllRead}
                className={classNames({
                  button: true,
                  'button--small': true,
                  'button--primary-alt': true,
                  'user-notifications-header-action': true
                })}
              >
                {state.isMarkingRead
                  ? 'Marking all as read...'
                  : 'Mark all read'
                }
              </button>
            ) : null}
          </div>
        </Sticky>

        {state.isFetching && !state.hasFetched ? (
          <div className="user-notifications-loading">
            <Loader size="52" />
          </div>
        ) : (
          this.renderNotifications()
        )}
      </Layout>
    )
  }
}
