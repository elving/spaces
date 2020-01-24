import head from 'lodash/head'
import split from 'lodash/split'
import replace from 'lodash/replace'

export default url => (
  head(
    split(
      replace(url, /^https?:\/\/(www\.)?/gim, ''),
      '/'
    )
  )
)
