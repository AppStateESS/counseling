'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import CategoryIcon from '../Share/CategoryIcon'
import VisitorName from '../Share/VisitorName'
import WaitingListStatus from './WaitingListStatus'
import ClipboardInput from '../Share/ClipboardInput'
import WaitingAction from './WaitingAction'
import WaitingListVisits from './WaitingListVisits'

const WaitingListRow = (props) => {
  let count = props.count + 1
  let _className = 'bg-' + props.color
  return (
    <tr className={_className}>
      <td style={{
        width: '3%'
      }}>{count}</td>
      <td style={{
        width: '3%'
      }} className="text-center">
        <CategoryIcon category={props.category} reasonTitle={props.reason_title}/></td>
      <td><VisitorName visitor={props.visitor}/></td>
      <td>
        <ClipboardInput bannerId={props.visitor.banner_id}/>
      </td>
      <td>{props.wait_time}
        min.</td>
      <td><WaitingListVisits visitNumber={props.total_visits}/></td>
      <td>
        <WaitingListStatus
          visitor={props.visitor}
          reload={props.reload}
          visitNumber={props.total_visits}/>
      </td>
      <td><WaitingAction visitId={props.id} reload={props.reload}/></td>
    </tr>
  )
}

WaitingListRow.propTypes = {
  count: PropTypes.number,
  color: PropTypes.string,
  category: PropTypes.string,
  visitor: PropTypes.object,
  total_visits: PropTypes.string,
  reason_title: PropTypes.string,
  wait_time: PropTypes.number,
  reload: PropTypes.func,
  id : PropTypes.string,
}

export default WaitingListRow
