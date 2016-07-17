import map from 'lodash/map'
import React, { Component, PropTypes } from 'react'

import MaterialDesignIcon from '../common/MaterialDesignIcon'

import getTags from '../../utils/getTags'
import toStringId from '../../api/utils/toStringId'

export default class CardTags extends Component {
  static propTypes = {
    model: PropTypes.object,
    className: PropTypes.string,
    forDisplayOnly: PropTypes.bool
  };

  static defaultProps = {
    model: {},
    className: '',
    forDisplayOnly: false
  };

  render() {
    const { props } = this

    return (
      <div className={`${props.className} card-tags`}>
        {map(getTags(props.model), tag => (
          props.forDisplayOnly ? (
            <span
              key={`${toStringId(props.model)}-${tag.id}`}
              className="card-tag"
            >
              <MaterialDesignIcon name={tag.type} size={12} />
              {tag.name}
            </span>
          ) : (
            <a
              key={`${toStringId(props.model)}-${tag.id}`}
              href={tag.url}
              className="card-tag"
            >
              <MaterialDesignIcon name={tag.type} size={12} />
              {tag.name}
            </a>
          )
        ))}
      </div>
    )
  }
}
