import find from 'lodash/find'
import split from 'lodash/split'
import without from 'lodash/without'
import shortid from 'shortid'

export default value => {
  const isShortUrl = /\/(p|s)\/\S+\/?/gi
  const isDetailUrl = /\/(products|spaces)\/\S+\/\S+\/?/gi

  if (isShortUrl.test(value) || isDetailUrl.test(value)) {
    return find(
      without(split(value, '/'), 'p', 's', 'spaces', 'products'),
      shortid.isValid
    )
  }

  return shortid.isValid(value) ? value : null
}
