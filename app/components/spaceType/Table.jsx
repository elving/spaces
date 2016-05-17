import get from 'lodash/get'
import size from 'lodash/size'
import React, { Component, PropTypes as Type } from 'react'

import Table from '../common/Table'
import Layout from '../common/Layout'
import formatDate from '../../utils/formatDate'

export default class SpaceTypesTable extends Component {
  static propTypes = {
    spaceTypes: Type.array.isRequired
  };

  renderRow(spaceType) {
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
            Update
          </a>
        </td>
      </tr>
    )
  }

  render() {
    const { spaceTypes } = this.props

    return (
      <Layout>
        <Table
          items={spaceTypes}
          count={size(spaceTypes)}
          headerTitle="SpaceTypes"
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
          headerCtaText="Add SpaceType"
          renderTableRow={::this.renderRow}
          searchPlaceholder="Search spaceTypes by name"/>
      </Layout>
    )
  }
}
