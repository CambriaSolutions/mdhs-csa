import * as actionTypes from '../actions/actionTypes'

import { subDays } from 'date-fns'

const initialState = {
  subjectMattersSettings: [],
  loading: false,
  downloadExportDate: subDays(new Date(), 1),
  showSettings: false,
  snackbarOpen: false,
  snackbarMessage: '',
  intentDetails: [],
  loadingIntentDetails: false,
  showIntentModal: false,
  updateRealtime: true,
}

const fetchSubjectMatterSettingsStart = (state) => {
  return { ...state, loading: true }
}

const fetchSubjectMatterSettingsSuccess = (state, action) => {
  return {
    ...state,
    subjectMattersSettings: action.subjectMattersSettings,
    loading: false,
  }
}

const fetchSubjectMatterSettingsFail = (state) => {
  return { ...state, loading: false }
}

const fetchIntentDetailsStart = (state) => {
  return { ...state, loadingIntentDetails: true }
}

const fetchIntentDetailsSuccess = (state, action) => {
  return {
    ...state,
    intentDetails: action.intentDetails,
    loadingIntentDetails: false,
  }
}

const fetchIntentDetailsFail = (state) => {
  return { ...state, loadingIntentDetails: false }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    // Metrics
    case actionTypes.FETCH_SUBJECT_MATTER_SETTINGS_START:
      return fetchSubjectMatterSettingsStart(state)
    case actionTypes.FETCH_SUBJECT_MATTER_SETTINGS_SUCCESS:
      return fetchSubjectMatterSettingsSuccess(state, action)
    case actionTypes.FETCH_SUBJECT_MATTER_SETTINGS_FAIL:
      return fetchSubjectMatterSettingsFail(state)
    // Intent Details
    case actionTypes.FETCH_INTENT_DETAILS_START:
      return fetchIntentDetailsStart(state)
    case actionTypes.FETCH_INTENT_DETAILS_SUCCESS:
      return fetchIntentDetailsSuccess(state, action)
    case actionTypes.FETCH_INTENT_DETAILS_FAIL:
      return fetchIntentDetailsFail(state)
    // Config settings
    case actionTypes.UPDATE_DEFAULT_SUBJECT_MATTER:
      return {
        ...state,
        defaultSubjectMatter: action.defaultSubjectMatter
      }
    case actionTypes.UPDATE_EXPORT_DATE:
      return {
        ...state,
        downloadExportDate: action.downloadExportDate,
      }
    case actionTypes.TOGGLE_SETTINGS:
      return {
        ...state,
        showSettings: action.showSettings,
      }
    case actionTypes.TOGGLE_INTENT_MODAL:
      return {
        ...state,
        showIntentModal: action.showIntentModal,
      }
    case actionTypes.TOGGLE_CONFIG_LOADING:
      return {
        ...state,
        loading: action.loading,
      }
    case actionTypes.CLOSE_SNACKBAR:
      return {
        ...state,
        snackbarOpen: false,
      }
    case actionTypes.SHOW_SNACKBAR:
      return {
        ...state,
        snackbarOpen: true,
        snackbarMessage: action.message,
      }
    default:
      return state
  }
}

export default reducer
