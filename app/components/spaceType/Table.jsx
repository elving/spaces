import get from 'lodash/get'
import size from 'lodash/size'
import React, { Component, PropTypes } from 'react'

import Table from '../common/Table'
import Layout from '../common/Layout'
import formatDate from '../../utils/formatDate'

export default class SpaceTypesTable extends Component {
  static propTypes = {
    spaceTypes: PropTypes.array.isRequired
  }

  renderRow = (spaceType) => {
    const sid = get(spaceType, 'sid', '')
    const name = get(spaceType, 'name', '')
    const createdAt = get(spaceType, 'createdAt', (new Date()))
    const description = get(spaceType, 'description', '')

    return (
      <tr key={`spaceType-row-${sid}`}>
        <td className="table-centered">
          {formatDate(createdAt)}
        </td>
        <td className="table-centered">
          {name}
        </td>
        <td className="table-centered">
          {description}
        </td>
        <td className="table-actions">
          <a href={`/admin/space-types/${sid}/update/`} className="button">
            <span className="button-text">
              Update
            </span>
          </a>
        </td>
      </tr>
    )
  }

  render() {
    const { props } = this

    return (
      <Layout>
        <Table
          items={props.spaceTypes}
          count={size(props.spaceTypes)}
          headerTitle="Rooms"
          tableHeaders={[{
            label: 'Date Created',
            property: 'createdAt'
          }, {
            label: 'Name',
            property: 'name'
          }, {
            label: 'Description'
          }, {
            label: 'Actions'
          }]}
          searchPath="name"
          headerCtaLink="/admin/space-types/add/"
          headerCtaText="Add Room"
          renderTableRow={this.renderRow}
          searchPlaceholder="Search rooms by name"
        />
      </Layout>
    )
  }
}
