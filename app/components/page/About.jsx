/* eslint-disable max-len */
import React, { PureComponent } from 'react'

import cdnUrl from '../../utils/cdnUrl'

import Layout from '../common/Layout'
import Users from '../user/Users'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

const renderSectionTitle = (id, title) => (
  <h3 className="about-section-title">
    <div className="about-section">
      <a href={`#${id}`} className="button button--icon button--transparent">
        <MaterialDesignIcon name="link" />
      </a>
      {title}
    </div>
  </h3>
)

const renderButton = type => {
  switch (type) {
    case 'add': {
      return (
        <a
          href="/products/recommend/"
          className="button button--icon button--primary button--small"
          data-action="add"
        >
          <MaterialDesignIcon name="add-alt" fill="#2ECC71" />
        </a>
      )
    }

    case 'design': {
      return (
        <button
          type="button"
          className="card-action button button--icon button--small"
          data-action="add"
        >
          <MaterialDesignIcon name="check-simple" fill="#2ECC71" />
        </button>
      )
    }

    case 'create': {
      return (
        <button
          type="button"
          className="button button--primary button--small"
        >
          Create a space
        </button>
      )
    }

    case 'check': {
      return (
        <button
          type="button"
          style={{
            paddingLeft: 2,
            paddingRight: 2
          }}
          className="button button--icon button--transparent button--small"
        >
          <MaterialDesignIcon name="check-empty" />
        </button>
      )
    }

    case 'redesign': {
      return (
        <button
          type="button"
          className="card-action button button--icon button--small"
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

export default class About extends PureComponent {
  render() {
    return (
      <Layout className="about">
        <div className="about-header">
          <h1 className="about-header-text">
            Find curated products for your home
          </h1>
        </div>

        <div className="about-section-container">
          <div className="about-section about-section-content">
            <h2 className="about-title">
              Spaces features the best products for your home from all over
              the web, curated and maintained by our community.
            </h2>
          </div>

          <h3 className="about-section-title">
            <div className="about-section">
              <span
                style={{ cursor: 'default' }}
                className="button button--icon button--transparent"
              >
                <MaterialDesignIcon name="star" />
              </span>
              Meet the team
            </div>
          </h3>

          <div className="about-section about-section-content">
            <Users params={{ usernames: ['elving', 'karla'] }} />
          </div>
        </div>

        <div className="about-index-container">
          <div className="about-index">
            <ol className="about-index-list">
              <li className="about-index-item">
                <a href="#getting-started" className="about-index-link">
                  Getting started
                </a>
              </li>
              <li className="about-index-item">
                <a href="#designing-spaces" className="about-index-link">
                  Designing spaces
                </a>
              </li>
              <li className="about-index-item">
                <a href="#redesigning-spaces" className="about-index-link">
                  Redesigning spaces
                </a>
              </li>
              <li className="about-index-item">
                <a href="#curating-products" className="about-index-link">
                  Curating products
                </a>
              </li>
            </ol>

            <ol className="about-index-list">
              <li className="about-index-item">
                <a href="#becoming-a-curator" className="about-index-link">
                  Becoming a curator
                </a>
              </li>
              <li className="about-index-item">
                <a href="#following-and-liking" className="about-index-link">
                  Following and liking
                </a>
              </li>
              <li className="about-index-item">
                <a href="#commenting" className="about-index-link">
                  Commenting
                </a>
              </li>
            </ol>
          </div>
        </div>

        <div id="getting-started" className="about-section-container">
          {renderSectionTitle('getting-started', 'Getting Started')}
          <div className="about-section about-section-content">
            <p>Start by <a rel="noreferrer noopener" href="/join/" target="_blank">joining the community</a>. Once you join, you&apos;ll be able to:</p>
            <ul>
              <li>Curate products.</li>
              <li>Design spaces.</li>
              <li>Like products and spaces you love.</li>
              <li>Follow other people, rooms and categories that interest you.</li>
              <li>Comment on spaces and products that you are passionate about.</li>
              <li>Redesign spaces you like to give them your personal touch.</li>
            </ul>
          </div>
        </div>

        <div id="designing-spaces" className="about-section-container">
          {renderSectionTitle('designing-spaces', 'Designing spaces')}
          <div className="about-section about-section-content">
            <p>A space is a collection of products. It’s where you experiment and generate ideas for your next project. Design spaces to showcase your taste and help others make informed decisions when shopping for their homes.</p>
            <p>You can design different types of spaces, like a <a href="/rooms/kitchen/" target="_blank" rel="noreferrer noopener">kitchen</a>, a <a href="/rooms/office/" target="_blank" rel="noreferrer noopener">home office</a>, a <a href="/rooms/bedroom/" target="_blank" rel="noreferrer noopener">bedroom</a>, etc. To design a space, click on the {renderButton('design')} button on any product you like. A popup will appear with one of two things:</p>
            <div className="about-section-media-container">
              <a
                rel="noreferrer noopener"
                href={cdnUrl('/static/images/how_to_design_a_space_1.png')}
                target="_blank"
                className="about-section-media"
              >
                <img
                  alt="How to design a space"
                  src={cdnUrl('/static/images/how_to_design_a_space_1.png')}
                  role="presentation"
                />
              </a>
              <a
                rel="noreferrer noopener"
                href={cdnUrl('/static/images/how_to_design_a_space.png')}
                target="_blank"
                className="about-section-media"
              >
                <img
                  alt="How to design a space"
                  src={cdnUrl('/static/images/how_to_design_a_space.png')}
                  role="presentation"
                />
              </a>
            </div>
            <p>You can design a new space with the selected product by clicking the {renderButton('create')} button and filling the form. You can also add that product to any of your existing spaces by clicking on the {renderButton('check')} icon.</p>
            <a
              rel="noreferrer noopener"
              href={cdnUrl('/static/videos/design_space.mp4?v=2')}
              target="_blank"
              className="about-section-media"
            >
              <video
                src={cdnUrl('/static/videos/design_space.mp4?v=2')} autoPlay muted loop
                width="100%"
                height="auto"
              />
            </a>
            <p>You can design spaces to:</p>
            <ul>
              <li>Create a wish list of products you want for your home.</li>
              <li>Create an idea board for your next home project.</li>
              <li>Share products you own to showcase your style and taste.</li>
              <li>Share design ideas with your friends to get their feedback.</li>
            </ul>
          </div>
        </div>

        <div id="redesigning-spaces" className="about-section-container">
          {renderSectionTitle('redesigning-spaces', 'Redesigning spaces')}
          <div className="about-section about-section-content">
            <p>You can redesign any space you like by clicking on the {renderButton('redesign')} button.</p>
            <a
              rel="noreferrer noopener"
              href={cdnUrl('/static/videos/redesign_space.mp4?v=2')}
              target="_blank"
              className="about-section-media"
            >
              <video
                src={cdnUrl('/static/videos/redesign_space.mp4?v=2')}
                autoPlay
                muted
                loop
                width="100%"
                height="auto"
              />
            </a>
            <p>When you redesign a space you are designing a new space based on the original. You can add or remove products on your redesigned spaces any time you want to make them more personal.</p>
          </div>
        </div>

        <div id="curating-products" className="about-section-container">
          {renderSectionTitle('curating-products', 'Curating products')}
          <div className="about-section about-section-content">
            <p>The products featured on Spaces are hand-picked to ensure the quality of our guides and recommendations for the community.</p>
            <p>Only curators can add products directly to Spaces, but anyone can recommend products by clicking the {renderButton('add')} button found on the top right corner of any page.</p>
            <a
              rel="noreferrer noopener"
              href={cdnUrl('/static/videos/recommend_product.mp4')}
              target="_blank"
              className="about-section-media"
            >
              <video
                src={cdnUrl('/static/videos/recommend_product.mp4')} autoPlay muted loop
                width="100%"
                height="auto"
              />
            </a>
            <p>We review every recommendation and approve products based on what’s currently trending on Spaces. As the community grows, this process will be more organic and community-driven.</p>
          </div>
        </div>

        <div id="becoming-a-curator" className="about-section-container">
          {renderSectionTitle('becoming-a-curator', 'Becoming a curator')}
          <div className="about-section about-section-content">
            <p>Curators are people with influence within the community so they can add products directly to Spaces.</p>
            <p>We pick curators based on:</p>
            <ul>
              <li>The amount of spaces they have designed and how many likes, redesigns and comments they have.</li>
              <li>How active they are in the community. Activity is measured based on what they follow and the spaces and products they have liked, redesigned and commented on.</li>
              <li>How many followers they have.</li>
            </ul>
            <p>If you think you don&apos;t meet this criteria but still feel that you can be a curator and contribute good content for the community <a href="mailto:hello@joinspaces.co">let us know 🙂</a></p>
          </div>
        </div>

        <div id="following-and-liking" className="about-section-container">
          {renderSectionTitle('following-and-liking', 'Following and liking')}
          <div className="about-section about-section-content">
            <p>You can follow people, rooms and categories. Your <a href="/feed/" target="_blank" rel="noreferrer noopener">personal feed</a> will show you spaces and products based on who and what you follow.</p>
            <div className="about-section-media-container">
              <a
                rel="noreferrer noopener"
                href={cdnUrl('/static/videos/following.mp4')}
                target="_blank"
                className="about-section-media"
              >
                <video
                  src={cdnUrl('/static/videos/following.mp4')}
                  autoPlay
                  muted
                  loop
                  width="100%"
                  height="auto"
                />
              </a>
              <a
                rel="noreferrer noopener"
                href={cdnUrl('/static/videos/following_2.mp4?v=2')}
                target="_blank"
                className="about-section-media"
              >
                <video
                  src={cdnUrl('/static/videos/following_2.mp4?v=2')}
                  autoPlay
                  muted
                  loop
                  width="100%"
                  height="auto"
                />
              </a>
            </div>
            <p>
              Similarly, you can like spaces and products. When you like
              something, it will be saved to your profile. We use likes to
              measure what spaces and products are trending so that we can surface
              them for others to discover.
            </p>
            <div className="about-section-media-container">
              <a
                rel="noreferrer noopener"
                href={cdnUrl('/static/videos/like_product.mp4?v=2')}
                style={{
                  border: '1px solid #e5e5e5',
                  maxHeight: 400,
                  overflowY: 'hidden'
                }}
                target="_blank"
                className="about-section-media"
              >
                <video
                  src={cdnUrl('/static/videos/like_product.mp4?v=2')}
                  autoPlay
                  muted
                  loop
                  style={{
                    border: '0 none',
                    maxHeight: 400
                  }}
                  width="100%"
                  height="auto"
                />
              </a>
              <a
                rel="noreferrer noopener"
                href={cdnUrl('/static/videos/like_space.mp4?v=2')}
                style={{
                  border: '1px solid #e5e5e5',
                  maxHeight: 400,
                  overflowY: 'hidden'
                }}
                target="_blank"
                className="about-section-media"
              >
                <video
                  src={cdnUrl('/static/videos/like_space.mp4?v=2')}
                  autoPlay
                  muted
                  loop
                  style={{
                    border: '0 none',
                    maxHeight: 400
                  }}
                  width="100%"
                  height="auto"
                />
              </a>
            </div>
          </div>
        </div>

        <div id="commenting" className="about-section-container">
          {renderSectionTitle('commenting', 'Commenting')}
          <div className="about-section about-section-content">
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
          </div>
        </div>
      </Layout>
    )
  }
}
