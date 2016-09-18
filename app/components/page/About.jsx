/* eslint-disable max-len */
import React, { Component } from 'react'

import Layout from '../common/Layout'

export default class About extends Component {
  render() {
    return (
      <Layout className="page-basic">
        <h1>About</h1>
        <p>Spaces ("us", "we", or "our") operates the joinspaces.co website (the "Service").</p>
        <p>This page informs you of our policies regarding the collection, use and disclosure of Personal Information when you use our Service.</p>
        <p>We will not use or share your information with anyone except as described in this Privacy Policy.</p>
        <p>We use your Personal Information for providing and improving the Service. By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible at joinspaces.co</p>
        <h3>Information Collection And Use</h3>
        <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to, your email address, name, other information ("Personal Information").</p>
        <h3>Log Data</h3>
        <p>We may also collect information that your browser sends whenever you visit our Service ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages and other statistics.</p>
      </Layout>
    )
  }
}
