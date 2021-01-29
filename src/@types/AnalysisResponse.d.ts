//Interface used in the whole app to the Response of the API for analysis

interface AnalysisResponse {
    _id: string
    id_strategy: number
    date: Date
    code_stock: string
    result: string
    created_at: Date
    updated_at: Date
}
