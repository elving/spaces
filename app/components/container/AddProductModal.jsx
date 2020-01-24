import React, { Component } from 'react'

const addProductModalContainer = Composed => class extends Component {
  state = {
    addProductModalIsOpen: false,
    createAddProductModal: false,
    addProductModalCurrent: {}
  }

  openAddProductModal = (product) => {
    this.setState({
      addProductModalIsOpen: true,
      createAddProductModal: true,
      addProductModalCurrent: product
    })
  }

  closeAddProductModal = () => {
    this.setState({
      addProductModalIsOpen: false
    })
  }

  render() {
    return (
      <Composed
        {...this.props}
        {...this.state}
        openAddProductModal={this.openAddProductModal}
        closeAddProductModal={this.closeAddProductModal}
      />
    )
  }
}

export default addProductModalContainer
