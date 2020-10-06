import * as actionTypes from '../actions/actionTypes'
import db from '../../Firebase'
import { updateSubjectMatter } from './filterActions'
import { completeSignIn } from './authActions'
import { format } from 'date-fns'
import timezones from '../../common/timezones'

// ------------------------------------------------------------------------
// ------------------------ S M  S E T T I N G S --------------------------
// ------------------------------------------------------------------------

export const fetchSubjectMatterSettings = user => {
  return (dispatch) => {
    const userRef = db.collection(`users`).doc(user.uid)

    dispatch(fetchSubjectMatterSettingsStart())

    userRef
      .get()
      .then(doc => {
        if (doc.exists) {
          const userData = doc.data()
          user.isAdmin = userData.admin && userData.admin === true
          user.defaultSubjectMatter = userData.defaultSubjectMatter
          user.dataExport = user.isAdmin
            ? true
            : userData.dataExport
              ? userData.dataExport
              : false

          const settingsRef = db.collection(`settings`)

          dispatch(fetchSubjectMatterSettingsStart())

          settingsRef
            .get()
            .then(querySnapshot => {
              let fetchedSubjectMattersSettings = []
              querySnapshot.forEach(doc => {
                // If user is admin add all the subject matters
                const subjectMatterSettingsData = doc.data()

                if (
                  user.isAdmin ||
                  userData.subjectMatters.includes(subjectMatterSettingsData.name)
                ) {
                  fetchedSubjectMattersSettings.push(subjectMatterSettingsData)
                }
              })

              // Update subject matter settings
              if (fetchedSubjectMattersSettings.length > 0) {
                const defaultSubjectMatterSettings = fetchedSubjectMattersSettings.filter(
                  p => p.name === user.defaultSubjectMatter
                )[0]

                dispatch({
                  type: actionTypes.UPDATE_DEFAULT_SUBJECT_MATTER,
                  defaultSubjectMatter: defaultSubjectMatterSettings.name,
                })

                dispatch(updateSubjectMatter(defaultSubjectMatterSettings.name, fetchedSubjectMattersSettings))
              }

              dispatch(fetchSubjectMatterSettingsSuccess(fetchedSubjectMattersSettings, user))
            })
            .catch(err => {
              dispatch(fetchSubjectMatterSettingsFail(err))
            })
        } else {
          dispatch(fetchSubjectMatterSettingsFail('User not found'))
        }
      })
      .catch(err => {
        dispatch(fetchSubjectMatterSettingsFail(err))
      })
  }
}

export const fetchSubjectMatterSettingsSuccess = (fetchedSubjectMattersSettings, user) => {
  return dispatch => {
    dispatch({
      type: actionTypes.FETCH_SUBJECT_MATTER_SETTINGS_SUCCESS,
      subjectMattersSettings: fetchedSubjectMattersSettings
    })
    dispatch(completeSignIn(user))
  }
}

export const fetchSubjectMatterSettingsFail = error => {
  console.log(error)
  return {
    type: actionTypes.FETCH_SUBJECT_MATTER_SETTINGS_FAIL,
    error: error,
  }
}

export const fetchSubjectMatterSettingsStart = () => {
  return {
    type: actionTypes.FETCH_SUBJECT_MATTER_SETTINGS_START,
  }
}

// ------------------------------------------------------------------------
// --------------------- I N T E N T  D E T A I L S -----------------------
// ------------------------------------------------------------------------

// Regex to retrieve text after last "/" on a path
const getIdFromPath = path => /[^/]*$/.exec(path)[0]

// pagination = null, 'next' or 'previous'
export const showIntentDetails = (intent, pagination, paginationPage) => {
  return async (dispatch, getState) => {
    try {
      const context = getState().filters.context
      const dateRange = getState().filters.dateFilters

      dispatch(fetchIntentDetailsStart())

      const previousFirstDocumentSnapshot = getState().config.firstDocumentSnapshot
      const previousLastDocumentSnapshot = getState().config.lastDocumentSnapshot

      let snapshot = db.collection(`${context}/requests`)
        .where('createdAt', '>', new Date(dateRange.start))
        .where('createdAt', '<', new Date(dateRange.end))
        .where('intentId', '==', intent.id)

      const totalIntentDetailCountPromise = snapshot.get()

      const queryLimit = 4

      if (previousLastDocumentSnapshot && pagination === 'next') {
        snapshot = snapshot.orderBy('createdAt', 'desc').startAfter(previousLastDocumentSnapshot).limit(queryLimit)
      } else if (previousLastDocumentSnapshot && pagination === 'previous') {
        snapshot = snapshot
          .orderBy('createdAt', 'asc')
          .startAfter(previousFirstDocumentSnapshot)
          .limit(queryLimit)
      } else {
        snapshot = snapshot.orderBy('createdAt', 'desc').limit(queryLimit)
      }

      const snapshotPromise = snapshot.get()

      const snapshotPromiseResponse = await snapshotPromise

      let intentDetails = []
      let newFirstDocumentSnapshot = null
      let newLastDocumentSnapshot = null

      let index = 0

      snapshotPromiseResponse.forEach((doc) => {
        let tempData = doc.data()

        if (index === 0) {
          newFirstDocumentSnapshot = doc
        } else if (index === queryLimit - 1) {
          newLastDocumentSnapshot = doc
        }

        index++

        const newIntentDetails = {
          createdAt: tempData.createdAt.toDate(),
          intentId: intent.id,
          intentName: tempData.queryResult.intent.displayName,
          intentDetectionConfidence:
            tempData.queryResult.intentDetectionConfidence,
          messageText: tempData.queryResult.queryText,
          outputContexts: tempData.queryResult.outputContexts
            ? tempData.queryResult.outputContexts.map(o => ({
              ...o,
              context: getIdFromPath(o.name),
            }))
            : [],
          conversationId: getIdFromPath(tempData.session),
          botResponse: tempData.queryResult.fulfillmentText,
        }

        // Insert in reverse order
        if (previousLastDocumentSnapshot && pagination === 'previous') {
          intentDetails = [newIntentDetails, ...intentDetails]
        } else {
          intentDetails.push(newIntentDetails)
        }
      })

      const totalIntentDetailCountPromiseResponse = await totalIntentDetailCountPromise

      const totalIntentDetailsCount = totalIntentDetailCountPromiseResponse.size

      dispatch(
        fetchIntentDetailsSuccess(
          intent,
          intentDetails,
          newFirstDocumentSnapshot,
          newLastDocumentSnapshot,
          totalIntentDetailsCount,
          paginationPage
        ))

      dispatch(toggleIntentsModal(true))
    }
    catch (e) {
      dispatch(fetchIntentDetailsFail(e))
    }
  }
}

export const fetchIntentDetailsSuccess = (intent, intentDetails, firstDocumentSnapshot, lastDocumentSnapshot, totalIntentDetailsCount, paginationPage) => {
  return {
    type: actionTypes.FETCH_INTENT_DETAILS_SUCCESS,
    intentDetailsIntent: intent,
    intentDetails,
    firstDocumentSnapshot,
    lastDocumentSnapshot,
    totalIntentDetailsCount,
    intentDetailsPaginationPage: paginationPage
  }
}

export const fetchIntentDetailsFail = error => {
  console.log(error)
  return {
    type: actionTypes.FETCH_INTENT_DETAILS_FAIL,
    error: error,
  }
}

export const fetchIntentDetailsStart = () => {
  return {
    type: actionTypes.FETCH_INTENT_DETAILS_START,
  }
}

// ------------------------------------------------------------------------
// -------------------------- S E T T I N G S -----------------------------
// ------------------------------------------------------------------------

export const toggleSettings = showSettings => {
  return {
    type: actionTypes.TOGGLE_SETTINGS,
    showSettings: showSettings,
  }
}

export const toggleConfigLoading = loading => {
  return {
    type: actionTypes.TOGGLE_CONFIG_LOADING,
    loading: loading,
  }
}

export const toggleIntentsModal = option => {
  return {
    type: actionTypes.TOGGLE_INTENT_MODAL,
    showIntentModal: option,
  }
}

export const updateExportDate = newDate => {
  return {
    type: actionTypes.UPDATE_EXPORT_DATE,
    downloadExportDate: newDate,
  }
}

export const updateDefaultSubjectMatter = subjectMatter => {
  return (dispatch, getState) => {
    // Get subject matter settings based on the given context
    const user = getState().auth.user
    if (user) {
      const userRef = db.collection(`users`).doc(user.uid)
      userRef.update({ defaultSubjectMatter: subjectMatter }).then(() => {
        dispatch({
          type: actionTypes.UPDATE_DEFAULT_SUBJECT_MATTER,
          defaultSubjectMatter: subjectMatter,
        })
        dispatch(showSnackbar(`Default subject matter updated successfully`))
      })
    }
  }
}

export const updateSubjectMatterColor = newColor => {
  return (dispatch, getState) => {
    let subjectMatterName = getState().filters.context
    let subjectMattersSettings = getState().config.subjectMattersSettings

    if (subjectMatterName.length > 0) {
      subjectMatterName = subjectMatterName.replace('subjectMatters/', '')
      const settingsRef = db.collection(`settings`).doc(subjectMatterName)
      settingsRef.update({ primaryColor: newColor }).then(() => {
        dispatch(showSnackbar(`Subject matter primary color updated successfully`))
      })

      // Update subject matters object with new primary color
      let currSubjectMatter = subjectMattersSettings.filter(p => p.name === subjectMatterName)[0]
      currSubjectMatter.primaryColor = newColor
      dispatch({
        type: actionTypes.FETCH_SUBJECT_MATTER_SETTINGS_SUCCESS,
        subjectMattersSettings: subjectMattersSettings,
      })
    }
  }
}

export const updateSubjectMatterTimezone = newTimezone => {
  return (dispatch, getState) => {
    let subjectMatterName = getState().filters.context
    let subjectMattersSettings = getState().config.subjectMattersSettings
    console.log(newTimezone)
    const selectedTimezone = timezones.filter(
      timezone => timezone.text === newTimezone
    )[0]

    console.log(selectedTimezone)
    if (subjectMatterName.length > 0 && selectedTimezone) {
      // Setup timezone value as DB expects it
      const _newTimezone = {
        name: selectedTimezone.text,
        offset: selectedTimezone.offset,
      }

      subjectMatterName = subjectMatterName.replace('subjectMatters/', '')
      const settingsRef = db.collection(`settings`).doc(subjectMatterName)
      settingsRef.update({ timezone: _newTimezone }).then(() => {
        dispatch(showSnackbar(`Subject matter timezone updated successfully`))
      })

      // Update subject matters object with new timezone
      let currSubjectMatter = subjectMattersSettings.filter(p => p.name === subjectMatterName)[0]
      currSubjectMatter.timezone = _newTimezone
      dispatch({
        type: actionTypes.FETCH_SUBJECT_MATTER_SETTINGS_SUCCESS,
        subjectMattersSettings: subjectMattersSettings,
      })
    }
  }
}

export const downloadExport = () => {
  return (dispatch, getState) => {
    const exportDate = getState().config.downloadExportDate

    const exportFileName = `${format(exportDate, 'MM-dd-yyyy')}.json`

    // Download export file
    dispatch(toggleConfigLoading(true))
    fetch(process.env.REACT_APP_DOWNLOAD_EXPORT_FUNCTION_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: exportFileName,
      }),
    })
      .then(response => {
        // Convert the ReadableStream response into a Blob
        if (response.status === 200) {
          return response.blob()
        } else if (response.status === 204 || response.status === 404) {
          dispatch(
            showSnackbar(
              `No data is available for ${format(exportDate, 'MMM do, yyyy')}`
            )
          )
          dispatch(toggleConfigLoading(false))
        } else {
          dispatch(toggleConfigLoading(false))
        }
      })
      .then(blob => {
        // Create object URL based on blob
        if (blob) return URL.createObjectURL(blob)
      })
      .then(url => {
        if (url) {
          // Create temporary tag to download objectURL on the client side
          const a = document.createElement('a')
          a.setAttribute('hidden', '')
          a.setAttribute('href', url)
          a.setAttribute('download', exportFileName)
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          setTimeout(() => {
            dispatch(toggleConfigLoading(false))
          }, 1000)
        }
      })
  }
}

export function closeSnackbar() {
  return { type: actionTypes.CLOSE_SNACKBAR }
}

export function showSnackbar(message) {
  return { type: actionTypes.SHOW_SNACKBAR, message }
}
