import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import api from '../services/api'
import { GetTotalCompaniesDB } from '../models/Company'
import { GetTotalStocksDB } from '../models/Stock'
import Company from '../entities/Company'
import { replaceAll, sleep } from '../utils/Utils'
import { addCompanyIfNotDB } from '../services/AddCompanyIfNotInDBService'
import Stock from '../entities/Stock'
import { addStockIfNotDB } from '../services/AddStockIfNotInDBService'
import { dropTablesDB, createTablesDB } from '../database'


interface LoadDataContextData {
    isLoadingData: boolean
    loadCompanies(): Promise<void>
}

const LoadDataContext = createContext<LoadDataContextData>({} as LoadDataContextData)

export const LoadDataProvider: React.FC = ({ children }) => {

    const [isLoadingData, setLoadingData] = useState(true)

    const loadCompanies = useCallback(async () => {
        console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
        console.log('Starting loadCompanies')
        //
        const recreateDB = false
        const refreshCompanyDB = false
        //
        if (recreateDB) {
            console.log('Before Drop')
            await dropTablesDB()
            console.log('After Drop')
            //
            console.log('Before Create')
            await createTablesDB()
            console.log('After Create')
        }
        //
        if (refreshCompanyDB) {
            const response = await api.get('/companies/total')
            const totalCompaniesAPI = response.data
            const totalCompaniesSQLite = await GetTotalCompaniesDB()
            console.log(`totalCompaniesAPI: ${totalCompaniesAPI} <=> totalCompaniesSQLite: ${totalCompaniesSQLite}`)
            //
            if (totalCompaniesAPI > totalCompaniesSQLite) {
                const response = await api.get('/companies')
                const companies = response.data as CompanyResponse[]
                //     //
                while (companies.length > 0) {
                    //await sleep(20)
                    console.log('---------------------------------------')
                    console.log(`companies.length: ${companies.length}`)

                    const companyAPI = companies[0]
                    companies.shift()
                    console.log(`companyAPI.code: ${companyAPI.code}`)
                    //
                    const newCompany = new Company(companyAPI.id_api, companyAPI.code_rdz, companyAPI.name,
                        companyAPI.code, companyAPI.economic_sector, companyAPI.subsector, companyAPI.segment)
                    //
                    const companyAdded = await addCompanyIfNotDB(newCompany)
                    console.log(`Company added: ${companyAdded.id} - ${companyAdded.code}`)
                    //
                    const codes: string[] = replaceAll(companyAPI.code, ' ', '').split(',')
                    while (codes.length > 0) {
                        const code = codes[0]
                        codes.shift()
                        console.log(`code: ${code}`)
                        //
                        if (!!companyAdded.id && companyAdded.id > 0) {
                            const newStock = new Stock(companyAdded, code)
                            console.log('Stock object created')
                            const stockAdded = await addStockIfNotDB(newStock)
                            console.log(`Stock added: ${stockAdded.code}`)
                        }
                    }
                    console.log('---------------------------------------')
                }
            }

            const companiesSQLite = await GetTotalCompaniesDB()
            const stocksSQLite = await GetTotalStocksDB()
            console.log(`DB ==> total companies: ${companiesSQLite} ==> total stocks: ${stocksSQLite}`)
        }

        setLoadingData(false)
    }, [])



    return (
        <LoadDataContext.Provider value={{ isLoadingData, loadCompanies }} >
            {children}
        </LoadDataContext.Provider>
    )
}

function useLoadData(): LoadDataContextData {
    const context = useContext(LoadDataContext)

    if (!context) {
        throw Error('useLoadData must be used within an LoadDataProvider!')
    }

    return context

}

export default useLoadData
