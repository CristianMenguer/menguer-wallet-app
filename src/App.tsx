import 'react-native-gesture-handler'

import React from 'react'
import { StatusBar, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'

import Routes from './routes'

import AppProvider from './hooks/index'
import { colors } from './constants/colors'

const App: React.FC = () => {
    return (
        <NavigationContainer>
            <StatusBar barStyle='dark-content' backgroundColor={colors.light} />
            <AppProvider >
                <View style={{
                    flex: 1,
                    backgroundColor: colors.light
                }} >

                    <Routes />

                </View>
            </AppProvider>
        </NavigationContainer>
    )
}

export default App
