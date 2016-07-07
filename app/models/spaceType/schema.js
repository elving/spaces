import shortid from 'shortid'
import mongoose from 'mongoose'

import { default as applyHooks } from './hooks'
import { default as applyVirtuals } from './virtuals'
import { default as applyValidations } from './validations'

const SpaceTypeSchema = new mongoose.Schema({
  sid: { type: String, default: shortid.generate },
  name: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
}, { timestamps: true })

applyHooks(SpaceTypeSchema)
applyVirtuals(SpaceTypeSchema)
applyValidations(SpaceTypeSchema)

SpaceTypeSchema.set('toJSON', {
  getters: true
})

SpaceTypeSchema.set('toObject', {
  getters: true
})

export default () => mongoose.model('SpaceType', SpaceTypeSchema)
