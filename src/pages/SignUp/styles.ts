import { Platform } from 'react-native'
import styled from 'styled-components/native'
import { text } from '../../theme'

// This is the style file to the sign up page

export const Container = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 0 30px ${Platform.OS === 'android' ? 100 : 40}px;
`

export const Title = styled.Text`
    font-size: 20px;
    color: #312e38;
    margin: 64px 0 24px;
    ${text.default}
`

export const BackToSignInButton = styled.TouchableOpacity`
    margin-top: 24px;
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    background: #F5F5F5;
    border-top-width: 1px;
    border-color: #8B8B89;
    padding: 16px 0;

    flex-direction: row;
    justify-content: center;
    align-items: center;
`

export const BackToSignInText = styled.Text`
    font-size: 14px;
    color: #ff9000;
    margin-left: 16px;
    ${text.default}
`
