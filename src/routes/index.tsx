import React, { useEffect, useState } from 'react'

import AuthRoutes from './auth.routes'
import AppRoutes from './app.routes'
import useAuth from '../hooks/auth'
import useLoadData from '../hooks/loadData'

import Loading from '../pages/Loading'
import useWallet from '../hooks/wallet'

const Routes: React.FC = () => {

    const { user } = useAuth()
    const { isLoadingData } = useLoadData()
    const { isLoadingWallet } = useWallet()

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(isLoadingData && isLoadingWallet)
    }, [isLoadingData, isLoadingWallet])

    if (isLoading)
        return <Loading />
    //
    return (!!user ? <AppRoutes /> : <AuthRoutes />)

    // return <AppRoutes />
}

export default Routes
