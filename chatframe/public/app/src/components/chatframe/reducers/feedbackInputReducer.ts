// import * as t from '../actions/actionTypes'

// const initialState = {
//     submitted: false,
//     wasHelpful: null,
//     feedbackList: null,
// }

// function feedbackInput(state = initialState, action) {
//     switch (action.type) {
//         case t.SAVE_FEEDBACK_INPUT:
//             return {
//                 ...state,
//                 feedbackList: state.feedbackList.map(item => {
//                     if (item.value === action.value.value) {
//                         return { ...item, checked: action.value.checked }
//                     }
//                     return item
//                 }),
//             }
//         case t.SET_FEEDBACK_OPTIONS:
//             return {
//                 ...state,
//                 wasHelpful: action.value.helpful,
//                 feedbackList: action.value.options.map(item => {
//                     return { ...item, checked: false }
//                 }),
//             }
//         case t.SET_FEEDBACK_SUBMITTED:
//             return { ...state, submitted: true }
//         default:
//             return state
//     }
// }

// export default feedbackInput

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FeedbackInputState {
    submitted: boolean
    wasHelpful: boolean | null
    feedbackList: { value: string; checked: boolean }[] | null
}

const initialState = {
    submitted: false,
    wasHelpful: null,
    feedbackList: null,
} as FeedbackInputState

const feedbackInputSlice = createSlice({
    name: 'userInput',
    initialState,
    reducers: {
        setFeedbackSubmitted: (state, action) => {
            state.submitted = true
        },
        setFeedbackOptions: (
            state,
            action: PayloadAction<{
                helpful: boolean
                options: { value: string; checked: boolean }[]
            }>
        ) => {
            state.wasHelpful = action.payload.helpful
            state.feedbackList = action.payload.options?.map(item => {
                return { ...item, checked: false }
            })
        },
        saveFeedbackInput: (
            state,
            action: PayloadAction<{ value: string; checked: boolean }>
        ) => {
            state.feedbackList?.map(item => {
                if (item.value === action.payload.value) {
                    return { ...item, checked: action.payload.checked }
                }
                return item
            })
        },
    },
})

export const { saveFeedbackInput } = feedbackInputSlice.actions

export default feedbackInputSlice.reducer
