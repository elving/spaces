import React, { Component } from 'react'

const addProductModalContainer = Composed => class extends Component {
  constructor(props) {
    super(props)

    this.state = {
      addProductModalIsOpen: false,
      createaddProductModal: false,
      addProductModalCurrent: {}
    }
  }

  openAddProductModal(product) {
    this.setState({
      addProductModalIsOpen: true,
      createaddProductModal: true,
      addProductModalCurrent: product
    })
  }

  closeAddProductModal() {
    this.setState({
      addProductModalIsOpen: false
    })
  }

  render() {
    return (
      <Composed
        {...this.props}
        {...this.state}
        openAddProductModal={::this.openAddProductModal}
        closeAddProductModal={::this.closeAddProductModal}
      />
    )
  }
}

export default addProductModalContainer
