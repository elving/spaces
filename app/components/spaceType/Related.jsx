import get from 'lodash/get'
import map from 'lodash/map'
import React, { Component, PropTypes } from 'react'

import RoomCard from './Card'
import ProductMiniCard from '../product/MiniCard'

import toStringId from '../../api/utils/toStringId'

export default class RelatedRooms extends Component {
  static propTypes = {
    rooms: PropTypes.object,
    onAddButtonClick: PropTypes.func
  }

  static defaultProps = {
    rooms: {
      main: {},
      related: []
    },
    onAddButtonClick: (() => {})
  }

  render() {
    const { props } = this
    const mainRoom = get(props, 'rooms.main', {})
    const relatedProducts = get(props, 'rooms.related', [])

    return (
      <div className="grid-container">
        <div className="grid-title-container">
          <h3 className="grid-title">
            Popular products for your {get(mainRoom, 'name')}
          </h3>
        </div>
        <div className="grid grid--has-inline">
          <div className="grid-items grid-items--3-cards">
            <RoomCard
              {...mainRoom}
              key={toStringId(mainRoom)}
            />
            <div className="grid-items grid-items--inline">
              {map(relatedProducts, product =>
                <ProductMiniCard
                  {...product}
                  key={`${toStringId(mainRoom)}-${toStringId(product)}`}
                  onAddButtonClick={() => props.onAddButtonClick(product)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
