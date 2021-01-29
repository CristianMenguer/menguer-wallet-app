import { selectDB, insertDB, countDB } from '../database'
import Stock from '../entities/Stock'

const tableName = 'stock'

// This function receives a stock code and returns the Stock found.
export const GetStockByCodeDB = async (code: string): Promise<Stock> => {

    const response = await selectDB(tableName, `code = '${code}'`) as Stock[]

    if (!response || !response.length || response.length == 0)
        return {} as Stock
    //
    return response[0]

}

// This function receives an ID and returns its Object.
export const GetStockByIdDB = async (id: number): Promise<Stock> => {

    const response = await selectDB(tableName, `id = ${id}`) as Stock[]

    if (!response || !response.length || response.length == 0)
        return {} as Stock
    //
    return response[0]

}

// This function receives a Stock object and insert it to the Database
export const AddStockDB = async (props: Stock): Promise<Stock> => {
    if (!props || !props.company_id)
        return props
    //
    const sql = `insert into ${tableName} (` +
        ' code, company_id, created_at, updated_at ' +
        ' ) values ( ' +
        ` '${props.code}', ${props.company_id}, ${props.created_at?.getTime()}, ${props.updated_at?.getTime()}  )`
    //
    const idInserted = await insertDB(sql)

    if (idInserted > 0)
        props.id = idInserted
    //
    return props

}

// This function returns the quantity os Stock rows in the Database
export const GetTotalStocksDB = async (): Promise<number> => {

    const response = await countDB(tableName, ``) as number

    //
    return response

}

// This function returns all the Stock Objects from the Database
export const GetStocksDB = async (): Promise<Stock[]> => {

    const response = await selectDB(tableName) as Stock[]
    //
    if (!response || !response.length || response.length == 0)
        return [] as Stock[]
    //
    return response

}
