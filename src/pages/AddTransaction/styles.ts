import styled, { css } from 'styled-components/native'
import { text } from '../../theme'

// This is the style file to the Add Trasanction page

export const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
`

export const TitlePage = styled.Text`
    margin: 16px 0;
    text-align: center;
    font-size: 22px;
    color: #312e38;
    ${text.bold}
`

export const BackToDashboardButton = styled.TouchableOpacity`
    margin-top: 24px;
    background: #F5F5F5;
    border-top-width: 1px;
    border-color: #8B8B89;
    padding: 16px 0;

    flex-direction: row;
    justify-content: center;
    align-items: center;
`

export const BackToDashboardText = styled.Text`
    font-size: 14px;
    color: #ff9000;
    margin-left: 16px;
    ${text.default}
`
