import isError from 'lodash/isError'
import parseError from './parseError'

export default (err) => isError(err) ? err : new Error(parseError(err))
