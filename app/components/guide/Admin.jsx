import get from 'lodash/get'
import size from 'lodash/size'
import React, { Component, PropTypes } from 'react'

import Table from '../common/Table'
import Layout from '../common/Layout'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import getDate from '../../utils/guide/getDate'

export default class GuidesAdmin extends Component {
  static propTypes = {
    guides: PropTypes.array
  }

  static defaultProps = {
    guides: []
  }

  renderRow = guide => {
    const sid = get(guide, 'sid', '')
    const name = get(guide, 'name', '')
    const detailUrl = get(guide, 'detailUrl', '')
    const createdBy = get(guide, 'createdBy', {})
    const createdAt = get(guide, 'createdAt', (new Date()))
    const isPublished = get(guide, 'isPublished', false)
    const description = get(guide, 'description', '')

    return (
      <tr key={`guide-row-${sid}`}>
        <td className="table-centered">
          {getDate(createdAt)}
        </td>
        <td className="table-centered">
          <a
            rel="noopener noreferrer"
            href={`/${get(createdBy, 'detailUrl')}/`}
            target="_blank"
          >
            {get(createdBy, 'name')}
          </a>
        </td>
        <td className="table-centered">
          <a href={`/${detailUrl}/`}>
            {name}
          </a>
        </td>
        <td className="table-centered">
          {description}
        </td>
        <td className="table-centered">
          <MaterialDesignIcon
            name={isPublished ? 'public' : 'private'}
          />
          {isPublished ? 'Published' : 'Not Published'}
        </td>
        <td className="table-actions">
          <a
            href={`/guides/${sid}/update/`}
            className="button button--primary-alt"
          >
            <span className="button-text">
              <MaterialDesignIcon name="edit" />
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
        <div className="admin-guides">
          <Table
            items={props.guides}
            count={size(props.guides)}
            headerTitle="Guides"
            tableHeaders={[{
              label: 'Date Created',
              property: 'createdAt'
            }, {
              label: 'Created By',
            }, {
              label: 'Name',
              property: 'name'
            }, {
              label: 'Description'
            }, {
              label: 'Status'
            }, {
              label: 'Actions'
            }]}
            searchPath="name"
            headerCtaLink="/guides/add/"
            headerCtaText="Add Guide"
            renderTableRow={this.renderRow}
            searchPlaceholder="Search guides by name"
          />
        </div>
      </Layout>
    )
  }
}
