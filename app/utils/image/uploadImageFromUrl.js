import request from 'request'

import uploadBuffer from './uploadBuffer'

export default (folder, url) => (
  new Promise((resolve, reject) => {
    request.get(url, { encoding: null }, async (err, res, buffer) => {
      if (err) {
        return reject(err)
      }

      try {
        const s3Url = await uploadBuffer(folder, buffer)
        resolve(s3Url)
      } catch (uploadErr) {
        reject(uploadErr)
      }
    })
  })
)
