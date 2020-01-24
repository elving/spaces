import map from 'lodash/map'
import join from 'lodash/join'
import words from 'lodash/words'
import upperFirst from 'lodash/upperFirst'

export default (slug) => (
  join(map(words(slug), upperFirst), ' ')
)
