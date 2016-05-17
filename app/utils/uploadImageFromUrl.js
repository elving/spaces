import mime from 'mime'
import knox from 'knox'
import uuid from 'node-uuid'
import sharp from 'sharp'
import sizeOf from 'image-size'
import request from 'request'
import knoxConfig from '../config/knox'

const optimize = (image) => {
  return new Promise((resolve, reject) => {
    sharp(image)
      .resize(750, null)
      .min()
      .withoutEnlargement()
      .jpeg()
      .quality(sizeOf(image) > 150 ? 90 : 100)
      .progressive()
      .toBuffer((err, buffer, info) => {
        if (err) {
          return reject(err)
        }

        resolve({ buffer, ...info })
      })
  })
}

export default (folder, url) => {
  const client = knox.createClient(knoxConfig())

  return new Promise((resolve, reject) => {
    request.get(url, { encoding: null }, async (err, res, image) => {
      if (err) {
        return reject(err)
      }

      try {
        const optimizedImage = await optimize(image)

        const name = uuid.v4()
        const size = optimizedImage.size
        const mimeType = mime.lookup(optimizedImage.format)
        const extension = optimizedImage.format

        const req = client.put(`/${folder}/${name}.${extension}`, {
          'x-amz-acl': 'public-read',
          'Content-Type': mimeType,
          'Cache-Control': 'max-age=2592000, public',
          'Content-Length': size
        }).on('response', (res) => {
          if (res.statusCode === 200) {
            resolve(req.url)
          } else {
            reject('Unknown error while uploading image to S3')
          }
        }).on('error', (err) => {
          reject(err)
        })

        req.end(optimizedImage.buffer)
      } catch (err) {
        reject(err)
      }
    })
  })
}
