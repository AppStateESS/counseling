'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'

/* global $, categoryIcons */

class CategoryIcon extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tooltip: true
    }
  }

  componentDidMount() {
    if (this.state.tooltip) {
      $('i.category').tooltip({animation: true, placement: 'right'})
      this.setState({tooltip: false})
    }
  }

  render() {
    var icon = null
    var _className = 'category fa fa-lg ' + categoryIcons[this.props.category]
    icon = <i className={_className} data-toggle="tooltip" title={this.props.reasonTitle}></i>
    return (
      <div>{icon}</div>
    )
  }
}

CategoryIcon.propTypes = {
  reasonTitle : PropTypes.string,
  category: PropTypes.string,
}

export default CategoryIcon
