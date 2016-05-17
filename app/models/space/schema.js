import mongoose from 'mongoose'

import { default as applyHooks } from './hooks'
import { default as applyVirtuals } from './virtuals'
import { default as applyValidations } from './validations'

// Schema
const SpaceSchema = new mongoose.Schema({
  title: { type: String, trim: true, default: '' },
  license: { type: String, trim: true, default: '' },
  images: [{
    url: String,
    width: Number,
    height:  Number,
    orientation: String
  }],
  colors: [{ type: mongoose.Schema.ObjectId, ref: 'Color' }],
  products: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }],
  category: { type: mongoose.Schema.ObjectId, ref: 'Category' },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  sourceUrl: { type: String, trim: true, default: '' },
  sourceName: { type: String, trim: true, default: '' },
  isPublished: { type: Boolean, default: false },
  description: { type: String, trim: true, default: '' }
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
