import isEmpty from 'lodash/isEmpty'

import metadata from '../constants/metadata'

export const getEmailUrl = (url, title) => {
  let shareUrl = 'mailto:?'

  if (!isEmpty(title)) {
    shareUrl += `subject=${encodeURIComponent(title)}&`
  }

  if (!isEmpty(url)) {
    shareUrl += `body=${encodeURIComponent(
      'Hey, I thought you might like this: ' + url
    )}`
  }

  return shareUrl
}

export const getTwitterUrl = (url, text) => {
  let shareUrl = 'https://twitter.com/intent/tweet/?'

  if (!isEmpty(url)) {
    shareUrl += `url=${encodeURIComponent(url)}&`
  }

  if (!isEmpty(text)) {
    shareUrl += `text=${encodeURIComponent(text)}&`
  }

  shareUrl += `via=${encodeURIComponent(metadata.twitterUsername)}`

  return shareUrl
}

export const getFacebookUrl = (url) => {
  let shareUrl = 'https://www.facebook.com/dialog/share?app_id=549973938496886&display=page&'

  if (!isEmpty(url)) {
    shareUrl += `href=${encodeURIComponent(url)}&`
    shareUrl += `redirect_uri=${encodeURIComponent(url)}`
  }

  return shareUrl
}

export const getPinterestUrl = (url, imageUrl, text) => {
  let shareUrl = 'https://www.pinterest.com/pin/create/button/?'

  if (!isEmpty(url)) {
    shareUrl += `url=${encodeURIComponent(url)}&`
  }

  if (!isEmpty(imageUrl)) {
    shareUrl += `media=${encodeURIComponent(imageUrl)}&`
  }

  if (!isEmpty(text)) {
    shareUrl += `description=${encodeURIComponent(text)}`
  } else {
    shareUrl += `description=${encodeURIComponent(metadata.shortDescription)}`
  }

  return shareUrl
}
