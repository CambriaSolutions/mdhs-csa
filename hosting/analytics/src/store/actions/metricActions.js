import * as actionTypes from './actionTypes'
import { storeMetricsSubscription } from './realtimeActions'
import db from '../../Firebase'
import { getUTCDate } from '../../common/helper'
import { format } from 'date-fns'
import { reduce } from 'lodash'

export const fetchMetrics = (dateRange, context) => {
  return (dispatch, getState) => {
    // const useRealtimeUpdates = getState().config.updateRealtime

    if (typeof dateRange === 'undefined') {
      dateRange = getState().filters.dateFilters
    }

    if (typeof context === 'undefined') {
      context = getState().filters.context
    }

    // const timezoneOffset = getState().filters.timezoneOffset
    const metricsRef = db.collection(`${context}/metrics`)
    const startDate = new Date(dateRange.start)
    let endDate = new Date(dateRange.end)

    const today = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    // const isToday = today.startsWith(dateRange.start.slice(0, 10))

    dispatch(fetchMetricsStart())

    metricsRef
      .where('date', '>=', startDate)
      .where('date', '<=', endDate)
      .get()
      .then(querySnapshot => {
        let fetchedMetrics = []
        querySnapshot.forEach(doc => {
          fetchedMetrics.push({ ...doc.data(), id: doc.id })
        })

        dispatch(fetchMetricsSuccess(fetchedMetrics))

        // BA 07/22/2020 #378 - Per Nibeer's request, we are temporarily disabling the live updates functionality
        // // Only subscribe to real time updates and its the same day view
        // if (useRealtimeUpdates && isToday) {
        //   const dateWithSubjectMatterTimezone = getUTCDate(new Date(), timezoneOffset)
        //   const dateKey = format(dateWithSubjectMatterTimezone, 'MM-dd-yyyy')

        //   // Load data from today and continue listening for changes
        //   const unsubscribeMetrics = metricsRef.doc(dateKey).onSnapshot(doc => {
        //     const metric = doc.data()
        //     if (metric) dispatch(fetchMetricsSuccess([metric]))
        //   })

        //   dispatch(storeMetricsSubscription(unsubscribeMetrics))
        // }
      })
      .catch(err => {
        dispatch(fetchMetricsFail(err))
      })
  }
}

export const fetchMetricsSuccess = metrics => {
  return dispatch => {
    // Retrieve intents & support requests from daily metrics
    // Create intents & support requests dictionary with counters for occurrences & sessions
    let intents = {},
      supportRequests = {},
      feedback = { helpful: {}, notHelpful: {}, positive: 0, negative: 0 }
    let avgConvoDuration = 0
    let numConversations = 0
    let numConversationsWithDuration = 0
    let numConversationsWithSupportRequests = 0
    let numSupportRequests = 0

    const exitIntents = []
    console.log('metrics', metrics)
    // Loop through metrics per day
    for (let metric of metrics) {
      avgConvoDuration += metric.averageConversationDuration * metric.numConversationsWithDuration
      numConversations += metric.numConversations
      numConversationsWithDuration += metric.numConversationsWithDuration
      numConversationsWithSupportRequests +=
        metric.numConversationsWithSupportRequests

      numSupportRequests += reduce(metric.supportRequests, (result, value, key) => {
        result += value.occurrences
        return result
      }, 0)

      for (const intent in metric.exitIntents) {
        const currentIntent = metric.exitIntents[intent].name
        // check to see if this intent is already on the list
        const exitIntentExists = exitIntents.filter(
          intent => intent.name === currentIntent
        )[0]
        if (exitIntentExists) {
          exitIntentExists.exits += metric.exitIntents[intent].occurrences
        } else {
          const newExitIntent = {
            name: metric.exitIntents[intent].name,
            id: metric.exitIntents[intent].id,
            exits: metric.exitIntents[intent].occurrences,
          }
          exitIntents.push(newExitIntent)
        }
      }

      // Intents
      const dateIntents = metric.intents
      for (let dateIntent of dateIntents) {
        let currIntent = intents[`${dateIntent.id}`]
        if (currIntent) {
          currIntent.occurrences =
            currIntent.occurrences + dateIntent.occurrences
          currIntent.sessions = currIntent.sessions + dateIntent.sessions
        } else
          intents[`${dateIntent.id}`] = {
            name: `${dateIntent.name}`,
            occurrences: dateIntent.occurrences,
            sessions: dateIntent.sessions,
          }
      }

      // Support requests
      const dateSupportRequests = metric.supportRequests
      if (dateSupportRequests) {
        for (let dateRequest of dateSupportRequests) {
          const supportId = dateRequest.name.replace(/\s+/g, '-')
          let currRequest = supportRequests[`${supportId}`]
          if (currRequest) {
            currRequest.occurrences =
              currRequest.occurrences + dateRequest.occurrences
          } else
            supportRequests[`${supportId}`] = {
              name: `${dateRequest.name}`,
              occurrences: dateRequest.occurrences,
            }
        }
      }

      // Feedback
      const feedbackEntry = metric.feedback
      if (feedbackEntry) {
        // Add up totals
        feedback.positive = feedback.positive + feedbackEntry.positive
        feedback.negative = feedback.negative + feedbackEntry.negative
        // Count through helpful feedback
        for (let helpfulFeedback of feedbackEntry.helpful) {
          const helpfulFeedbackId = helpfulFeedback.name.replace(/\s+/g, '-')
          let currFeedback = feedback.helpful[`${helpfulFeedbackId}`]
          if (currFeedback) {
            currFeedback.occurrences =
              currFeedback.occurrences + helpfulFeedback.occurrences
          } else
            feedback.helpful[`${helpfulFeedbackId}`] = {
              name: `${helpfulFeedback.name}`,
              occurrences: helpfulFeedback.occurrences,
            }
        }

        // Count through not-helpful feedback
        for (let notHelpfulFeedback of feedbackEntry.notHelpful) {
          const notHelpfulFeedbackId = notHelpfulFeedback.name.replace(
            /\s+/g,
            '-'
          )
          let currFeedback = feedback.notHelpful[`${notHelpfulFeedbackId}`]
          if (currFeedback) {
            currFeedback.occurrences =
              currFeedback.occurrences + notHelpfulFeedback.occurrences
          } else
            feedback.notHelpful[`${notHelpfulFeedbackId}`] = {
              name: `${notHelpfulFeedback.name}`,
              occurrences: notHelpfulFeedback.occurrences,
            }
        }
      }
    }

    // Feedback contains helpful & non helpful data, send only positive feedback
    const feedbackFiltered = filterFeedback('positive', feedback)

    // Convert dictionary to array of objects (add ids)
    intents = Object.keys(intents).map(key => ({
      ...intents[key],
      id: key,
    }))

    supportRequests = Object.keys(supportRequests).map(key => ({
      ...supportRequests[key],
    }))

    dispatch({
      type: actionTypes.FETCH_METRICS_SUCCESS,
      dailyMetrics: metrics,
      intents: intents,
      supportRequests: supportRequests,
      numConversationsWithSupportRequests: numConversationsWithSupportRequests,
      supportRequestTotal: numSupportRequests,
      feedback: feedback,
      feedbackSelected: 'positive',
      feedbackFiltered: feedbackFiltered,
      conversationsDurationTotal: numConversationsWithDuration,
      conversationsTotal: numConversations,
      durationTotal: avgConvoDuration / numConversations,
      durationTotalNoExit: avgConvoDuration / numConversationsWithDuration,
      exitIntents: exitIntents,
    })
  }
}

export const fetchMetricsFail = error => {
  console.log(error)
  return {
    type: actionTypes.FETCH_METRICS_FAIL,
    error: error,
  }
}

export const fetchMetricsStart = () => {
  return {
    type: actionTypes.FETCH_METRICS_START,
  }
}

const filterFeedback = (type, feedback) => {
  if (type === 'positive') {
    feedback = {
      details: Object.keys(feedback.helpful).map(key => ({
        ...feedback.helpful[key],
      })),
      total: feedback.positive,
    }
  } else {
    feedback = {
      details: Object.keys(feedback.notHelpful).map(key => ({
        ...feedback.notHelpful[key],
      })),
      total: feedback.negative,
    }
  }
  return feedback
}

export const updateFeedbackType = feedbackType => {
  return (dispatch, getState) => {
    const feedbackFiltered = filterFeedback(
      feedbackType,
      getState().metrics.feedback
    )

    dispatch({
      type: actionTypes.UPDATE_FEEDBACK_TYPE,
      feedbackType: feedbackType,
      feedbackFiltered: feedbackFiltered,
    })
  }
}

// --------------------------------  R E A L T I M E   U P D A T E S  --------------------------------

const formatExitIntents = exitIntents => {
  let exitIntentsAggregate = []
  for (const intent in exitIntents) {
    const currentIntent = exitIntents[intent].name
    // check to see if this intent is already on the list
    const exitIntentExists = exitIntentsAggregate.filter(
      intent => intent.name === currentIntent
    )[0]
    if (exitIntentExists) {
      exitIntentExists.exits += exitIntents[intent].occurrences
    } else {
      const newExitIntent = {
        name: exitIntents[intent].name,
        id: exitIntents[intent].id,
        exits: exitIntents[intent].occurrences,
      }
      exitIntentsAggregate.push(newExitIntent)
    }
  }
  return exitIntentsAggregate
}

// TODO - need to revise this entire thing. It is supposed to trigger
// off of a subscription to today's data changes, but the fields changed
// are calculated differently from when they are fetched in fetchMetrics.
// BA 07/21/2020 #378: Currently not using this function. Pending review.
export const updateMetrics = metric => {
  return (dispatch, getState) => {
    const emptyFeedback = {
      helpful: {},
      notHelpful: {},
      positive: 0,
      negative: 0,
    }

    let { feedbackSelected } = getState().metrics

    const metricFeedback = metric.feedback ? metric.feedback : emptyFeedback
    const updatedExitIntents = formatExitIntents(metric.exitIntents)

    dispatch({
      type: actionTypes.UPDATE_METRICS,
      dailyMetrics: metric,
      intents: metric.intents,
      supportRequests: metric.supportRequests,
      feedback: metricFeedback,
      supportRequestTotal: metric.numConversationsWithSupportRequests,
      conversationsDurationTotal: metric.numConversationsWithDuration,
      conversationsTotal: metric.numConversations,
      durationTotal:
        metric.averageConversationDuration / metric.numConversations,
      durationTotalNoExit:
        metric.averageConversationDuration /
        metric.numConversationsWithDuration,
      exitIntents: updatedExitIntents,
      feedbackSelected: feedbackSelected,
      feedbackFiltered: filterFeedback(feedbackSelected, metricFeedback),
    })
  }
}
