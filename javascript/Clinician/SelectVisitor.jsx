'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

/* global $, categoryIcons */

export default class SelectVisitor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      waiting: null,
      emergencies: null,
      selectedVisit: null,
    }
    this.select = this.select.bind(this)
    this.startConsultation = this.startConsultation.bind(this)
    this.goBack = this.goBack.bind(this)
    this.reset = this.reset.bind(this)
  }

  componentDidMount() {
    this.loadData()
  }

  loadData() {
    $.getJSON('counseling/Admin/Clinician', {command: 'visitorList'}).done(function (data) {
      if (data !== null) {
        this.setState({waiting: data.waiting, emergencies: data.emergencies,})
      }
    }.bind(this))
  }

  goBack() {
    this.props.setStage('choose')
  }

  reset() {
    this.setState({selectedVisit: null})
  }

  select(visit) {
    this.setState({selectedVisit: visit})
  }

  startConsultation() {
    var visitId = this.state.selectedVisit.id
    var clinicianId = this.props.clinician.id
    $.post('counseling/Admin/Clinician/', {
      command: 'selectVisit',
      visitId: visitId,
      clinicianId: clinicianId,
    }, null, 'json').done(function () {
      this.reset()
      this.props.setStage('reset')
    }.bind(this))
  }

  render() {
    if (this.state.selectedVisit !== null) {
      return <ConfirmVisitor
        visit={this.state.selectedVisit}
        goBack={this.reset}
        startConsultation={this.startConsultation}/>
    }

    var listing = null
    if (this.state.waiting === null && this.state.emergencies === null) {
      listing = (
        <div>
          <div className="alert alert-info">No visitors are currently waiting.</div>
          <div className="go-back text-center">
            <button className="btn btn-default btn-lg" onClick={this.goBack}>
              <i className="fa fa-undo"></i>&nbsp;
              Go Back</button>
          </div>
        </div>
      )
    } else {
      listing = <SelectVisitorListing
        waiting={this.state.waiting}
        emergencies={this.state.emergencies}
        setStage={this.props.setStage}
        clinician={this.props.clinician}
        reload={this.loadData}
        goBack={this.goBack}
        select={this.select}/>
    }
    return (
      <div>
        <h2>Hello {this.props.clinician.first_name}</h2>
        <hr/> {listing}
      </div>
    )
  }
}

SelectVisitor.propTypes = {
  clinician: PropTypes.object,
  setStage: PropTypes.func,
}

const ConfirmVisitor = (props) => {
  const visitor = props.visit.visitor
  return (
    <div className="text-center well">
      <h2>
        {`You have chosen to start a consulation with ${visitor.preferred_name} \
        ${visitor.last_name}`}
      </h2>
      <div className="go-back">
        <button
          className="btn btn-success btn-lg mb-1"
          onClick={props.startConsultation}>
          <i className="fa fa-check"></i>&nbsp;
          Start consultation</button><br/>
        <button className="btn btn-default btn-3x" onClick={props.goBack}>
          <i className="fa fa-undo"></i>&nbsp;
          Start over</button>
      </div>
    </div>
  )
}

ConfirmVisitor.propTypes = {
  visit : PropTypes.object,
  startConsultation: PropTypes.func,
  goBack: PropTypes.func,
}

const SelectVisitorListing = (props) => {
  return (
    <div className="visitor-listing">
      <Emergencies
        list={props.emergencies}
        clinician={props.clinician}
        select={props.select}/>
      <Waiting
        waiting={props.waiting}
        clinician={props.clinician}
        select={props.select}/>
      <div className="go-back text-center">
        <button className="btn btn-default btn-lg" onClick={props.goBack}>
          <i className="fa fa-undo"></i>&nbsp;
          Go Back</button>
      </div>
    </div>
  )
}

SelectVisitorListing.propTypes = {
  emergencies: PropTypes.array,
  select: PropTypes.func,
  waiting: PropTypes.array,
  clinician: PropTypes.object,
  goBack: PropTypes.func,
}

const Emergencies = (props) => {
  if (props.list === null || props.list.length === 0) {
    return null
  } else {
    let visits = props.list.map(function (value, key) {
      return (<VisitorRow
        key={key}
        {...value}
        clinician={props.clinician}
        buttonClass="danger"
        select={props.select.bind(null, value)}/>)
    }.bind(this))

    return (
      <div>
        <h3>Emergencies</h3>
        {visits}
      </div>
    )
  }
}

Emergencies.propTypes = {
  list: PropTypes.array,
  clinician: PropTypes.object,
  select: PropTypes.func,
}

const Waiting = (props) => {
  let visits = <div>No walk-ins waiting</div>
  if (props.waiting !== null && props.waiting.length !== 0) {
    visits = props.waiting.map(function (value, key) {
      return (<VisitorRow
        key={key}
        {...value}
        clinician={props.clinician}
        buttonClass={value.color}
        select={props.select.bind(null, value)}/>)
    }.bind(this))
  }

  return (
    <div>
      <h3>Waiting</h3>
      {visits}
    </div>
  )
}

Waiting.propTypes = {
  waiting: PropTypes.array,
  clinician: PropTypes.object,
  select: PropTypes.func,
}

const VisitorRow = (props) => {
  let _className = 'btn btn-block btn-lg btn-' + props.buttonClass
  let waiting = null
  if (props.category == '1' || props.has_emergency == '1') {
    waiting = <span>&nbsp;- Waiting: {props.wait_time}
      min.</span>
  }
  let preferredName = props.visitor.preferred_name !== null
    ? props.visitor.preferred_name
    : props.visitor.first_name
  return (
    <button className={_className} onClick={props.select}>
      <CategoryIcon category={props.category} title={props.reason_title}/>
      &nbsp;<strong>{preferredName} {props.visitor.last_name}</strong>
      {waiting}
    </button>
  )
}

VisitorRow.propTypes = {
  buttonClass: PropTypes.string,
  has_emergency: PropTypes.string,
  visitor: PropTypes.object,
  select: PropTypes.func,
  reason_title: PropTypes.string,
  category: PropTypes.string,
  wait_time: PropTypes.number,
}


const CategoryIcon = (props) => {

  const _className = 'category fa fa-lg ' + categoryIcons[props.category]
  const icon = <i className={_className} title={props.title}></i>
  return (
    <span>{icon}</span>
  )
}

CategoryIcon.propTypes = {
  title: PropTypes.string,
  category: PropTypes.string,
}
