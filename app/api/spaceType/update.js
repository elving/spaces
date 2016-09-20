import has from 'lodash/has'
import get from 'lodash/get'
import set from 'lodash/set'
import isEmpty from 'lodash/isEmpty'
import mongoose from 'mongoose'

import toIds from '../utils/toIds'
import sanitize from './sanitize'
import setImage from './setImage'
import parseError from '../utils/parseError'
import findCategoryByName from '../category/findByName'
import { invalidateFromCache } from '../cache'

export default (_id, props) => (
  new Promise(async (resolve, reject) => {
    const updates = sanitize(props)
    const categories = []
    const categoriesFromUpdates = get(updates, 'categories', [])

    const options = {
      new: true,
      runValidators: true
    }

    if (!isEmpty(categoriesFromUpdates)) {
      try {
        for (let category of categoriesFromUpdates) {
          category = await findCategoryByName(category, true)

          if (!isEmpty(category)) {
            categories.push(category)
          }
        }

        set(updates, 'categories', toIds(categories))
      } catch (err) {
        if (has(err, 'name')) {
          return reject({ categories: get(err, 'name') })
        }

        return reject({
          generic: (
            'There was an error while trying to update this room. ' +
            'Please try again.'
          )
        })
      }
    }

    mongoose
      .model('SpaceType')
      .findOneAndUpdate({ _id }, updates, options, async (err, spaceType) => {
        if (err) {
          return reject(parseError(err))
        }

        await invalidateFromCache(_id)
        setImage(spaceType)
        resolve(spaceType)
      })
  })
)
