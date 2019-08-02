import React, { Component } from 'react'
import Chatframe from '@cambriasolutions/chatframe'
import './App.css'
import Avatar from './images/genbot_avatar.svg'
const dfWebhookOptions = {
  eventUrl: 'https://us-central1-mdhs-csa-dev.cloudfunctions.net/eventRequest',
  textUrl: 'https://us-central1-mdhs-csa-dev.cloudfunctions.net/textRequest',
}

const policyText =
  'Please do not enter any personally identifiable information such as SSN or Date of Birth.'

const feedbackUrl =
  'https://us-central1-webchat-analytics.cloudfunctions.net/storeFeedback'

export const mapConfig = {
  googleMapsKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  centerCoordinates: {
    lat: 32.777025,
    lng: -89.543724,
  },
}

export const activationText = 'Talk to Gen'

class App extends Component {
  render() {
    return (
      <Chatframe
        avatar={Avatar}
        primaryColor='#6497AD'
        secondaryColor='#6497AD'
        headerColor='#6497AD'
        title='Gen'
        client='Dialogflow'
        clientOptions={dfWebhookOptions}
        fullscreen={false}
        initialActive={false}
        policyText={policyText}
        mapConfig={mapConfig}
        feedbackUrl={feedbackUrl}
        activationText={activationText}
      />
    )
  }
}

export default App
