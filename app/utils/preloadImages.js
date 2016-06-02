import isArray from 'lodash/isArray'

const loadImage = (image) => {
  return new Promise((resolve, reject) => {
    const loader = new Image()
    loader.src = image

    if (loader.complete) {
      resolve()
    } else {
      loader.onload = resolve
      loader.onerror = reject
    }
  })
}

export default (images) => {
  return new Promise(async (resolve, reject) => {
    images = isArray(images) ? images : [images]

    for (let src of images) {
      try {
        await loadImage(src)
      } catch (err) {
        reject(err)
      }
    }

    resolve()
  })
}
