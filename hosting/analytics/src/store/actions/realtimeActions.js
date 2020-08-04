import * as actionTypes from '../actions/actionTypes'

export const storeConversationsSubscription = unsubscribeConversations => {
  return {
    type: actionTypes.STORE_CONVERSATIONS_SUBSCRIPTION,
    unsubscribeConversations: unsubscribeConversations,
  }
}

export const storeMetricsSubscription = unsubscribeMetrics => {
  return {
    type: actionTypes.STORE_METRICS_SUBSCRIPTION,
    unsubscribeMetrics: unsubscribeMetrics,
  }
}

export const updateRealtimeConversations = currentConversations => {
  return {
    type: actionTypes.UPDATE_REALTIME_CONVERSATIONS,
    currentConversations: currentConversations,
  }
}

export const clearSubscriptions = () => {
  return (dispatch, getState) => {
    const unsubscribeConversations = getState().realtime
      .unsubscribeConversations
    const unsubscribeMetrics = getState().realtime.unsubscribeMetrics
    if (unsubscribeConversations) unsubscribeConversations()
    if (unsubscribeMetrics) unsubscribeMetrics()

    dispatch({
      type: actionTypes.CLEAR_REALTIME_SUBSCRIPTIONS,
    })
  }
}
