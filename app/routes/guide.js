import express from 'express'
import isAdmin from '../utils/middlewares/isAdmin'
import * as controller from '../controllers/guide'

const router = express.Router()
const ajaxRoot = '/ajax/guides'

router.get('/guides/', controller.renderIndex)
router.get('/guides/add/', isAdmin, controller.renderAddGuide)
router.get('/guides/:sid/update/', controller.renderUpdateGuide)
router.get('/g/:sid/', controller.renderDetail)
router.get('/guides/:sid/:name/', controller.renderDetail)

router.get('/admin/guides/', isAdmin, controller.renderAdminGuides)

router.post(`${ajaxRoot}/`, isAdmin, controller.addGuide)
router.put(`${ajaxRoot}/:id/`, isAdmin, controller.updateGuide)
router.delete(`${ajaxRoot}/:id/`, isAdmin, controller.destroyGuide)

export default router
