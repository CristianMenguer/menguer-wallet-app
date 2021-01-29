// Class Watchlist and its constructor defined here

class Watchlist {
    id?: number
    id_stock: number
    code: string
    name: string
    created_at: Date
    updated_at: Date

	constructor(code: string, id_stock: number, name: string) {
        this.code = code
        this.name = name
        this.id_stock = id_stock
        this.created_at = new Date()
        this.updated_at = new Date()
    }
}

export default Watchlist
