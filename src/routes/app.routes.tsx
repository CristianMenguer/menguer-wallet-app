import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Dashboard from '../pages/Dashboard'
import AddTransaction from '../pages/AddTransaction'
import AddWatchlist from '../pages/AddWatchlist'
import { colors } from '../constants/colors'

const App = createStackNavigator()

/**
 * These are the routes that the user has access when authenticated.
 * Once Signed Out, these routes are not accessable anymore
 */

const AppRoutes: React.FC = () => (
    <App.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: colors.light }
        }}
        initialRouteName='Dashboard'
    >
        <App.Screen name='Dashboard' component={Dashboard} />
        <App.Screen name='AddTransaction' component={AddTransaction} />
        <App.Screen name='AddWatchlist' component={AddWatchlist} />
    </App.Navigator>
)

export default AppRoutes
