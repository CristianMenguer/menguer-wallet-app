import { selectDB, insertDB, countDB, CustomSelectDB, createTablesDB, dropTablesDB } from '../database'
import Wallet from '../entities/Wallet'

const tableName = 'wallet'

// This function returns all the Wallet Objects from the Database
export const GetWalletsDB = async (): Promise<Wallet[]> => {

    const response = await selectDB(tableName) as Wallet[]

    if (!response || !response.length || response.length === 0)
        return {} as Wallet[]
    //
    return response
}

// This function receives a Wallet object and saves it to the database and returns the object saved
// with the new ID.
export const AddWalletDB = async (props: Wallet): Promise<Wallet> => {
    if (!props || !props.stock_id)
        return props
    //
    const sql = `insert into ${tableName} (` +
        ' stock_id, dateTransaction, quantity, price, fees, total, created_at, updated_at ' +
        ' ) values ( ' +
        ` ${props.stock_id}, ${props.dateTransaction.getTime()}, ${props.quantity}, ` +
        `${props.price}, ${props.fees}, ${props.total}, ${props.created_at.getTime()}, ${props.updated_at.getTime()}  )`
    //
    console.log(`sql: ${sql}`)
    const idInserted = await insertDB(sql)

    if (idInserted > 0)
        props.id = idInserted
    //
    return props

}

// This function returns the quantity os Wallet rows in the Database
export const GetTotalWalletsDB = async (): Promise<number> => {

    const response = await countDB(tableName) as number
    //
    return response
}

// This function returns all the open positions that the user have registered
export const LoadOpenPositions = async (quantity: number = 10): Promise<OpenPosition[]> => {

    const response = await CustomSelectDB('select ' +
        ' sto.code, coalesce(com.name, "") as name, sum(wal.quantity) as quantity, 0 as totalNow, ' +
        ' sum(wal.total) as totalPaid, (sum(wal.total) / sum(wal.quantity)) as price ' +
        ' from wallet wal ' +
        ' join stock sto on sto.id = wal.stock_id ' +
        ' join company com on sto.company_id = com.id ' +
        ' GROUP BY sto.code, name ORDER BY total DESC ' +
        ' LIMIT ' + quantity) as OpenPosition[]

    if (!response || !response.length || response.length == 0)
        return {} as OpenPosition[]
    //
    return response
}
