import React from 'react'
import PropTypes from 'prop-types'

const Emergency = ({update}) => {

  const hasEmergency = (answer) => {
    update(answer)
  }

  return (
    <div className="checkin-box">
      <div className="text-center">
        <p className="title">A few quick questions</p>
        <p className="subtitle">Are you currently experiencing an emergency?</p>
        <p style={{
          textAlign: 'left'
        }}>Examples of emergencies include recent:</p>
        <ul>
          <li>suicidal crisis</li>
          <li>sexual assault</li>
          <li>homicidal thoughts</li>
          <li>death of a friend or loved one</li>
          <li>unusual experiences such as hearing voices or seeing things other people do not</li>
          <li>serious accident</li>
          <li>other similar events</li>
        </ul>
        <button
          className="btn btn-default btn-lg mr-1 emergency"
          onClick={hasEmergency.bind(this, true)}>Yes</button>
        <button
          onClick={hasEmergency.bind(this, false)}
          className="btn btn-default btn-lg emergency">No</button>
      </div>
      <div className="clearfix"></div>
    </div>
  )
}

Emergency.propTypes = {
  update: PropTypes.func,
}

export default Emergency
