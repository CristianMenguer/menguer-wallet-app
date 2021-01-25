import React, { createContext, useCallback, useState, useContext, useEffect } from 'react'
import api from '../services/api'
import { GetCompaniesDB, GetTotalCompaniesDB, LoadCompanyByCodeDB } from '../models/Company'
import { GetStockByCodeDB, GetStockByIdDB, GetStocksDB, GetTotalStocksDB } from '../models/Stock'
import Company from '../entities/Company'
import { datesEqual, dateToAPI, replaceAll, sleep } from '../utils/Utils'
import { addCompanyIfNotDB } from '../services/AddCompanyIfNotInDBService'
import Stock from '../entities/Stock'
import { addStockIfNotDB } from '../services/AddStockIfNotInDBService'
import { dropTablesDB, createTablesDB } from '../database'
import { AddQuoteDB, GetLastQuoteDB, GetLastQuotesDB, GetQuotesByCodeDB } from '../models/Quote'
import Quote from '../entities/Quote'
import { GetWalletsDB, LoadOpenPositions } from '../models/Wallet'
import { AddRecommendationDB, GetRecommendationsDB } from '../models/Recommendation'
import Recommendation from '../entities/Recommendation'


interface LoadDataContextData {
    isLoadingData: boolean
    loadCompanies(): Promise<void>
    loadQuotes(startDate: Date, stock_id: number): Promise<void>
}

const LoadDataContext = createContext<LoadDataContextData>({} as LoadDataContextData)

export const LoadDataProvider: React.FC = ({ children }) => {

    const [isLoadingData, setLoadingData] = useState(true)

    const loadCompanies = useCallback(async () => {
        setLoadingData(true)
        //
        const dropDB = false
        const createDB = false
        const refreshCompanyDB = false
        const refreshQuotesDB = false
        const refreshRecommendationsDB = true
        //
        if (dropDB) {
            console.log('Before Drop')
            await dropTablesDB()
            console.log('After Drop')
        }
        //
        if (createDB) {
            //console.log('Before Create')
            await createTablesDB()
            //console.log('After Create')
        }
        //
        // try {
        //     const response = await api.get('/companies/total')
        // } catch (err) {
        //     console.log(err)
        // }
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

                    const companyAPI = companies.shift()
                    //
                    if (!!companyAPI) {
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
                            const code = codes.shift()
                            if (!!code) {
                                console.log(`code: ${code}`)
                                //
                                if (!!companyAdded.id && companyAdded.id > 0) {
                                    const newStock = new Stock(companyAdded, code)
                                    const stockAdded = await addStockIfNotDB(newStock)
                                    console.log(`Stock added: ${stockAdded.code}`)
                                }
                            }
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
            const needQuotes = await GetWalletsDB()
            if (!!needQuotes)
                while (needQuotes.length > 0) {
                    const needQuote = needQuotes.shift()
                    if (!!needQuote) {
                        await loadQuotes(new Date(needQuote.dateTransaction), needQuote.stock_id)
                    }
                }
        }
        //
        if (refreshRecommendationsDB) {
            const response = await api.get('/analysis')
            const recommendationsAPI = response.data as AnalysisResponse[]
            const recommendationsDB = await GetRecommendationsDB()
            const dateFrom = new Date()
            dateFrom.setMonth(dateFrom.getMonth() - 1)
            //
            let counter = 0
            while (!!recommendationsAPI && recommendationsAPI.length > 0) {
                const recommendationAPI = recommendationsAPI.shift()

                if (!!recommendationAPI) {
                    if (!recommendationsDB
                        ||
                        recommendationsDB.length < 1
                        ||
                        recommendationsDB.filter(recom =>
                            recom.code_stock === recommendationAPI.code_stock &&
                            recom.id_strategy === recommendationAPI.id_strategy &&
                            datesEqual(new Date(recom.date), new Date(recommendationAPI.date)) &&
                            recom.date > dateFrom
                        ).length < 1
                    ) {
                        const company = await LoadCompanyByCodeDB(recommendationAPI.code_stock)
                        const stock = await GetStockByCodeDB(recommendationAPI.code_stock)
                        //
                        const name = company.name
                        const id_stock = !!stock.id && stock.id > 0 ? stock.id : 0
                        //
                        if (id_stock > 0 && !!recommendationAPI.date && recommendationAPI.result !== '') {
                            const recommendationToAdd = new Recommendation(
                                recommendationAPI.id_strategy,
                                new Date(recommendationAPI.date),
                                recommendationAPI.code_stock,
                                recommendationAPI.result,
                                name,
                                id_stock
                            )
                            //
                            //if (counter < 3)
                            {
                                const recommendationAdded = await AddRecommendationDB(recommendationToAdd)
                            }
                            counter++
                        }
                    }
                }
            }
            //console.log(counter)
        }
        //
        setLoadingData(false)
        console.log('Finish LoadCompanies')
    }, [])

    const loadQuotes = useCallback(async (startDate: Date, stock_id: number = 0) => {
        //
        if (stock_id < 1)
            return
        //
        console.log('\n\n')
        console.log(`Load Quote (${stock_id})`)
        let stocks: Stock[] = []
        if (stock_id > 0)
            //     stocks = await GetStocksDB()
            // else
            stocks.push(await GetStockByIdDB(stock_id))
        //
        if (stocks.length < 1)
            return
        //
        const response = await api.get('/quotes/allLastQuotes')
        const lastQuotesAPI = response.data as LastUpdateResponse[]
        //const lastQuotesSQLite = await GetLastQuotesDB()
        //
        let counter = 0
        //while (stocks.length > 0)
        {
            //const stock = stocks.shift()
            const stock = stocks[0]
            if (!!stock && stock.code.length > 4 && stock.id && stock.id > 0) {
                counter++
                //if (counter < 4)
                {
                    //console.log(`stocks.length: ${stocks.length}`)
                    console.log(stock.code)
                    //
                    const lastQuoteAPI = lastQuotesAPI.filter(lastQuote => lastQuote._id === stock.code)
                    if (!!lastQuoteAPI && lastQuoteAPI.length > 0 && !!lastQuoteAPI[0].lastDate) {
                        //
                        const response = await api.get(`/quotes/${stock.code}?dateFrom=${dateToAPI(startDate)}`)
                        if (!!response && !!response.data && !!response.data[0]) {
                            //
                            const quotesSQLite = await GetQuotesByCodeDB(stock.code)
                            //
                            const quotesAPI = response.data as Quote[]
                            let counterAdded = 0
                            while (quotesAPI.length > 0) {
                                const quoteAPI = quotesAPI.shift()
                                //
                                if (!!quoteAPI && (quotesSQLite.filter(quote => datesEqual(new Date(quote.date), new Date(quoteAPI.date))).length < 1)) {
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


    }, [])


    return (
        <LoadDataContext.Provider value={{ isLoadingData, loadCompanies, loadQuotes }} >
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
