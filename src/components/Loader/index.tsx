import React from 'react'
import { Image, ActivityIndicator } from 'react-native'

import { Container } from './styles'

import logoImg from '../../assets/logo.png'

const Loader: React.FC = () => {
    return (
        <Container >
            <Image source={logoImg} />
            <ActivityIndicator size='large' color='#ff9000' style={{marginTop: 16}} />
        </Container >
    )
}

export default Loader
