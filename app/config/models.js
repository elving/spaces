import {
  default as registerUserModel
} from '../models/user/schema'

import {
  default as registerBrandModel
} from '../models/brand/schema'

import {
  default as registerColorModel
} from '../models/color/schema'

import {
  default as registerSpaceModel
} from '../models/space/schema'

import {
  default as registerProductModel
} from '../models/product/schema'

import {
  default as registerCategoryModel
} from '../models/category/schema'

import {
  default as registerSpaceTypeModel
} from '../models/spaceType/schema'

import {
  default as registerPasswordResetModel
} from '../models/passwordReset/schema'

const configModels = () => {
  registerUserModel()
  registerBrandModel()
  registerColorModel()
  registerProductModel()
  registerCategoryModel()
  registerSpaceTypeModel()
  registerPasswordResetModel()
}

export default configModels
