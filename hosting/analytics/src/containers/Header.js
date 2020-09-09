import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  updateSubjectMatter,
  updateEngagedUserToggle,
} from '../store/actions/filterActions'
import { toggleSettings } from '../store/actions/configActions'
import styled from 'styled-components'

// Material UI
import Hidden from '@material-ui/core/Hidden'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'
import IconButton from '@material-ui/core/IconButton'
import MenuItem from '@material-ui/core/MenuItem'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

// Icons
import InsertChartOutlined from '@material-ui/icons/InsertChartOutlined'
import SettingsIcon from '@material-ui/icons/Settings'

// Date Filter
import DateFilter from '../components/DateFilter'

import { filter } from 'lodash'

const ToolbarTitle = styled(Typography)`
  flex-grow: 1;
  margin-left: 10px !important;
`
const FilterTitle = styled(Typography)`
  padding-bottom: 2px;
`

const Dropdown = styled(Select)`
  color: #fff !important;
  margin-left: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.42) !important;
  &:after {
    border-bottom: 2px solid #fff !important;
  }
  svg {
    color: #fff;
  }
`

const CustomMenuItem = styled(MenuItem)`
  && {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
    padding-bottom: 0px;
  }
`

// Regex to retrieve text after last "/" on a context
const getSubjectMatterFromContext = context => /[^/]*$/.exec(context)[0]

class Header extends Component {
  render() {
    let subjectMatterDropdown = ''

    if (this.props.subjectMattersSettings.length > 1) {
      subjectMatterDropdown = (
        <Hidden xsDown>
          <Dropdown
            value={this.props.subjectMatterName}
            onChange={event => this.props.onSubjectMatterChange(event.target.value, this.props.subjectMattersSettings)}
            name='subjectMatter'
          >
            {filter(this.props.subjectMattersSettings, x => x.name.toLowerCase() !== 'general' && x.name.toLowerCase() !== 'total').map(subjectMatter =>
              (
                <MenuItem value={subjectMatter.name} key={subjectMatter.name}>
                  {subjectMatter.name}
                </MenuItem>
              )
            )}
            <MenuItem value='general' key='general'>
              general
            </MenuItem>
            <CustomMenuItem value={'total'}>Total</CustomMenuItem>
          </Dropdown>
        </Hidden>
      )
    }

    return (
      <AppBar position='static' color='primary'>
        <Toolbar>
          <InsertChartOutlined />
          {subjectMatterDropdown}
          <ToolbarTitle variant='h5' color='inherit'>
            Analytics
          </ToolbarTitle>
          <Hidden xsDown>
            <FilterTitle variant='subtitle1' color='inherit'>
              Filter Date
            </FilterTitle>
          </Hidden>
          <DateFilter />
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={this.props.showEngagedUser}
                  onChange={event =>
                    this.props.onEngagedUserToggle(!this.props.showEngagedUser)
                  }
                />
              }
              labelPlacement='start'
              label='Engaged Users'
            />
          </FormGroup>
          <IconButton
            color='inherit'
            onClick={() => this.props.onSettingsToggle(true)}
            aria-label='Open settings'
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    )
  }
}

const mapStateToProps = state => {
  return {
    filterLabel: state.filters.filterLabel,
    showEngagedUser: state.filters.showEngagedUser,
    mainColor: state.filters.mainColor,
    subjectMattersSettings: state.config.subjectMattersSettings,
    subjectMatterName: getSubjectMatterFromContext(state.filters.context),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSubjectMatterChange: (newSubjectMatter, subjectMattersSettings) => dispatch(updateSubjectMatter(newSubjectMatter, subjectMattersSettings)),
    onEngagedUserToggle: showEngagedUser =>
      dispatch(updateEngagedUserToggle(showEngagedUser)),
    onSettingsToggle: showSettings => dispatch(toggleSettings(showSettings)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
