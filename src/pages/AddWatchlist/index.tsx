//This is the page where the user add a stock to the watchlist.
import React, { useCallback, useRef } from 'react'
import { ScrollView, TextInput, Alert } from 'react-native'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import * as Yup from 'yup'

import Header from '../../components/Header'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'

import Input from '../../components/Input'

import { Container, TitlePage, BackToDashboardButton, BackToDashboardText, Box, BoxInfo, BoxText, DeleteItemButton } from './styles'
import Button from '../../components/Button'
import { showToast } from '../../utils/ShowToast'
import getValidationErrors, { getFirstErrorMessage } from '../../utils/getValidationErros'
import Watchlist from '../../entities/Watchlist'
import { GetStockByCodeDB, } from '../../models/Stock'
import useWallet from '../../hooks/wallet'
import { AddWatchlistDB, GetWatchlistsDB, RemoveWatchlistDB } from '../../models/Watchlist'
import { LoadCompanyByCodeDB } from '../../models/Company'
import { colors } from '../../constants/colors'

// interface used to receive the data from the form when submitted
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
    const { reloadWatchlist, myDataInfo } = useWallet()

    const formRef = useRef<FormHandles>(null)
    const stockRef = useRef<TextInput>(null)

    // function called when the form is submitted
    const handleAddWatchlist = useCallback(async (data: WatchlistFormData) => {


        // validate if the stock code is already in the watchlist
        const watchlists = await GetWatchlistsDB()
        if (watchlists.filter(watch => watch.code === data.code).length > 0) {
            showToast(`${data.code} is already in the watchlist!`)
            formRef.current?.clearField('code')
            return
        }
        //
        try {
            formRef.current?.setErrors({})

            // schema that validates the data
            const schema = Yup.object().shape({
                code: Yup.string().required('Code is required!')
            })

            await schema.validate(data, {
                abortEarly: false
            })

            // search for the stock by its code
            // if found, add to watchlist
            // if not, show the message to the user
            const stock = await GetStockByCodeDB(data.code)
            if (!!stock && stock.id && stock.id > 0) {
                //
                const company = await LoadCompanyByCodeDB(stock.code)
                const watchlist = new Watchlist(stock.code, stock.id, company.name)
                const watchlistAdded = await AddWatchlistDB(watchlist)
                //
                showToast(`${watchlistAdded.name} added to your Watchlist!`)
                formRef.current?.clearField('code')
                //
                reloadWatchlist()

            } else {
                showToast('Error. Stock code not found!')
                formRef.current?.setFieldError('code', 'Stock Code not found!')
            }

        } catch (err) {
            // Errors are handled here and shown to the user
            if (err instanceof Yup.ValidationError) {
                const errors = getValidationErrors(err)
                formRef.current?.setErrors(errors)
                //
                const errorMessage = getFirstErrorMessage(errors)
                if (!!errorMessage)
                    showToast(errorMessage)
                //
                return
            } else {
                console.log(err)
            }

            showToast('Error. Please, try again!')
        }
    }, [])

    // function called to delete a stock from the watchlist
    const handleDeleteWatchlist = useCallback(async (data: Watchlist) => {
        // ask the user to confirm the operation
        Alert.alert(
            'Delete from Watchlist',
            `Are you sure you want to delete ${data.name} from your watchlist?`,
            [
                {
                    text: 'No',
                    style: 'cancel'
                },
                {
                    text: 'Yes',
                    onPress: async () => {
                        // if user confirms, delete from DB and update the context/hook
                        myDataInfo.watchlist.forEach((watch: Watchlist) => {
                            if (watch.code === data.code) {
                                RemoveWatchlistDB(watch)
                                    .then(response => {
                                        if (response) {
                                            showToast(`${watch.name} removed from your watchlist!`)
                                            reloadWatchlist()
                                        }
                                    })
                            }
                        })
                    }
                }
            ],
            { cancelable: false }
        )
    }, [])

    /**
     * The page itself.
     * Header + Form + Stock in the Watchlist + 'Back to Dashboard' Button
     */
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
                        {!!myDataInfo.watchlist && myDataInfo.watchlist.length > 0 && (
                            myDataInfo.watchlist.map((watch: Watchlist) => (
                                <BoxInfo key={watch.code} >
                                    <BoxText >{watch.name} - ({watch.code})</BoxText>
                                    <DeleteItemButton
                                        onPress={() => handleDeleteWatchlist(watch)}
                                    >
                                        <Icon name='trash-2' size={20} color={colors.dark} />
                                    </DeleteItemButton>
                                </BoxInfo>
                            ))
                        )}
                    </Box>

                </ScrollView>
            </Container>

            <BackToDashboardButton onPress={() => navigation.goBack()} >
                <Icon name='arrow-left' size={20} color={colors.orange} />
                <BackToDashboardText >Back to Dashboard</BackToDashboardText>
            </BackToDashboardButton>
        </>
    )
}

export default AddWatchlist
