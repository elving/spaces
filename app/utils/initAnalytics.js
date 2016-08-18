import ReactGA from 'react-ga'
import isEmpty from 'lodash/isEmpty'

import metadata from '../constants/metadata'

export default (userId, page) => {
  const config = {
    titleCase: false
  }

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
