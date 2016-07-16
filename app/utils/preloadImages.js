import isArray from 'lodash/isArray'

const loadImage = (image) => (
  new Promise((resolve, reject) => {
    const loader = new Image()
    loader.src = image

    if (loader.complete) {
      resolve()
    } else {
      loader.onload = resolve
      loader.onerror = reject
    }
  })
)

export default (images = []) => (
  new Promise(async (resolve, reject) => {
    for (const src of isArray(images) ? images : [images]) {
      try {
        await loadImage(src)
      } catch (err) {
        reject(err)
      }
    }

    resolve()
  })
)
