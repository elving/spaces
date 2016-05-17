import get from 'lodash/get'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import Icon from '../common/Icon'
import Loader from '../common/Loader'

export default class ProductCard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      imageIsLoaded: false,
      imageIsLoading: false
    }
  }

  static contextTypes = {
    csrf: Type.string,
    userLoggedIn: Type.func
  };

  static propTypes = {
    id: Type.string,
    url: Type.string,
    name: Type.string,
    image: Type.string
  };

  componentDidMount() {
    const { image } = this.props
    const imagePreloader = new Image()

    const onImageLoad = () => {
      this.setState({
        imageIsLoaded: true,
        imageIsLoading: false
      })
    }

    this.setState({
      imageIsLoading: true
    }, () => {
      imagePreloader.onload = onImageLoad
      imagePreloader.src = image

      if (imagePreloader.complete) {
        onImageLoad()
      }
    })
  }

  renderImage() {
    const { name, image } = this.props
    const { imageIsLoaded, imageIsLoading } = this.state

    return (
      <div
        className={classNames({
          'product-card-image-container': true,
          'product-card-image-container--loading': imageIsLoading
        })}>
        {imageIsLoading ? (
          <Loader size={50}/>
        ) : null}

        {imageIsLoaded ? (
          <div
            title={name}
            style={{ backgroundImage: `url(${image})` }}
            className="product-card-image"/>
        ) : null}
      </div>
    )
  }

  renderInfo() {
    const { url, name, brand, price } = this.props

    return (
      <div className="product-card-info">
        <div className="product-card-info-left">
          <span className="product-card-info-brand">
            {get(brand, 'name', '')}
          </span>
          <span className="product-card-info-name">
            {name}
          </span>
        </div>
        <div className="product-card-info-right">
          <a
            href={url}
            className={classNames({
              'button': true,
              'button--icon-right': true,
              'button--primary-outline': true,
              'product-card-info-price': true
            })}>
            {`$${price}`} <Icon name="next" width={18} height={18}/>
          </a>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="product product-card">
        {this.renderImage()}
        {this.renderInfo()}
      </div>
    )
  }
}
