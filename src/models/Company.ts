import { selectDB, insertDB, countDB, insertOrIgnoreDB } from '../database'
import Company from '../entities/Company'

const tableName = 'company'

// This function receives the currency base, retrieves the rate from the database and returns it.
export const LoadCompanyByCodeDB = async (code: string): Promise<Company> => {

    const response = await selectDB(tableName, `code = '${code}'`) as Company[]

    if (!response || !response.length || response.length == 0)
        return {} as Company
    //
    return response[0]

}

export const GetCompaniesDB = async (): Promise<Company[]> => {

    const response = await selectDB(tableName)

    if (!response || !response.length || response.length == 0)
        return []

    return response as Company[]

}

// This function receives the currency base, retrieves the rate from the database and returns it.
export const GetTotalCompaniesDB = async (): Promise<number> => {

    const response = await countDB(tableName) as number

    //
    return response

}

// This function receives a currency object and saves it to the database and returns the object saved
// with the new ID.
export const AddCompanyDB = async (props: Company): Promise<Company> => {
    if (!props || !props.id_api)
        return props
    //
    const sql = `insert or ignore into ${tableName} (` +
        'id_api, name, code, code_rdz, economic_sector, subsector, segment, created_at, updated_at ' +
        ' ) values ( ' +
        ` ${props.id_api}, '${props.name}', '${props.code}', '${props.code_rdz}', ` +
        ` '${props.economic_sector}', '${props.subsector}', '${props.segment}', ${props.created_at?.getTime()}, ${props.updated_at?.getTime()}  )`
    //

    const idInserted = await insertOrIgnoreDB(sql)

    if (idInserted > 0)
        props.id = idInserted
    //
    return props
}
