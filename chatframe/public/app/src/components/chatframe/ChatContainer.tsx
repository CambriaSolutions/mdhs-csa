import React, { FC } from 'react'
import Paper from '@material-ui/core/Paper'
import styled, { css } from 'styled-components'
import grey from '@material-ui/core/colors/grey'
import Header from './Header'
import PrivacyPolicy from './PrivacyPolicy'
import ChatWindow from './ChatWindow'
import UserInput from './UserInput'
import ButtonBar from './ButtonBar'
import { media } from './styles/media'
import { useSelector } from './ducks/store'

const Container = styled(Paper)`
    && {
        width: 400px;
        height: 70vh;
        max-height: 600px;
        overflow: hidden;
        position: absolute;
        bottom: 48px;
        right: 48px;
        transition: width 120ms ease-in-out, height 150ms ease-in-out;
        pointer-events: none;

        ${(props: any) =>
            props.fullscreen &&
            css`
                width: calc(100% - 96px);
                height: calc(100% - 96px);
            `};

        ${(props: any) =>
            !props.visible &&
            css`
                width: 0;
                height: 0;
            `};

        ${(media as any).phone`
      width: ${props => (props.visible ? 'calc(100% - 20px)' : '0')};
      height: ${props => (props.visible ? 'calc(100% - 96px)' : '0')};
      right: 10px;
      max-width: none;
      max-height: none;
    `};
    }
` as any

const OuterFrame = styled.div`
    && {
        width: 100%;
        height: 100%;
        transform-origin: bottom right;
        pointer-events: auto;
        background: ${grey[100]};
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 44px 1fr auto min-content;
        grid-template-areas:
            'header'
            'chatwindow'
            'buttonbar'
            'userinput';
        box-sizing: content-box;
    }
` as any

const ChatContainer: FC = () => {
    const containerRef = React.useRef(null)

    const { windowVisible, fullscreen } = useSelector(state => state.config)
    return (
        <Container
            elevation={4}
            fullscreen={fullscreen ? 1 : 0}
            visible={windowVisible ? 1 : 0}>
            <OuterFrame ref={containerRef} className='mui-fixed'>
                <Header />
                <PrivacyPolicy parentRef={containerRef.current} />
                <ChatWindow />
                <ButtonBar />
                <UserInput />
            </OuterFrame>
        </Container>
    )
}

export default ChatContainer
