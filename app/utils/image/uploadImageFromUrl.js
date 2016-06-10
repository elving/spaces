import request from 'request'

import uploadBuffer from './uploadBuffer'

export default (folder, url) => {
  return new Promise((resolve, reject) => {
    request.get(url, { encoding: null }, async (err, res, buffer) => {
      if (err) {
        return reject(err)
      }

      try {
        const url = await uploadBuffer(folder, buffer)
        resolve(url)
      } catch (err) {
        reject(err)
      }
    })
  })
}
