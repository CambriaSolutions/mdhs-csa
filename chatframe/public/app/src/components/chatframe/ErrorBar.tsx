import React, { FC } from 'react'
import styled from 'styled-components'
import red from '@material-ui/core/colors/red'
import { useSelector } from './ducks/store'

const Container = styled.div`
    grid-area: errorbar;
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;
    padding: ${(p: any) => (p.visible ? '24px 16px' : '0 16px')};
    background: ${red[300]};
    border-top: ${(p: any) => (p.visible ? `1px solid ${red[500]}` : 'none')};
    color: ${red[700]};
` as any

const ErrorBar: FC = () => {
    const error = useSelector(state => state.error)
    return <Container visible={error !== ''}>{error}</Container>
}
export default ErrorBar
