import get from 'lodash/get'
import size from 'lodash/size'
import isEqual from 'lodash/isEqual'
import React, { Component, PropTypes } from 'react'

import Table from '../common/Table'
import Layout from '../common/Layout'
import formatDate from '../../utils/formatDate'

export default class ColorsTable extends Component {
  static propTypes = {
    colors: PropTypes.array.isRequired
  }

  renderRow = (color) => {
    const sid = get(color, 'sid', '')
    const hex = get(color, 'hex', '')
    const name = get(color, 'name', '')
    const createdAt = get(color, 'createdAt', (new Date()))

    return (
      <tr key={`color-row-${sid}`}>
        <td className="table-centered">
          {formatDate(createdAt)}
        </td>
        <td className="table-centered">
          {name}
        </td>
        <td
          style={{
            color: isEqual(name, 'White') ? '#555' : '#fff',
            backgroundColor: hex
          }}
          className="table-centered"
        >
          {hex}
        </td>
        <td className="table-actions">
          <a href={`/admin/colors/${sid}/update/`} className="button">
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
          items={props.colors}
          count={size(props.colors)}
          headerTitle="Colors"
          tableHeaders={[{
            label: 'Date Created',
            property: 'createdAt'
          }, {
            label: 'Name',
            property: 'name'
          }, {
            label: 'Hex',
            property: 'hex'
          }, {
            label: 'Actions'
          }]}
          searchPath="name"
          headerCtaLink="/admin/colors/add/"
          headerCtaText="Add Color"
          renderTableRow={this.renderRow}
          searchPlaceholder="Search colors by name"
        />
      </Layout>
    )
  }
}
