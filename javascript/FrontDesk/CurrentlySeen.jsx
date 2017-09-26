'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Modal from './Modal'

/* global $ */
export default class CurrentlySeen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dispositions: [],
      seenId: 0,
    }
  }

  componentDidMount() {
    this.loadDispositions()
  }

  loadDispositions() {
    $.getJSON('counseling/Admin/Clinician', {command: 'dispositionList'}).done(function (data) {
      this.setState({dispositions: data})
    }.bind(this))
  }

  moveBack(id) {
    $.post('./counseling/Admin/Dashboard/Waiting', {
      visitId: id,
      command: 'reset'
    }).done(function () {
      this.props.reload()
    }.bind(this), 'json')
  }

  complete(id) {
    this.setState({seenId: id})
    $('#reactModal').modal('show')
  }

  handleClick(dispositionId) {
    $.post('counseling/Admin/Clinician', {
      command: 'assignDisposition',
      dispositionId: dispositionId,
      visitId: this.state.seenId,
    }, null, 'json').done(function () {
      this.closeModal()
    }.bind(this))
  }

  getModal() {
    let dispositions = null
    let buttonClass = null
    let iconClass = null

    dispositions = this.state.dispositions.map(function (value, key) {
      buttonClass = 'btn btn-lg btn-block btn-' + value.color
      iconClass = 'fa fa-' + value.icon
      return (
        <button
          key={key}
          className={buttonClass}
          onClick={this.handleClick.bind(null, value.id)}>
          <i className={iconClass}></i>
          {value.title}</button>
      )
    }.bind(this))
    let modalBody = (
      <div>
        {dispositions}
      </div>
    )
    return (<Modal body={modalBody} header="Assign disposition" onClose={this.closeModal}/>)
  }

  closeModal() {
    this.setState({seenId: 0})
    this.props.reload()
    $('#reactModal').modal('hide')
  }

  render() {
    if (!this.props.seen) {
      return <div className="alert alert-info">No one is being seen</div>
    }
    let modal = this.getModal()
    let seen = this.props.seen.map(function (value, key) {
      return (
        <span key={key} className="dropdown mr-1">
          <button className="btn btn-default" data-toggle="dropdown">{value.visitor.last_name}&nbsp;w/&nbsp; {value.clinician}&nbsp;<span className="caret"></span>
          </button>
          <ul className="dropdown-menu">
            <li>
              <a className="pointer" onClick={this.moveBack.bind(this, value.id)}>
                <i className="fa fa-reply"></i>&nbsp;Move&nbsp;{value.visitor.preferred_name}&nbsp; {value.visitor.last_name}&nbsp;back to queue</a>
            </li>
            <li>
              <a className="pointer" onClick={this.complete.bind(this, value.id)}>
                <i className="fa fa-flag-checkered"></i>&nbsp;Complete {value.visitor.preferred_name}&nbsp;{value.visitor.last_name}'s consultation</a>
            </li>
          </ul>
        </span>
      )
    }.bind(this))
    return (
      <div>
        {modal}
        <div className="alert alert-info">
          <strong>Currently seen:&nbsp;
          </strong>
          {seen}
        </div>
      </div>
    )
  }
}

CurrentlySeen.propTypes = {
  seen: PropTypes.array,
  reload: PropTypes.func
}
