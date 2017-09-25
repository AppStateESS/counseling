'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import Emergency from './Emergency'
import WaitingList from './Waiting/WaitingList'

const isEmpty = (value) => {
  return (value === undefined || value === null || value.length === 0)
}

const Waiting = (props) => {
  let waitingList = <div>No walk-ins waiting</div>
  if (!isEmpty(props.waiting)) {
    waitingList = (
      <div>
        <WaitingList list={props.waiting} reload={props.reload}/>
      </div>
    )
  }
  return (
    <div>
      <Emergency list={props.emergency} reload={props.reload}/>
      <h3>Walk-ins</h3>
      {waitingList}
    </div>
  )
}

Waiting.propTypes = {
  waiting: PropTypes.array,
  reload: PropTypes.func,
  emergency: PropTypes.array,
}

export default Waiting
