import set from 'lodash/set'
import assign from 'lodash/assign'

import metadata from '../../constants/metadata'
import getFullUrl from '../../utils/getFullUrl'

export default (req, res, ogTags = {}) => {
  set(res, 'locals.og', assign({
    ogUrl: getFullUrl(req),
    ogTitle: metadata.title,
    ogImage: metadata.image,
    ogSiteName: metadata.siteName,
    ogDescription: metadata.description
  }, ogTags))

  return res
}
