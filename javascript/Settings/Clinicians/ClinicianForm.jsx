'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {TextInput} from '../Mixins'

/* global $ */

export default class ClinicianForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: null,
      lastName: null,
      formError: ''
    }
    this.closeForm = this.closeForm.bind(this)
    this.updateFirstName = this.updateFirstName.bind(this)
    this.updateLastName = this.updateLastName.bind(this)
    this.save = this.save.bind(this)
  }

  componentWillMount() {
    this.setState({firstName: this.props.firstName, lastName: this.props.lastName, clinicianId: this.props.clinicianId})
  }
  componentDidMount() {
    $('#firstName').focus()
  }

  closeForm(event) {
    event.preventDefault()
    this.props.closeForm()
  }

  updateFirstName(event) {
    this.setState({firstName: event.target.value})
  }

  updateLastName(event) {
    this.setState({lastName: event.target.value})
  }

  save(event) {
    event.preventDefault()

    if (this.state.firstName === null || this.state.firstName.length === 0) {
      $('#firstName').css('borderColor', 'red')
      this.setState({formError: 'First name empty'})
      return
    }
    if (this.state.lastName === null || this.state.lastName.length === 0) {
      var splitString = this.state.firstName.split(' ')
      if (splitString.length === 2) {
        this.setState({firstName: splitString[0], lastName: splitString[1], formError: 'Last name empty. Did you type the full name in the first name field?'})
        return
      }

      $('#lastName').css('borderColor', 'red')
      this.setState({formError: 'Last name empty.'})
      return
    }

    this.setState({formError: false})

    $.post('counseling/Admin/Settings/Clinician', {
      command: 'save',
      clinicianId: this.state.clinicianId,
      firstName: this.state.firstName,
      lastName: this.state.lastName
    }, null, 'json').done(function () {
      this.props.reload()
    }.bind(this)).fail(function () {
      this.props.fail()
    }.bind(this)).always(function () {
      this.props.closeForm()
    }.bind(this))

  }

  render() {
    let alert = null
    if (this.state.formError.length > 0) {
      alert = <div className="alert alert-danger" style={{
        fontSize: '1em'
      }}>
        {this.state.formError}</div>
    }

    return (
      <div>
        {alert}
        <div>
          <form method="post" action="counseling/Admin/Settings/Clinicians">
            <input type="hidden" name="command" value="add"/>
            <div className="row">
                <div className="col-sm-6">
                    <TextInput
                      inputId="firstName"
                      label="First name"
                      handleChange={this.updateFirstName}
                      required={true}
                      tabIndex={1}
                      value={this.state.firstName}/>
                </div>
                <div className="col-sm-6">
                    <TextInput
                      inputId="lastName"
                      label="Last name"
                      handleChange={this.updateLastName}
                      required={true}
                      tabIndex={1}
                      value={this.state.lastName}/>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-9">
                    <button className="pull-left btn btn-primary" onClick={this.save} tabIndex={2}>
                    <i className="fa fa-check"></i>Save Clinician</button>&nbsp;
                    <button className="btn btn-danger" onClick={this.closeForm} tabIndex={3}>
                    <i className="fa fa-exclamation-triangle"></i>Cancel</button>
                </div>
            </div>
         </form>
        </div>
      </div>
    )
  }
}

ClinicianForm.propTypes = {
  closeForm: PropTypes.func,
  reload: PropTypes.func,
  fail: PropTypes.func,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  clinicianId: PropTypes.string
}
