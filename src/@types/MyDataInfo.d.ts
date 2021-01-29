//Interface used in the whole app to the object tha contains all the user data

interface MyDataInfo {
    openPosition: OpenPosition[]
    totalInvested: number
    totalBalance: number
    profitLossAmout: number
    profitLossPerc: number
    watchlist: Watchlist[]
}
