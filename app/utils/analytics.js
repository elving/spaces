import get from 'lodash/get'
import ReactGA from 'react-ga'
import isEmpty from 'lodash/isEmpty'

import metadata from '../constants/metadata'

const exitIfNotInProduction = () => {
  if (get(process, 'env.NODE_ENV') !== 'production') {
    return false
  }
}

export const init = (userId, page) => {
  const config = {
    titleCase: false
  }

  exitIfNotInProduction()

  if (!isEmpty(userId)) {
    config.userId = userId
  }

  ReactGA.initialize(metadata.googleAnalyticsUA, {
    titleCase: false,
    gaOptions: {
      userId,
      cookieDomain: 'auto'
    }
  })

  ReactGA.pageview(page)
}

export const event = data => {
  exitIfNotInProduction()
  ReactGA.event(data)
}
