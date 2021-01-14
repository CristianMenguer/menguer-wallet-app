import { selectDB, insertDB, countDB } from '../database'
import Stock from '../entities/Stock'

const tableName = 'stock'

// This function receives the currency base, retrieves the rate from the database and returns it.
export const LoadStockByCodeDB = async (code: string): Promise<Stock> => {

    const response = await selectDB(tableName, `code = '${code}'`) as Stock[]

    if (response.length == 0 || response.length > 1)
        return {} as Stock
    //
    return response[0]

}

// This function receives a currency object and saves it to the database and returns the object saved
// with the new ID.
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

// This function receives the currency base, retrieves the rate from the database and returns it.
export const GetTotalStocksDB = async (): Promise<number> => {

    const response = await countDB(tableName, ``) as number

    //
    return response

}
