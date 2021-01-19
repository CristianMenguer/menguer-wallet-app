import React, { useEffect } from 'react'

import Loader from '../../components/Loader'
import useLoadData from '../../hooks/loadData'
import useAuth from '../../hooks/auth'
import useWallet from '../../hooks/wallet'

const Loading: React.FC = () => {

    const { loadCompanies } = useLoadData()
    const { isLoadingAuth } = useAuth()
    const { loadMyPosition } = useWallet()

    async function loadData() {
        await loadCompanies()
        //await loadMyPosition()
    }

    useEffect(() => {
        if (isLoadingAuth)
            return
        //
        loadData()
    }, [isLoadingAuth])

    return <Loader message='Loading data' />

}

export default Loading
