import { format } from 'date-fns'
import { reportError } from '../reportError'
import { SAVE_USER_RESPONSE } from './actionTypes'
import { sendMessageWithDialogflow, sendEvent } from './dialogflow'
// Date Format
import { sysTimeFormat } from '../config/dateFormats'
import { clientName } from './client'
import { setError } from '../ducks/errorSlice'
import { hideButtonBar } from '../ducks/buttonBarSlice'

export function sendMessage(message, isEvent = false) {
    return (dispatch, getState) => {
        try {
            if (clientName.toLowerCase() === 'dialogflow') {
                dispatch(
                    isEvent
                        ? sendEvent(message.replace(' ', '-'))
                        : sendMessageWithDialogflow(message)
                )
            } else {
                throw new Error(
                    `${clientName} is not a recognized conversation provider.`
                )
            }
        } catch (error) {
            reportError(error, getState().config.reportErrorUrl).then()

            // Unrecognized client
            dispatch(setError(`Unable to connect to ${clientName}`))
        }
    }
}

export function sendQuickReply(text, isEvent = false) {
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
        dispatch(hideButtonBar())
        dispatch(sendMessage(text, isEvent))
    }
}
