'use strict'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Clinicians from './Clinicians'
import Dispositions from './Dispositions'
import Reasons from './Reasons'

export default class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tab: 'Dispositions'
    }
  }

  selectTab(tab) {
    this.setState({tab: tab})
  }

  render() {
    return (
      <div className="settingsDashboard">
        <h2>Counseling Check-In Settings</h2>
        <ul className="nav nav-tabs">
          <Tab
            active={this.state.tab == 'Clinicians'}
            label={'Clinicians'}
            handleClick={this.selectTab.bind(this, 'Clinicians')}/>
          <Tab
            active={this.state.tab == 'Reasons'}
            label={'Reasons'}
            handleClick={this.selectTab.bind(this, 'Reasons')}/>
          <Tab
            active={this.state.tab == 'Dispositions'}
            label={'Dispositions'}
            handleClick={this.selectTab.bind(this, 'Dispositions')}/>
        </ul>
        <div style={{
          marginTop: '1em'
        }}>
          <Content tab={this.state.tab}/>
        </div>
      </div>
    )
  }
}

const Tab = ({active, label, handleClick,}) => {
  return (
    <li
      role="presentation"
      onClick={handleClick}
      className={active
      ? 'active'
      : null}>
      <a className="pointer">{label}</a>
    </li>
  )
}

Tab.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.string,
  handleClick: PropTypes.func,
}

const Content = ({tab}) => {

  var content = null
  switch (tab) {
    case 'Clinicians':
      content = <Clinicians/>
      break

    case 'Reasons':
      content = <Reasons/>
      break

    case 'Dispositions':
      content = <Dispositions/>
      break
  }

  return (
    <div>{content}</div>
  )
}

Content.propTypes = {
  tab: PropTypes.string
}

const BoolIcon = ({bool, handleClick}) => {

  let _className = bool === '1'
    ? 'fa fa-thumbs-o-up text-success'
    : 'fa fa-thumbs-o-down text-danger'

  if (handleClick !== null) {
    _className += ' pointer'
  }

  return (
    <i className={_className} onClick={this.props.handleClick}></i>
  )
}

BoolIcon.propTypes = {
  bool: PropTypes.bool,
  handleClick: PropTypes.func,
}
