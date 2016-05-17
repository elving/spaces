import isEmpty from 'lodash/isEmpty'
import { join } from 'path'
import { readFileSync } from 'fs'

export default () => {
  let version
  const app = readFileSync(join(__dirname, '../../package.json'), 'utf8')

  try {
    version = JSON.parse(app).version
  } catch (err) {
    console.error(err)
  }

  return `version_${isEmpty(version) ? 'latest' : version}`
}
