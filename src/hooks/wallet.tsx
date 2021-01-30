import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import { createTablesDB } from '../database'
import Quote from '../entities/Quote'
import Watchlist from '../entities/Watchlist'
import { GetLastQuoteByCodeDB, GetQuotesByCodeDB } from '../models/Quote'
import { LoadOpenPositions } from '../models/Wallet'
import { GetWatchlistsDB } from '../models/Watchlist'
import { newDateZero } from '../utils/Utils'

interface WalletContextData {
    isLoadingWallet: boolean
    loadMyPosition(): Promise<MyDataInfo>
    reloadWatchlist(): Promise<Watchlist[]>
    myDataInfo: MyDataInfo
}

// creates the context of Wallet
const WalletContext = createContext<WalletContextData>({} as WalletContextData)

export const WalletProvider: React.FC = ({ children }) => {

    // these "variables" are available everywhere in the application
    // they are "global"
    const [myDataInfo, setMyDataInfo] = useState<MyDataInfo>({} as MyDataInfo)
    const [isLoadingWallet, setLoadingWallet] = useState(true)

    // this function updates only the watchlist of myDataInfo
    const reloadWatchlist = useCallback(async () => {
        const myData = Object.assign({}, myDataInfo)
        myData.watchlist = [] as Watchlist[]
        const watchlist = await GetWatchlistsDB()
        watchlist.sort((a, b) => a.name > b.name ? 1 : -1)
        watchlist.forEach(watch => myData.watchlist.push(watch))
        //
        //console.log(myData)
        setMyDataInfo(myData)
        //
        return watchlist
    }, [])

    // this function will load the user position from the Database
    const loadMyPosition = useCallback(async () => {
        setLoadingWallet(true)

        // it first loads the open positions of the user from the Database,
        // based on the transactions
        const positions = await LoadOpenPositions()

        const myData = Object.assign({}, myDataInfo)
        myData.openPosition = [] as OpenPosition[]
        while (!!myData.openPosition && myData.openPosition.length > 0)
            myData.openPosition.shift()
        //
        // From here all the possible filters in the Dashboard are calculated
        // It is explained in the final report
        let totalInvested = 0
        let currentBalance = 0
        //
        while (!!positions && positions.length > 0) {
            const position = positions.shift()
            if (!!position && !!position.code && position.code.length > 0) {
                position.totalNow = 0
                position.totalWeek = 0
                position.total30D = 0
                position.totalMonth = 0
                position.total12M = 0
                position.totalYear = 0
                //
                position.resultNow = 0
                position.resultWeek = 0
                position.result30D = 0
                position.resultMonth = 0
                position.result12M = 0
                position.resultYear = 0
                //
                const quotes = await GetQuotesByCodeDB(position.code)
                const lastQuote = !!quotes && quotes.length > 0 ? quotes[0] : {} as Quote
                if (!!lastQuote && !!lastQuote.close && lastQuote.close > 0) {
                    currentBalance += (lastQuote.close * position.quantity)
                    position.totalNow = !!position.quantity ? (lastQuote.close * position.quantity) : 0
                    //
                    const dateToFilter = newDateZero()
                    dateToFilter.setDate(dateToFilter.getDate() - dateToFilter.getDay())
                    let quotesFiltered = quotes.filter(quo => quo.date < dateToFilter)
                    if (!!quotesFiltered && quotesFiltered.length > 0) {
                        position.totalWeek = !!position.quantity ? (quotesFiltered[0].close * position.quantity) : 0
                    } else {
                        position.totalWeek = position.totalNow
                    }
                    //
                    dateToFilter.setTime(newDateZero().getTime())
                    dateToFilter.setDate(1)
                    quotesFiltered = quotes.filter(quo => quo.date < dateToFilter)
                    if (!!quotesFiltered && quotesFiltered.length > 0) {
                        position.totalMonth = !!position.quantity ? (quotesFiltered[0].close * position.quantity) : 0
                    } else {
                        position.totalMonth = position.totalNow
                    }
                    //
                    dateToFilter.setTime(newDateZero().getTime())
                    dateToFilter.setDate(dateToFilter.getDate() - 30)
                    quotesFiltered = quotes.filter(quo => quo.date < dateToFilter)
                    if (!!quotesFiltered && quotesFiltered.length > 0) {
                        position.total30D = !!position.quantity ? (quotesFiltered[0].close * position.quantity) : 0
                    } else {
                        position.total30D = position.totalNow
                    }
                    //
                    dateToFilter.setTime(newDateZero().getTime())
                    dateToFilter.setDate(1)
                    dateToFilter.setMonth(0)
                    quotesFiltered = quotes.filter(quo => quo.date < dateToFilter)
                    if (!!quotesFiltered && quotesFiltered.length > 0) {
                        position.totalYear = !!position.quantity ? (quotesFiltered[0].close * position.quantity) : 0
                    } else {
                        position.totalYear = position.totalNow
                    }
                    //
                    dateToFilter.setTime(newDateZero().getTime())
                    dateToFilter.setMonth(dateToFilter.getMonth() - 12)
                    quotesFiltered = quotes.filter(quo => quo.date < dateToFilter)
                    if (!!quotesFiltered && quotesFiltered.length > 0) {
                        position.total12M = !!position.quantity ? (quotesFiltered[0].close * position.quantity) : 0
                    } else {
                        position.total12M = position.totalNow
                    }
                    //
                }
                position.resultNow = ((position.totalNow / position.totalPaid) - 1) * 100
                position.resultWeek = ((position.totalNow / position.totalWeek) - 1) * 100
                position.result30D = ((position.totalNow / position.total30D) - 1) * 100
                position.resultMonth = ((position.totalNow / position.totalMonth) - 1) * 100
                position.resultYear = ((position.totalNow / position.totalYear) - 1) * 100
                position.result12M = ((position.totalNow / position.total12M) - 1) * 100
                //
                totalInvested += !!position.totalPaid ? position.totalPaid : 0
                myData.openPosition.push(position)
            }
        }
        //
        if (myData.openPosition.length > 0)
            myData.openPosition.map(pos => {
                pos.percentage = pos.totalNow > 0 ? (pos.totalNow / currentBalance) * 100 : 0
            })
        //
        myData.totalInvested = totalInvested
        myData.totalBalance = currentBalance
        myData.profitLossAmout = 0
        myData.profitLossPerc = 0
        //
        if (totalInvested > 0 && currentBalance > 0) {
            myData.profitLossAmout = currentBalance - totalInvested
            myData.profitLossPerc = ((currentBalance / totalInvested) - 1) * 100
        }
        //
        myData.openPosition.sort((a, b) => (a.totalNow > b.totalNow ? -1 : 1))
        //
        myData.watchlist = [] as Watchlist[]
        const watchlist = await GetWatchlistsDB()
        watchlist.sort((a, b) => a.name > b.name ? 1 : -1)
        watchlist.forEach(watch => myData.watchlist.push(watch))
        //
        setMyDataInfo(myData)
        //
        setLoadingWallet(false)
        //
        return myData
    }, [])



    // returns the provider
    return (
        <WalletContext.Provider value={{ isLoadingWallet, loadMyPosition, reloadWatchlist, myDataInfo }} >
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
