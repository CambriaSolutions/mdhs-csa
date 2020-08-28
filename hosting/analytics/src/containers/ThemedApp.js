import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from './Header'
import Dashboard from './Dashboard'

import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'

class ThemedApp extends Component {
  render() {
    const theme = {
      palette: {
        primary: { main: this.props.mainColor },
      },
      typography: {
        fontSize: 13,
      },
    }
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <MuiThemeProvider theme={createMuiTheme(theme)}>
          <div className='App'>
            <Header />
            <Dashboard />
          </div>
        </MuiThemeProvider>
      </MuiPickersUtilsProvider>
    )
  }
}

const mapStateToProps = state => {
  return {
    mainColor: state.filters.mainColor,
  }
}

export default connect(mapStateToProps)(ThemedApp)
