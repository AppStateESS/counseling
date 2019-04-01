'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const WaitingListVisits = ({visitNumber}) => {
  switch (visitNumber) {
    case '0':
      return <span></span>

    case '1':
      return <span className="badge badge-info">First visit</span>

    case '2':
    case '3':
      return <span className="badge badge-primary">{visitNumber}&nbsp; visits</span>

    case '4':
    case '5':
      return <span className="badge badge-warning">{visitNumber}&nbsp; visits</span>

    default:
      return <span className="badge badge-danger">{visitNumber}&nbsp; visits</span>
  }
}

WaitingListVisits.propTypes = {
  visitNumber: PropTypes.string
}

export default WaitingListVisits
