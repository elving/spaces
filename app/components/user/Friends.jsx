/* eslint-disable max-len */
import React, { Component } from 'react'

import Users from './Users'
import Layout from '../common/Layout'
import SocialIcon from '../common/SocialIcon'

import { getTwitterUrl } from '../../utils/getShareUrl'

export default class Friends extends Component {
  render() {
    return (
      <Layout>
        <h1 className="page-title">
          Everything&apos;s better with friends
        </h1>
        <div className="finder-actions-container">
          <div className="friends-actions">
            <a
              href="mailto:?subject=Join%20me%20on%20Spaces%20%E2%9C%8C%EF%B8%8F%EF%B8%8F&body=Hello!%0A%0AI%20would%20love%20to%20see%20you%20on%20Spaces!%20Come%20join%20me%20at%20https%3A%2F%2Fjoinspaces.co%2F"
              target="_blank"
              className="friends-action button"
            >
              <SocialIcon name="email" />
              Invite via email
            </a>
            <a
              href={getTwitterUrl('https:/joinspaces.co/join/', 'Come join me on Spaces!')}
              target="_blank"
              className="friends-action button"
            >
              <SocialIcon name="twitter" />
              Invite via Twitter
            </a>
            <a
              href="https://www.facebook.com/sharer/sharer.php?u=http%3A//joinspaces.co/join"
              target="_blank"
              className="friends-action button"
            >
              <SocialIcon name="facebook" />
              Invite via Facebook
            </a>
          </div>
        </div>
        <h2 className="page-title">
          Here&apos;s some people we think you should follow
        </h2>
        <Users
          params={{ skip: 9, limit: 9 }}
          disableSorting
          disablePagination
        />
      </Layout>
    )
  }
}
