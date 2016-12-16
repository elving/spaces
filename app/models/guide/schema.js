import shortid from 'shortid'
import mongoose from 'mongoose'

import applyHooks from './hooks'
import applyVirtuals from './virtuals'
import applyValidations from './validations'

const GuideSchema = new mongoose.Schema({
  sid: { type: String, default: shortid.generate },
  name: { type: String, trim: true, default: '', unique: true },
  sections: [{ type: mongoose.Schema.Types.Mixed }],
  likesCount: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  coverImage: { type: String, trim: true, default: '' },
  coverSource: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  introduction: { type: String, trim: true, default: '' },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
}, { timestamps: true })

applyHooks(GuideSchema)
applyVirtuals(GuideSchema)
applyValidations(GuideSchema)

GuideSchema.set('toJSON', {
  getters: true
})

GuideSchema.set('toObject', {
  getters: true
})

export default () => mongoose.model('Guide', GuideSchema)
