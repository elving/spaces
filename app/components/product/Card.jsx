import get from 'lodash/get'
import classNames from 'classnames'
import React, { Component, PropTypes as Type } from 'react'

import Loader from '../common/Loader'
import Avatar from '../user/Avatar'
import CardTags from '../card/CardTags'
import CardTitle from '../card/CardTitle'
import MaterialIcon from '../common/MaterialIcon'

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
    brand: Type.object,
    image: Type.string,
    colors: Type.array,
    createdBy: Type.object,
    categories: Type.array,
    spaceTypes: Type.array
  };

  static defaultProps = {
    id: '',
    url: '',
    name: '',
    brand: {},
    image: '',
    colors: [],
    createdBy: {},
    categories: [],
    spaceTypes: []
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
        <div className="card-actions-overlay"/>
        {this.renderActions()}

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

  renderActions() {
    return (
      <div className="product-card-actions card-actions">
        <div className="card-actions-left">
          <button
            type="button"
            className="card-action button button--icon">
            <MaterialIcon name="add" color="#2ECC71"/>
          </button>
          <button
            type="button"
            className="card-action button button--icon">
            <MaterialIcon name="like" color="#E74C3C"/>
          </button>
        </div>
        <div className="card-actions-right">
          <button
            type="button"
            className="card-action button button--icon">
            <MaterialIcon name="send"/>
          </button>
        </div>
      </div>
    )
  }

  renderTitle() {
    const { url, name, brand } = this.props

    return (
      <CardTitle
        title={name}
        titleUrl={url}
        subTitle={get(brand, 'name')}
        className="product-title"/>
    )
  }

  renderTags() {
    const { colors, spaceTypes, categories } = this.props

    return (
      <CardTags
        tags={[spaceTypes, categories, colors]}
        className="product-tags"/>
    )
  }

  renderDesigner() {
    const { createdBy } = this.props

    return (
      <div className="product-card-designer">
        <Avatar
          width={30}
          height={30}
          imageUrl={get(createdBy, 'avatar', '')}
          initials={get(createdBy, 'initials', '')}
          className="product-card-designer-avatar"/>
        <span className="product-card-designer-name">
          Added by <a
            href={`/${get(createdBy, 'detailUrl', '#')}/`}
            className="product-card-designer-link">
            {get(createdBy, 'name')}
          </a>
        </span>
      </div>
    )
  }

  render() {
    return (
      <div className="product product-card">
        {this.renderImage()}
        {this.renderActions()}
        {this.renderTitle()}
        {this.renderTags()}
        {this.renderDesigner()}
      </div>
    )
  }
}
