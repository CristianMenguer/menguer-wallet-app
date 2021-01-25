class Recommendation {
    id?: number
    id_strategy: number
    id_stock: number
    date: Date
    code_stock: string
    name: string
    result: string
    created_at: Date
    updated_at: Date

    constructor(id_strategy: number, date: Date, code_stock: string, result: string, name: string, id_stock: number) {
        this.id_strategy = id_strategy
        this.date = date
        this.code_stock = code_stock
        this.result = result
        this.name = name
        this.id_stock = id_stock
        this.created_at = new Date()
        this.updated_at = new Date()
    }
}

export default Recommendation