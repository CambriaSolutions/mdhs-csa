import get from 'lodash/get'
import {
  parse,
  format,
  differenceInMinutes,
  differenceInSeconds,
} from 'date-fns'
import {
  SET_TITLE,
  SET_AVATAR,
  TIMER_START,
  UPDATE_CURRENT_TIME,
  SHOW_WINDOW,
  HIDE_WINDOW,
  FULLSCREEN,
  WINDOWED,
  SET_CONVERSATION_STARTED,
  SHOW_PRIVACY_POLICY,
  HIDE_PRIVACY_POLICY,
  SET_PRIVACY_POLICY,
  SET_GOOGLE_MAPS_KEY,
  SET_CENTER_COORDINATES,
  SET_ACTIVATION_TEXT,
  SET_FEEDBACK_URL,
} from './actionTypes'

import { sysTimeFormat } from '../config/dateFormats'
import { setupClient } from './conversation'
import { sendEvent } from './dialogflow'
import genbotAvatar from '../genbot_avatar.svg'

export function showWindow() {
  return (dispatch, getState) => {
    const { conversationStarted } = getState().conversation
    dispatch({ type: SHOW_WINDOW })
    if (!conversationStarted) {
      dispatch(sendEvent('Welcome'))
      dispatch({ type: SET_CONVERSATION_STARTED })
    }
  }
}
export function showPrivacyPolicy() {
  return { type: SHOW_PRIVACY_POLICY }
}
export function hidePrivacyPolicy() {
  return { type: HIDE_PRIVACY_POLICY }
}
export function hideWindow() {
  return { type: HIDE_WINDOW }
}
export function showFullscreen() {
  return { type: FULLSCREEN }
}
export function showWindowed() {
  return { type: WINDOWED }
}

function updateIdleTime() {
  return (dispatch, getState) => {
    const { lastUpdateTime } = getState().conversation
    const now = new Date()
    const lastUpdate = parse(
      lastUpdateTime,
      sysTimeFormat,
      new Date(lastUpdateTime)
    )
    const diffMinutes = differenceInMinutes(now, lastUpdate)
    const diffSeconds = differenceInSeconds(now, lastUpdate)
    let headerTime = 'Now'
    if (diffMinutes >= 1) {
      headerTime = `${diffMinutes} min ago`
    } else if (diffSeconds >= 9) {
      headerTime = `${diffSeconds} sec ago`
    }

    const currentTime = format(now, sysTimeFormat)

    dispatch({ type: UPDATE_CURRENT_TIME, headerTime, currentTime })
  }
}

export function startTimer() {
  return (dispatch, getState) => {
    const { timer } = getState().conversation
    // If there's an existing timer, clear it
    if (timer) {
      clearInterval(timer)
    }
    // Create a new timer to tick every 10 seconds
    const newTimer = setInterval(() => dispatch(updateIdleTime()), 1000 * 10)
    // Save the new timer
    dispatch({ type: TIMER_START, newTimer })
    // Dispatch the first tick
    dispatch(updateIdleTime())
  }
}

export function initialize(props) {
  return dispatch => {
    const {
      title,
      avatar,
      client,
      clientOptions,
      initialActive,
      fullscreen,
      policyText,
      mapConfig,
      activationText,
      feedbackUrl,
    } = props
    let userAvatar = avatar
    if (!userAvatar) {
      userAvatar = genbotAvatar
    }
    dispatch({ type: SET_TITLE, title })
    dispatch({ type: SET_AVATAR, avatar: userAvatar })
    dispatch(setupClient(client, clientOptions))
    dispatch(startTimer())

    if (policyText && policyText !== '') {
      dispatch({ type: SET_PRIVACY_POLICY, policyText })
    }

    if (activationText && activationText !== '') {
      dispatch({ type: SET_ACTIVATION_TEXT, activationText })
    }

    if (feedbackUrl) {
      dispatch({ type: SET_FEEDBACK_URL, feedbackUrl })
    }

    if (mapConfig) {
      const { googleMapsKey, centerCoordinates } = mapConfig
      const latitude = get(centerCoordinates, 'lat', null)
      const longitude = get(centerCoordinates, 'lng', null)

      if (googleMapsKey && googleMapsKey !== '') {
        dispatch({ type: SET_GOOGLE_MAPS_KEY, googleMapsKey })
      }
      if (centerCoordinates) {
        try {
          if (
            typeof centerCoordinates === 'object' &&
            latitude !== null &&
            longitude !== null
          ) {
            dispatch({ type: SET_CENTER_COORDINATES, centerCoordinates })
          } else {
            throw new Error(
              'Please provide valid latitude and longitude coordinates, see README'
            )
          }
        } catch (error) {
          // TODO: log error to analytics
          console.log(error)
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
