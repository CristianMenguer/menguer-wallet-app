import { selectDB, insertDB, countDB, execSql } from '../database'
import Watchlist from '../entities/Watchlist'

const tableName = 'watchlist'

// This function receives the currency base, retrieves the rate from the database and returns it.
export const GetWatchlistsDB = async (): Promise<Watchlist[]> => {

    const response = await selectDB(tableName) as Watchlist[]
    //
    if (!response || !response.length || response.length == 0)
        return [] as Watchlist[]
    //
    return response

}

// This function receives a currency object and saves it to the database and returns the object saved
// with the new ID.
export const AddWatchlistDB = async (props: Watchlist): Promise<Watchlist> => {
    if (!props)
        return props
    //
    const sql = `insert into ${tableName} (` +
        ' id_stock, code, name, created_at, updated_at ' +
        ' ) values ( ' +
        ` ${props.id_stock}, '${props.code}', '${props.name}', ${props.created_at.getTime()}, ${props.updated_at.getTime()}  )`
    //
    const idInserted = await insertDB(sql)

    if (idInserted > 0)
        props.id = idInserted
    //
    return props

}

export const RemoveWatchlistDB = async (props: Watchlist): Promise<boolean> => {
    if (!props || !props.id)
        return false
    //
    try {
        const response = await execSql(` delete from ${tableName} where id = ${props.id} `)
        //
        return true
        //
    } catch (err) {
        console.log(err)
        return false
    }
}