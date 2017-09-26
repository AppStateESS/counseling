import React from 'react'
import PropTypes from 'prop-types'
import WaitingAction from './Waiting/WaitingAction'
import WaitingListStatus from './Waiting/WaitingListStatus'
import VisitorName from './Share/VisitorName'
import ClipboardInput from './Share/ClipboardInput'

const Emergency = (props) => {
  if (props.list === null || props.list === undefined) {
    return null
  }

  let rows = props.list.map(function (value, key) {
    return (<EmergencyRow key={key} {...value} reload={props.reload}/>)
  }.bind(this))

  return (
    <div className="emergency">
      {rows}
    </div>
  )
}

Emergency.propTypes = {
  reload: PropTypes.func,
  list: PropTypes.array,
}

const EmergencyRow = (props) => {
  return (
    <div className="row">
      <div className="col-sm-1">
        <i className="fa fa-lg fa-exclamation-triangle"></i>
      </div>
      <div className="col-sm-2 visitor-name">
        <VisitorName visitor={props.visitor}/>
      </div>
      <div className="col-sm-3">
        <ClipboardInput bannerId={props.visitor.banner_id}/>
      </div>
      <div className="col-sm-2">
        {props.wait_time}
        min.
      </div>
      <div className="col-sm-3">
        <WaitingListStatus
          visitor={props.visitor}
          reload={props.reload}
          visitNumber={props.total_visits}/>
      </div>
      <div className="col-sm-1">
        <WaitingAction visitId={props.id} reload={props.reload}/>
      </div>
    </div>
  )
}

EmergencyRow.propTypes = {
  visitor: PropTypes.object,
  reload: PropTypes.func,
  wait_time: PropTypes.number,
  total_visits: PropTypes.string,
}

export default Emergency
