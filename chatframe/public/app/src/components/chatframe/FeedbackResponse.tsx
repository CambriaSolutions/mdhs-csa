import React, { FC, useEffect } from 'react'
import Card from '@material-ui/core/Card'
import styled from 'styled-components'
import FeedbackInput from './FeedbackInput'
import { setFeedbackOptions } from './ducks/feedbackInputSlice'
import { useDispatch } from './ducks/store'

const CardContainer = styled(Card)`
    && {
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        background: #fff;
        margin: 15px 16px 15px 16px;
        white-space: pre-line;
        scroll-margin: 15px;
    }
`
interface FeedbackList {
    value: string
    checked: boolean
}

interface FeedbackData {
    helpful: boolean
    options: FeedbackList[]
}

interface FeedbackResponseProps {
    session?: string
    className?: string
    key?: string
    feedbackData?: FeedbackData
}

const FeedbackResponse: FC<FeedbackResponseProps> = ({
    session,
    className,
    key,
    feedbackData,
}) => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(setFeedbackOptions(feedbackData))
    }, [dispatch, feedbackData])

    return (
        <CardContainer className={className} key={key}>
            <FeedbackInput session={session} />
        </CardContainer>
    )
}

export default FeedbackResponse
