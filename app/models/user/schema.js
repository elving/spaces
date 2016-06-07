import shortid from 'shortid'
import has from 'lodash/has'
import omit from 'lodash/omit'
import mongoose from 'mongoose'

import { default as applyHooks } from './hooks'
import { default as applyMethods } from './methods'
import { default as applyVirtuals } from './virtuals'
import { default as applyValidations } from './validations'

import setAssetUrl from '../../utils/setAssetUrl'

const UserSchema = new mongoose.Schema({
  sid: { type: String, default: shortid.generate },
  bio: { type: String, trim: true, default: '' },
  fullname: { type: String, trim: true, default: '' },
  email: { type: String, trim: true, unique: true },
  avatar: { type: String, trim: true, default: '' },
  username: { type: String, trim: true, unique: true },
  salt: { type: String, default: '' },
  settings: { type: mongoose.Schema.Types.Mixed },
  hashedPassword: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  provider: { type: String, default: 'local' },
  isCurator: { type: Boolean, default: false },
  comments: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
  categories: [{ type: mongoose.Schema.ObjectId, ref: 'Category' }],
  spacesLiked: [{ type: mongoose.Schema.ObjectId, ref: 'Space' }],
  poductsLiked: [{ type: mongoose.Schema.ObjectId, ref: 'Product' }]
}, { timestamps: true })

applyHooks(UserSchema)
applyMethods(UserSchema)
applyVirtuals(UserSchema)
applyValidations(UserSchema)

UserSchema.set('toJSON', {
  getters: true,
  transform(doc, ret) {
    if (has(ret, 'avatar')) {
      ret.avatar = setAssetUrl(ret.avatar)
    }

    return omit(ret, ['email', 'salt', 'password', 'hashedPassword'])
  }
})

UserSchema.set('toObject', {
  getters: true,
  transform(doc, ret) {
    if (has(ret, 'avatar')) {
      ret.avatar = setAssetUrl(ret.avatar)
    }

    return omit(ret, ['email', 'salt', 'password', 'hashedPassword'])
  }
})

export default () => mongoose.model('User', UserSchema)
