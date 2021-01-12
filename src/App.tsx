import 'react-native-gesture-handler'

import React from 'react'
import { StatusBar, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'

import Routes from './routes'

import AppProvider from './hooks/index'

const App: React.FC = () => {
    return (
        <NavigationContainer>
            <StatusBar barStyle='dark-content' backgroundColor='#F5F5F5' />
            <AppProvider >
                <View style={{
                    flex: 1,
                    backgroundColor: '#F5F5F5'
                }} >

                    <Routes />

                </View>
            </AppProvider>
        </NavigationContainer>
    )
}

export default App
