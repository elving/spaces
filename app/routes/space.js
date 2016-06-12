import express from 'express'
import isAdmin from '../utils/middlewares/isAdmin'
import * as controller from '../controllers/space'

const router = express.Router()
const ajaxRoot = '/ajax/spaces'

router.get('/spaces/', controller.renderIndex)
router.get('/s/:sid/', controller.renderDetail)
router.get('/spaces/:sid/:name/', controller.renderDetail)
router.get('/spaces/create/', controller.renderCreateSpace)
// router.get('/admin/spaces/', isAdmin, controller.renderAllProducts)
// router.get('/spaces/:sid/update/', controller.renderUpdateProduct)

router.post(`${ajaxRoot}/`, controller.createSpace)
router.put(`${ajaxRoot}/:id/`, controller.updateSpace)
router.post(`${ajaxRoot}/:id/redesign/`, controller.redesignSpace)
// router.delete(`${ajaxRoot}/:sid/`, controller.destroyProduct)

export default router
