/* eslint-disable max-len */
import React, { Component } from 'react'

import cdnUrl from '../../utils/cdnUrl'

import Layout from '../common/Layout'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class About extends Component {
  renderButton(type) {
    switch (type) {
      case 'add': {
        return (
          <button
            type="button"
            className="card-action button button--icon"
            data-action="add"
          >
            <MaterialDesignIcon name="add" fill="#2ECC71" />
          </button>
        )
      }

      case 'redesign': {
        return (
          <button
            type="button"
            className="card-action button button--icon"
            data-action="redesign"
          >
            <MaterialDesignIcon name="redesign" fill="#2ECC71" />
          </button>
        )
      }

      default: {
        return null
      }
    }
  }

  render() {
    return (
      <Layout className="page-basic">
        <h1 style={{ display: 'none' }}>About Spaces</h1>
        <h2 style={{ textAlign: 'center' }}>Spaces is a shopping guide for your home where you can find the best products curated by people with a passion for design and home decor.</h2>
        <hr />
        <h3>Getting Started</h3>
        <p>Start by <a rel="noreferrer noopener" href="/join/" target="_blank">joining the community</a>. Once you join, you become designer.</p>
        <p>As a designer you can:</p>
        <ul>
          <li>Design spaces.</li>
          <li>Like spaces and products you love.</li>
          <li>Follow other designers, rooms and categories that interest you.</li>
          <li>Comment on spaces and products that you are passionate about.</li>
          <li>Redesign spaces you like to give them your personal touch.</li>
        </ul>
        <h3>What&apos;s a space?</h3>
        <p>A space is a collection of products. You can design different types of spaces, like a <a href="/rooms/kitchen/" target="_blank" rel="noreferrer noopener">kitchen</a>, a <a href="/rooms/office/" target="_blank" rel="noreferrer noopener">home office</a>, a <a href="/rooms/bedroom/" target="_blank" rel="noreferrer noopener">bedroom</a>, etc.</p>
        <p>To design a space, click on the {this.renderButton('add')} button on any product you like. Save that product on any of your existing spaces or design a new space with it.</p>
        <video
          src={cdnUrl('/static/videos/design_space.mp4')} autoPlay muted loop
          width="100%"
          height="auto"
        />
        <p>You can design spaces to:</p>
        <ul>
          <li>Create a wish list of products you want for your home.</li>
          <li>Create an idea board for your next home project.</li>
          <li>Share products you own to showcase your style and taste.</li>
          <li>Share design ideas with your friends to get their feedback.</li>
        </ul>
        <h3>Redesigning spaces</h3>
        <p>You can redesign any space you like by clicking on the {this.renderButton('redesign')} button.</p>
        <p>When you redesign a space you are designing a new space based on the original. You can add or remove products on your redesigned spaces any time you want to make them more personal.</p>
        <video
          src={cdnUrl('/static/videos/redesign_space.mp4')}
          autoPlay
          muted
          loop
          width="100%"
          height="auto"
        />
        <h3>How can I add products?</h3>
        <p>Products are added by curators. Curators are people with influence within the community.</p>
        <p>We hand pick curators to ensure the quality of the products in Spaces.</p>
        <p>We pick curators based on:</p>
        <ul>
          <li>The amount of spaces they have designed and how many likes, redesigns and comments they have.</li>
          <li>How active they are in the community. Activity is measured based on what they follow and the spaces and products they have liked, redesigned and commented on.</li>
          <li>How many followers they have.</li>
        </ul>
        <p>If you think you don&apos;t meet this criteria but still feel that you can be a curator and contribute good content for the community <a href="mailto:hello@joinspaces.co">let us know 🙂</a></p>
        <h3>Following and liking</h3>
        <p>You can follow designers, rooms and categories. Your personal feed will show you spaces and products based on who and what you follow.</p>
        <div className="images">
          <a
            rel="noreferrer noopener"
            href={cdnUrl('/static/images/following.png')}
            target="_blank"
          >
            <img
              src={cdnUrl('/static/images/following.png')}
              role="presentation"
            />
          </a>
          <a
            rel="noreferrer noopener"
            href={cdnUrl('/static/images/feed.png')}
            target="_blank"
          >
            <img
              src={cdnUrl('/static/images/feed.png')}
              role="presentation"
            />
          </a>
        </div>
        <p>Similarly, you can like spaces and products. When you like something, it will be saved to your profile.</p>
        <div className="images">
          <a
            rel="noreferrer noopener"
            href={cdnUrl('/static/images/liking.png')}
            target="_blank"
          >
            <img
              src={cdnUrl('/static/images/liking.png')}
              role="presentation"
            />
          </a>
          <a
            rel="noreferrer noopener"
            href={cdnUrl('/static/images/likes.png')}
            target="_blank"
          >
            <img
              src={cdnUrl('/static/images/likes.png')}
              role="presentation"
            />
          </a>
        </div>
        <h3>Commenting</h3>
        <p>You can leave comments on spaces and products. You can comment to ask a question about a product, give feedback on a space, or even review a product you own.</p>
        <p>When posting comments please be mindful of others in the community. We will not tolerate any:</p>
        <ul>
          <li>Violent or harmful comments.</li>
          <li>Harassment, threats or bullying.</li>
          <li>Hateful or inappropriate conduct.</li>
          <li>Sharing of private and personal information.</li>
          <li>Spam.</li>
        </ul>
        <p>While we don&apos;t have a flagging system to report any misconduct yet, we are committed to making Spaces a friendly, open and inviting community for everyone. If you see anyone that is violating the rules established above <a href="mailto:hello@joinspaces.co">please let us know</a>.</p>
      </Layout>
    )
  }
}
