/* eslint-disable max-len */
import get from 'lodash/get'
import truncate from 'lodash/truncate'
import React, { Component, PropTypes } from 'react'

const getContext = notification => {
  const action = get(notification, 'action')
  const contextUrl = get(notification, 'context.detailUrl')
  const contextType = get(notification, 'contextType')
  const contextName = get(notification, 'context.name')

  return action !== 'follow' ? (
    <a href={`/${contextUrl}/`} title={contextName}>
      {contextType}: {truncate(contextName, { length: 50 })}
    </a>
  ) : null
}

const getCreatedBy = notification => {
  const action = get(notification, 'action')
  const username = get(notification, 'createdBy.username')

  return action === 'approve' ? (
    'We '
  ) : (
    <a href={`/designers/${username}/`}>
      {username}
    </a>
  )
}

const getAction = action => {
  switch (action) {
    case 'like': {
      return 'liked'
    }

    case 'comment': {
      return 'commented'
    }

    case 'redesign': {
      return 'redesigned'
    }

    case 'follow': {
      return 'followed'
    }

    case 'approve': {
      return 'approved'
    }

    default: {
      return action
    }
  }
}

const getPronoun = action => {
  switch (action) {
    case 'like': {
      return 'your'
    }

    case 'comment': {
      return 'on your'
    }

    case 'redesign': {
      return 'your'
    }

    case 'follow': {
      return 'you'
    }

    case 'approve': {
      return 'your'
    }

    default: {
      return 'your'
    }
  }
}

export default class NotificationText extends Component {
  static propTypes = {
    notification: PropTypes.object
  }

  static defaultProps = {
    notification: {}
  }

  render() {
    const { props } = this
    const action = get(props.notification, 'action')

    return (
      <p className="user-notification-text">
        {getCreatedBy(props.notification)}
        &nbsp;
        {getAction(action)}
        &nbsp;
        {getPronoun(action)}
        &nbsp;
        {getContext(props.notification)}
      </p>
    )
  }
}
