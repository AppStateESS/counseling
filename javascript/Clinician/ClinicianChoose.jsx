'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

export default class ClinicianChoose extends Component {
  constructor(props) {
    super(props)
    this.state = {
      timeframe: null
    }
  }

  componentDidMount() {
    this.setTimeframe()
  }

  setTimeframe() {
    let timeframe
    const date = new Date()
    const hours = date.getHours()
    switch (hours) {
      case hours < 12:
        timeframe = 'Morning'
        break

      case hours > 17:
        timeframe = 'Evening'
        break

      default:
        timeframe = 'Afternoon'
        break
    }
    this.setState({timeframe: timeframe})
  }

  render() {
    let rows = null

    if (this.props.clinicians !== null && this.props.clinicians.length > 0) {
      rows = this.props.clinicians.map(function (value, key) {
        return <ClinicianRow key={key} {...value} choose={this.props.choose.bind(null, key)}/>
      }.bind(this))
    } else {
      rows = <p>No clinicians found in system.</p>
    }

    return (
      <div>
        <h2>Good {this.state.timeframe}!</h2>
        <hr/>
        <h3>Please click/touch your name to continue...</h3>
        <div className="row clinician-container">
          {rows}
        </div>
      </div>
    )
  }
}

ClinicianChoose.propTypes = {
  clinicians: PropTypes.array,
  choose: PropTypes.func
}

ClinicianChoose.defaultProps = {
  clinicians: null,
  choose: null
}

const ClinicianRow = (props) => {
  return (
    <div className="col-sm-12 col-md-6">
      <button
        className="clinician btn btn-primary btn-lg btn-block"
        onClick={props.choose}>{props.first_name}&nbsp;{props.last_name}</button>
    </div>
  )
}

ClinicianRow.propTypes = {
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  id: PropTypes.string,
  choose: PropTypes.func
}
