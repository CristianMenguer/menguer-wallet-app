import React, { useEffect } from 'react'

import Loader from '../../components/Loader'
import useLoadData from '../../hooks/loadData'
import useAuth from '../../hooks/auth'


const Loading: React.FC = () => {

    const { loadCompanies } = useLoadData()
    const { isLoadingAuth } = useAuth()

    async function loadData() {
        await loadCompanies()
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
