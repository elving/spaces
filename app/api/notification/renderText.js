/* eslint-disable max-len */
import get from 'lodash/get'
import truncate from 'lodash/truncate'

const getContext = notification => {
  const action = get(notification, 'action')
  const contextType = get(notification, 'contextType')
  const contextName = get(notification, 'context.name')

  return action !== 'follow' ? (
    `${contextType}: ${truncate(contextName, { length: 50 })}`
  ) : ''
}

const getCreatedBy = notification => {
  const action = get(notification, 'action')
  const username = get(notification, 'createdBy.username')

  return action === 'approve' ? 'We ' : username
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

export default notification => {
  const action = get(notification, 'action')

  return `${getCreatedBy(notification)} ${getAction(action)} ${getPronoun(action)} ${getContext(notification)}`
}
