import express from 'express'
import * as controller from '../controllers/like'

const router = express.Router()
const ajaxRoot = '/ajax/likes'

router.post(`${ajaxRoot}/`, controller.like)
router.delete(`${ajaxRoot}/:parentType/:parent/:createdBy/`, controller.unlike)

export default router
