import styled from 'styled-components/native'
import { RectButton } from 'react-native-gesture-handler'

// This is the stylisation of the component Button

export const Container = styled(RectButton)`
    width: 100%;
    height: 60px;
    background: #FF9000;
    border-radius: 10px;
    margin-top: 8px;

    justify-content: center;
    align-items: center;
`
export const ButtonText = styled.Text`
    font-size: 18px;
    font-family: 'RobotoSlab-Medium';
    color: #312e38;
`
