import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes as Type } from 'react'

import SpaceMiniCard from '../space/MiniCard'
import CurrentUserLikes from '../containers/CurrentUserLikes'

class UserProfileSpaceLikes extends Component {
  static propTypes = {
    spaceLikes: Type.array
  };

  render() {
    const likes = this.props.spaceLikes

    return (
      !isEmpty(likes) ? (
        <div className="ui-grids">
          <div className="ui-grid">
            <div className="ui-grid-cards">
              {map(likes, (like) => (
                <SpaceMiniCard
                  {...like.space}
                  key={`space-card-${like.space.id}`}
                  likes={this.props.currentUserLikes}/>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="user-profile-empty">
          <h3 className="user-profile-empty-title">
            No spaces liked here, yet...
          </h3>
        </div>
      )
    )
  }
}

export default CurrentUserLikes(UserProfileSpaceLikes)
