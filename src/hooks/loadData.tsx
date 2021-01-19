import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import api from '../services/api'
import { GetTotalCompaniesDB } from '../models/Company'
import { GetStocksDB, GetTotalStocksDB } from '../models/Stock'
import Company from '../entities/Company'
import { dateToAPI, replaceAll, sleep } from '../utils/Utils'
import { addCompanyIfNotDB } from '../services/AddCompanyIfNotInDBService'
import Stock from '../entities/Stock'
import { addStockIfNotDB } from '../services/AddStockIfNotInDBService'
import { dropTablesDB, createTablesDB } from '../database'
import { AddQuoteDB, GetLastQuoteDB, GetQuotesByCodeDB } from '../models/Quote'
import Quote from '../entities/Quote'


interface LoadDataContextData {
    isLoadingData: boolean
    loadCompanies(): Promise<void>
}

const LoadDataContext = createContext<LoadDataContextData>({} as LoadDataContextData)

export const LoadDataProvider: React.FC = ({ children }) => {

    const [isLoadingData, setLoadingData] = useState(true)

    const loadCompanies = useCallback(async () => {
        console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
        console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n')
        console.log('Starting loadCompanies')
        //
        const recreateDB = false
        const refreshCompanyDB = false
        const refreshQuotesDB = true
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
                    console.log('\n')
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
                            //console.log('Stock object created')
                            const stockAdded = await addStockIfNotDB(newStock)
                            console.log(`Stock added: ${stockAdded.code}`)
                        }
                    }
                    console.log('---------------------------------------')
                    console.log('\n')
                }
            }

            const companiesSQLite = await GetTotalCompaniesDB()
            const stocksSQLite = await GetTotalStocksDB()
            console.log(`DB ==> total companies: ${companiesSQLite} ==> total stocks: ${stocksSQLite}`)
        }

        if (refreshQuotesDB) {
            let date = new Date()
            date.setFullYear(date.getFullYear() - 1)
            await loadQuotes(date)
        }
        //
        setLoadingData(false)
    }, [])

    const loadQuotes = useCallback(async (startDate: Date) => {
        console.log('\n\nLoad Quotes:')
        const stocks = await GetStocksDB()
        console.log(`stocks.length: ${stocks.length}`)
        //
        let counter = 0
        while (stocks.length > 0) {
            const stock = stocks.shift()
            if (!!stock && stock.code.length > 4 && stock.id && stock.id > 0) {
                counter++
                if (counter < 4) {
                    console.log('\n\n')
                    console.log(`stocks.length: ${stocks.length}`)
                    console.log(stock.code)
                    //
                    const response = await api.get(`/quotes/${stock.code}`)
                    if (!!response && !!response.data && !!(response.data as Quote).date) {
                        const lastQuoteAPI = response.data as Quote
                        const lastQuoteSQLite = await GetLastQuoteDB(stock.code)
                        const quotesSQLite = await GetQuotesByCodeDB(stock.code)
                        console.log(`quotesSQLite: ${quotesSQLite.length}`)
                        //
                        if ((!lastQuoteSQLite || !lastQuoteSQLite.date || lastQuoteAPI.date > lastQuoteSQLite.date)) {
                            const response = await api.get(`/quotes/${stock.code}?dateFrom=${dateToAPI(startDate)}`)
                            if (!!response && !!response.data && !!response.data[0]) {
                                const quotesAPI = response.data as Quote[]
                                let counterAdded = 0
                                while (quotesAPI.length > 0) {
                                    const quoteAPI = quotesAPI.shift()
                                    //
                                    if (!!quoteAPI &&
                                        (!lastQuoteSQLite || !lastQuoteSQLite.date || quoteAPI.date > lastQuoteSQLite.date) &&
                                        (quotesSQLite.filter(quote => quote.date === quoteAPI.date).length < 1)) {
                                        //
                                        const quoteToBeAdded = new Quote(stock.id, stock.code, quoteAPI.open, quoteAPI.close,
                                            quoteAPI.max, quoteAPI.min, quoteAPI.volume, new Date(quoteAPI.date), quoteAPI.dividend,
                                            quoteAPI.coefficient)
                                        //
                                        const quoteAdded = await AddQuoteDB(quoteToBeAdded)
                                        counterAdded++
                                    }
                                }
                                console.log(`Quotes Added: ${counterAdded}`)
                            }
                        }
                    }
                }
            }
        }


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
