import { sendMessage } from './conversation'

export function sendFeedback(value) {
    return dispatch => {
        dispatch(sendMessage(value))
    }
}
