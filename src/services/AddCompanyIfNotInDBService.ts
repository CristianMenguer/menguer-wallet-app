import Company from '../entities/Company'
import { LoadCompanyByCodeDB, AddCompanyDB } from '../models/Company'

/**
 * This function receives a Company Object.
 * If the Company does not exist in the Database, it is inserted
 */

export const addCompanyIfNotDB = async (props: Company) => {
    if (!props || (props.id && props.id > 0))
        return props
    //
    const companyFromDB = await LoadCompanyByCodeDB(props.code)
    if (!companyFromDB || (companyFromDB.id && companyFromDB.id > 0))
        return companyFromDB
    //
    const companyAddedDB = await AddCompanyDB(props)
    return companyAddedDB
}
