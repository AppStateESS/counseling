'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReasonRow from './Reasons/ReasonRow'
import ReasonForm from './Reasons/ReasonForm'
import './style.css'

/* global $ */

export default class Reasons extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showForm: false,
      reasons: null,
      saveFail: false,
      currentEdit: null,
      allowAdd: true,
    }
    this.loadData = this.loadData.bind(this)
    this.showForm = this.showForm.bind(this)
    this.closeForm = this.closeForm.bind(this)
    this.saveFailure = this.saveFailure.bind(this)
    this.setCurrentEdit = this.setCurrentEdit.bind(this)
  }

  componentDidMount() {
    this.loadData()
  }

  closeForm() {
    this.setState({showForm: false, allowAdd: true})
  }

  showForm() {
    this.setState({showForm: true, allowAdd: false})
  }

  saveFailure() {
    this.setState({saveFail: true})
  }

  loadData() {
    $.getJSON('counseling/Admin/Settings/Reason', {command: 'list'}).done(function (data) {
      this.setState({reasons: data})
    }.bind(this))
  }

  setCurrentEdit(reasonId, section) {
    var currentEdit = null
    if (reasonId !== null) {
      currentEdit = {
        id: reasonId,
        section: section,
      }
    }
    this.setState({currentEdit: currentEdit})
  }

  render() {
    let form
    let button = (
      <button
        className="btn btn-success mb-1" disabled={!this.state.allowAdd}
        onClick={this.showForm}>Add reason&nbsp;
        <i className="fa fa-caret-down"></i>
      </button>
    )
    let alert
    let background

    if (this.state.showForm) {
      form = <ReasonForm
        closeForm={this.closeForm}
        reload={this.loadData}
        fail={this.saveFailure}/>
      background = <div className="modal-background"></div>
    }

    if (this.state.saveFail) {
      alert = <div className="alert alert-danger">
        <strong>
          <i className="fa fa-exclamation-triangle"></i>
          Error:</strong>
        Reason save failed</div>
    }

    return (
      <div>
        {background}
        <div className="settings-form-area">
          <div className="reason-form">
            {form}
          </div>
          {button}
        </div>
        {alert}
        <div className="settings-listing">
          <ReasonList
            reasons={this.state.reasons}
            reload={this.loadData}
            currentEdit={this.state.currentEdit}
            setCurrentEdit={this.setCurrentEdit}/>
        </div>
      </div>
    )
  }
}

const ReasonList = ({reasons, reload, currentEdit, setCurrentEdit}) => {
  let reasonResult
  if (reasons) {
    reasonResult = reasons.map(function (value) {
      return (<ReasonRow
        key={value.id}
        {...value}
        reload={reload}
        currentEdit={currentEdit}
        setCurrentEdit={setCurrentEdit}/>)
    }.bind(this))
  }
  return (
    <div>{reasonResult}</div>
  )
}

ReasonList.propTypes = {
  reasons: PropTypes.array,
  reload: PropTypes.func,
  currentEdit: PropTypes.object,
  setCurrentEdit: PropTypes.func
}
