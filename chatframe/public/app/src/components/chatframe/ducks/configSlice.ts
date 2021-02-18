import { createSlice, PayloadAction } from '@reduxjs/toolkit'
interface Coordinates {
    latitude: number | undefined
    longitude: number | undefined
}

interface ConfigState {
    title: string
    windowVisible: boolean
    fullscreen: boolean
    privacyPolicyVisible: boolean
    googleMapsKey: string
    centerCoordinates: Coordinates
    activationText: string
    privacyPolicy: string
    feedbackUrl: string
    reportErrorUrl: string
}
const initialState = {
    title: 'Chat Window',
    windowVisible: false,
    fullscreen: false,
    privacyPolicyVisible: false,
    googleMapsKey: '',
    centerCoordinates: {},
    activationText: '',
    privacyPolicy:
        'Please do not enter any personally identifiable information such as SSN, Date of Birth, Case Number or last name.',
    feedbackUrl: '',
    reportErrorUrl: '',
} as ConfigState

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        hidePrivacyPolicy(state) {
            state.privacyPolicyVisible = false
        },
        showPrivacyPolicy(state) {
            state.privacyPolicyVisible = true
        },
        showWindow: state => {
            state.windowVisible = true
        },
        hideWindow: state => {
            state.windowVisible = false
        },
        showFullscreen: state => {
            state.fullscreen = true
        },
        showWindowed: state => {
            state.fullscreen = false
        },
        setPrivatePolicy: (state, action: PayloadAction<string>) => {
            state.privacyPolicy = action.payload
        },
        setGoogleMapsKey: (state, action: PayloadAction<string>) => {
            state.googleMapsKey = action.payload
        },
        setCenterCoordinates: (state, action: PayloadAction<Coordinates>) => {
            state.centerCoordinates = action.payload
        },
        setActivationText: (state, action: PayloadAction<string>) => {
            state.activationText = action.payload
        },
        setTitle: (state, action: PayloadAction<string>) => {
            state.title = action.payload
        },
        setFeedbackUrl: (state, action: PayloadAction<string>) => {
            state.feedbackUrl = action.payload
        },
        setReportErrorUrl: (state, action: PayloadAction<string>) => {
            state.reportErrorUrl = action.payload
        },
    },
})

export const {
    hidePrivacyPolicy,
    showPrivacyPolicy,
    showWindow,
    hideWindow,
    showFullscreen,
    showWindowed,
    setPrivatePolicy,
    setGoogleMapsKey,
    setCenterCoordinates,
    setActivationText,
    setTitle,
    setFeedbackUrl,
    setReportErrorUrl,
} = configSlice.actions

export default configSlice.reducer
