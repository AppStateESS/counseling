'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import SummaryCompleted from './Summary/SummaryCompleted'
import SummaryWaitingTally from './Summary/SummaryWaitingTally'

export default class Summary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      errorMessage: null
    }
  }

  serverError() {
    this.setState({error: true, errorMessage: 'Could not retrieve server data'})
  }

  render() {
    let currentTally = null
    let totalTally = null
    if (this.props.data) {
      currentTally = this.props.data.currentTally
      totalTally = this.props.data.completeTally
    } else {
      currentTally = {
        emergencies: 0,
        walkin: 0,
        appointment: 0,
        other: 0
      }
      totalTally = currentTally
    }
    return (
      <div className="summary">
        {this.state.error
          ? <div className="alert alert-danger">{this.state.errorMessage}</div>
          : null}
        <div className="row">
          <div className="col-sm-6 left">
            <h3>Current</h3>
            <div className="row">
              <div className="col-sm-4">
                <SummaryTotalWaiting {...this.props.data}/>
              </div>
              <div className="col-sm-4">
                <SummaryEstimatedWait {...this.props.data}/>
              </div>
              <div className="col-sm-4">
                <SummaryWaitingTally {...currentTally}/>
              </div>
            </div>
          </div>
          <div className="col-sm-6 right">
            <h4 className="pull-right">{this.props.time}</h4>
            <h3>Today</h3>
            <div className="row">
              <div className="col-sm-2">
                <SummaryTotalSeen {...this.props.data}/>
              </div>
              <div className="col-sm-3">
                <SummaryCompleted {...this.props.data}/>
              </div>
              <div className="col-sm-3">
                <SummaryAverageWait {...this.props.data}/>
              </div>
              <div className="col-sm-4">
                <SummaryWaitingTally {...totalTally} showLabels={true}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Summary.propTypes = {
  data: PropTypes.object,
  time: PropTypes.string
}

const SummaryTotalWaiting = ({totalWaiting}) => {
  return (
    <div className="total-waiting text-center">
      <div className="big-number">{totalWaiting}</div>
      <div>Waiting</div>
    </div>
  )
}

SummaryTotalWaiting.propTypes = {
  totalWaiting: PropTypes.number
}

const SummaryEstimatedWait = ({estimatedWait}) => {
  return (
    <div className="estimated-wait text-center">
      <div>
        <span className="big-number">{estimatedWait}</span>
        <span>min</span>
      </div>
      <div>Est. Wait</div>
    </div>
  )
}

SummaryEstimatedWait.propTypes = {
  estimatedWait: PropTypes.number
}

const SummaryTotalSeen = ({totalSeen}) => {
  return (
    <div className="total-seen text-center">
      <div className="big-number">{totalSeen}</div>
      <div>Seen</div>
    </div>
  )
}

SummaryTotalSeen.propTypes = {
  totalSeen: PropTypes.string
}

const SummaryAverageWait = ({averageWait}) => {
  return (
    <div className="average-wait text-center">
      <div>
        <span className="big-number">{averageWait}</span>
        <span>min</span>
      </div>
      <div>Avg. Wait</div>
    </div>
  )
}

SummaryAverageWait.propTypes = {
  averageWait: PropTypes.number
}
