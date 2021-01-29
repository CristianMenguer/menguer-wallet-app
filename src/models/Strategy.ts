import { selectDB, insertDB, countDB } from '../database'
import Strategy from '../entities/Strategy'

const tableName = 'strategy'

// This function returns all the Strategy Objects from the Database
export const GetStrategiesDB = async (): Promise<Strategy[]> => {

    const response = await selectDB(tableName) as Strategy[]
    //
    if (!response || !response.length || response.length == 0)
        return [] as Strategy[]
    //
    return response

}

// This function receives a Strategy object and saves it to the database and returns the object saved
// with the new ID.
export const AddStrategyDB = async (props: Strategy): Promise<Strategy> => {
    if (!props)
        return props
    //
    const sql = `insert into ${tableName} (` +
        ' id, name, description, created_at, updated_at ' +
        ' ) values ( ' +
        ` ${props.id}, '${props.name}', '${props.description}', ${props.created_at.getTime()}, ${props.updated_at.getTime()}  )`
    //
    const idInserted = await insertDB(sql)

    if (idInserted > 0)
        props.id = idInserted
    //
    return props

}
