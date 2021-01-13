import React from 'react'
import { View } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'

import { Container, Title, Image, SignOutButton, SignOutText, Name } from './styles'

import logoImg from '../../assets/logo.png'

import useAuth from '../../hooks/auth'

const Header: React.FC = () => {

    const { signOut } = useAuth()

    return (
        <Container >
            <Name >
                <Image source={logoImg} />
                <Title >Menguer Wallet</Title>
            </Name>

            <SignOutButton onPress={() => signOut()} >
                <SignOutText >Sign Out</SignOutText>
                <Icon name='log-out' size={16} color='#ff9000' />

            </SignOutButton>
        </Container >
    )
}

export default Header
