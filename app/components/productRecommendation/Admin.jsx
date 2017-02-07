import get from 'lodash/get'
import size from 'lodash/size'
import axios from 'axios'
import filter from 'lodash/filter'
import isEmpty from 'lodash/isEmpty'
import Timeago from 'timeago.js'
import React, { Component, PropTypes } from 'react'

import Table from '../common/Table'
import Layout from '../common/Layout'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

import toStringId from '../../api/utils/toStringId'

export default class RecommendedAdmin extends Component {
  static propTypes = {
    recommendations: PropTypes.array
  }

  static defaultProps = {
    recommendations: []
  }

  static contextTypes = {
    csrf: PropTypes.string
  }

  constructor(props) {
    super(props)

    this.state = {
      isSaving: false,
      recommendations: filter(this.props.recommendations, recommendation =>
        get(recommendation, 'status') === 'pending'
      )
    }
  }

  disapprove = recommendation => {
    const id = toStringId(recommendation)
    const data = {
      _csrf: this.context.csrf,
      status: 'declined'
    }

    if (window.confirm('Are you sure? This can\'t be undone.')) {
      this.setState({
        isSaving: true
      }, () => {
        axios
          .put(`/ajax/recommendations/${id}/`, data)
          .then(() => {
            const recommendations = this.state.recommendations

            this.setState({
              isSaving: false,
              recommendations: filter(recommendations, _recommendation =>
                id !== toStringId(_recommendation)
              )
            })
          })
          .catch(() => {
            this.setState({
              isSaving: false
            })
          })
      })
    }
  }

  approve = recommendation => {
    const id = toStringId(recommendation)
    const product = window.prompt('Enter the product\'s sid')

    const data = {
      _csrf: this.context.csrf,
      status: 'approved',
      product
    }

    if (!isEmpty(product)) {
      this.setState({
        isSaving: true
      }, () => {
        axios
          .put(`/ajax/recommendations/${id}/`, data)
          .then(() => {
            const recommendations = this.state.recommendations

            this.setState({
              isSaving: false,
              recommendations: filter(recommendations, _recommendation =>
                id !== toStringId(_recommendation)
              )
            })
          })
          .catch(() => {
            this.setState({
              isSaving: false
            })
          })
      })
    }
  }

  renderRow = recommendation => {
    const sid = get(recommendation, 'sid', '')
    const url = get(recommendation, 'url', '')
    const note = get(recommendation, 'note', '')
    const createdBy = get(recommendation, 'createdBy', {})
    const createdAt = get(recommendation, 'createdAt', (new Date()))

    return (
      <tr key={`product-row-${sid}`}>
        <td className="table-centered">
          {new Timeago().format(createdAt)}
        </td>
        <td className="table-centered">
          <a
            rel="noopener noreferrer"
            href={`/${get(createdBy, 'detailUrl')}/`}
            style={{ display: 'block', marginBottom: 15 }}
            target="_blank"
          >
            {get(createdBy, 'name')}
          </a>
          <input
            value={get(createdBy, 'id')}
            onFocus={event => event.target.select()}
            readOnly
            className="textfield textfield--small"
          />
        </td>
        <td className="table-centered">
          <a rel="noopener noreferrer" href={url} target="_blank">
            {url}
          </a>
        </td>
        <td className="table-centered">
          {note}
        </td>
        <td className="table-actions table-actions--multiple">
          <button
            type="button"
            onClick={() => this.disapprove(recommendation)}
            disabled={this.state.isSaving}
            className="button button--small button--danger"
          >
            <span className="button-text">
              <MaterialDesignIcon name="disapprove" />
              Disapprove
            </span>
          </button>
          <button
            type="button"
            onClick={() => this.approve(recommendation)}
            disabled={this.state.isSaving}
            className="button button--small button--primary-alt"
          >
            <span className="button-text">
              <MaterialDesignIcon name="approve" />
              Approve
            </span>
          </button>
        </td>
      </tr>
    )
  }

  render() {
    return (
      <Layout>
        <div className="admin-recommended">
          <Table
            items={this.state.recommendations}
            count={size(this.state.recommendations)}
            headerTitle="Product Recommendations"
            tableHeaders={[{
              label: 'Date Recommended',
              property: 'createdAt'
            }, {
              label: 'Recommended By',
            }, {
              label: 'Url'
            }, {
              label: 'Note'
            }, {
              label: 'Actions'
            }]}
            searchPath="name"
            renderTableRow={this.renderRow}
            searchPlaceholder="Search products by name"
          />
        </div>
      </Layout>
    )
  }
}
