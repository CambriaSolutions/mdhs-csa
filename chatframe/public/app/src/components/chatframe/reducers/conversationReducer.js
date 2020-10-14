import { parse, format, differenceInMilliseconds } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import * as t from '../actions/actionTypes'
import { sysTimeFormat } from '../config/dateFormats'

const initialState = {
  client: null,
  clientName: null,
  messages: [],
  webhookPayload: null,
  disableInput: false,
  lastUpdateTime: format(new Date(), sysTimeFormat),
  currentTime: format(new Date(), sysTimeFormat),
  headerTime: 'Now',
  timer: null,
  conversationStarted: false,
}

function conversation(state = initialState, action) {
  switch (action.type) {
    case t.SAVE_CLIENT:
      return { ...state, client: action.client, clientName: action.clientName }

    case t.UPDATE_CURRENT_TIME:
      return {
        ...state,
        headerTime: action.headerTime,
        currentTime: action.currentTime,
      }

    case t.TIMER_START:
      return {
        ...state,
        timer: action.timer,
      }

    case t.INITIATE_LOADING:
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            loading: true,
            entity: 'bot',
            systemTime: format(new Date(), sysTimeFormat),
          },
        ],
      }

    case t.SAVE_RESPONSE:
      return {
        ...state,
        lastUpdateTime: format(new Date(), sysTimeFormat),
        headerTime: 'Now',
        messages: action.newConversationArray,
      }

    case t.SAVE_USER_RESPONSE:
      return {
        ...state,
        lastUpdateTime: format(new Date(), sysTimeFormat),
        headerTime: 'Now',
        messages: [...state.messages, { ...action.response, key: uuidv4() }].sort((a, b) => {
          const dateA = parse(
            a.systemTime,
            sysTimeFormat,
            new Date(a.systemTime)
          )
          const dateB = parse(
            b.systemTime,
            sysTimeFormat,
            new Date(b.systemTime)
          )
          const diff = differenceInMilliseconds(dateB, dateA)
          return diff
        }),
      }

    case t.RECEIVE_WEBHOOK_DATA:
      return {
        ...state,
        webhookPayload: action.payload,
      }

    case t.ENABLE_INPUT:
      return {
        ...state,
        disableInput: false,
      }

    case t.DISABLE_INPUT:
      return {
        ...state,
        disableInput: true,
      }

    case t.SET_CONVERSATION_STARTED:
      return {
        ...state,
        conversationStarted: true,
      }

    case t.SET_CONVERSATION_ENDED:
      return {
        ...state,
        conversationStarted: false,
      }

    case t.SET_OUTPUT_CONTEXTS:
      return {
        ...state,
        outputContexts: action.rawOutputContexts
      }

    default:
      return state
  }
}

export default conversation
