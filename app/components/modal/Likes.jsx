import ga from 'react-ga'
import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import axios from 'axios'
import Modal from 'react-modal'
import isEmpty from 'lodash/isEmpty'
import React, { Component, PropTypes as Type } from 'react'

import Loader from '../common/Loader'
import MiniProfile from '../user/MiniProfile'
import MaterialDesignIcon from '../common/MaterialDesignIcon'

const overrideDefaultStyles = {
 overlay: { backgroundColor: null },
 content: {
   top: 'initial',
   left: 'initial',
   right: 'initial',
   bottom: 'initial',
   border: null,
   padding: null,
   position: null,
   background: null,
   borderRadius: null
 }
}

export default class LikesModal extends Component {
 constructor(props, context) {
   super(props, context)

   this.state = {
     likes: [],
     isLoadingLikes: true
   }
 }

 static propTypes = {
   parent: Type.string.isRequired,
   onClose: Type.func.isRequired,
   isVisible: Type.bool.isRequired,
   parentType: Type.string.isRequired
 };

 static defaultProps = {
   onClose: (() => {}),
   isVisible: false
 };

 componentDidMount() {
   this.fetch()
   ga.modalview(`${this.props.parentType}-likes-modal`)
 }

 componentWillReceiveProps(nextProps) {
   const { isVisible } = nextProps
   const { isLoadingLikes } = this.state

   if (isVisible && !isLoadingLikes) {
     this.fetch()
   }
 }

 fetch() {
   const { parent, parentType } = this.props

   axios({
     url: `/ajax/likes/${parentType}/${parent}/`,
     method: 'GET'
   }).then((res) => {
     this.setState({
       likes: get(res, 'data.likes', []),
       isLoadingLikes: false
     })
   }).catch(() => {
     this.setState({
       likes: [],
       isLoadingLikes: false
     })
   })
 }

 renderContent() {
   const { likes, isLoadingLikes } = this.state

   if (isLoadingLikes) {
     return this.renderLoadingState()
   } else if (isEmpty(likes)) {
     return this.renderEmptyState()
   } else {
     return this.renderLikes()
   }
 }

 renderLoadingState() {
   return (
     <section className="likes-modal-inner">
       {this.renderCloseButton()}
       <Loader size={55}/>
     </section>
   )
 }

 renderEmptyState() {
   return (
     <section className="likes-modal-inner">
       {this.renderCloseButton()}
       <h1 className="likes-modal-title">
         {`This ${this.props.parentType} hasn't been liked yet.`}
       </h1>
     </section>
   )
 }

 renderLikes() {
   const { likes } = this.state
   const { parentType } = this.props

   const count = size(likes)
   const countTerm = size(likes) === 1 ? 'person' : 'people'

   return (
     <section
       className="likes-modal-inner likes-modal-inner--has-likes"
       data-type={parentType}>
       {this.renderCloseButton()}
       <h1 className="likes-modal-title">
         {`Liked by ${count} ${countTerm}`}
       </h1>
       <ul className="likes-modal-list">
         {map(likes, ::this.renderLike)}
       </ul>
     </section>
   )
 }

 renderLike(like) {
   const createdBy = get(like, 'createdBy')

   return (
     <li
       key={`likes-user-${get(createdBy, 'id')}`}
       className="likes-modal-user">
       <MiniProfile user={createdBy}/>
     </li>
   )
 }

 renderCloseButton() {
   return (
     <button
       type="button"
       onClick={() => this.props.onClose()}
       className="likes-modal-close button button--icon button--transparent">
       <MaterialDesignIcon name="close"/>
     </button>
   )
 }

 render() {
   const { onClose, isVisible } = this.props

   return (
     <Modal
       style={overrideDefaultStyles}
       isOpen={isVisible}
       className="ui-modal likes-modal"
       onRequestClose={onClose}>
       {this.renderContent()}
     </Modal>
   )
 }
}
