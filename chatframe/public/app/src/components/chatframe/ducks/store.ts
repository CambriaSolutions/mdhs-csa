import { configureStore } from '@reduxjs/toolkit'
import { createSelectorHook, useDispatch as useDiaper } from 'react-redux'
import rootReducer, { RootState } from './rootReducer'

const store = configureStore({
    reducer: rootReducer,
})

export type AppDispatch = typeof store.dispatch
export const useDispatch = () => useDiaper<AppDispatch>()
export const useSelector = createSelectorHook<RootState>()
