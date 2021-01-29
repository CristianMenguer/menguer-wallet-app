import styled from 'styled-components/native'

// This is the stylisation of the component Header

export const Container = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 100%;
    height: 50px;

    padding: 0 16px;

`

export const Name = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

export const Image = styled.Image`
    width: 48px;
    height: 48px;
`
export const SignOutButton = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

export const SignOutText = styled.Text`
    font-size: 12px;
    font-family: 'RobotoSlab-Medium';
    color: #312e38;
    margin-right: 4px;
`

export const Title = styled.Text`
    font-size: 18px;
    font-family: 'RobotoSlab-Medium';
    color: #ff9000;
    margin-left: 4px;
`
