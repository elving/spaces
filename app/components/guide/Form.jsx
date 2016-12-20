import get from 'lodash/get'
import map from 'lodash/map'
import size from 'lodash/size'
import omit from 'lodash/omit'
import axios from 'axios'
import Select from 'react-select'
import assign from 'lodash/assign'
import concat from 'lodash/concat'
import result from 'lodash/result'
import filter from 'lodash/filter'
import compact from 'lodash/compact'
import isEmpty from 'lodash/isEmpty'
import uniqueId from 'lodash/uniqueId'
import serialize from 'form-serialize'
import classNames from 'classnames'
import React, { Component, PropTypes } from 'react'

import Sticky from '../common/Sticky'
import Notification from '../common/Notification'
import TextSectionForm from './TextSectionForm'
import GridSectionForm from './GridSectionForm'
import RelatedSectionForm from './RelatedSectionForm'
import MaterialDesignIcon from '../common/MaterialDesignIcon'
import ItemTextSectionForm from './ItemTextSectionForm'

import toStringId from '../../api/utils/toStringId'

export default class GuideForm extends Component {
  static contextTypes = {
    csrf: PropTypes.string
  }

  static propTypes = {
    guide: PropTypes.object,
    formMethod: PropTypes.string.isRequired
  }

  static defaultProps = {
    guide: {},
    formMethod: 'POST'
  }

  constructor(props) {
    super(props)

    const description = get(props.guide, 'description', '')
    const descriptionLength = size(description)

    const sections = map(get(props.guide, 'sections', []), section => ({
      id: uniqueId('section'),
      ...section
    }))

    this.state = {
      name: get(props.guide, 'name', ''),
      sections,
      coverImage: get(props.guide, 'coverImage', ''),
      isPublished: get(props.guide, 'isPublished', false),
      coverSource: get(props.guide, 'coverSource', ''),
      description,
      introduction: get(props.guide, 'introduction', ''),
      guide: {},
      errors: {},
      isSaving: false,
      hasSaved: false,
      isDeleting: false,
      isPublishing: false,
      savingSuccessful: false,
      deletingSuccessful: false,
      descriptionCharsLeft: (140 - descriptionLength),
      hasDescriptionCharsError: (descriptionLength > 140)
    }
  }

  componentDidMount() {
    const { props, state } = this.state

    window.onbeforeunload = () => {
      let action

      if (state.isDeleting) {
        action = 'deleting'
      } else if (state.isSaving && props.formMethod === 'POST') {
        action = 'creating'
      } else if (state.isSaving && props.formMethod === 'PUT') {
        action = 'updating'
      }

      if (state.isSaving || state.isDeleting) {
        return (
          `You are in the process of ${action} this guide. ` +
          'Are you sure you want to navigate away from this page and ' +
          'loose your progress?'
        )
      }
    }
  }

  onSubmit = (event) => {
    const { props } = this

    const form = this.form
    const isPOST = props.formMethod === 'POST'
    const formData = assign({}, serialize(form, { hash: true }), {
      sections: map(this.sectionRefs, ref => result(ref, 'getData'))
    })
    const endpoint = isPOST
      ? '/ajax/guides/'
      : `/ajax/guides/${toStringId(props.guide)}/`

    event.preventDefault()

    this.setState({
      errors: {},
      isSaving: true
    }, () => {
      axios({
        url: endpoint,
        data: formData,
        method: props.formMethod
      })
      .then(({ data: guide }) => {
        const resetData = isPOST ? {
          name: '',
          coverImage: '',
          sections: [],
          isPublished: false,
          coverSource: '',
          description: '',
          introduction: '',
          descriptionCharsLeft: 140,
          hasDescriptionCharsError: false
        } : {}

        if (isPOST) {
          this.sectionRefs = []
        }

        this.setState({
          guide,
          errors: {},
          isSaving: false,
          hasSaved: true,
          savingSuccessful: true,
          ...resetData
        })
      })
      .catch(({ response }) => {
        this.setState({
          guide: {},
          errors: get(response, 'data.err', {}),
          isSaving: false,
          hasSaved: false,
          savingSuccessful: false
        })
      })
    })
  }

  onClickPublishToggle = () => {
    const { props, state, context } = this
    const verb = state.isPublished ? 'private' : 'public'
    const message = `Are you sure you want to make this guide ${verb}?`

    if (window.confirm(message)) {
      this.setState({
        isPublishing: true
      }, () => {
        axios
          .put(`/ajax/guides/${toStringId(props.guide)}/`, {
            _csrf: context.csrf,
            isPublished: !state.isPublished
          })
          .then(() => {
            this.setState({
              isPublished: !state.isPublished,
              isPublishing: false,
              savingSuccessful: true
            })
          })
          .catch(() => {
            this.setState({
              isPublishing: false
            })
          })
      })
    }
  }

  onClickDelete = () => {
    const { props, context } = this

    const deleteMessage = (
      'Are you sure you want to delete this guide? \n' +
      'This action cannot be undone. ' +
      'Type the word "DELETE" to confirm.'
    )

    if (window.prompt(deleteMessage) === 'DELETE') {
      this.setState({
        errors: {},
        isDeleting: true
      }, () => {
        axios
          .post(`/ajax/guides/${toStringId(props.guide)}/`, {
            _csrf: context.csrf,
            _method: 'delete'
          })
          .then(() => {
            this.setState({
              guide: {},
              isDeleting: false,
              deletingSuccessful: true
            })
          })
          .catch((res) => {
            this.setState({
              guide: {},
              errors: get(res, 'data.err', {}),
              isDeleting: false,
              deletingSuccessful: false
            })
          })
      })
    }
  }

  onNameChange = ({ currentTarget: input }) => {
    this.setState({
      name: input.value
    })
  }

  onDescriptionChange = ({ currentTarget: input }) => {
    const descriptionCharsLeft = 140 - size(input.value)

    this.setState({
      description: input.value,
      descriptionCharsLeft,
      hasDescriptionCharsError: descriptionCharsLeft < 0
    })
  }

  onCoverChange = ({ currentTarget: input }) => {
    this.setState({
      coverImage: input.value
    })
  }

  onCoverSourceChange = ({ currentTarget: input }) => {
    this.setState({
      coverSource: input.value
    })
  }

  onIntroductionChange = ({ currentTarget: input }) => {
    this.setState({
      introduction: input.value
    })
  }

  onChangeCurrentSectionType = currentSectionType => {
    this.setState({
      currentSectionType
    })
  }

  registerSection = section => {
    this.sectionRefs = compact(concat(this.sectionRefs, section))
  }

  addSection = () => {
    const { state } = this

    if (!isEmpty(state.currentSectionType)) {
      this.setState({
        sections: concat([], state.sections, {
          id: uniqueId('section'),
          type: state.currentSectionType
        }),
        currentSectionType: null
      })
    }
  }

  removeSection = (id) => {
    const { state } = this

    this.setState({
      sections: filter(state.sections, section => section.id !== id)
    }, () => {
      this.sectionRefs = filter(this.sectionRefs, ref =>
        !get(ref, '_calledComponentWillUnmount', false)
      )
    })
  }

  form = null
  sectionRefs = []

  renderForm() {
    const { props, state, context } = this

    const isPOST = props.formMethod === 'POST'
    const shouldDisable = (
      state.isSaving ||
      state.isDeleting ||
      state.isPublishing ||
      state.deletingSuccessful
    )

    const nameError = get(state.errors, 'name')
    const hasNameError = !isEmpty(nameError)

    const descriptionError = get(state.errors, 'description')
    const hasDescriptionError = !isEmpty(descriptionError)

    const coverError = get(state.errors, 'coverImage')
    const hasCoverError = !isEmpty(coverError)

    const coverSourceError = get(state.errors, 'coverSource')
    const hasCoverSourceError = !isEmpty(coverSourceError)

    const introductionError = get(state.errors, 'introduction')
    const hasIntroductionError = !isEmpty(introductionError)

    let btnText = ''

    if (isPOST) {
      btnText = state.isSaving ? 'Creating Guide...' : 'Create Guide'
    } else {
      btnText = state.isSaving ? 'Updating Guide...' : 'Update Guide'
    }

    let publishToggleBtnText = ''

    if (state.isPublished) {
      publishToggleBtnText = state.isPublishing
        ? 'Unpublishing Guide...'
        : 'Unpublish Guide'
    } else {
      publishToggleBtnText = state.isPublishing
        ? 'Publishing Guide...'
        : 'Publish Guide'
    }

    return (
      <form
        ref={form => { this.form = form }}
        method="POST"
        onSubmit={this.onSubmit}
        className="form guide-form"
      >
        <input type="hidden" name="_csrf" value={context.csrf} />
        <input type="hidden" name="_method" value={props.formMethod} />

        <h1 className="form-title">
          {isPOST ? 'Create Guide' : 'Update Guide'}
          <a href="/admin/guides/" className="form-title-link">
            <MaterialDesignIcon name="list" size={18} />
            All Guides
          </a>
        </h1>

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name <small>required</small>
          </label>

          <input
            id="name"
            type="text"
            name="name"
            required
            value={state.name}
            disabled={shouldDisable}
            onChange={this.onNameChange}
            autoFocus
            className={classNames({
              textfield: true,
              'textfield--error': hasNameError
            })}
            placeholder="E.g. Chair Guide 2017"
          />

          {hasNameError ? (
            <small className="form-error">{nameError}</small>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
            <small
              style={{
                color: state.hasDescriptionCharsError ? '#ED4542' : '#999999'
              }}
            >
              required &middot; {state.descriptionCharsLeft} chars left
            </small>
          </label>

          <textarea
            id="description"
            name="description"
            value={state.description}
            required
            disabled={shouldDisable}
            onChange={this.onDescriptionChange}
            className={classNames({
              textfield: true,
              'textfield--error': (
                hasDescriptionError ||
                state.hasDescriptionCharsError
              )
            })}
            placeholder="E.g. The definite guide for chairs in 2017"
          />

          {hasDescriptionError ? (
            <small className="form-error">{descriptionError}</small>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="url" className="form-label">
            Cover Image Url <small>required</small>
          </label>

          <input
            id="coverImage"
            type="url"
            name="coverImage"
            value={state.coverImage}
            required
            disabled={shouldDisable}
            onChange={this.onCoverChange}
            className={classNames({
              textfield: true,
              'textfield--error': hasCoverError
            })}
            placeholder="E.g. https://images.unsplash.com/photo-1467987506553-8f3916508521/"
          />

          {hasCoverError ? (
            <small className="form-error">{coverError}</small>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="url" className="form-label">
            Cover Image Source Url <small>required</small>
          </label>

          <input
            id="coverSource"
            type="url"
            name="coverSource"
            value={state.coverSource}
            required
            disabled={shouldDisable}
            onChange={this.onCoverSourceChange}
            className={classNames({
              textfield: true,
              'textfield--error': hasCoverSourceError
            })}
            placeholder="E.g. https://unsplash.com/collections/245338/habitat-deco-home/"
          />

          {hasCoverSourceError ? (
            <small className="form-error">{coverSourceError}</small>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="introduction" className="form-label">
            Introduction <small>optional</small>
          </label>

          <textarea
            id="introduction"
            name="introduction"
            value={state.introduction}
            disabled={shouldDisable}
            onChange={this.onIntroductionChange}
            className={classNames({
              textfield: true,
              'textfield--error': hasIntroductionError
            })}
            placeholder={
              'E.g. Decorating a home or apartment is a ' +
              'fun project, but it\'s also daunting...'
            }
          />

          {hasIntroductionError ? (
            <small className="form-error">{introductionError}</small>
          ) : null}
        </div>

        <div className="form-group">
          <label htmlFor="sections" className="form-label">
            Sections <small>required</small>
          </label>
          <div
            className={classNames({
              'guide-form-sections': true,
              'guide-form-sections--has-sections': !isEmpty(state.sections)
            })}
          >
            <Sticky>
              <div className="guide-form-sections-header">
                <Select
                  id="currentSectionType"
                  name="currentSectionType"
                  value={state.currentSectionType}
                  options={[{
                    value: 'text',
                    label: 'Text'
                  }, {
                    value: 'product-grid',
                    label: 'Product Grid'
                  }, {
                    value: 'product-text',
                    label: 'Product + Text'
                  }, {
                    value: 'product-related',
                    label: 'Product + Related'
                  }, {
                    value: 'space-grid',
                    label: 'Space Grid'
                  }, {
                    value: 'space-text',
                    label: 'Space + Text'
                  }]}
                  onChange={this.onChangeCurrentSectionType}
                  disabled={state.isSaving}
                  className="select"
                  placeholder="Select a section type"
                />
                <button
                  type="button"
                  onClick={this.addSection}
                  className="button button--primary-alt"
                >
                  <span className="button-text">Add Section</span>
                </button>
              </div>
            </Sticky>
            {map(state.sections, section => {
              const id = get(section, 'id')
              const type = get(section, 'type')
              const modelName = get(section, 'modelName')

              if (type === 'text') {
                return (
                  <TextSectionForm
                    id={id}
                    ref={this.registerSection}
                    key={`section-${type}-${id}`}
                    onRemove={this.removeSection}
                    {...omit(section, ['type'])}
                  />
                )
              } else if (
                type === 'product-grid' ||
                (type === 'grid' && modelName === 'Product')
              ) {
                return (
                  <GridSectionForm
                    id={id}
                    ref={this.registerSection}
                    key={`section-${type}-${id}`}
                    onRemove={this.removeSection}
                    modelName="product"
                    {...omit(section, ['type'])}
                  />
                )
              } else if (
                type === 'product-text' ||
                (type === 'item-text' && modelName === 'Product')
              ) {
                return (
                  <ItemTextSectionForm
                    id={id}
                    ref={this.registerSection}
                    key={`section-${type}-${id}`}
                    onRemove={this.removeSection}
                    modelName="product"
                    {...omit(section, ['type'])}
                  />
                )
              } else if (
                type === 'product-related' ||
                (type === 'related' && modelName === 'Product')
              ) {
                return (
                  <RelatedSectionForm
                    id={id}
                    ref={this.registerSection}
                    key={`section-${type}-${id}`}
                    onRemove={this.removeSection}
                    modelName="product"
                    {...omit(section, ['type'])}
                  />
                )
              } else if (
                type === 'space-grid' ||
                (type === 'grid' && modelName === 'Space')
              ) {
                return (
                  <GridSectionForm
                    id={id}
                    ref={this.registerSection}
                    key={`section-${type}-${id}`}
                    onRemove={this.removeSection}
                    modelName="space"
                    {...omit(section, ['type'])}
                  />
                )
              } else if (
                type === 'space-text' ||
                (type === 'item-text' && modelName === 'Space')
              ) {
                return (
                  <ItemTextSectionForm
                    id={id}
                    ref={this.registerSection}
                    key={`section-${type}-${id}`}
                    onRemove={this.removeSection}
                    modelName="space"
                    {...omit(section, ['type'])}
                  />
                )
              }

              return null
            })}
          </div>
        </div>

        <div className="form-group">
          <div className="form-group form-group--inline">
            <button
              type="submit"
              disabled={shouldDisable}
              className="button button--primary"
            >
              <span className="button-text">
                <MaterialDesignIcon name="guide" />
                {btnText}
              </span>
            </button>
            {isPOST ? (
              <a href="/admin/guides/" className="button">
                <span className="button-text">Cancel</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={this.onClickDelete}
                disabled={shouldDisable}
                className="button button--danger"
              >
                <span className="button-text">
                  <MaterialDesignIcon name="delete" />
                  {state.isDeleting ? 'Deleting...' : 'Delete'}
                </span>
              </button>
            )}
          </div>
          {!isPOST ? (
            <div className="form-group">
              <button
                type="button"
                onClick={this.onClickPublishToggle}
                disabled={shouldDisable}
                className={classNames({
                  button: true,
                  'button--danger': state.isPublished,
                  'button--primary-alt': !state.isPublished
                })}
              >
                <span className="button-text">
                  {state.isPublished ? (
                    <MaterialDesignIcon name="private" />
                  ) : (
                    <MaterialDesignIcon name="public" />
                  )}
                  {publishToggleBtnText}
                </span>
              </button>
            </div>
          ) : null}
        </div>
      </form>
    )
  }

  renderNotification() {
    const { props, state } = this

    const sid = get(props.guide, 'sid', '')
    const url = !isEmpty(sid) ? `/admin/guides/${sid}/update/` : '#'
    const name = get(state, 'name', 'Guide')

    const genericError = get(state.errors, 'generic')
    const hasGenericError = !isEmpty(genericError)

    const onClose = () => {
      if (state.deletingSuccessful) {
        window.location.href = '/admin/guides/'
      } else {
        this.setState({
          guide: {},
          hasSaved: false,
          savingSuccessful: false
        })
      }
    }

    if (state.savingSuccessful) {
      return (
        <Notification
          type="success"
          onClose={onClose}
          timeout={3500}
          isVisible
        >
          {props.formMethod === 'POST' ? (
            <span>
              &quot;{name}&quot; was added successfully.
              Click <a href={url}>here</a> to edit.
            </span>
          ) : (
            <span>
              &quot;{name}&quot; was updated successfully.
            </span>
          )}
        </Notification>
      )
    } else if (state.deletingSuccessful) {
      return (
        <Notification
          type="success"
          timeout={3500}
          onClose={onClose}
          isVisible
        >
          &quot;{name}&quot; was deleted successfully. Redirecting...
        </Notification>
      )
    } else if (hasGenericError) {
      return (
        <Notification
          type="error"
          timeout={3500}
          onClose={() => {
            this.setState({
              errors: {},
              savingSuccessful: false
            })
          }}
          isVisible
        >
          {genericError}
        </Notification>
      )
    }

    return null
  }

  render() {
    return (
      <div className="guide-form-container">
        {this.renderNotification()}
        {this.renderForm()}
      </div>
    )
  }
}
