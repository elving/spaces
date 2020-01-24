import get from 'lodash/get'
import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from '../common/MaterialDesignIcon'

const getIcon = action => {
  switch (action) {
    case 'like': {
      return (
        <MaterialDesignIcon name="like" />
      )
    }

    case 'comment': {
      return (
        <MaterialDesignIcon name="comment" />
      )
    }

    case 'redesign': {
      return (
        <MaterialDesignIcon name="redesign" />
      )
    }

    case 'follow': {
      return (
        <MaterialDesignIcon name="follow" />
      )
    }

    case 'approve': {
      return (
        <MaterialDesignIcon name="approve" />
      )
    }

    default: {
      return (
        <MaterialDesignIcon name="star" />
      )
    }
  }
}

export default class NotificationIcon extends Component {
  static propTypes = {
    notification: PropTypes.object
  }

  static defaultProps = {
    notification: {}
  }

  render() {
    const { props } = this
    const notificationAction = get(props.notification, 'action')

    return (
      <span className="user-notification-icon">
        {getIcon(notificationAction)}
      </span>
    )
  }
}
