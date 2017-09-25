'use strict'
import React, {Component} from 'react'
import DispositionList from './Dispositions/DispositionList'
import DispositionForm from './Dispositions/DispositionForm'

/* global $ */

export default class Dispositions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dispositions: null,
      saveFail: false,
      currentEdit: null,
      showForm: false,
      currentDisposition: null,
    }
    this.showForm = this.showForm.bind(this)
    this.closeForm = this.closeForm.bind(this)
    this.loadData = this.loadData.bind(this)
    this.setDispositions = this.setDispositions.bind(this)
  }

  componentDidMount(){
    this.loadData()
  }

  loadData() {
    $.getJSON('counseling/Admin/Settings/Disposition', {command: 'list'}).done(function (data) {
      this.setState({dispositions: data})
    }.bind(this))
  }

  closeForm() {
    this.setState({showForm: false, allowAdd: true})
  }

  showForm() {
    this.setState({showForm: true, allowAdd: false})
  }

  setCurrentEdit(value) {
    this.setState({currentEdit: value})
  }

  setDispositions(value) {
    this.setState({dispositions: value})
  }

  render() {
    let form
    let button
    let alert
    if (this.state.showForm) {
      form = (
        <div className="form-box">
          <DispositionForm
            closeForm={this.closeForm}
            reload={this.loadData}
            fail={this.saveFailure}/>
        </div>
      )
    } else {
      button = (
        <button className="btn btn-success mb-1" onClick={this.showForm}>Add disposition&nbsp;
          <i className="fa fa-caret-down"></i>
        </button>
      )
    }
    if (this.state.saveFail) {
      alert = (
        <div className="alert alert-danger">
          <strong>
            <i className="fa fa-exclamation-triangle"></i>
            Error:</strong>
          Disposition save failed</div>
      )
    }
    const style = {height: '50px'}
    return (
      <div>
        <div className="disposition-form-area">
          <div className="reason-form">
            {form}
          </div>
          <div style={style}>
            {button}
          </div>
        </div>
        {alert}
        <div>
          <DispositionList
            dispositions={this.state.dispositions}
            reload={this.loadData}
            currentEdit={this.state.currentEdit}
            setCurrentEdit={this.setCurrentEdit}
            showForm={this.showForm}
            setCurrent={this.setCurrentEdit}
            setDispositions={this.setDispositions}/>
        </div>
      </div>
    )
  }
}

Dispositions.propTypes = {}
