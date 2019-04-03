'use strict'
import React from 'react'
import PropTypes from 'prop-types'

const ButtonGroup = (props) => {
  const options = props.options.map(function (value, key) {
    return <ButtonGroupOption
      key={key}
      label={value.label}
      handleClick={value.handleClick}
      divider={value.divider}/>
  })

  return (
    <div className="dropdown">
      <button
        type="button"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        {props.label}
        <i className="fas fa-caret-down"></i>
      </button>
      <div className="dropdown-menu dropdown-menu-right">
        {options}
      </div>
    </div>
  )
}

ButtonGroup.propTypes = {
  options: PropTypes.array,
  label :PropTypes.func,
}

ButtonGroup.defaultProps = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.element]),
  options: [
    {
      label: 'Action1',
      handleClick: null,
      divider: false
    },
  ]
}

const ButtonGroupOption = (props) => {

  if (props.divider) {
    return (
      <span role="separator" className="divider"></span>
    )
  } else {
    return (
      
        <a onClick={props.handleClick} className="dropdown-item">{props.label}</a>
      
    )
  }
}

ButtonGroupOption.propTypes = {
  divider: PropTypes.bool,
  handleClick: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.element,])
}

export default ButtonGroup
