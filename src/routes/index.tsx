import React from 'react'
import { ActivityIndicator } from 'react-native'

import AuthRoutes from './auth.routes'
import AppRoutes from './app.routes'
import useAuth from '../hooks/auth'

import Loader from '../components/Loader'

const Routes: React.FC = () => {

    const { user, isLoading } = useAuth()

    // if (isLoading)
    //     return <Loader />
    // //
    // return (!!user ? <AppRoutes /> : <AuthRoutes />)

    return <AppRoutes />
}

export default Routes
