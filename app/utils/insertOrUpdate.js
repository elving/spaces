import map from 'lodash/map'

export default (collection, item, shouldUpdate = (() => {})) => (
  map(collection, (value) => (
    shouldUpdate(value) ? item : value
  ))
)
