import React, { useEffect } from 'react'

import Loader from '../../components/Loader'
import useLoadData from '../../hooks/loadData'
import useAuth from '../../hooks/auth'
import useWallet from '../../hooks/wallet'

/**
 * This is the loading page.
 * It is called when the user signs in to load all the information
 * necessary to use the app.
 */

const Loading: React.FC = () => {

    const { loadCompanies } = useLoadData()
    const { isLoadingAuth } = useAuth()
    const { loadMyPosition } = useWallet()

    // call the functions to load first from API, and then
    // to calculte the current position of the user
    async function loadData() {
        await loadCompanies()
        await loadMyPosition()
    }

    // after testing if the user is authenticated, call
    // the function to load data
    useEffect(() => {
        if (isLoadingAuth)
            return
        //
        loadData()
    }, [isLoadingAuth])

    return <Loader message='Loading data' />

}

export default Loading
