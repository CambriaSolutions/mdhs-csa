import React, { PureComponent } from 'react'
import styled from 'styled-components'
import Fab from '@material-ui/core/Fab'
import Chat from '@material-ui/icons/Chat'
import Zoom from '@material-ui/core/Zoom'
import { withTheme } from '@material-ui/core/styles'
import Avatar from '@material-ui/core/Avatar'

// Redux
import { connect } from 'react-redux'
import { showWindow } from './actions/initialization'

const Btn = styled(Fab)`
  && {
    display: ${p => (p.active ? 'flex' : 'none')};
    pointer-events: auto;
    width: ${p => (p.activationtext ? 'auto' : '56px')};
    height: ${p => (p.activationtext ? 'auto' : '56px')};
    padding: ${p => (p.activationtext ? '4px 6px' : 'auto')};
    border-radius: ${p => (p.activationtext ? '20px' : '50%')};
  }
`

const TextContainer = styled.div`
  text-transform: none;
  padding-right: 10px;
  color: ${p => p.theme.palette.getContrastText(p.theme.palette.primary.dark)};
`

const BotAvatar = styled(Avatar)`
  && {
    width: 32px;
    height: 32px;
    margin-right: 10px;
    border-radius: 50% 50% 0px 50%;
  }
`

class ActivatorButton extends PureComponent {
  render() {
    const {
      title,
      windowVisible,
      showWindow,
      activationText,
      theme,
      avatar,
    } = this.props

    const contentToDisplay = activationText ? (
      <>
        <BotAvatar alt={title} src={avatar} />
        <TextContainer theme={theme}>{activationText}</TextContainer>
      </>
    ) : <Chat />

    return (
      <Zoom in={!windowVisible} unmountOnExit>
        <Btn
          color='primary'
          onClick={showWindow}
          active={windowVisible ? 0 : 1}
          activationtext={activationText ? 1 : 0}
        >
          {contentToDisplay}
        </Btn>
      </Zoom>
    )
  }
}

const mapStateToProps = state => {
  return {
    title: state.config.title,
    windowVisible: state.config.windowVisible,
    activationText: state.config.activationText,
    avatar: state.config.avatar,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    showWindow: () => {
      dispatch(showWindow())
    },
  }
}

export default withTheme()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ActivatorButton)
)
