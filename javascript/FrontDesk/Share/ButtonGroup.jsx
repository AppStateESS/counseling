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
    <div className="btn-group">
      <button
        type="button"
        className="btn btn-default btn-sm dropdown-toggle"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false">
        {props.label}
        <span className="caret"></span>
      </button>
      <ul className="dropdown-menu dropdown-menu-right">
        {options}
      </ul>
    </div>
  )
}

ButtonGroup.propTypes = {
  options: PropTypes.array,
  label :PropTypes.func,
}

ButtonGroup.defaultProps = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object,]),
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
      <li role="separator" className="divider"></li>
    )
  } else {
    return (
      <li onClick={props.handleClick}>
        <a className="pointer">{props.label}</a>
      </li>
    )
  }
}

ButtonGroupOption.propTypes = {
  divider: PropTypes.bool,
  handleClick: PropTypes.func,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object,]),
}

export default ButtonGroup
