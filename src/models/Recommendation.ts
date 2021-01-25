import { selectDB, insertDB, countDB, CustomSelectDB, createTablesDB, dropTablesDB } from '../database'
import Recommendation from '../entities/Recommendation'

const tableName = 'recommendation'

// This function receives the currency base, retrieves the rate from the database and returns it.
export const GetRecommendationsDB = async (): Promise<Recommendation[]> => {

    const response = await selectDB(tableName) as Recommendation[]

    if (!response || !response.length || response.length === 0)
        return {} as Recommendation[]
    //
    return response
}
