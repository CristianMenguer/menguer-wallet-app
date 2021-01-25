import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import * as Yup from 'yup'

import Header from '../../components/Header'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'

import Input from '../../components/Input'

import { Container, TitlePage, BackToDashboardButton, BackToDashboardText, Box, BoxInfo, BoxText, BoxDeleteItem } from './styles'
import Button from '../../components/Button'
import { showToast } from '../../utils/ShowToast'
import getValidationErrors from '../../utils/getValidationErros'
import Watchlist from '../../entities/Watchlist'
import { GetStockByCodeDB, } from '../../models/Stock'
import { AddWalletDB } from '../../models/Wallet'
import { sleep } from '../../utils/Utils'
import useWallet from '../../hooks/wallet'
import { AddWatchlistDB } from '../../models/Watchlist'
import { GetCompaniesDB, LoadCompanyByCodeDB } from '../../models/Company'
import { createTablesDB, execSql } from '../../database'

interface WatchlistFormData {
    date: Date
    code: string
    price: number
    quantity: number
    fees: number
    total: number
}

const AddWatchlist: React.FC = () => {

    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const { loadMyPosition, myDataInfo } = useWallet()

    const formRef = useRef<FormHandles>(null)
    const stockRef = useRef<TextInput>(null)

    const [myList, setMyList] = useState<Watchlist[]>([])

    useEffect(() => {
        if (!isFocused || !myDataInfo || !myDataInfo.watchlist || !myDataInfo.watchlist.length || myDataInfo.watchlist.length < 1)
            return
        //
        const list: Watchlist[] = []
        //
        myDataInfo.watchlist.forEach(watch => {
            list.push(watch)
        })
        //
        setMyList(list)
    }, [isFocused, myDataInfo])

    const handleAddWatchlist = useCallback(async (data: WatchlistFormData) => {

        try {
            formRef.current?.setErrors({})

            const schema = Yup.object().shape({
                code: Yup.string().required('Code is required!')
            })

            await schema.validate(data, {
                abortEarly: false
            })

            const stock = await GetStockByCodeDB(data.code)
            if (!!stock && stock.id && stock.id > 0) {
                if (myList.filter(watch => watch.code === stock.code).length > 0) {
                    showToast(`${stock.code} is already in the watchlist!`)
                    return
                } else {
                    const company = await LoadCompanyByCodeDB(stock.code)
                    const watchlist = new Watchlist(stock.code, stock.id, company.name)
                    const watchlistAdded = await AddWatchlistDB(watchlist)
                    const list: Watchlist[] = []
                    if (!!myList && myList.length > 0)
                        myList.forEach(watch => {
                            list.push(watch)
                        })
                    //
                    list.push(watchlistAdded)
                    //
                    showToast('Company added to your Watchlist!')
                    //
                    list.sort((a, b) => a.name > b.name ? 1 : -1)
                    setMyList(list)
                    //
                    loadMyPosition()
                }
                // navigation.goBack()
            } else {
                showToast('Error. Stock code not found!')
            }

        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err)
                formRef.current?.setErrors(errors)
                //
                if (errors.code)
                    showToast(errors.code)
                //
                return
            } else {
                console.log(err)
            }

            showToast('Error. Please, try again!')
        }
    }, [])

    return (
        <>
            <Header />
            <Container >
                <ScrollView
                    style={{
                        width: '100%',
                        paddingTop: 12,
                        paddingHorizontal: 8,
                        paddingBottom: 16,
                    }}
                    contentContainerStyle={{
                        paddingBottom: 16,
                        justifyContent: 'space-between',
                    }}
                >
                    <TitlePage>Watchlist</TitlePage>

                    <Form onSubmit={handleAddWatchlist} ref={formRef} style={{ width: '100%' }} >
                        <Input
                            name={'code'}
                            icon={'bar-chart-2'}
                            placeholder='Stock Code'
                            autoCapitalize='characters'
                            returnKeyType='send'
                            ref={stockRef}
                            onSubmitEditing={() => formRef.current?.submitForm()}
                        />
                        <Button onPress={() => formRef.current?.submitForm()} >Add to Watchlist</Button>
                    </Form>

                    <Box >
                        {!!myList && myList.length > 0 && (
                            myList.map((watch: Watchlist) => (
                                <BoxInfo key={watch.code} >
                                    <BoxText >{watch.name} - ({watch.code})</BoxText>
                                </BoxInfo>
                            ))
                        )}
                    </Box>

                </ScrollView>
            </Container>

            <BackToDashboardButton onPress={() => navigation.goBack()} >
                <Icon name='arrow-left' size={20} color='#ff9000' />
                <BackToDashboardText >Back to Dashboard</BackToDashboardText>
            </BackToDashboardButton>
        </>
    )
}

export default AddWatchlist
