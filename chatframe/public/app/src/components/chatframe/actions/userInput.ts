import { sendQuickReply } from './conversation'
import { includes, map } from 'lodash'
import { saveUserInput } from '../ducks/userInputSlice'

function validateCharacterLimit(userInput) {
    if (userInput.length > 256) {
        return false
    }
    return true
}


export function submitUserInput() {
    return (dispatch, getState) => {
        const { userInput } = getState()
        const trimmedValue = userInput.value.trim()
        if (!trimmedValue || trimmedValue === '') {
            return
        }
        const validUserInput = validateCharacterLimit(userInput.value)
        if (validUserInput) {
            const suggestions = map(getState().conversation.suggestions, x =>
                x.toLowerCase()
            )
            const inputLowercase = userInput.value.toLowerCase()

            // If the input is 'go back', 'home', or 'start over' and those are suggestions to the user,
            // then we must treat the input as an event and not a regular text input
            const isEvent =
                (inputLowercase === 'go back' ||
                    inputLowercase === 'home' ||
                    inputLowercase === 'start over') &&
                includes(suggestions, inputLowercase)

            dispatch(sendQuickReply(userInput.value, isEvent))
            dispatch(saveUserInput(''))
        }
    }
}
