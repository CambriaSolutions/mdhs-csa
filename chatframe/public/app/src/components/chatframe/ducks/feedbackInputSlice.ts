import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FeedbackInputState {
    wasHelpful: boolean | null
    feedbackList: { value: string; checked: boolean }[] | null
}

const initialState = {
    wasHelpful: null,
    feedbackList: null,
} as FeedbackInputState

const feedbackInputSlice = createSlice({
    name: 'feedbackInput',
    initialState,
    reducers: {
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
            state.feedbackList = state.feedbackList?.map(item => {
                if (item.value === action.payload.value) {
                    return { ...item, checked: action.payload.checked }
                }
                return item
            })
        },
    },
})

export const {
    saveFeedbackInput,
    setFeedbackOptions,
} = feedbackInputSlice.actions

export default feedbackInputSlice.reducer
