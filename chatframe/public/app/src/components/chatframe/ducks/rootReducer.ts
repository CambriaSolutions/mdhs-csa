import { combineReducers } from 'redux'
import config from './configSlice'
import conversation from '../reducers/conversationReducer'
import buttonBar from './buttonBarSlice'
import userInput from './userInputSlice'
import feedbackInput from './feedbackInputSlice'
import error from './errorSlice'

const rootReducer = combineReducers({
    config,
    conversation,
    buttonBar,
    userInput,
    feedbackInput,
    error,
})
export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
