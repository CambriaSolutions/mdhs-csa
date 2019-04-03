import React, { Component } from 'react'
import Chatframe from '@cambriasolutions/chatframe'
import './App.css'

const dfWebhookOptions = {
  eventUrl: 'https://us-central1-mdhs-csa-dev.cloudfunctions.net/eventRequest',
  textUrl: 'https://us-central1-mdhs-csa-dev.cloudfunctions.net/textRequest',
}

const policyText =
  'Please do not enter any personally identifiable information such as Social Security Number or Date of Birth.'

export const mapConfig = {
  googleMapsKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  centerCoordinates: {
    lat: 32.777025,
    lng: -89.543724,
  },
}

class App extends Component {
  render() {
    return (
      <Chatframe
        primaryColor='#6497ad'
        secondaryColor='#6497ad'
        title='Gen'
        client='Dialogflow'
        clientOptions={dfWebhookOptions}
        fullscreen={false}
        initialActive={false}
        policyText={policyText}
        mapConfig={mapConfig}
      />
    )
  }
}

export default App
