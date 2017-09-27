'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import WaitingListRow from './WaitingListRow'

const WaitingList = (props) => {
  var listRows = null
  if (props.list == null) {
    return <div></div>
  }
  listRows = props.list.map(function (value, key) {
    return (<WaitingListRow {...value} count={key} key={key} reload={props.reload}/>)
  }.bind(this))
  return (
    <div className="waiting-list">
      <table className="table">
        <tbody>
          <tr>
            <th>#</th>
            <th>&nbsp;</th>
            <th>Name</th>
            <th>Banner id</th>
            <th>Wait time</th>
            <th>Location</th>
            <th>Visits</th>
            <th>Status</th>
            <th>&nbsp;</th>
          </tr>
          {listRows}
        </tbody>
      </table>
    </div>
  )
}

WaitingList.propTypes = {
  list: PropTypes.array,
  reload: PropTypes.func
}

export default WaitingList
