import shortid from 'shortid'
import mongoose from 'mongoose'

import { default as applyHooks } from './hooks'
import { default as applyVirtuals } from './virtuals'
import { default as applyValidations } from './validations'

// Schema
const SpaceSchema = new mongoose.Schema({
  sid: { type: String, default: shortid.generate },
  name: { type: String, trim: true, default: '' },
  image: { type: String, trim: true, default: '' },
  coverImage: { type: String, trim: true, default: '' },
  brands: [{ type: mongoose.Schema.ObjectId, ref: 'Brand' }],
  colors: [{ type: mongoose.Schema.ObjectId, ref: 'Color' }],
  products: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
  redesigns: [{ type: mongoose.Schema.ObjectId, ref: 'Space' }],
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  spaceType: { type: mongoose.Schema.ObjectId, ref: 'SpaceType' },
  categories: [{ type: mongoose.Schema.ObjectId, ref: 'Category' }],
  description: { type: String, trim: true, default: '' },
  originalSpace: { type: mongoose.Schema.ObjectId, ref: 'Space' },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  redesignsCount: { type: Number, default: 0 },
  followersCount: { type: Number, default: 0 }
}, { timestamps: true })

applyHooks(SpaceSchema)
applyVirtuals(SpaceSchema)
applyValidations(SpaceSchema)

SpaceSchema.set('toJSON', {
  getters: true
})

SpaceSchema.set('toObject', {
  getters: true
})

export default () => mongoose.model('Space', SpaceSchema)
