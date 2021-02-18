import get from 'lodash/get'
import { reportError } from '../reportError'
import { SET_CONVERSATION_STARTED } from './actionTypes'
import { createClient } from './client'
import {
    showWindow as openWindow,
    hideWindow,
    showFullscreen,
    showWindowed,
    setTitle,
    setPrivatePolicy,
    setActivationText,
    setFeedbackUrl,
    setReportErrorUrl,
    setGoogleMapsKey,
    setCenterCoordinates,
} from '../ducks/configSlice'

import { sendEvent } from './dialogflow'

export function showWindow() {
    return (dispatch, getState) => {
        const { conversationStarted } = getState().conversation
        dispatch(openWindow())
        if (!conversationStarted) {
            dispatch(sendEvent('Welcome'))
            dispatch({ type: SET_CONVERSATION_STARTED })
        }
    }
}

export function initialize(props) {
    return dispatch => {
        const {
            title,
            clientOptions,
            initialActive,
            fullscreen,
            policyText,
            mapConfig,
            activationText,
            feedbackUrl,
            reportErrorUrl,
        } = props

        dispatch(setTitle(title))
        createClient(clientOptions)

        if (policyText && policyText !== '') {
            dispatch(setPrivatePolicy(policyText))
        }

        if (activationText && activationText !== '') {
            dispatch(setActivationText(activationText))
        }

        if (feedbackUrl) {
            dispatch(setFeedbackUrl(feedbackUrl))
        }

        if (reportErrorUrl) {
            dispatch(setReportErrorUrl(reportErrorUrl))
        }

        if (mapConfig) {
            const { googleMapsKey, centerCoordinates } = mapConfig
            const latitude = get(centerCoordinates, 'lat', null)
            const longitude = get(centerCoordinates, 'lng', null)

            if (googleMapsKey && googleMapsKey !== '') {
                dispatch(setGoogleMapsKey(googleMapsKey))
            }
            if (centerCoordinates) {
                try {
                    if (
                        typeof centerCoordinates === 'object' &&
                        latitude !== null &&
                        longitude !== null
                    ) {
                        dispatch(setCenterCoordinates(centerCoordinates))
                    } else {
                        throw new Error(
                            'Please provide valid latitude and longitude coordinates, see README'
                        )
                    }
                } catch (error) {
                    reportError(error, reportErrorUrl).then()
                }
            }
        }

        if (initialActive === true) {
            dispatch({ type: SET_CONVERSATION_STARTED })
            dispatch(sendEvent('Welcome'))
            dispatch(showWindow())
        } else {
            dispatch(hideWindow())
        }

        if (fullscreen === true) {
            dispatch(showFullscreen())
        } else {
            dispatch(showWindowed())
        }
    }
}
