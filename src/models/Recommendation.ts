import { selectDB, insertDB, countDB, CustomSelectDB, createTablesDB, dropTablesDB } from '../database'
import Recommendation from '../entities/Recommendation'

const tableName = 'recommendation'

// This function receives the currency base, retrieves the rate from the database and returns it.
export const GetRecommendationsDB = async (): Promise<Recommendation[]> => {

    const response = await selectDB(tableName) as Recommendation[]

    if (!response || !response.length || response.length === 0)
        return [] as Recommendation[]
    //
    return response
}

export const AddRecommendationDB = async (props: Recommendation): Promise<Recommendation> => {
    if (!props || !props.result)
        return props
    //
    const sql = `insert into ${tableName} (` +
        ' id_strategy, id_stock, date, code_stock, name, result, created_at, updated_at ' +
        ' ) values ( ' +
        ` ${props.id_strategy}, ${props.id_stock}, ${props.date.getTime()}, ` +
        ` '${props.code_stock}', '${props.name}', '${props.result}', ` +
        ` ${props.created_at?.getTime()}, ${props.updated_at?.getTime()}  )`
    //
    const idInserted = await insertDB(sql)

    if (idInserted > 0)
        props.id = idInserted
    //
    return props

}
