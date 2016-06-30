import ga from 'react-ga'
import isEmpty from 'lodash/isEmpty'

import metadata from '../constants/metadata'

export default (user, page) => {
  if (!isEmpty(user)) {
    ga.initialize(metadata.googleAnalyticsUA, {
      gaOptions: { user, cookieDomain: 'auto' }
    })
  } else {
    ga.initialize(metadata.googleAnalyticsUA)
  }

  ga.pageview(page)
}
