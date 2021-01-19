import { selectDB, insertDB, countDB } from '../database'
import Quote from '../entities/Quote'

const tableName = 'quote'


export const GetQuotesByCodeDB = async (code: string): Promise<Quote[]> => {

    const response = await selectDB(tableName, `code_stock = '${code}' order by date DESC`) as Quote[]

    if (!response || !response.length || response.length == 0)
        return [] as Quote[]
    //
    return response

}

export const AddQuoteDB = async (props: Quote): Promise<Quote> => {
    if (!props || !props.id_stock || (!!props.id && props.id > 0))
        return props
    //
    const sql = `insert into ${tableName} (` +
        ' id_stock, code_stock, open, close, max, min, volume, date, dividend, coefficient, created_at, updated_at ' +
        ' ) values ( ' +
        ` ${props.id_stock}, '${props.code_stock}', ${props.open}, ${props.close}, ${props.max}, ` +
        ` ${props.min}, ${props.volume}, ${props.date.getTime()}, ${props.dividend}, ` +
        ` ${props.coefficient}, ${props.created_at.getTime()}, ${props.updated_at.getTime()}  )`
    //
    const idInserted = await insertDB(sql)

    if (idInserted > 0)
        props.id = idInserted
    //
    return props

}

export const GetTotalQuotesDB = async (): Promise<number> => {

    const response = await countDB(tableName) as number
    //
    return response
}

export const GetQuotesDB = async (): Promise<Quote[]> => {

    const response = await selectDB(tableName) as Quote[]
    //
    if (!response || !response.length || response.length == 0)
        return [] as Quote[]
    //
    return response

}

export const GetLastQuoteDB = async (code: string): Promise<Quote> => {

    const response = await selectDB(tableName, `code_stock = '${code}' ORDER BY date DESC LIMIT 1`) as Quote[]
    //
    if (!response || !response.length || response.length == 0)
        return {} as Quote
    //
    return response[0]

}
