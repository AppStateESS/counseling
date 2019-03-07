'use strict'
import React, {Component} from 'react'
import LocationForm from './Location/LocationForm'
import LocationList from './Location/LocationList'

/* global $ */

export default class Locations extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showForm: false,
      allowAdd: true,
      locations: [],
      saveFail: false,
      currentEdit: null,
    }
    this.loadData = this.loadData.bind(this)
    this.showForm = this.showForm.bind(this)
    this.closeForm = this.closeForm.bind(this)
    this.saveFailure = this.saveFailure.bind(this)
    this.setCurrentEdit = this.setCurrentEdit.bind(this)
  }

  loadData() {
    $.getJSON('./counseling/Admin/Settings/Location', {command: 'list'}).done(function (data) {
      console.log('setting locations')
      this.setState({locations: data})
    }.bind(this))
  }

  setLocations(locations) {
    this.setState({locations : locations})
  }

  componentDidMount() {
    this.loadData()
  }

  saveFailure(fail = true) {
    this.setState({saveFail: fail})
  }

  closeForm() {
    this.setState({showForm: false, allowAdd: true,})
  }

  showForm() {
    this.setState({showForm: true, allowAdd: false,})
  }

  setCurrentEdit(locationId, section) {
    var currentEdit = null
    if (locationId !== null) {
      currentEdit = {
        id: locationId,
        section: section,
      }
    }
    this.setState({currentEdit: currentEdit})
  }


  render() {
    let form
    let button
    let alert
    if (this.state.showForm) {
      form = (
        <div>
          <LocationForm
            closeForm={this.closeForm}
            reload={this.loadData}
            fail={this.saveFailure}/>
        </div>
      )
    } else {
      button = (
        <button className="btn btn-success mb-1" onClick={this.showForm}>Add location&nbsp;
          <i className="fa fa-caret-down"></i>
        </button>
      )
    }
    if (this.state.saveFail) {
      alert = (
        <div className="alert alert-danger">
          <strong>
            <i className="fa fa-exclamation-triangle"></i>&nbsp;
            Error:</strong>&nbsp;
          Location save failed</div>
      )
    }
    const style = {
      height: '50px'
    }
    return (
      <div>
        <div className="location-form-area">
          <div>
            {form}
          </div>
          <div style={style}>
            {button}
          </div>
        </div>
        {alert}
        <div>
          <LocationList
            locations={this.state.locations}
            reload={this.loadData}
            currentEdit={this.state.currentEdit}
            setCurrentEdit={this.setCurrentEdit}
            showForm={this.showForm}
            setCurrent={this.setCurrentEdit}
            setLocations={this.setLocations}/>
        </div>
      </div>
    )
  }
}
