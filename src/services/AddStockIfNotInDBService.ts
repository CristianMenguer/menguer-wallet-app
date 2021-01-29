import Stock from '../entities/Stock'
import { GetStockByCodeDB, AddStockDB } from '../models/Stock'

/**
 * This function receives a Stock Object.
 * If the Stock does not exist in the Database, it is inserted
 */

export const addStockIfNotDB = async (props: Stock) => {

    if (!props || (props.id && props.id > 0))
        return props
    //
    const stockFromDB = await GetStockByCodeDB(props.code)
    if (!stockFromDB || (stockFromDB.id && stockFromDB.id > 0))
        return stockFromDB
    //
    const stockAddedDB = await AddStockDB(props)
    return stockAddedDB
}
