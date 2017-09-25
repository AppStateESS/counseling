'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {TextInput} from '../Mixins'
/* global $ */

export default class ReasonForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      description: '',
      instruction: 1,
      category: 1,
      showEmergency: false,
      askForPhone: 0,
      formError: false,
      instructionList: null,
    }
    this.save = this.save.bind(this)
    this.closeForm = this.closeForm.bind(this)
    this.updateTitle = this.updateTitle.bind(this)
    this.updateDescription = this.updateDescription.bind(this)
    this.updateInstruction = this.updateInstruction.bind(this)
    this.updateCategory = this.updateCategory.bind(this)
    this.updateEmergency = this.updateEmergency.bind(this)
    this.updateAskForPhone = this.updateAskForPhone.bind(this)
  }

  componentDidMount() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
  }

  save(event) {
    event.preventDefault()
    if (this.state.title === null || this.state.title.length === 0) {
      $('#title').css('borderColor', 'red')
      this.setState({formError: true})
      return
    }

    if (this.state.description === null || this.state.description.length === 0) {
      $('#description').css('borderColor', 'red')
      this.setState({formError: true})
      return
    }

    this.setState({formError: false})
    $.post('counseling/Admin/Settings/Reason', {
      command: 'save',
      reasonId: 0,
      title: this.state.title,
      description: this.state.description,
      instruction: this.state.instruction,
      category: this.state.category,
      showEmergency: this.state.showEmergency,
      askForPhone: this.state.askForPhone,
    }, null, 'json').done(function () {
      this.props.reload()
    }.bind(this)).fail(function () {
      this.props.fail()
    }.bind(this)).always(function () {
      this.props.closeForm()
    }.bind(this))
  }

  updateTitle(event) {
    this.setState({title: event.target.value})
  }

  updateDescription(event) {
    this.setState({description: event.target.value})
  }

  updateInstruction(event) {
    this.setState({instruction: event.target.value})
  }

  updateCategory(event) {
    this.setState({category: event.target.value})
  }

  updateEmergency(event) {
    var showEmergency = event.target.checked
    this.setState({showEmergency: showEmergency})
  }

  updateAskForPhone(event) {
    this.setState({askForPhone: event.target.checked})
  }

  closeForm(event) {
    event.preventDefault()
    this.props.closeForm()
  }

  render() {
    return (
      <div className="setting-form">
        <form method="post" action="counseling/Admin/Settings/Reasons">
          <input type="hidden" name="command" value="add"/> {this.state.formError
            ? <div className="alert alert-danger required-alert">
                Please complete all highlighted text inputs.
              </div>
            : null}
          <div className="form-group">
            <TextInput
              inputId="title"
              label="Title"
              placeholder="One or two words describing reason. Internal use only."
              handleChange={this.updateTitle}
              required={true}
              tabIndex={1}
              value={this.state.title}/>
          </div>
          <div className="form-group">
            <TextInput
              inputId="description"
              label="Description"
              placeholder="Description of reason. Seen by visitors."
              handleChange={this.updateDescription}
              required={true}
              tabIndex={2}
              value={this.state.description}/>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div className="form-group">
                <label>Instructions</label>
                <p>
                  <label className="mr-2">
                    <input
                      type="radio"
                      name="instruction"
                      defaultValue="1"
                      defaultChecked={true}
                      tabIndex={3}
                      onClick={this.updateInstruction}/>&nbsp; Sit down
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="instruction"
                      defaultValue="2"
                      tabIndex={4}
                      onClick={this.updateInstruction}/>&nbsp; Front desk
                  </label>
                </p>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="showEmergency"
                    value="1"
                    checked={this.state.showEmergency}
                    onChange={this.updateEmergency}
                    tabIndex={5}/>&nbsp;
                  Show emergency question&nbsp;
                  <i
                    className="fa fa-question-circle pointer"
                    data-toggle="tooltip"
                    data-placement="right"
                    title="If checked, the visitor will be asked if they have an emergency."></i>
                </label>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="askForPhone"
                    value="1"
                    checked={this.state.askForPhone}
                    onChange={this.updateAskForPhone}
                    tabIndex={8}/>&nbsp; Ask for phone number &nbsp;
                  <i
                    className="fa fa-question-circle pointer"
                    data-toggle="tooltip"
                    data-placement="right"
                    title="If checked, the visitor will be asked for their phone number."></i>
                </label>
              </div>
            </div>
            <div className="col-sm-6">
              <GroupSelect update={this.updateCategory}/>
            </div>
          </div>
          <button className="pull-left btn btn-primary" onClick={this.save} tabIndex={8}>
            <i className="fa fa-check"></i>
            Save reason</button>&nbsp;
          <button className="btn btn-danger" onClick={this.closeForm} tabIndex={9}>
            <i className="fa fa-times"></i>
            Cancel</button>
        </form>
      </div>
    )
  }
}

ReasonForm.propTypes = {
  closeForm: PropTypes.func,
  reload: PropTypes.func,
  fail: PropTypes.func
}

const GroupSelect = ({update}) => {
  return (
    <div>
      <label>Category</label>
      <div>
        <label>
          <input type="radio" name="summaryGroup" defaultValue="1" onClick={update}/>&nbsp;
          <i className="fa fa-clock-o fa-lg"></i>&nbsp; Walk-in
        </label>
      </div>
      <div>
        <label>
          <input type="radio" name="summaryGroup" defaultValue="2" onClick={update}/>&nbsp;
          <i className="fa fa-male fa-lg"></i>&nbsp; Individual appointment
        </label>
      </div>
      <div>
        <label>
          <input type="radio" name="summaryGroup" defaultValue="4" onClick={update}/>&nbsp;
          <i className="fa fa-users fa-lg"></i>&nbsp; Group appointment
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            name="summaryGroup"
            defaultChecked={true}
            defaultValue="0"
            onClick={update}/>&nbsp;
          <i className="fa fa-question-circle fa-lg"></i>&nbsp; Other
        </label>
      </div>
    </div>
  )
}

GroupSelect.propTypes = {
  update: PropTypes.func
}
