import get from 'lodash/get'
import head from 'lodash/head'
import axios from 'axios'
import isEmpty from 'lodash/isEmpty'
import React, { Component } from 'react'

export default class LatestGuideBanner extends Component {
  state = {
    guide: {},
    isFetching: false
  }

  componentDidMount() {
    if (!(/guide/gim).test(window.location.href)) {
      this.fetch()
    }
  }

  fetch = () => {
    this.setState({
      isFetching: true
    }, () => {
      axios
        .get('/ajax/guides/search/?limit=1')
        .then(({ data }) => {
          this.setState({
            guide: head(get(data, 'results', [])),
            isFetching: false
          })
        })
        .catch(() => {
          this.setState({
            isFetching: false
          })
        })
    })
  }

  render() {
    const { state } = this

    return !state.isFetching && !isEmpty(state.guide) ? (
      <a
        href={`/${get(state.guide, 'detailUrl', 'guides')}/`}
        style={{ backgroundImage: `url(${get(state.guide, 'coverImage')})` }}
        className="guide-banner"
      >
        <span className="guide-banner-text">
          Check out our latest guide: {get(state.guide, 'name', 'now')}
        </span>
      </a>
    ) : null
  }
}
