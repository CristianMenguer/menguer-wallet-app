import { selectDB, insertDB } from '../database'
import Company from '../entities/Company'

const tableName = 'company'

// This function receives the currency base, retrieves the rate from the database and returns it.
export const LoadCompanyByCodeDB = async (code: string): Promise<Company> => {

    const response = await selectDB(tableName, `code = '${code}'`) as Company[]

    if (response.length == 0 || response.length > 1)
        return {} as Company
    //
    return response[0]

}

// This function receives a currency object and saves it to the database and returns the object saved
// with the new ID.
export const AddCompanyDB = async (props: Company): Promise<Company> => {
    if (!props || !props.id_api)
        return props
    //
    const sql = `insert into ${tableName} (` +
        'id_api, name, code, code_rdz, economic_sector, subsector, segment, created_at, updated_at ' +
        ' ) values ( ' +
        ` ${props.id_api}, '${props.name}', '${props.code}', '${props.code_rdz}', ` +
        ` '${props.economic_sector}', '${props.subsector}', '${props.segment}', ${props.created_at?.getTime()}, ${props.updated_at?.getTime()}  )`
    //

    const idInserted = await insertDB(sql)

    if (idInserted > 0)
        props.id_api = idInserted
    //
    return props

}
