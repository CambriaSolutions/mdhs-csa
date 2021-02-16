import React, { FC } from 'react'
import Chatframe from './components/chatframe'

interface WebHookOptions {
    eventUrl: string
    textUrl: string
}

interface MapConfig {
    googleMapsKey: string
    centerCoordinates: {
        lat: number
        lng: number
    }
}

const dfWebhookOptions: WebHookOptions = {
    eventUrl: process.env.REACT_APP_EVENT_URL,
    textUrl: process.env.REACT_APP_TEXT_URL,
}

const policyText =
    'Please do not enter any personally identifiable information such as SSN or Date of Birth'

const feedbackUrl = process.env.REACT_APP_FEEDBACK_URL
const reportErrorUrl = process.env.REACT_APP_REPORT_ERROR_URL

export const mapConfig: MapConfig = {
    googleMapsKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
    centerCoordinates: {
        lat: 32.777025,
        lng: -89.543724,
    },
}

export const activationText = 'Talk to Gen'

const App: FC = () => {
    return (
        <Chatframe
            primaryColor='#9999AD'
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
            reportErrorUrl={reportErrorUrl}
            activationText={activationText}
        />
    )
}

export default App
