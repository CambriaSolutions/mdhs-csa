import { createSlice, PayloadAction } from '@reduxjs/toolkit'
type ErrorState = string
const initialState = '' as ErrorState

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<string>) => action.payload,
        clearError: state => initialState,
    },
})
export const { setError, clearError } = errorSlice.actions

export default errorSlice.reducer
