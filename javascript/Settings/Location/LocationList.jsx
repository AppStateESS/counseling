'use strict'
import React from 'react'
import PropTypes from 'prop-types'
import LocationRow from './LocationRow'

const LocationList = ({locations, reload, currentEdit, setCurrentEdit,}) => {
  let locationResult
  if (locations) {
    locationResult = locations.map(function (value) {
      console.log('sending to locationrow')
      console.log(value)
      return (<LocationRow
        key={value.id}
        {...value}
        reload={reload}
        currentEdit={currentEdit}
        setCurrentEdit={setCurrentEdit}/>)
    }.bind(this))
  }
  return (
    <table className="table table-striped">
      <tbody>
        {locationResult}
      </tbody>
    </table>
  )
}

LocationList.propTypes = {
  locations: PropTypes.array,
  reload: PropTypes.func,
  currentEdit: PropTypes.object,
  setCurrentEdit: PropTypes.func,
}

export default LocationList
