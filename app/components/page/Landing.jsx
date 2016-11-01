/* eslint-disable max-len */
import React, { Component } from 'react'

import cdnUrl from '../../utils/cdnUrl'

import Logo from '../common/Logo'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

export default class Landing extends Component {
  render() {
    return (
      <div className="landing-container">
        <a
          href="/login/"
          className="button button--primary-alt"
          data-action="betaLogin"
        >
          Beta Login
        </a>
        <div className="landing-content">
          <Logo width={80} height={80} />
          <h1>We are building a shopping guide for your home, curated by people like you.</h1>
          <a rel="noopener noreferrer" href="https://joinspaces.us13.list-manage.com/subscribe?u=4dca4b4a60cf2feda43c29b55&id=aecb35207a" target="_blank" className="button button--primary-alt">
            <span className="button-text">Get Early Access</span>
          </a>
          <a href="#about" className="button button--icon button--transparent landing-go-down">
            <MaterialDesignIcon name="arrow-down" fill="#ffffff" size={52} />
          </a>
        </div>
        <div id="about" className="landing-about">
          <div className="landing-about-text-columns">
            <div className="landing-about-text">
              <h3>Hand-picked products, curated for your home.</h3>
              <p>Discover products curated by people with a passion for design and home decor.</p>
            </div>
            <div className="landing-about-text">
              <h3>Become a designer</h3>
              <p>Design spaces with beautiful products to create a wish list for your home or an idea board for your next home project.</p>
            </div>
            <div className="landing-about-text">
              <h3>Follow interesting products and designers</h3>
              <p>Stay up to date with the products you&apos;re interested in and discover what other people are in to.</p>
            </div>
          </div>
          <div className="landing-about-cards">
            <img
              src={cdnUrl('/static/landing/product_card.png?v=1')}
              role="presentation"
              width="50%"
              height="auto"
              className="card"
            />
            <img
              src={cdnUrl('/static/landing/space_card.png?v=1')}
              role="presentation"
              width="50%"
              height="auto"
              className="card"
            />
            <img
              src={cdnUrl('/static/landing/product_normal.png?v=1')}
              role="presentation"
              width="50%"
              height="auto"
              className="card"
            />
          </div>
          <div className="landing-about-cta">
            <h2>Help curate the home shopping guide of the future.</h2>
            <a rel="noopener noreferrer" href="https://joinspaces.us13.list-manage.com/subscribe?u=4dca4b4a60cf2feda43c29b55&id=aecb35207a" target="_blank" className="button button--primary-alt">
              <span className="button-text">Get Early Access</span>
            </a>
          </div>
        </div>
      </div>
    )
  }
}
