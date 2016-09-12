import shortid from 'shortid'
import mongoose from 'mongoose'

import { default as applyHooks } from './hooks'
import { default as applyVirtuals } from './virtuals'
import { default as applyValidations } from './validations'

const CategorySchema = new mongoose.Schema({
  sid: { type: String, default: shortid.generate },
  name: { type: String, trim: true, default: '', unique: true },
  image: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  spacesCount: { type: Number, default: 0 },
  productsCount: { type: Number, default: 0 },
  followersCount: { type: Number, default: 0 }
}, { timestamps: true })

applyHooks(CategorySchema)
applyVirtuals(CategorySchema)
applyValidations(CategorySchema)

CategorySchema.set('toJSON', {
  getters: true
})

CategorySchema.set('toObject', {
  getters: true
})

export default () => mongoose.model('Category', CategorySchema)
