import React, { useEffect, useState } from 'react'
import { ActivityIndicator } from 'react-native'

import AuthRoutes from './auth.routes'
import AppRoutes from './app.routes'
import useAuth from '../hooks/auth'
import useLoadData from '../hooks/loadData'

import Loading from '../pages/Loading'

const Routes: React.FC = () => {

    const { user } = useAuth()
    const { isLoadingData } = useLoadData()

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(isLoadingData)
    }, [isLoadingData])

    if (isLoading)
        return <Loading />
    //
    return (!!user ? <AppRoutes /> : <AuthRoutes />)

    //return <Loading />
}

export default Routes
