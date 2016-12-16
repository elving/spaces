import defaultTo from 'lodash/defaultTo'
import upperFirst from 'lodash/upperFirst'
import React, { Component, PropTypes } from 'react'

import getSid from '../../api/utils/getSid'

export default class ItemTextSectionForm extends Component {
  static propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    item: PropTypes.string,
    text: PropTypes.string,
    title: PropTypes.string,
    onRemove: PropTypes.func,
    modelName: PropTypes.string
  }

  static defaultProps = {
    type: 'item-text',
    item: '',
    text: '',
    title: '',
    onRemove: (() => {})
  }

  constructor(props) {
    super(props)

    this.state = {
      item: defaultTo(props.item, ''),
      text: defaultTo(props.text, ''),
      title: defaultTo(props.title, '')
    }
  }

  onTitleChange = ({ currentTarget: input }) => {
    this.setState({
      title: input.value
    })
  }

  onItemChange = ({ currentTarget: input }) => {
    this.setState({
      item: input.value
    })
  }

  onTextChange = ({ currentTarget: input }) => {
    this.setState({
      text: input.value
    })
  }

  getData() {
    const { props, state } = this

    return {
      type: props.type,
      title: state.title,
      item: getSid(state.item),
      text: state.text,
      modelName: upperFirst(props.modelName)
    }
  }

  remove = () => {
    const { props } = this
    const message = 'Are you sure you want to remove this section?'

    if (window.confirm(message)) {
      props.onRemove(props.id)
    }
  }

  render() {
    const { props, state } = this

    return (
      <div className="guide-form-section form" data-type={props.type}>
        <div className="guide-form-section-header">
          <span className="guide-form-section-header-title">
            Section: {upperFirst(props.modelName)} + Text
          </span>
          <button
            type="button"
            onClick={this.remove}
            className="button button--danger"
          >
            Remove Section
          </button>
        </div>
        <div
          style={{
            borderBottom: '1px dashed #dadada',
            paddingBottom: 15
          }}
          className="form-group"
        >
          <input
            type="text"
            onChange={this.onTitleChange}
            className="textfield"
            placeholder="Section title"
            defaultValue={defaultTo(state.title, '')}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            onChange={this.onItemChange}
            className="textfield"
            placeholder={`${upperFirst(props.modelName)} url or short id`}
            defaultValue={defaultTo(state.item, '')}
          />
        </div>
        <div className="form-group">
          <textarea
            name="text"
            value={defaultTo(state.text, '')}
            onChange={this.onTextChange}
            className="textfield"
            placeholder={`This ${props.modelName} is perfect for...`}
          />
        </div>
      </div>
    )
  }
}
