import express from 'express'
import * as controller from '../controllers/follow'

const router = express.Router()
const ajaxRoot = '/ajax/follows'

router.post(`${ajaxRoot}/`, controller.follow)
router.delete(
  `${ajaxRoot}/:parentType/:parent/:createdBy/`, controller.unfollow
)

export default router
