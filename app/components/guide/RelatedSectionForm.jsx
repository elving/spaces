import map from 'lodash/map'
import size from 'lodash/size'
import omit from 'lodash/omit'
import assign from 'lodash/assign'
import forEach from 'lodash/forEach'
import toArray from 'lodash/toArray'
import isEmpty from 'lodash/isEmpty'
import uniqueId from 'lodash/uniqueId'
import defaultTo from 'lodash/defaultTo'
import upperFirst from 'lodash/upperFirst'
import React, { Component, PropTypes } from 'react'

import getSid from '../../api/utils/getSid'

export default class RelatedSectionForm extends Component {
  static propTypes = {
    id: PropTypes.string,
    type: PropTypes.string,
    item: PropTypes.string,
    title: PropTypes.string,
    items: PropTypes.array,
    onRemove: PropTypes.func,
    modelName: PropTypes.string
  }

  static defaultProps = {
    type: 'related',
    item: '',
    title: '',
    items: [],
    onRemove: (() => {})
  }

  constructor(props) {
    super(props)

    let items = {}

    forEach(props.items, item => {
      items = assign({}, items, { [uniqueId(props.id)]: item })
    })

    this.state = {
      item: defaultTo(props.item, ''),
      title: defaultTo(props.title, ''),
      items: !isEmpty(items) ? items : {
        [uniqueId(`items-${props.id}`)]: ''
      }
    }
  }

  onItemChange = ({ currentTarget: input }) => {
    this.setState({
      item: input.value
    })
  }

  onTitleChange = ({ currentTarget: input }) => {
    this.setState({
      title: input.value
    })
  }

  getData = () => {
    const { props, state } = this

    return {
      type: props.type,
      title: state.title,
      item: getSid(state.item),
      items: map(toArray(state.items), getSid),
      modelName: upperFirst(props.modelName)
    }
  }

  addRelated = () => {
    const { props, state } = this

    this.setState({
      items: assign({}, state.items, {
        [uniqueId(`items-${props.id}`)]: ''
      })
    })
  }

  updateRelated = (cid, item) => {
    const { state } = this

    this.setState({
      items: assign({}, state.items, {
        [cid]: item
      })
    })
  }

  removeRelated = cid => {
    const { state } = this

    this.setState({
      items: omit(state.items, [cid])
    })
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
            Section: {upperFirst(props.modelName)} + Related
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
            placeholder={`Main ${upperFirst(props.modelName)} url or short id`}
            defaultValue={defaultTo(state.item, '')}
          />
        </div>
        {map(state.items, (related, cid) =>
          <div
            key={`${props.id}-${cid}`}
            className="form-group guide-form-section-row"
          >
            <input
              type="text"
              onChange={({ currentTarget: input }) => {
                this.updateRelated(cid, input.value)
              }}
              className="textfield"
              placeholder={`Related ${props.modelName} url or short id`}
              defaultValue={defaultTo(related, '')}
            />
            {size(state.items) > 1 ? (
              <button
                type="button"
                onClick={() => this.removeRelated(cid)}
                className="button button--danger"
              >
                Remove {upperFirst(props.modelName)}
              </button>
            ) : null}
          </div>
        )}
        {size(state.items) < 8 ? (
          <div className="form-group">
            <button
              type="button"
              onClick={this.addRelated}
              className="button button--primary"
            >
              <span className="button-text">
                Add Related {upperFirst(props.modelName)}
              </span>
            </button>
          </div>
        ) : null}
      </div>
    )
  }
}
