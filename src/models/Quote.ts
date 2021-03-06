import { selectDB, insertDB, countDB, CustomSelectDB } from '../database'
import Quote from '../entities/Quote'

const tableName = 'quote'

// This function receives a stock code and returns the Quotes found.
export const GetQuotesByCodeDB = async (code: string): Promise<Quote[]> => {

    const response = await selectDB(tableName, `code_stock = '${code}' order by date DESC`) as Quote[]

    if (!response || !response.length || response.length == 0)
        return [] as Quote[]
    //
    return response

}

// This function receives a stock code and returns the last Quote found.
export const GetLastQuoteByCodeDB = async (code: string): Promise<Quote> => {

    const response = await GetQuotesByCodeDB(code)

    if (!response || !response.length || response.length == 0)
        return {} as Quote
    //
    return response[0]

}

// This function receives a Quote object and insert it to the Database
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

// This function receives a stock code and returns the last Quote found.
export const GetLastQuoteDB = async (code: string): Promise<Quote> => {

    const response = await selectDB(tableName, `code_stock = '${code}' ORDER BY date DESC LIMIT 1`) as Quote[]
    //
    if (!response || !response.length || response.length == 0)
        return {} as Quote
    //
    return response[0]

}

// This function returns the last Quote for each code Stock.
export const GetLastQuotesDB = async (): Promise<LastUpdateResponse[]> => {

    const response = await CustomSelectDB('select quo.code_stock as _id, max(quo.date) from  quote quo group by quo.code_stock') as LastUpdateResponse[]
    //
    if (!response || !response.length || response.length == 0)
        return [] as LastUpdateResponse[]
    //
    return response

}
