import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Dashboard from '../pages/Dashboard'
import AddTransaction from '../pages/AddTransaction'
import AddWatchlist from '../pages/AddWatchlist'

const App = createStackNavigator()

const AppRoutes: React.FC = () => (
    <App.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#F5F5F5' }
        }}
        initialRouteName='Dashboard'
    >
        <App.Screen name='Dashboard' component={Dashboard} />
        <App.Screen name='AddTransaction' component={AddTransaction} />
        <App.Screen name='AddWatchlist' component={AddWatchlist} />
    </App.Navigator>
)

export default AppRoutes
