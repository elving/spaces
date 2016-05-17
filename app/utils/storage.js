import map from 'lodash/map'
import mime from 'mime'
import knox from 'knox'
import uuid from 'node-uuid'
import head from 'lodash/head'
import sizeOf from 'image-size'
import isArray from 'lodash/isArray'
import request from 'request'
import { series } from 'async'
import knoxConfig from '../config/knox'

export const uploadImages = (folder, files) => {
  const client = knox.createClient(knoxConfig())
  const images = isArray(files) ? files : [files]

  return new Promise((resolve, reject) => {
    series(map(images, (image) => ((withNextImage) => {
      const name = uuid.v4()
      const mimeType = image.mimetype || mime.lookup(image.originalname)
      const extension = mime.extension(mimeType)
      const dimmensions = sizeOf(image.buffer)

      const req = client.put(`/${folder}/${name}.${extension}`, {
        'x-amz-acl': 'public-read',
        'Content-Type': mimeType,
        'Cache-Control': 'max-age=2592000, public',
        'Content-Length': image.size
      }).on('response', (res) => {
        let orientation

        if (res.statusCode === 200) {
          if (dimmensions.width > dimmensions.height) {
            orientation = 'landscape'
          } else if (dimmensions.width < dimmensions.height) {
            orientation = 'portrait'
          } else {
            orientation = 'square'
          }

          withNextImage(null, {
            url: req.url,
            width: dimmensions.width,
            height: dimmensions.height,
            orientation
          })
        }
      }).on('error', withNextImage)

      req.end(image.buffer)
    })), (err, images) => {
      if (err) {
        reject(err)
      } else {
        resolve(images)
      }
    })
  })
}

export const uploadFromUrls = (folder, sources) => {
  const client = knox.createClient(knoxConfig())
  const images = isArray(sources) ? sources : [sources]

  return new Promise((resolve, reject) => {
    series(map(images, (image) => ((withNextImage) => {
      request.get(image, { encoding: null }, (err, res, body) => {
        const { headers } = res

        if (err) {
          withNextImage(err)
        } else {
          const name = uuid.v4()
          const mimeType = headers['content-type'] || mime.lookup(image)
          const extension = mime.extension(mimeType)

          const req = client.put(`/${folder}/${name}.${extension}`, {
            'x-amz-acl': 'public-read',
            'Content-Type': mimeType,
            'Cache-Control': 'max-age=2592000, public',
            'Content-Length': headers['content-length']
          }).on('response', (res) => {
            if (res.statusCode === 200) withNextImage(null, req.url)
          }).on('error', withNextImage)

          req.end(body)
        }
      })
    })), (err, urls) => {
      if (err) {
        reject(err)
      } else {
        resolve(urls)
      }
    })
  })
}

export const deleteImages = (folder, files) => {
  const regx = new RegExp(`\/${folder}.+`)
  const client = knox.createClient(knoxConfig())
  const images = isArray(files) ? files : [files]

  return new Promise((resolve, reject) => {
    series(map(images, (image) => ((withNextImage) => {
      const fileName = head(image.url.match(regx))

      if (!fileName) {
        withNextImage(new Error('Error extracting file name.'))
      } else {
        client
          .del(fileName)
          .on('error', withNextImage)
          .on('response', (res) => {
            const status = res.statusCode
            if (status === 200 || status === 204) withNextImage(null)
          })
          .end()
      }
    })), (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
