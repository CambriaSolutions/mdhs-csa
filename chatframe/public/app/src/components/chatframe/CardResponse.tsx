import React, { FC } from 'react'
import {
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Link,
    Button,
    Typography,
} from '@material-ui/core'
import Markdown from 'markdown-to-jsx'
import styled from 'styled-components'
import { format } from 'date-fns'

// Date Format
import { sysTimeFormat } from './config/dateFormats'

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

const CardImage = styled(CardMedia)`
    && {
        height: ${p => (p.image && p.image !== '' ? '200px' : '0px')};
        background-size: cover;
        background-position: center center;
    }
`

interface Props {
    data: {
        title: string
        subtitle: string
        imageUrl: string
        buttons: any
    }
    className: string
    key: string
}

const CardResponse: FC<Props> = ({ data, className, key }) => {
    const { title, subtitle, imageUrl, buttons } = data
    return (
        <CardContainer className={className} key={key}>
            {imageUrl ? (
                <CardImage image={encodeURI(imageUrl)} title='' />
            ) : null}
            <CardContent>
                <Typography gutterBottom variant='h6'>
                    {title}
                </Typography>
                <Markdown
                    options={{
                        forceBlock: true,
                        overrides: {
                            h6: {
                                component: Typography,
                                props: {
                                    variant: 'h6',
                                },
                            },
                            p: {
                                component: Typography,
                                props: {
                                    variant: 'body1',
                                },
                            },
                            a: {
                                component: Link,
                            },
                        },
                    }}>
                    {subtitle}
                </Markdown>
            </CardContent>
            <CardActions>
                {buttons.map((b, index) => {
                    const cardKey = `card-${index}${format(
                        new Date(),
                        sysTimeFormat
                    )}`
                    return (
                        <Button
                            href={b.postback}
                            target='_blank'
                            size='small'
                            color='primary'
                            key={cardKey}>
                            {b.text}
                        </Button>
                    )
                })}
            </CardActions>
        </CardContainer>
    )
}

export default CardResponse
