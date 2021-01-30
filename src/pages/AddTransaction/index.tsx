//This is the page where the user add a transaction.

import React, { useCallback, useRef } from 'react'
import { ScrollView, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import * as Yup from 'yup'

import Header from '../../components/Header'
import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'

import Input from '../../components/Input'

import { Container, TitlePage, BackToDashboardButton, BackToDashboardText } from './styles'
import Button from '../../components/Button'
import { showToast } from '../../utils/ShowToast'
import getValidationErrors, { getFirstErrorMessage } from '../../utils/getValidationErros'
import Wallet from '../../entities/Wallet'
import { GetStockByCodeDB } from '../../models/Stock'
import { AddWalletDB, GetWalletsDB, LoadOpenPositions } from '../../models/Wallet'
import { sleep } from '../../utils/Utils'
import useWallet from '../../hooks/wallet'
import useLoadData from '../../hooks/loadData'
import { colors } from '../../constants/colors'

// interface used to receive the data from the form when submitted
interface AddTransactionFormData {
    date: Date
    code: string
    price: number
    quantity: number
    fees: number
    total: number
}

const AddTransaction: React.FC = () => {

    const navigation = useNavigation()
    const { loadQuotes } = useLoadData()
    const { loadMyPosition } = useWallet()

    const formRef = useRef<FormHandles>(null)
    const dateRef = useRef<TextInput>(null)
    const stockRef = useRef<TextInput>(null)
    const priceRef = useRef<TextInput>(null)
    const quantityRef = useRef<TextInput>(null)
    const feesRef = useRef<TextInput>(null)
    const totalRef = useRef<TextInput>(null)

    // function called when the form is submitted
    const handleAddTransaction = useCallback(async (data: AddTransactionFormData) => {

        try {
            formRef.current?.setErrors({})

            // schema that validates the data
            const schema = Yup.object().shape({
                date: Yup.date().min('2000-01-01', 'Date is required!'),
                code: Yup.string().required('Code is required!'),
                price: Yup.number().positive('Price must to be positive!'),
                quantity: Yup.number().required('Quantity is required!'),
                fees: Yup.number().positive('Fees must be positive!'),
                total: Yup.number().required('Total is required!')
            })

            await schema.validate(data, {
                abortEarly: false
            })

            // it validates if the stock code exists
            // if yes, add the transaction and go back to the dashboard
            // if not, show the message to the user

            const stock = await GetStockByCodeDB(data.code)
            if (!!stock && stock.id && stock.id > 0) {
                const wallet = new Wallet(stock.id, new Date(data.date), data.quantity, data.price, data.fees, data.total)
                const walletAdded = await AddWalletDB(wallet)
                console.log(walletAdded)
                showToast('Transaction created!')
                await loadQuotes(wallet.dateTransaction, stock.id)
                await loadMyPosition()
                await sleep(250)
                navigation.goBack()
                //DevSettings.reload()
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

    /**
     * The page itself.
     * Header + Form + 'Back to Dashboard' Button
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
                    <TitlePage>New Transaction</TitlePage>

                    <Form onSubmit={handleAddTransaction} ref={formRef} style={{ width: '100%' }} >
                        <Input
                            name={'date'}
                            icon={'calendar'}
                            placeholder='Date (yyyy-mm-dd)'
                            autoCapitalize='characters'
                            keyboardType='numbers-and-punctuation'
                            returnKeyType='next'
                            ref={dateRef}
                            onSubmitEditing={() => stockRef.current?.focus()}
                        />

                        <Input
                            name={'code'}
                            icon={'bar-chart-2'}
                            placeholder='Stock Code'
                            autoCapitalize='characters'
                            returnKeyType='next'
                            ref={stockRef}
                            onSubmitEditing={() => priceRef.current?.focus()}
                        />

                        <Input
                            name={'price'}
                            icon={'dollar-sign'}
                            placeholder='Price'
                            returnKeyType='next'
                            keyboardType='numeric'
                            ref={priceRef}
                            onSubmitEditing={() => quantityRef.current?.focus()}
                        />

                        <Input
                            name={'quantity'}
                            icon={'hash'}
                            placeholder='Quantity'
                            returnKeyType='next'
                            keyboardType='numeric'
                            ref={quantityRef}
                            onSubmitEditing={() => feesRef.current?.focus()}
                        />

                        <Input
                            name={'fees'}
                            icon={'clipboard'}
                            placeholder='Fees'
                            returnKeyType='next'
                            keyboardType='numeric'
                            ref={feesRef}
                            onSubmitEditing={() => totalRef.current?.focus()}
                        />

                        <Input
                            name={'total'}
                            icon={'layers'}
                            placeholder='Total'
                            returnKeyType='send'
                            keyboardType='numeric'
                            ref={totalRef}
                            onSubmitEditing={() => formRef.current?.submitForm()}
                        />

                        <Button onPress={() => formRef.current?.submitForm()} >Add Transaction</Button>
                    </Form>

                </ScrollView>
            </Container>

            <BackToDashboardButton onPress={() => navigation.goBack()} >
                <Icon name='arrow-left' size={20} color={colors.orange} />
                <BackToDashboardText >Back to Dashboard</BackToDashboardText>
            </BackToDashboardButton>
        </>
    )
}

export default AddTransaction
