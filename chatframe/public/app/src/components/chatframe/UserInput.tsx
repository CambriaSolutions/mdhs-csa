import React, { FC } from 'react'
import Send from '@material-ui/icons/Send'
import styled from 'styled-components'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'

// Redux
import { submitUserInput } from './actions/userInput'
import { saveUserInput } from './ducks/userInputSlice'
import { useDispatch, useSelector } from './ducks/store'

const OuterFrame = styled.div`
    grid-area: userinput;
    background: #fefefe;
    display: flex;
    display: ${(p: any) => (p.visible ? 'none' : 'flex')};
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    border-top: 1px solid rgba(0, 0, 0, 0.2);
    z-index: 4;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
` as any

const TextInput = styled(TextField)`
    && {
        padding: 5px 15px;
        padding-bottom: ${(p: any) => p.helperText !== null && '16px'};
        /*All properties below are specified to combat WordPress*/

        textarea {
            border: none;
            width: 100%;
            outline: none;
            color: #000;
            height: 100%;
            padding: 0;
            font-size: 14px;
        }
    }
`

const Icon = styled(IconButton)`
    && {
        padding-right: 15px;
        &:hover {
            background: transparent;
        }
    }
`
const UserInput: FC = () => {
    const dispatch = useDispatch()
    const { value: inputValues, charLength, maxExceeded } = useSelector(
        state => state.userInput
    )
    const shouldDisable = useSelector(state => state.conversation.disableInput)

    const charLimit = `${charLength}/255`
    let helperTextValue = null

    const handleKeyPress = e => {
        // Enter was pressed
        if (e.charCode === 13) {
            dispatch(submitUserInput())
            e.preventDefault()
        }
    }

    if (maxExceeded) {
        helperTextValue = `Exceeded character limit: ${charLimit}`
    } else {
        helperTextValue = null
    }

    return (
        <OuterFrame visible={shouldDisable}>
            <TextInput
                multiline
                rowsMax='4'
                fullWidth
                InputProps={{ disableUnderline: true }}
                placeholder='Send a message'
                helperText={helperTextValue}
                FormHelperTextProps={{
                    style: { color: '#cd5c5c', margin: 0 },
                }}
                onChange={e => dispatch(saveUserInput(e.target.value))}
                value={inputValues}
                onKeyPress={handleKeyPress}
            />

            <Icon
                onClick={() => dispatch(submitUserInput())}
                aria-label='Send'
                color='primary'
                disabled={maxExceeded}
                disableRipple>
                <Send />
            </Icon>
        </OuterFrame>
    )
}

export default UserInput
