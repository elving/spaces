import size from 'lodash/size'

export default word => word.substring(0, size(word) - 1)
