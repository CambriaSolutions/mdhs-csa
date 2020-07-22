import React, { Component } from 'react'
import Chatframe from '@cambriasolutions/chatframe'
import './App.css'

class App extends Component {
  options = {
    eventUrl: process.env.REACT_APP_EVENT_URL,
    textUrl: process.env.REACT_APP_TEXT_URL
  }

  feedbackUrl = process.env.REACT_APP_FEEDBACK_URL

  privacyPolicy =
    'Please do not enter any personally identifiable information such as SSN or Date of Birth'

  mapConfig = {
    googleMapsKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    centerCoordinates: {
      lat: 32.777025,
      lng: -89.543724,
    },
  }

  activationText = 'Talk to Gen'

  render() {
    console.log('Process.env', process.env)

    return (
      <Chatframe
        primaryColor='#6497AD'
        secondaryColor='#6497AD'
        headerColor='#6497AD'
        title='Gen (TEST CHAT)'
        client='Dialogflow'
        clientOptions={this.options}
        fullscreen={false}
        initialActive={false}
        policyText={this.privacyPolicy}
        mapConfig={this.mapConfig}
        activationText={this.activationText}
        feedbackUrl={this.feedbackUrl}
      />
    )
  }
}

export default App
