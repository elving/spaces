import split from 'lodash/split'
import compact from 'lodash/compact'

export default csv => compact(split(csv, ','))
