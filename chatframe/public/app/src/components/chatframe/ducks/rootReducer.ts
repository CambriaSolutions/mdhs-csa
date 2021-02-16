import { combineReducers } from 'redux'
import config from '../reducers/configReducer'
import conversation from '../reducers/conversationReducer'
import buttonBar from '../reducers/buttonBarReducer'
import userInput from './userInputSlice'
import feedbackInput from '../reducers/feedbackInputReducer'
import error from '../reducers/errorReducer'

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
