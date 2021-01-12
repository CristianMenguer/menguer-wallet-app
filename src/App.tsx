import 'react-native-gesture-handler'

import React from 'react'
import { StatusBar, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'

import Routes from './routes'

const App: React.FC = () => {
    return (
        <NavigationContainer>
            <StatusBar barStyle='dark-content' backgroundColor='#F5F5F5' />
            <View style={{
                flex: 1,
                backgroundColor: '#F5F5F5'
            }} >
                <Routes />
            </View>
        </NavigationContainer>
    )
}

export default App
