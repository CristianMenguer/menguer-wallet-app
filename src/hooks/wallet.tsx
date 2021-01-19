import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import { LoadOpenPositions } from '../models/Wallet'

interface WalletContextData {
    isLoadingWallet: boolean
    loadMyPosition(): Promise<MyDataInfo>
    myDataInfo: MyDataInfo
}

const WalletContext = createContext<WalletContextData>({} as WalletContextData)

export const WalletProvider: React.FC = ({ children }) => {

    const [myDataInfo, setMyDataInfo] = useState<MyDataInfo>({} as MyDataInfo)
    const [isLoadingWallet, setLoadingWallet] = useState(true)

    const loadMyPosition = useCallback(async () => {
        const positions = await LoadOpenPositions()

        const myData = myDataInfo
        const wallet = myData.openPosition
        let totalInvested = 0
        while (!!wallet && !!wallet.length && wallet.length > 0)
            wallet.shift()
        //
        if (!!positions && positions.length > 0) {
            positions.map(position => {
                totalInvested += position.totalPaid
                wallet.push(position)
            })
            myData.openPosition = wallet
            myData.totalInvested = totalInvested
        }
        //
        setMyDataInfo(myData)
        //
        setLoadingWallet(false)
        //
        return myData
    }, [])



    return (
        <WalletContext.Provider value={{ isLoadingWallet, loadMyPosition, myDataInfo }} >
            {children}
        </WalletContext.Provider>
    )
}

function useWallet(): WalletContextData {
    const context = useContext(WalletContext)

    if (!context) {
        throw Error('useWallet must be used within an WalletProvider!')
    }

    return context

}

export default useWallet
