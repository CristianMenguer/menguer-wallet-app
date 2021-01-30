import React, { useCallback } from 'react'
import { Alert, DevSettings } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { colors } from '../../constants/colors'

import { Container, Title, Image, SignOutButton, SignOutText, Name } from './styles'

import logoImg from '../../assets/logo.png'

import useAuth from '../../hooks/auth'
import { dropTablesDB } from '../../database'
import { showToast } from '../../utils/ShowToast'

// This is a personalised Header component

const Header: React.FC = () => {

    const { signOut } = useAuth()

    // function called when the user press "Sign Out"
    const handleSignOut = useCallback(async () => {
        //
        Alert.alert(
            'Sign Out',
            `Are you sure you want to Sign Out?`,
            [
                {
                    text: 'No',
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        await dropTablesDB()
                        await signOut()
                        showToast('You are signing out...')
                        DevSettings.reload('Sign Out')
                    }
                }
            ],
            { cancelable: false }
        )
    }, [])

    // The Header has the logo and the App name, then the Sign Out button
    return (
        <Container >
            <Name >
                <Image source={logoImg} />
                <Title >Menguer Wallet</Title>
            </Name>

            <SignOutButton onPress={() => handleSignOut()} >
                <SignOutText >Sign Out</SignOutText>
                <Icon name='log-out' size={16} color={colors.orange} />

            </SignOutButton>
        </Container >
    )
}

export default Header
