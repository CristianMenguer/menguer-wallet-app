import Company from './Company'
import Quote from './Quote'

// Class Stock and its constructor defined here
class Stock {
    id?: number
    company_id: number
    company: Company
    code: string
    quotes?: Quote[]
    created_at?: Date
    updated_at?: Date

	constructor(company: Company, code: string) {
        this.company = company
        this.company_id = !!company.id ? company.id : 0
        this.code = code
        this.created_at = new Date()
        this.updated_at = new Date()
    }
}

export default Stock
