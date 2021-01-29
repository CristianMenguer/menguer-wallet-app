import styled, { css } from 'styled-components/native'
import { text } from '../../theme'

interface TabButtonItemProps {
    isSelected: boolean
}

interface BoxInfoProps {
    textColor?: string
    textSize?: number
}

export const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;

`

export const TitleBalance = styled.Text`
    margin-top: 16px;
    text-align: center;
    font-size: 22px;
    color: #312e38;
    ${text.bold}
`

export const Box = styled.View`
    align-items: center;
    justify-content: center;

    padding-bottom: 4px;

    border-radius: 18px;
    border-width: 6px;
    border-color: #ff9000;

    width: 100%;
    margin-top: 32px;

`

export const BoxTouch = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;

    padding-bottom: 4px;

    border-radius: 18px;
    border-width: 6px;
    border-color: #ff9000;

    width: 100%;
    margin-top: 32px;

`

export const BoxTile = styled.View`
    width: 100%;
    padding: 2px 8px;

    background-color: #ff9000dd;

    flex-direction: row;
    align-items: center;
    justify-content: space-between;

`

export const BoxTitle = styled.Text`
    text-align: center;
    font-size: 20px;
    color: #312e38;
    ${text.bold}
`

export const AddTransactionButton = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
`

export const BoxInfo = styled.Text<BoxInfoProps>`
    margin: 8px 0;
    text-align: center;
    font-size: 16px;
    color: #312e38;
    ${text.default};

    ${props => !!props && !!props.textColor && props.textColor !== '' && css`
        color: ${props.textColor};
    `}

    ${props => !!props && !!props.textSize && props.textSize > 0 && css`
        font-size: ${props.textSize}px;
    `}

`

export const TabButtons = styled.View`
    flex-direction: row;

`

export const TabButtonItem = styled.TouchableOpacity<TabButtonItemProps>`
    text-align: center;
    justify-content: center;
    font-size: 18px;
    color: #312e38;
    background-color: #F5F5F5;
    margin: 0 1px;
    padding: 0 8px;

    border-radius: 4px;
    border-width: 1px;
    border-color: #FF8E00;

    ${props => props.isSelected && css`
        background-color: #ff9000;
        border-width: 2px;
    `}
`

export const TabButtonItemText = styled.Text<TabButtonItemProps>`
    margin: 4px 0;
    text-align: center;
    font-size: 10px;
    color: #312e38;
    ${text.default}

    ${props => props.isSelected && css`
        font-size: 12px;
    `}
`

export const ViewModal = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: center;

`

export const ModalTile = styled.View`
    width: 100%;
    padding: 4px 8px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;

    background-color: #ff9000dd;

    flex-direction: row;
    align-items: center;
    justify-content: space-between;

`

export const CloseModalButton = styled.TouchableOpacity`
    width: 100%;
    align-items: flex-end;
    justify-content: center;
    padding-right: 8px;
`
