'use strict'
import React, {Component} from 'react'
import ClinicianForm from './Clinicians/ClinicianForm'
import ClinicianList from './Clinicians/ClinicianList'

/* global $ */

export default class Clinicians extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showForm: false,
      clinicians: null,
      saveFail: false,
      currentEdit: null
    }
    this.setClinicians = this.setClinicians.bind(this)
    this.loadData = this.loadData.bind(this)
    this.closeForm = this.closeForm.bind(this)
    this.showForm = this.showForm.bind(this)
  }

  componentDidMount(){
    this.loadData()
  }

  closeForm() {
    this.setState({showForm: false})
  }

  showForm() {
    this.setState({showForm: true})
  }

  loadData() {
    $.getJSON('counseling/Admin/Settings/Clinician', {command: 'list'}).done(function (data) {
      this.setState({clinicians: data})
    }.bind(this))
  }

  setCurrentEdit(value) {
    this.setState({currentEdit: value})
  }

  setClinicians(value) {
    this.setState({clinicians: value})
  }

  render() {
    let form
    let button
    let alert

    const pos = {
      position: 'relative'
    }

    const height = {
      height: '50px'
    }

    if (this.state.showForm) {
      form = (
        <div className="form-box">
          <ClinicianForm
            closeForm={this.closeForm}
            reload={this.loadData}
            fail={this.saveFailure}/>
        </div>
      )
    } else {
      button = (
        <button className="btn btn-success mb-1" onClick={this.showForm}>Add clinician&nbsp;
          <i className="fa fa-caret-down"></i>
        </button>
      )
    }
    if (this.state.saveFail) {
      alert = <div className="alert alert-danger">
        <strong>
          <i className="fa fa-exclamation-triangle"></i>
          Error:</strong>
        Clinician save failed</div>
    }
    return (
      <div>
        <div className="clinician-form-area">
          <div style={pos}>
            {form}
          </div>
          <div style={height}>
            {button}
          </div>
        </div>
        {alert}
        <div className="clinician-listing">
          <ClinicianList
            clinicians={this.state.clinicians}
            reload={this.loadData}
            currentEdit={this.state.currentEdit}
            setCurrentEdit={this.setCurrentEdit}
            setClinicians={this.setClinicians}/>
        </div>
      </div>
    )
  }
}
