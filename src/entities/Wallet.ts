// Class Wallet and its constructor defined here

class Wallet {
    id?: number
    stock_id: number
    dateTransaction: Date
    quantity: number
    price: number
    fees: number
    total: number
    created_at: Date
    updated_at: Date

    constructor(stock_id: number, dateTransaction: Date, quantity: number, price: number, fees: number, total: number) {
        this.stock_id = stock_id
        this.dateTransaction = dateTransaction
        this.quantity = quantity
        this.price = price
        this.fees = fees
        this.total = total
        this.created_at = new Date()
        this.updated_at = new Date()
    }
}

export default Wallet
