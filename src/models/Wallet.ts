import { selectDB, insertDB, countDB, CustomSelectDB } from '../database'
import Wallet from '../entities/Wallet'

const tableName = 'wallet'

// This function receives the currency base, retrieves the rate from the database and returns it.
export const GetWalletsDB = async (): Promise<Wallet[]> => {

    const response = await selectDB(tableName) as Wallet[]

    if (response.length == 0 || response.length > 1)
        return {} as Wallet[]
    //
    return response
}

// This function receives a currency object and saves it to the database and returns the object saved
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
    const idInserted = await insertDB(sql)

    if (idInserted > 0)
        props.id = idInserted
    //
    return props

}

// This function receives the currency base, retrieves the rate from the database and returns it.
export const GetTotalWalletsDB = async (): Promise<number> => {

    const response = await countDB(tableName) as number
    //
    return response
}

export const LoadOpenPositions = async (quantity: number = 3): Promise<OpenPosition[]> => {

    const response = await CustomSelectDB('select ' +
        ' sto.code, coalesce(com.name, "") as name, sum(wal.quantity) as quantity, sum(wal.total) as total, (sum(wal.total) / sum(wal.quantity)) as price ' +
        ' from wallet wal ' +
        ' join stock sto on sto.id = wal.stock_id ' +
        ' left join company com on sto.company_id = com.id ' +
        ' ORDER BY stock_id limit ' + quantity) as OpenPosition[]

    if (response.length == 0 || response.length > 1)
        return {} as OpenPosition[]
    //
    return response
}
