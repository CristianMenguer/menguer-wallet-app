import styled, { css } from 'styled-components/native'
import { text } from '../../theme'

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
    font-family: 'RobotoSlab-Regular';
    color: #ff9000;
    margin-left: 16px;
`

export const Box = styled.View`
    align-items: center;
    justify-content: center;

    padding-bottom: 4px;

    border-radius: 18px;
    border-width: 6px;
    border-color: #ff9000;

    width: 100%;
    min-height: 100px;
    margin-top: 32px;
`

export const BoxInfo = styled.View`
    margin: 8px 0px;
    padding: 0px 16px;

    width: 100%;

    flex-direction: row;
    align-items: center;
    justify-content: space-between;

`

export const BoxText = styled.Text`
    text-align: center;
    font-size: 16px;
    color: #312e38;
    ${text.default};
`

export const DeleteItemButton = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
`
