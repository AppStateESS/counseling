'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

/* global $ */

export default class CompleteVisit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dispositions: []
    }
    this.handleClick = this.handleClick.bind(this)
    this.loadData = this.loadData.bind(this)
  }

  componentDidMount() {
    this.loadData()
  }

  loadData() {
    $.getJSON('counseling/Admin/Clinician', {command: 'dispositionList'}).done(function (data) {
      this.setState({dispositions: data})
    }.bind(this))

  }

  handleClick(dispositionId) {
    $.post('counseling/Admin/Clinician', {
      command: 'assignDisposition',
      dispositionId: dispositionId,
      visitId: this.props.seen.id,
    }, null, 'json').done(function () {
      this.props.setStage('selectVisitor')
    }.bind(this))
  }

  render() {
    let dispositions = this.state.dispositions.map(function (value, key) {
      const buttonClass = 'btn btn-lg btn-block btn-' + value.color
      const iconClass = 'fa fa-' + value.icon
      return (
        <button
          key={key}
          className={buttonClass}
          onClick={this.handleClick.bind(null, value.id)}>
          <i className={iconClass}></i>&nbsp; {value.title}</button>
      )
    }.bind(this))

    return (
      <div>
        <h2>{`${this.props.clinician.first_name} ${this.props.clinician.last_name} \
          meeting with ${this.props.seen.preferred_name} ${this.props.seen.last_name}`}
        </h2>
        <h3>If your consultation is complete, choose a disposition below.</h3>
        {dispositions}
        <hr/>
        <div className="text-center">
          <button className="btn btn-default btn-lg" onClick={this.props.goBack}>
            <i className="fa fa-undo"></i>&nbsp; Go Back</button>
        </div>
      </div>
    )
  }
}

CompleteVisit.propTypes = {
  seen: PropTypes.object,
  clinician: PropTypes.object,
  goBack: PropTypes.func,
  setStage: PropTypes.func,
}
