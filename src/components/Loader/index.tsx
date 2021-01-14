import React, { useState } from 'react'
import { Image, ActivityIndicator } from 'react-native'

import { Container, Message } from './styles'

import logoImg from '../../assets/logo.png'
import { useEffect } from 'react'

// Interface used to declare the props coming from the call
interface LoaderProps {
    message?: string
}

const Loader: React.FC<LoaderProps> = ({ message }) => {

    const [counter, setCounter] = useState(0)
    const [loadingMessage, setLoadingMessage] = useState('Loading...')

    useEffect(() => {
        // This useEffect is called everytime the variable is set, each 1 second.
        // It is used to set the message with '.', or '..' or '...', to show that
        // something is happened and the app is not blocked
        let unmounted = false

        // If there is a message sent, it will be used.
        // Otherwise the message on screen will be 'Loading'
        const textMessage = (message && message !== '') ? message : 'Loading'
        setLoadingMessage(textMessage + '.' + (counter > 0 ? '.' : '') + (counter > 1 ? '.' : ''))
        setTimeout(() => {
            if (!unmounted)
                setCounter((counter + 1) % 3)
        }, 1000
        )

        return () => { unmounted = true }
    }, [counter])

    return (
        <Container >
            <Image source={logoImg} />
            <ActivityIndicator size='large' color='#ff9000' style={{ marginTop: 16 }} />
            <Message >{loadingMessage}</Message>
        </Container >
    )
}

export default Loader
