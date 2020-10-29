import { format } from 'date-fns'
import {
  SAVE_USER_RESPONSE,
  DISPLAY_ERROR,
  HIDE_BUTTON_BAR,
} from './actionTypes'
import { setupDialogflow, sendMessageWithDialogflow } from './dialogflow'
// Date Format
import { sysTimeFormat } from '../config/dateFormats'

export function setupClient(client, clientOptions) {
  return dispatch => {
    try {
      if (!client) {
        throw new Error('No conversation provider selected.')
      }
      // Setup Dialogflow
      if (client.toLowerCase() === 'dialogflow') {
        dispatch(setupDialogflow(clientOptions))
      } else {
        // Unrecognized client
        dispatch({
          type: DISPLAY_ERROR,
          error: `Unable to connect to ${client}`,
        })
        throw new Error(`${client} is not a recognized conversation provider.`)
      }
    } catch (error) {
      // TODO: log error to analytics
      console.log(error)
    }
  }
}
export function sendMessage(message) {
  return (dispatch, getState) => {
    const { clientName } = getState().conversation
    try {
      if (clientName.toLowerCase() === 'dialogflow') {
        dispatch(sendMessageWithDialogflow(message))
      } else {
        throw new Error(
          `${clientName} is not a recognized conversation provider.`
        )
      }
    } catch (error) {
      // TODO: log error to analytics
      console.log(error)
      // Unrecognized client
      dispatch({
        type: DISPLAY_ERROR,
        error: `Unable to connect to ${clientName}`,
      })
    }
  }
}

export function createUserResponse(text) {
  return (dispatch, getState) => {
    const numMessages = getState().conversation.messages.length
    const systemTime = format(new Date(), sysTimeFormat)
    const response = {
      entity: 'user',
      messageId: `usermessage-${numMessages}`,
      systemTime,
      text,
    }
    dispatch({ type: SAVE_USER_RESPONSE, response })
    dispatch({ type: HIDE_BUTTON_BAR })
    dispatch(sendMessage(text))
  }
}

export function sendQuickReply(text) {
  return dispatch => {
    dispatch(createUserResponse(text))
  }
}
