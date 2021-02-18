import React, { FC } from 'react'
import styled from 'styled-components'
import Fab, { FabProps } from '@material-ui/core/Fab'
import Chat from '@material-ui/icons/Chat'
import Zoom from '@material-ui/core/Zoom'
import { useTheme } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'
import chatbotAvatar from './chatbot_avatar.svg'

// Redux
import { showWindow } from './actions/initialization'
import { useDispatch, useSelector } from './ducks/store'

interface BtnProps extends FabProps {
    active: number
    activationtext: number
}

const Btn = styled(Fab)`
    && {
        display: ${(p: any) => (p.active ? 'flex' : 'none')};
        pointer-events: auto;
        width: ${(p: any) => (p.activationtext ? 'auto' : '56px')};
        height: ${(p: any) => (p.activationtext ? 'auto' : '56px')};
        padding: ${(p: any) => (p.activationtext ? '4px 6px' : 'auto')};
        border-radius: ${(p: any) => (p.activationtext ? '20px' : '50%')};
    }
` as React.FunctionComponent<BtnProps>

const TextContainer = styled.div`
    text-transform: none;
    padding-right: 10px;
    color: ${p =>
        p.theme.palette.getContrastText(p.theme.palette.primary.dark)};
`

const BotAvatar = styled(Avatar)`
    && {
        width: 32px;
        height: 32px;
        margin-right: 10px;
        border-radius: 50% 50% 0px 50%;
    }
`
// Improve how this gets pulled in
const mediaRoot = document
    .getElementById('cambria-wordpress-chatframe')
    .getAttribute('data-media-root')

const ActivatorButton: FC = () => {
    const dispatch = useDispatch()
    const { windowVisible, activationText } = useSelector(state => state.config)
    const theme = useTheme()

    const contentToDisplay = activationText ? (
        <>
            <BotAvatar src={(mediaRoot || '').concat(chatbotAvatar)} />
            <TextContainer theme={theme}>{activationText}</TextContainer>
        </>
    ) : (
        <Chat />
    )

    return (
        <Zoom in={!windowVisible} unmountOnExit>
            <Btn
                color='primary'
                onClick={() => dispatch(showWindow())}
                active={windowVisible ? 0 : 1}
                activationtext={activationText ? 1 : 0}>
                {contentToDisplay}
            </Btn>
        </Zoom>
    )
}

export default ActivatorButton
