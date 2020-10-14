import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import WebFont from 'webfontloader'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider'
import thunkMiddleware from 'redux-thunk'
import 'whatwg-fetch'
import grey from '@material-ui/core/colors/grey'
import createTheme from './createTheme'
import ActivatorButton from './ActivatorButton'
import ChatContainer from './ChatContainer'
import rootReducer from './reducers/rootReducer'
import { initialize } from './actions/initialization'

WebFont.load({
  google: {
    families: ['Roboto:300,400,500', 'Product Sans:400'],
  },
})

const OuterContainer = styled.div`
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
  line-height: normal; /*For WordPress*/
  & > * {
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;

    & ::-webkit-scrollbar-thumb {
      background-color: ${grey[600]};
      -webkit-border-radius: 8px;
      border-radius: 8px;
      border: 2px solid ${grey[100]};
    }
    & ::-webkit-scrollbar {
      background-color: ${grey[100]};
      width: 8px;
    }
  }
`

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

class ChatFrame extends PureComponent {
  constructor(props) {
    super(props)
    this.store = createStore(rootReducer, composeEnhancer(applyMiddleware(thunkMiddleware)))
    this.currentValue = null
    this.theme = createTheme(
      this.props.primaryColor,
      this.props.secondaryColor,
      this.props.headerColor
    )
  }

  componentDidMount() {
    // We load the initial options into the Redux store inside of the
    // componentDidMount() lifecycle hook. This lets us use Redux to manage
    // state instead of passing props down manually.
    this.store.dispatch(initialize(this.props, this.theme))

    // In order to expose when a webhook payload of custom data is received,
    // we manually create a subscription to the data piece we want to expose
    this.unsubscribe = this.store.subscribe(() => this.handleChange(this.store))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  // Select the current conversation payload from our Redux store
  select(state) {
    return state.conversation.webhookPayload
  }

  // When props are updated (e.g. Theme changes), update entire component
  handleChange(store) {
    const previousValue = this.currentValue
    this.currentValue = this.select(store.getState())
    if (previousValue !== this.currentValue && this.props.onPayload) {
      this.props.onPayload(this.currentValue)
    }
  }

  render() {
    return (
      <Provider store={this.store}>
        <MuiThemeProvider theme={this.theme}>
          <OuterContainer>
            <ChatContainer />
            <ActivatorButton />
          </OuterContainer>
        </MuiThemeProvider>
      </Provider>
    )
  }
}

export default ChatFrame
