import mongoose from 'mongoose'

import parseError from '../utils/parseError'

export default createdBy => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Space')
      .where({ createdBy })
      .populate('spaceType')
      .exec((err, spaces = []) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(spaces)
      })
  })
)
