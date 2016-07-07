import get from 'lodash/get'
import map from 'lodash/map'
import flattenDeep from 'lodash/flattenDeep'
import React, { Component, PropTypes as Type } from 'react'

import toStringId from '../../api/utils/toStringId'

export default class CardTags extends Component {
  static propTypes = {
    tags: Type.array,
    className: Type.string
  };

  static defaultProps = {
    tags: [],
    className: ''
  };

  render() {
    const { tags, className } = this.props

    return (
      <div className={`${className} card-tags`}>
        {map(flattenDeep(tags), tag =>
          <a
            key={`tag-${toStringId(tag)}`}
            href={`/${get(tag, 'detailUrl')}/`}
            className="card-tag">
            {get(tag, 'name')}
          </a>
        )}
      </div>
    )
  }
}
