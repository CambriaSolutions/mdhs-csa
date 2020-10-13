import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Fullscreen from '@material-ui/icons/Fullscreen'
import FullscreenExit from '@material-ui/icons/FullscreenExit'
import Info from '@material-ui/icons/Info'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'
import styled from 'styled-components'
import Tooltip from '@material-ui/core/Tooltip'
import Button from '@material-ui/core/Button'
import { findLast, find } from 'lodash'
import { sendQuickReply } from './actions/conversation'

import {
  hideWindow,
  showFullscreen,
  showWindowed,
  showPrivacyPolicy,
} from './actions/initialization'

const BotAvatar = styled(Avatar)`
  && {
    flex: 0 0 32px;
    width: 32px;
    height: 32px;
    margin-right: 16px;
    border-radius: 50% 50% 0px 50%;
  }
`

const Container = styled.div`
  && {
    position: relative;
    background: ${p => p.theme.palette.header.main};
    padding: 6px;
    height: 32px;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
    z-index: 1;
    grid-area: header;
    box-sizing: content-box; /*For WordPress*/
    line-height: normal; /*For WordPress*/
  }
`

const HeaderText = styled(Typography)`
  && {
    font-family: 'Product Sans';
    font-weight: 400;
    height: 32px;
    font-size: 18px;
    line-height: 32px;
    flex: 1;
    color: ${p => p.theme.palette.getContrastText(p.theme.palette.primary.dark)};
  }
`

const HeaderButton = styled(IconButton)`
  && {
    padding: 6px;
    flex: 0;
    cursor: pointer;
    color: ${p => p.theme.palette.getContrastText(p.theme.palette.primary.dark)};
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }
`

const StartOverButton = styled(Button)`
  && {
    font-size: 12px;
    font-weight: lighter;
    flex: 0;
    cursor: pointer;
    min-width: 85px;
    padding: 1px;
    border-radius: 10px;
    border: 1px solid ${p => p.theme.palette.getContrastText(p.theme.palette.primary.dark)};
    color: ${p => p.theme.palette.getContrastText(p.theme.palette.primary.dark)};
    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }
  }
`

class Header extends PureComponent {
  render() {
    const {
      title,
      theme,
      hideWindow,
      showWindowed,
      showFullscreen,
      fullscreen,
      avatar,
      showPrivacyPolicy,
      sendQuickReply,
      messages
    } = this.props

    const lastMessageWithSuggestions = findLast(messages, m => {
      const hasSuggestions = find(m.responses, ['type', 'suggestion'])
      return hasSuggestions
    })

    let startOverButtonLabel = null

    if (lastMessageWithSuggestions) {
      const { suggestions } = lastMessageWithSuggestions.responses.filter(m => m.type === 'suggestion')[0]

      // We search for it and use it instead of hard coding because we want
      // to persist the casing that we get back from server
      // The 'start over' and 'home' buttons are essentially the same,
      // but which we receive is dependent on the back end version, so we check for both.
      startOverButtonLabel = find(suggestions, x => x.toLowerCase() === 'home' || x.toLowerCase() === 'start over')
    }

    return (
      <Container theme={theme}>
        <BotAvatar alt={title} src={avatar} />
        <HeaderText theme={theme} variant='h6'>
          {title}
        </HeaderText>
        {startOverButtonLabel && (
          <Tooltip title='Return to subject selection' placement='bottom'>
            <StartOverButton
              theme={theme}
              onClick={() => sendQuickReply('START OVER')}
            >
              Start Over
            </StartOverButton>
          </Tooltip>
        )}
        <Tooltip title='Privacy Policy' placement='bottom'>
          <HeaderButton
            theme={theme}
            onClick={showPrivacyPolicy}
            aria-label='Windowed'
          >
            <Info fontSize='small' />
          </HeaderButton>
        </Tooltip>
        {fullscreen ? (
          <HeaderButton
            theme={theme}
            onClick={showWindowed}
            aria-label='Windowed'
          >
            <FullscreenExit fontSize='small' />
          </HeaderButton>
        ) :
          (
            <HeaderButton
              theme={theme}
              onClick={(e) => {
                console.log('maximize clicked')
                showFullscreen(e)
              }}
              aria-label='Fullscreen'
            >
              <Fullscreen fontSize='small' />
            </HeaderButton>
          )}
        <HeaderButton theme={theme} onClick={hideWindow} aria-label='Close'>
          <Close fontSize='small' />
        </HeaderButton>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    title: state.config.title,
    fullscreen: state.config.fullscreen,
    avatar: state.config.avatar,
    messages: state.conversation.messages
  }
}

const mapDispatchToProps = dispatch => ({
  hideWindow: () => dispatch(hideWindow()),
  showFullscreen: () => dispatch(showFullscreen()),
  showWindowed: () => dispatch(showWindowed()),
  showPrivacyPolicy: () => dispatch(showPrivacyPolicy()),
  sendQuickReply: text => dispatch(sendQuickReply(text))
})

export default withTheme()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
)
