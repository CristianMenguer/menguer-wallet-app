
// Class Quote and its constructor defined here
class Quote {
    id?: number
    id_stock: number
    code_stock: string
    open: number
    close: number
    max: number
    min: number
    volume: number
    date: Date
    dividend: number
    coefficient: number
    created_at: Date
    updated_at: Date

	constructor(id_stock: number, code_stock: string, open: number, close: number, max: number, min: number, volume: number, date: Date, dividend: number, coefficient: number) {
        this.id_stock = id_stock
        this.code_stock = code_stock
        this.open = open
        this.close = close
        this.max = max
        this.min = min
        this.volume = volume
        this.date = date
        this.dividend = dividend
        this.coefficient = coefficient
        this.created_at = new Date()
        this.updated_at = new Date()
    }
}

export default Quote
