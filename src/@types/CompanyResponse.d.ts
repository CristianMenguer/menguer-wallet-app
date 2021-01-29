//Interface used in the whole app to the Response of the API for companies
interface CompanyResponse {
    _id: string
    code: string
    code_rdz: string
    economic_sector: string
    id_api: number
    name: string
    segment: string
    subsector: string
    created_at: Date
    updated_at: Date
}
