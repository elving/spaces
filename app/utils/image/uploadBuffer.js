import get from 'lodash/get'
import mime from 'mime'
import knox from 'knox'
import uuid from 'node-uuid'
import sharp from 'sharp'
import fileType from 'file-type'

import knoxConfig from '../../config/knox'

const optimize = (image) => (
  new Promise((resolve, reject) => {
    sharp(image)
      .resize(1024, null)
      .min()
      .withoutEnlargement()
      .background({ r: 255, g: 255, b: 255, alpha: 1 })
      .flatten()
      .jpeg()
      .toBuffer((err, buffer, info) => {
        if (err) {
          return reject(err)
        }

        resolve({ buffer, ...info })
      })
  })
)

export default (folder, buffer, tryOptimize = true) => {
  const client = knox.createClient(knoxConfig())

  return new Promise(async (resolve, reject) => {
    let optimizedImage

    try {
      if (tryOptimize) {
        optimizedImage = await optimize(buffer)
      } else {
        optimizedImage = buffer
      }

      const name = uuid.v4()

      const size = tryOptimize
        ? optimizedImage.size
        : optimizedImage.length

      const mimeType = tryOptimize
        ? mime.lookup(optimizedImage.format)
        : get(fileType(optimizedImage), 'mime', 'image/jpeg')

      const extension = tryOptimize
        ? optimizedImage.format
        : get(fileType(optimizedImage), 'ext', 'jpeg')

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

      req.end(tryOptimize ? optimizedImage.buffer : optimizedImage)
    } catch (err) {
      reject(err)
    }
  })
}
