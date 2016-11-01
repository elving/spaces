import mongoose from 'mongoose'

import parseError from '../utils/parseError'

const getSpacesCount = createdBy => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Space')
      .where({ createdBy })
      .count((err, count = 0) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(count)
      })
  })
)

const getProductsCount = createdBy => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Product')
      .where({ createdBy })
      .count((err, count = 0) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(count)
      })
  })
)

const getLikesCount = createdBy => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Like')
      .where({
        createdBy,
        parentType: { $not: /comment/ }
      })
      .count((err, count = 0) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(count)
      })
  })
)

const getFollowingCount = createdBy => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Follow')
      .where({ createdBy })
      .count((err, count = 0) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(count)
      })
  })
)

const getFollowersCount = parent => (
  new Promise((resolve, reject) => {
    mongoose
      .model('Follow')
      .where({ parent })
      .count((err, count = 0) => {
        if (err) {
          return reject(parseError(err))
        }

        resolve(count)
      })
  })
)

export default async (user) => ({
  likes: await getLikesCount(user),
  spaces: await getSpacesCount(user),
  products: await getProductsCount(user),
  following: await getFollowingCount(user),
  followers: await getFollowersCount(user)
})
