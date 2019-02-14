import React, { Component } from 'react'
import Chatframe from '@cambriasolutions/chatframe'
import './App.css'

const dfWebhookOptions = {
  eventUrl: 'https://us-central1-mdhs-csa-dev.cloudfunctions.net/eventRequest',
  textUrl: 'https://us-central1-mdhs-csa-dev.cloudfunctions.net/textRequest',
}

const policyText =
  'Please do not enter any personally identifiable information such as SSN, Date of Birth or last name.'

const googleMapsKey = process.env.REACT_APP_GOOGLE_MAPS_KEY

const centerCoordinates = {
  lat: 32.777025,
  lng: -89.543724,
}

class App extends Component {
  render() {
    console.log(process.env)
    return (
      <Chatframe
        primaryColor='#3bafbf'
        secondaryColor='#3bafbf'
        title='Gen'
        client='Dialogflow'
        clientOptions={dfWebhookOptions}
        fullscreen={false}
        initialActive={false}
        policyText={policyText}
        googleMapsKey={googleMapsKey}
        centerCoordinates={centerCoordinates}
      />
    )
  }
}

export default App
