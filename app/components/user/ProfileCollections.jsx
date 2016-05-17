import ga from 'react-ga'
import get from 'lodash/get'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import { Link } from 'react-router'
import React, { Component, PropTypes as Type } from 'react'

import fullReload from '../../utils/fullReload'
import CollectionCard from '../collection/Card'

export default class UserProfileCollections extends Component {
  static propTypes = {
    collections: Type.array
  };

  static contextTypes = {
    user: Type.object,
    userLoggedIn: Type.func
  };

  render() {
    const { collections } = this.props
    const { user, userLoggedIn } = this.context

    const username = get(user, 'username')

    return (
      <div className="user-profile-collections">
        <div className="ui-filters">
          <h2 className="ui-filters-title">Collections</h2>
          {userLoggedIn() ? (
            <div className="ui-filters-options">
              <Link
                to={{pathname: '/collections/new/'}}
                onClick={(event) => {
                  ga.event({
                    label: username,
                    action: 'Clicked Create Collections Button',
                    category: 'Profile Collections'
                  })

                  fullReload(event)
                }}
                className="ui-filters-option">
                Create a collection
              </Link>
            </div>
          ) : null}
        </div>
        {!isEmpty(collections) ? (
          <div className="ui-grids">
            <div className="ui-grid">
              <div className="ui-grid-cards">
                {map(collections, (collection) => (
                  <CollectionCard
                    {...collection}
                    key={`collection-card-${collection.id}`}
                    linksToContents={false}/>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="user-profile-empty">
            <h3 className="user-profile-empty-title">
              No products collected here, yet...
            </h3>
          </div>
        )}
      </div>
    )
  }
}
