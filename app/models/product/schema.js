import shortid from 'shortid'
import mongoose from 'mongoose'

import { default as applyHooks } from './hooks'
import { default as applyVirtuals } from './virtuals'
import { default as applyValidations } from './validations'

const ProductSchema = new mongoose.Schema({
  sid: { type: String, default: shortid.generate },
  url: { type: String, trim: true, default: '', unique: true },
  note: { type: String, trim: true, default: '' },
  name: { type: String, trim: true, default: '', unique: true },
  image: { type: String, trim: true, default: '' },
  price: { type: Number, min: 0.01 },
  brand: { type: mongoose.Schema.ObjectId, ref: 'Brand' },
  colors: [{ type: mongoose.Schema.ObjectId, ref: 'Color' }],
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  categories: [{ type: mongoose.Schema.ObjectId, ref: 'Category' }],
  spaceTypes: [{ type: mongoose.Schema.ObjectId, ref: 'SpaceType' }],
  description: { type: String, trim: true, default: '' },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  followersCount: { type: Number, default: 0 }
}, { timestamps: true })

applyHooks(ProductSchema)
applyVirtuals(ProductSchema)
applyValidations(ProductSchema)

ProductSchema.set('toJSON', {
  getters: true
})

ProductSchema.set('toObject', {
  getters: true
})

export default () => mongoose.model('Product', ProductSchema)
