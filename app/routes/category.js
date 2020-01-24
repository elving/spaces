import express from 'express'
import isAdmin from '../utils/middlewares/isAdmin'
import * as controller from '../controllers/category'

const router = express.Router()
const ajaxRoot = '/ajax/categories'
const adminRoot = '/admin/categories'

const {
  addCategory,
  updateCategory,
  destroyCategory,
  renderAddCategory,
  renderAllCategories,
  renderUpdateCategory
} = controller

router.get('/categories/', controller.renderIndex)
router.get('/categories/:slug/', controller.renderDetail)

router.get(`${adminRoot}/`, isAdmin, renderAllCategories)
router.get(`${adminRoot}/add/`, isAdmin, renderAddCategory)
router.get(`${adminRoot}/:sid/update/`, isAdmin, renderUpdateCategory)

router.post(`${ajaxRoot}/`, isAdmin, addCategory)
router.put(`${ajaxRoot}/:id/`, isAdmin, updateCategory)
router.delete(`${ajaxRoot}/:id/`, isAdmin, destroyCategory)

export default router
