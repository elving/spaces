import isEmpty from 'lodash/isEmpty'
import { inCache, getFromCache } from '../cache'

export default async (key, query, resolve) => {
  if (!inCache(key)) {
    return query()
  }

  try {
    const data = await getFromCache(key)

    if (isEmpty(data)) {
      query()
    } else {
      resolve(data)
    }
  } catch (err) {
    query()
  }
}
