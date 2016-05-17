import attempt from 'lodash/attempt'
import isError from 'lodash/isError'

export default (value) => !isError(attempt(JSON.parse, value))
