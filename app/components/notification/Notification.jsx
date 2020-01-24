import get from 'lodash/get'
import Timeago from 'timeago.js'
import React, { Component, PropTypes } from 'react'

import NotificationIcon from './Icon'
import NotificationText from './Text'

export default class Notification extends Component {
  static propTypes = {
    notification: PropTypes.object
  }

  static defaultProps = {
    notification: {}
  }

  render() {
    const { props } = this

    return (
      <div
        className="user-notification"
        data-action={get(props.notification, 'action')}
      >
        <div className="user-notification-left">
          <NotificationIcon notification={props.notification} />
          <div className="user-notification-content">
            <NotificationText notification={props.notification} />
            <small className="user-notification-time">
              {new Timeago().format(get(props.notification, 'createdAt'))}
            </small>
          </div>
        </div>
        <div className="user-notification-right">
          {get(props.notification, 'unread', false) ? (
            <div title="Unread" className="user-notification-unread" />
          ) : null}
        </div>
      </div>
    )
  }
}
