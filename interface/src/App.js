import React, { Component } from 'react'
import Chatframe from '@cambriasolutions/chatframe'
import './App.css'

const dfWebhookOptions = {
  eventUrl: 'https://us-central1-mdhs-csa-dev.cloudfunctions.net/eventRequest',
  textUrl: 'https://us-central1-mdhs-csa-dev.cloudfunctions.net/textRequest',
}

const policyText =
  'Please do not enter any personally identifiable information such as SSN, Date of Birth or last name.'

class App extends Component {
  render() {
    return (
      <Chatframe
        primaryColor="#3bafbf"
        secondaryColor="#3bafbf"
        title="Gen"
        client="Dialogflow"
        clientOptions={dfWebhookOptions}
        fullscreen={false}
        initialActive={false}
        policyText={policyText}
      />
    )
  }
}

export default App
