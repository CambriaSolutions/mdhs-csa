import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserInputState {
    value: string
    charLength: number
    maxExceeded: boolean
}

const initialState = {
    value: '',
    charLength: 0,
    maxExceeded: false,
} as UserInputState

const userInputSlice = createSlice({
    name: 'userInput',
    initialState,
    reducers: {
        saveUserInput: (state, { payload: value }: PayloadAction<string>) => {
            return {
                value,
                charLength: value.length || 0,
                maxExceeded: value.length > 255,
            }
        },
    },
})

export const { saveUserInput } = userInputSlice.actions

export default userInputSlice.reducer
