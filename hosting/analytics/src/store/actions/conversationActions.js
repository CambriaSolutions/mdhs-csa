import * as actionTypes from '../actions/actionTypes'
import {
  updateRealtimeConversations,
  storeConversationsSubscription,
} from './realtimeActions'
import db from '../../Firebase'

export const fetchConversations = (dateRange, context) => {
  return (dispatch, getState) => {
    const useRealtimeUpdates = getState().config.updateRealtime
    if (typeof dateRange === 'undefined')
      dateRange = getState().filters.dateFilters
    if (typeof context === 'undefined') context = getState().filters.context

    let conversationsRef = db.collection(`${context}/conversations`)

    dispatch(fetchConversationsStart())
    
    conversationsRef
      .where('createdAt', '>', new Date(dateRange.start))
      .where('createdAt', '<', new Date(dateRange.end))
      .get()
      .then(querySnapshot => {
        let fetchedConversations = []
        querySnapshot.forEach(doc => {
          fetchedConversations.push({ ...doc.data(), id: doc.id })
        })

        dispatch(fetchConversationsSuccess(fetchedConversations))

        // If realtime is enabled, subscribe to any changes on the current conversations query
        if (useRealtimeUpdates) {
          const unsubscribeConversations = conversationsRef
            .where('updatedAt', '>', new Date(dateRange.start))
            .where('updatedAt', '<', new Date(dateRange.end))
            .orderBy('updatedAt')
            .startAt(new Date())
            .onSnapshot(snapshot => {
              snapshot.docChanges().forEach(function(change) {
                if (change.type === 'added') {
                  dispatch(
                    addConversationToMetrics({
                      ...change.doc.data(),
                      id: change.doc.id,
                    })
                  )
                }
                if (change.type === 'modified') {
                  dispatch(
                    updateConversationMetrics({
                      ...change.doc.data(),
                      id: change.doc.id,
                    })
                  )
                }
              })
            })

          dispatch(storeConversationsSubscription(unsubscribeConversations))
        }
      })
      .catch(err => {
        dispatch(fetchConversationsFail(err))
      })
  }
}

export const fetchConversationsSuccess = conversations => {
  // Retrieve metrics from conversations

  // Get sum of all conversations duration
  const durationTotal = conversations.reduce((accumulator, conversation) => {
    return conversation.duration
      ? accumulator + conversation.duration
      : accumulator
  }, 0)

  // Get amount of conversations that have a support request
  const supportRequests = conversations.reduce((accumulator, conversation) => {
    return conversation.hasSupportRequest ? accumulator + 1 : accumulator
  }, 0)

  // Create dictionary with exit intents counters
  let exitIntents = {}
  for (let conversation of conversations) {
    const lastIntent = conversation.lastIntent
    let currExitIntent = exitIntents[`${lastIntent.id}`]
    if (currExitIntent) currExitIntent.exits = currExitIntent.exits + 1
    else
      exitIntents[`${lastIntent.id}`] = {
        name: `${lastIntent.name}`,
        exits: 1,
      }
  }
  // Convert dictionary to array of objects
  exitIntents = Object.keys(exitIntents).map(key => ({
    ...exitIntents[key],
    id: key,
  }))

  return {
    type: actionTypes.FETCH_CONVERSATIONS_SUCCESS,
    conversations: conversations,
    conversationsTotal: conversations.length,
    durationTotal: durationTotal,
    supportRequests: supportRequests,
    exitIntents: exitIntents,
  }
}

export const fetchConversationsFail = error => {
  console.log(error)
  return {
    type: actionTypes.FETCH_CONVERSATIONS_FAIL,
    error: error,
  }
}

export const fetchConversationsStart = () => {
  return {
    type: actionTypes.FETCH_CONVERSATIONS_START,
  }
}

// --------------------------------  R E A L T I M E   U P D A T E S  --------------------------------

const updateExitIntents = (exitIntents, lastIntent) => {
  // Update exit intents counters
  let currExitIntent = exitIntents.filter(i => i.id === lastIntent.id)[0]
  if (currExitIntent) currExitIntent.exits++
  else
    exitIntents.push({
      id: lastIntent.id,
      name: `${lastIntent.name}`,
      exits: 1,
    })
  return exitIntents
}

export const addConversationToMetrics = (
  conversation,
  isOngoingConversation = false
) => {
  return (dispatch, getState) => {
    let {
      allConversations: conversations,
      durationTotal,
    } = getState().conversations

    // If duration already exists this is an ongoing conversation
    if (conversation.duration && conversation.duration > 0) {
      isOngoingConversation = true
    }

    if (!isOngoingConversation) conversations.push(conversation)

    // Update sum of all conversations duration
    if (conversation.duration && !isOngoingConversation)
      durationTotal += conversation.duration

    let supportRequests = getState().conversations.supportRequests
    let exitIntents = getState().conversations.exitIntents

    // Update total support requests if found
    if (conversation.hasSupportRequest && !isOngoingConversation)
      supportRequests++

    // Update exit intents counters
    const lastIntent = conversation.lastIntent
    exitIntents = updateExitIntents(exitIntents, lastIntent)

    // Add conversation to list of ongoing (realtime) conversations
    let currentConversations = getState().realtime.currentConversations
    currentConversations.push(conversation)
    dispatch(updateRealtimeConversations(currentConversations))

    // Update metrics
    dispatch({
      type: actionTypes.FETCH_CONVERSATIONS_SUCCESS,
      conversations: conversations,
      conversationsTotal: conversations.length,
      durationTotal: durationTotal,
      supportRequests: supportRequests,
      exitIntents: exitIntents,
    })
  }
}

export const updateConversationMetrics = updatedConversation => {
  return (dispatch, getState) => {
    let currentConversations = getState().realtime.currentConversations

    let currConversation = currentConversations.filter(
      c => c.id === updatedConversation.id
    )[0]

    if (currConversation) {
      // --- UPDATE CONVERSATION DURATION
      let durationTotal = getState().conversations.durationTotal

      // Update sum of all conversations duration
      if (updatedConversation.duration) {
        // Consider ongoing conversation time increasing per update
        const oldDuration = currConversation.duration
          ? currConversation.duration
          : 0
        // Substract current duration by last update duration to correctly keep track of totals
        const newDuration = updatedConversation.duration - oldDuration
        // Update ongoing conversation locally
        currConversation.duration = newDuration

        durationTotal += newDuration
      }

      // --- UPDATE CONVERSATION SUPPORT REQUEST
      let supportRequests = getState().conversations.supportRequests

      // Update total support requests only if new entry has a support request and the current(outdated) conversation didn't have one already
      if (
        !currConversation.hasSupportRequest &&
        updatedConversation.hasSupportRequest
      ) {
        supportRequests++
        currConversation.hasSupportRequest = true
      }

      // --- UPDATE EXIT INTENTS
      let exitIntents = getState().conversations.exitIntents

      // Update exit intents counters, decrease past lastIntent on exitIntents array
      const oldLastIntent = currConversation.lastIntent

      let currExitIntent = exitIntents.filter(i => i.id === oldLastIntent.id)[0]
      if (currExitIntent) {
        if (currExitIntent.exits === 1)
          exitIntents = exitIntents.filter(i => i.id !== oldLastIntent.id)
        else currExitIntent.exits--
      }
      // Increase new lastIntent on exitIntents array
      const updatedLastIntent = updatedConversation.lastIntent
      currConversation.lastIntent = updatedLastIntent
      exitIntents = updateExitIntents(exitIntents, updatedLastIntent)

      dispatch(updateRealtimeConversations(currentConversations))

      dispatch({
        type: actionTypes.UPDATE_CONVERSATION_METRICS,
        durationTotal: durationTotal,
        supportRequests: supportRequests,
        exitIntents: exitIntents,
      })
    } else {
      // If the ongoing conversation isn't part of the current conversations (internal array) add it
      dispatch(addConversationToMetrics(updatedConversation, true))
    }
  }
}
