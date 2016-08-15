import set from 'lodash/set'
import size from 'lodash/size'
import slice from 'lodash/slice'
import sizeOf from 'image-size'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import reverse from 'lodash/reverse'
import request from 'request'

import uploadBuffer from './uploadBuffer'

import { resize } from 'aspectratio'
import { default as Canvas } from 'canvas'

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    request.get(url, { encoding: null }, (err, res, buffer) => {
      if (err) {
        return reject(err)
      }

      const imageData = sizeOf(buffer)
      set(imageData, 'url', url)
      set(imageData, 'buffer', buffer)
      resolve(imageData)
    })
  })
}

export default (folder, urls = []) => {
  return new Promise(async (resolve, reject) => {
    urls = slice(reverse(urls), 0, isEqual(size(urls), 3) ? 2 : 4)
    const images = []
    const imagesLength = size(urls)

    if (isEmpty(urls)) {
      return resolve('')
    }

    for (let url of urls) {
      try {
        const image = await loadImage(url)
        images.push(image)
      } catch (err) {
        reject(err)
      }
    }

    const canvasWidth = isEqual(imagesLength, 4) ? 400 : 200
    const canvasHeight = isEqual(imagesLength, 1) ? 200 : 400

    const canvas = new Canvas(canvasWidth, canvasHeight)
    const canvasCtx = canvas.getContext('2d')

    canvasCtx.fillStyle = '#ffffff'
    canvasCtx.fillRect(0, 0, canvasWidth, canvasHeight)
    canvasCtx.save()

    let counter = 1

    for (let image of images) {
      let x, y
      const wh = resize(image.width, image.height, 185, 185)
      const w = wh[0]
      const h = wh[1]
      const wDifference = (185 - w) / 2
      const hDifference = (185 - h) / 2

      if (isEqual(counter, 1)) {
        x = wDifference + 15
        y = hDifference + 15
      } else if (isEqual(counter, 2) && isEqual(imagesLength, 2)) {
        x = wDifference + 15
        y = hDifference + 215
      } else if (isEqual(counter, 2) && isEqual(imagesLength, 4)) {
        x = wDifference + 215
        y = hDifference + 15
      } else if (isEqual(counter, 3)) {
        x = wDifference + 15
        y = hDifference + 215
      } else if (isEqual(counter, 4)) {
        x = wDifference + 215
        y = hDifference + 215
      }

      const img = new Canvas.Image(w, h)
      img.src = image.buffer
      counter += 1
      canvasCtx.drawImage(img, x, y, w, h)
    }

    try {
      const buffer = canvas.toBuffer()
      const imageUrl = await uploadBuffer(folder, buffer, false)
      resolve(imageUrl)
    } catch (err) {
      reject(err)
    }
  })
}
