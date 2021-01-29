import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import { colors } from '../constants/colors'

const Auth = createStackNavigator()

/**
 * This route is called if the user is not authenticated.
 * There are two options here:
 * 1. Sign In
 * 2. Sign Up
 * Once the user is Signed In, this route is not used.
 */

const AuthRoutes: React.FC = () => (
    <Auth.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: colors.light }
        }}
    >
        <Auth.Screen name='SignIn' component={SignIn} />
        <Auth.Screen name='SignUp' component={SignUp} />
    </Auth.Navigator>
)

export default AuthRoutes
