import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import slice from 'lodash/slice'
import React, { Component, PropTypes } from 'react'

import Tag from '../common/Tag'

import getTags from '../../utils/getTags'
import toStringId from '../../api/utils/toStringId'

export default class CardTags extends Component {
  static propTypes = {
    model: PropTypes.object,
    className: PropTypes.string,
    autoScroll: PropTypes.bool,
    forDisplayOnly: PropTypes.bool
  }

  static defaultProps = {
    model: {},
    className: '',
    forDisplayOnly: false
  }

  render() {
    const { props } = this
    const tags = getTags(props.model)
    const tagsShown = slice(tags, 0, 3)
    const tagsNotShown = size(tags) - size(tagsShown)

    return (
      <div className={`${props.className} card-tags`}>
        {map(tagsShown, tag =>
          <Tag
            key={`${toStringId(props.model)}-${tag.id}`}
            url={!props.forDisplayOnly ? tag.url : null}
            type={tag.type}
            name={tag.name}
            size="small"
            className="card-tag"
          />
        )}
        {tagsNotShown > 0 ? (
          <a
            href={`/${get(props.model, 'detailUrl')}/`}
            style={{ marginRight: 0 }}
            className="tag tag--small card-tag"
          >
            + {tagsNotShown} more
          </a>
        ) : null}
      </div>
    )
  }
}
