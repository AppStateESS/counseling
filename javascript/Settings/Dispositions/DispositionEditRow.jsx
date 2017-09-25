'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import DispositionForm from './DispositionForm'

/* global $ */

export default class DispositionEditRow extends Component {
  componentDidMount() {
    $('.form-anchor')[0].scrollIntoView({behavior: 'smooth'})
  }

  render() {
    return (
      <tr>
        <td colSpan="2">
          <div className="form-anchor"></div>
          <div className="active-form">
            <DispositionForm
              closeForm={this.props.cancel}
              reload={this.props.reload}
              fail={this.props.fail}
              title={this.props.title}
              icon={this.props.icon}
              color={this.props.color}
              dispositionId={this.props.id}/>
          </div>
        </td>
      </tr>
    )
  }
}

DispositionEditRow.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.string,
  cancel: PropTypes.func,
  reload: PropTypes.func,
  fail: PropTypes.func,
  id: PropTypes.string
}
