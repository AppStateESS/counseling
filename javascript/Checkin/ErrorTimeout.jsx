'use strict'
import React, {Component} from 'react'

export default class ErrorTimeout extends Component {
  constructor(props) {
    super(props)
    this.state = {error : false}
  }

  componentDidUpdate() {
    if (this.state.error === true) {
      this.interval = setTimeout(function () {
        this.resetForm()
      }.bind(this), 5000)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.interval)
  }

  resetForm() {
    clearTimeout(this.interval)
    this.setState({error: false})
  }

  render() {
    return (
      <div></div>
    )
  }
}

ErrorTimeout.propTypes = {}
