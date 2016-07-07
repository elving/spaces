import get from 'lodash/get'
import map from 'lodash/map'
import flattenDeep from 'lodash/flattenDeep'
import React, { Component, PropTypes } from 'react'

import toStringId from '../../api/utils/toStringId'

export default class CardTags extends Component {
  static propTypes = {
    tags: PropTypes.array,
    className: PropTypes.string,
    forDisplayOnly: PropTypes.bool
  };

  static defaultProps = {
    tags: [],
    className: '',
    forDisplayOnly: false
  };

  render() {
    const { props } = this

    return (
      <div className={`${props.className} card-tags`}>
        {map(flattenDeep(props.tags), tag =>
          props.forDisplayOnly ? (
            <span
              key={`tag-${toStringId(tag)}`}
              className="card-tag">
              {get(tag, 'name')}
            </span>
          ) : (
            <a
              key={`tag-${toStringId(tag)}`}
              href={`/${get(tag, 'detailUrl')}/`}
              className="card-tag">
              {get(tag, 'name')}
            </a>
          )
        )}
      </div>
    )
  }
}
