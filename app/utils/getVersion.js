import isEmpty from 'lodash/isEmpty'
import { join } from 'path'
import { readFileSync } from 'fs'

import logError from '../utils/logError'

export default () => {
  try {
    const app = readFileSync(join(__dirname, '../../package.json'), 'utf8')
    const version = JSON.parse(app).version
    return `version_${isEmpty(version) ? 'latest' : version}`
  } catch (err) {
    logError(err)
  }
}
