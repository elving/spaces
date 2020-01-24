import knox from 'knox'
import head from 'lodash/head'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

import knoxConfig from '../../config/knox'

export default (folder, name) => {
  const regx = new RegExp(`\/${folder}.+`)
  const client = knox.createClient(knoxConfig())

  return new Promise((resolve, reject) => {
    const fileName = head(name.match(regx))

    if (isEmpty(fileName)) {
      reject('Error extracting file name.')
    } else {
      client
        .del(fileName)
        .on('error', reject)
        .on('response', (res) => {
          if (isEqual(res.statusCode, 200) || isEqual(res.statusCode, 204)) {
            resolve()
          }
        })
        .end()
    }
  })
}
