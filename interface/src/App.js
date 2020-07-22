import React, { Component } from 'react'
import Chatframe from '@cambriasolutions/chatframe'
import './App.css'

const options = {
  eventUrl: process.env.REACT_APP_EVENT_URL,
  textUrl: process.env.REACT_APP_TEXT_URL
}

const feedbackUrl = process.env.REACT_APP_FEEDBACK_URL

const privacyPolicy =
  'Please do not enter any personally identifiable information such as SSN or Date of Birth'

const mapConfig = {
  googleMapsKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  centerCoordinates: {
    lat: 32.777025,
    lng: -89.543724,
  },
}

const activationText = 'Talk to Gen'

class App extends Component {
  render() {
    console.log('Process.env', process.env)

    return (
      <Chatframe
        primaryColor='#6497AD'
        secondaryColor='#6497AD'
        headerColor='#6497AD'
        title='Gen (TEST CHAT)'
        client='Dialogflow'
        clientOptions={options}
        fullscreen={false}
        initialActive={false}
        policyText={privacyPolicy}
        mapConfig={mapConfig}
        activationText={activationText}
        feedbackUrl={feedbackUrl}
      />
    )
  }
}

export default App
