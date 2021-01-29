import styled from 'styled-components/native'
import { text } from '../../theme'

// This is the stylisation of the component Loader

export const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`
export const Message = styled.Text`
    padding-top: 16px;
    font-size: 20px;
    color: #312e38;
    text-align: center;
    ${text.default}
`
