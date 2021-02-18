import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import React, { FC, useEffect } from 'react'
import styled from 'styled-components'
import WebFont from 'webfontloader'
import { MuiThemeProvider } from '@material-ui/core/styles'
import 'whatwg-fetch'
import grey from '@material-ui/core/colors/grey'
import createTheme from './createTheme'
import ActivatorButton from './ActivatorButton'
import ChatContainer from './ChatContainer'
import rootReducer from './ducks/rootReducer'
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

interface Props {
    primaryColor: string
    secondaryColor: string
    headerColor: string
    title: string
    client: string
    clientOptions: {
        eventUrl: string
        textUrl: string
    }
    fullscreen: boolean
    initialActive: boolean
    policyText: string
    mapConfig: {
        googleMapsKey: string
        centerCoordinates: {
            lat: number
            lng: number
        }
    }
    feedbackUrl: string
    activationText: string
    reportErrorUrl: string
}

const store = configureStore({ reducer: rootReducer })

const ChatFrame: FC<Props> = props => {
    const theme = createTheme(
        props.primaryColor,
        props.secondaryColor,
        props.headerColor
    )
    useEffect(() => {
        store.dispatch(initialize(props))
    }, [props])
    return (
        <Provider store={store}>
            <MuiThemeProvider theme={theme}>
                <OuterContainer>
                    <ChatContainer />
                    <ActivatorButton />
                </OuterContainer>
            </MuiThemeProvider>
        </Provider>
    )
}

export default ChatFrame
