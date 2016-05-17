import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes as Type } from 'react'

import ProductMiniCard from '../product/MiniCard'
import CurrentUserLikes from '../containers/CurrentUserLikes'

class UserProfileProductLikes extends Component {
  static propTypes = {
    productLikes: Type.array
  };

  render() {
    const likes = this.props.productLikes

    return (
      !isEmpty(likes) ? (
        <div className="ui-grids">
          <div className="ui-grid">
            <div className="ui-grid-cards">
              {map(likes, (like) => (
                <ProductMiniCard
                  {...like.product}
                  key={`product-card-${like.product.id}`}
                  likes={this.props.currentUserLikes}/>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="user-profile-empty">
          <h3 className="user-profile-empty-title">
            No products liked here, yet...
          </h3>
        </div>
      )
    )
  }
}

export default CurrentUserLikes(UserProfileProductLikes)
