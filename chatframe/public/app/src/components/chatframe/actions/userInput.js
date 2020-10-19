import { SAVE_USER_INPUT } from './actionTypes'
import { createUserResponse } from './conversation'

function validateCharacterLimit(userInput) {
  if (userInput.length > 256) {
    return false
  }
  return true
}

export function saveUserInput(value) {
  const userInput = {
    value,
    charLength: value.length || 0,
    maxExceeded: value.length > 255,
  }
  return { type: SAVE_USER_INPUT, userInput }
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
      dispatch(createUserResponse(userInput.value))
      dispatch(saveUserInput(''))
    }
  }
}
