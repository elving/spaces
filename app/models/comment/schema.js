import shortid from 'shortid'
import mongoose from 'mongoose'

import { default as applyHooks } from './hooks'
import { default as applyVirtuals } from './virtuals'
import { default as applyValidations } from './validations'

const CommentSchema = new mongoose.Schema({
  sid: { type: String, default: shortid.generate },
  parent: { type: mongoose.Schema.ObjectId },
  content: { type: String, trim: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  parentType: { type: String, trim: true, default: '' },
  likesCount: { type: Number, default: 0 }
}, { timestamps: true })

applyHooks(CommentSchema)
applyVirtuals(CommentSchema)
applyValidations(CommentSchema)

CommentSchema.set('toJSON', {
  getters: true
})

CommentSchema.set('toObject', {
  getters: true
})

export default () => mongoose.model('Comment', CommentSchema)
