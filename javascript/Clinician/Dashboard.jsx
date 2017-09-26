'use strict'
import React, {Component} from 'react'
import ClinicianChoose from './ClinicianChoose'
import SelectVisitor from './SelectVisitor'
import CompleteVisit from './CompleteVisit'
import '../css/style.css'

/* global $ */

let ClinicianTimeout = null

export default class ClinicianDashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clinicians: null,
      currentClinician: null,
      stage: 'choose',
      currentlySeen: null
    }
    this.choose = this.choose.bind(this)
    this.setStage = this.setStage.bind(this)
    this.goBack = this.goBack.bind(this)
  }
  componentDidMount() {
    this.loadData()
  }

  loadData() {
    $.getJSON('counseling/Admin/Clinician', {command: 'list'}).done(function (data) {
      this.setState({clinicians: data})
    }.bind(this))
  }

  loadSeen(clinician) {
    $.getJSON('counseling/Admin/Clinician', {
      command: 'currentlySeen',
      clinicianId: clinician.id
    }).done(function (data) {
      if (data !== false) {
        this.setState({currentlySeen: data, stage: 'completeVisit', currentClinician: clinician})
      } else {
        this.setState({currentlySeen: null, stage: 'selectVisitor', currentClinician: clinician})
      }
    }.bind(this))

  }

  choose(key) {
    this.loadSeen(this.state.clinicians[key])
  }

  setStage(stage) {
    this.setState({stage: stage})
  }

  componentDidUpdate() {
    if (this.state.stage == 'reset') {
      ClinicianTimeout = setTimeout(function () {
        this.setStage('choose')
      }.bind(this), 5000)
    }
  }

  goBack() {
    clearTimeout(ClinicianTimeout)
    this.setStage('choose')
  }

  render() {
    switch (this.state.stage) {
      case 'choose':
        return <ClinicianChoose clinicians={this.state.clinicians} choose={this.choose}/>

      case 'selectVisitor':
        return <SelectVisitor
          clinician={this.state.currentClinician}
          setStage={this.setStage}/>

      case 'completeVisit':
        return <CompleteVisit
          clinician={this.state.currentClinician}
          seen={this.state.currentlySeen}
          goBack={this.goBack}
          setStage={this.setStage}/>

      case 'reset':
        return (
          <div className="well text-center">
            <h2>Thank you.</h2>
            <h3>Return on completion of your consultation.</h3>
            <button className="btn btn-default btn-lg" onClick={this.goBack}>
              <i className="fa fa-undo"></i>&nbsp;
              Go Back</button>
          </div>
        )
    }
  }
}
