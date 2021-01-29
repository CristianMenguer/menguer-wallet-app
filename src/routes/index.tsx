import React, { useEffect, useState } from 'react'

import AuthRoutes from './auth.routes'
import AppRoutes from './app.routes'
import useAuth from '../hooks/auth'
import useLoadData from '../hooks/loadData'

import Loading from '../pages/Loading'
import useWallet from '../hooks/wallet'

/**
 * This is the main file that handles the routes (pages).
 * If the user is authenticated, it calls the Loading Page
 * that will load all necessary data and then
 * send the user to the Dashboard.
 */

const Routes: React.FC = () => {

    const { user } = useAuth()
    const { isLoadingData } = useLoadData()
    const { isLoadingWallet } = useWallet()

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(isLoadingData && isLoadingWallet)
    }, [isLoadingData, isLoadingWallet])

    if (!!user && isLoading)
        return <Loading />
    //
    return (!!user ? <AppRoutes /> : <AuthRoutes />)

}

export default Routes
