import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ButtonBarState {
    visible: boolean
    buttons: []
    paginationPage: number
}

const initialState = {
    visible: false,
    buttons: [],
    paginationPage: 1,
} as ButtonBarState

const buttonBarSlice = createSlice({
    name: 'buttonBar',
    initialState,
    reducers: {
        showButtonBar(state) {
            state.visible = true
        },
        hideButtonBar(state) {
            state.visible = false
        },
        changeSuggestionPage(state, action: PayloadAction<number>) {
            state.paginationPage = action.payload
        },
    },
    // extraReducers: {
    //     [initiateLoading]: (state ) => {
    //         state.paginationPage = 1
    //     },
    // }
})

export const {
    showButtonBar,
    hideButtonBar,
    changeSuggestionPage,
} = buttonBarSlice.actions

export default buttonBarSlice.reducer
