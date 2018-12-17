import React, { Component } from 'react'
import Chatframe from '@cambriasolutions/chatframe'
import './App.css'

const dfWebhookOptions = {
  eventUrl: 'https://us-central1-mdhs-csa.cloudfunctions.net/eventRequest',
  textUrl: 'https://us-central1-mdhs-csa.cloudfunctions.net/textRequest'
}

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
      />
    )
  }
}

export default App
