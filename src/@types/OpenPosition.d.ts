//Interface used in the whole app to the objects of open positions

interface OpenPosition {
    code: string
    name: string
    quantity: number
    price: number
    totalPaid: number

    totalNow: number
    totalWeek: number
    totalMonth: number
    total30D: number
    totalYear: number
    total12M: number

    resultNow: number
    resultWeek: number
    resultMonth: number
    result30D: number
    resultYear: number
    result12M: number

    percentage: number
}
