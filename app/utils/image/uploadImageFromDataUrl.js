import replace from 'lodash/replace'

import uploadBuffer from './uploadBuffer'

export default (folder, dataUrl) => (
  new Promise(async (resolve, reject) => {
    const buffer = new Buffer(
      replace(dataUrl, /^data:image\/\w+;base64,/, ''), 'base64'
    )

    try {
      const url = await uploadBuffer(folder, buffer)
      resolve(url)
    } catch (err) {
      reject(err)
    }
  })
)
